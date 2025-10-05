-- =====================================================
-- SUPABASE MIGRATION FILE
-- Run this in Supabase SQL Editor
-- =====================================================

-- This file contains all necessary SQL for setting up
-- the MealPlan AI database on Supabase

-- Step 1: Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 2: Run the main schema
-- Copy and paste contents of supabase_schema.sql here
-- Or run it separately in the Supabase SQL Editor

-- Step 3: Insert seed data (optional)
-- Use the seed_data.sql file for initial data

-- =====================================================
-- STORAGE BUCKETS (Supabase Storage)
-- =====================================================

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('dish-images', 'dish-images', true),
    ('user-avatars', 'user-avatars', true),
    ('restaurant-images', 'restaurant-images', true),
    ('review-images', 'review-images', true);

-- Storage policies for dish images
CREATE POLICY "Dish images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'dish-images');

CREATE POLICY "Authenticated users can upload dish images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'dish-images'
        AND auth.role() = 'authenticated'
    );

-- Storage policies for user avatars
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'user-avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'user-avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for restaurant images
CREATE POLICY "Restaurant images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'restaurant-images');

-- Storage policies for review images
CREATE POLICY "Review images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'review-images');

CREATE POLICY "Users can upload review images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'review-images'
        AND auth.role() = 'authenticated'
    );

-- =====================================================
-- EDGE FUNCTIONS (Optional - Template)
-- =====================================================

-- Edge Function: generate-meal-plan
-- Path: supabase/functions/generate-meal-plan/index.ts
/*
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { userId, startDate, endDate, preferences } = await req.json()
  
  // Your AI logic here to generate meal plan
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
*/

-- =====================================================
-- WEBHOOKS (Optional)
-- =====================================================

-- Table to log webhooks
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CRON JOBS (via pg_cron extension)
-- =====================================================

-- Clean up expired AI recommendations daily
-- Run this via Supabase Dashboard > Database > Cron Jobs
/*
SELECT cron.schedule(
    'delete-expired-recommendations',
    '0 0 * * *', -- Every day at midnight
    $$
    DELETE FROM public.ai_recommendations
    WHERE expires_at < NOW()
    $$
);
*/

-- =====================================================
-- ANALYTICS VIEWS
-- =====================================================

-- View: Popular dishes this week
CREATE OR REPLACE VIEW public.popular_dishes_this_week AS
SELECT 
    d.id,
    d.name_vi,
    d.image_url,
    d.calories,
    d.rating_avg,
    COUNT(mpi.id) as times_planned
FROM public.dishes d
LEFT JOIN public.meal_plan_items mpi ON d.id = mpi.dish_id
WHERE mpi.meal_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY d.id
ORDER BY times_planned DESC, d.popularity_score DESC
LIMIT 10;

-- View: User nutrition summary
CREATE OR REPLACE VIEW public.user_nutrition_summary AS
SELECT 
    nl.user_id,
    nl.log_date,
    SUM(nl.calories) as total_calories,
    SUM(nl.protein) as total_protein,
    SUM(nl.carbs) as total_carbs,
    SUM(nl.fat) as total_fat,
    up.daily_calorie_target,
    up.daily_protein_target,
    up.daily_carbs_target,
    up.daily_fat_target
FROM public.nutrition_logs nl
JOIN public.user_preferences up ON nl.user_id = up.user_id
GROUP BY nl.user_id, nl.log_date, up.daily_calorie_target, up.daily_protein_target, up.daily_carbs_target, up.daily_fat_target;

-- View: User expense summary
CREATE OR REPLACE VIEW public.user_expense_summary AS
SELECT 
    el.user_id,
    DATE_TRUNC('week', el.expense_date) as week_start,
    SUM(el.amount) as total_expense,
    up.weekly_budget,
    CASE 
        WHEN up.weekly_budget IS NOT NULL THEN 
            ROUND((SUM(el.amount) / up.weekly_budget * 100)::NUMERIC, 2)
        ELSE NULL
    END as budget_percentage
FROM public.expense_logs el
JOIN public.user_preferences up ON el.user_id = up.user_id
GROUP BY el.user_id, DATE_TRUNC('week', el.expense_date), up.weekly_budget;

-- =====================================================
-- FULL TEXT SEARCH
-- =====================================================

-- Add full text search to dishes
ALTER TABLE public.dishes ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION public.dishes_search_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.name_vi, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dishes_search_update BEFORE INSERT OR UPDATE
    ON public.dishes FOR EACH ROW
    EXECUTE FUNCTION public.dishes_search_trigger();

CREATE INDEX IF NOT EXISTS dishes_search_idx ON public.dishes USING GIN(search_vector);

-- Function to search dishes
CREATE OR REPLACE FUNCTION public.search_dishes(search_query TEXT)
RETURNS SETOF public.dishes AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.dishes
    WHERE search_vector @@ to_tsquery('english', search_query)
    ORDER BY ts_rank(search_vector, to_tsquery('english', search_query)) DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POSTGIS (Optional - for location features)
-- =====================================================

-- Uncomment if you want advanced geospatial queries
-- CREATE EXTENSION IF NOT EXISTS postgis;
-- ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS location geography(POINT, 4326);
-- CREATE INDEX idx_restaurants_location_gist ON public.restaurants USING GIST(location);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check storage buckets
SELECT * FROM storage.buckets;

-- =====================================================
-- SAMPLE QUERIES FOR TESTING
-- =====================================================

-- Test: Get dishes for a vegetarian user
/*
SELECT * FROM public.search_dishes_by_preferences(
    'user-uuid-here',
    'lunch',
    5
);
*/

-- Test: Get weekly meal plan
/*
SELECT * FROM public.get_meal_plan_for_week(
    'user-uuid-here',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '7 days'
);
*/

-- Test: Get daily nutrition
/*
SELECT * FROM public.get_daily_nutrition(
    'user-uuid-here',
    CURRENT_DATE
);
*/

-- Test: Full text search
/*
SELECT name_vi, description 
FROM public.search_dishes('tofu');
*/

