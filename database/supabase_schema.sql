-- =====================================================
-- SUPABASE-OPTIMIZED SCHEMA FOR MEALPLAN AI
-- PostgreSQL + Row Level Security + Supabase Auth
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS & AUTH (Tích hợp Supabase Auth)
-- =====================================================

-- Bảng Users - Extend từ auth.users của Supabase
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users chỉ xem và sửa thông tin của chính mình
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Trigger tự động tạo user profile khi signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- USER PREFERENCES
-- =====================================================

CREATE TABLE public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    dietary_type VARCHAR(50),
    allergies TEXT[],
    disliked_ingredients TEXT[],
    health_goals TEXT[],
    daily_calorie_target INT DEFAULT 2000,
    daily_protein_target INT DEFAULT 50,
    daily_carbs_target INT DEFAULT 250,
    daily_fat_target INT DEFAULT 70,
    weekly_budget DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
    ON public.user_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
    ON public.user_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
    ON public.user_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- CATEGORIES
-- =====================================================

CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_vi VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories có thể xem bởi tất cả users
CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

-- =====================================================
-- INGREDIENTS
-- =====================================================

CREATE TABLE public.ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_vi VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    unit VARCHAR(20),
    calories_per_100g DECIMAL(6, 2),
    protein_per_100g DECIMAL(5, 2),
    carbs_per_100g DECIMAL(5, 2),
    fat_per_100g DECIMAL(5, 2),
    avg_price_per_unit DECIMAL(10, 2),
    is_vegetarian BOOLEAN DEFAULT true,
    is_vegan BOOLEAN DEFAULT false,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ingredients are viewable by everyone"
    ON public.ingredients FOR SELECT
    USING (true);

-- =====================================================
-- DISHES
-- =====================================================

CREATE TABLE public.dishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_vi VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    meal_type VARCHAR(20),
    cuisine_type VARCHAR(50),
    difficulty_level VARCHAR(20),
    prep_time_minutes INT,
    cook_time_minutes INT,
    total_time_minutes INT,
    servings INT DEFAULT 2,
    
    -- Nutrition
    calories INT,
    protein DECIMAL(5, 2),
    carbs DECIMAL(5, 2),
    fat DECIMAL(5, 2),
    fiber DECIMAL(5, 2),
    
    estimated_cost DECIMAL(10, 2),
    
    -- Classifications
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    is_dairy_free BOOLEAN DEFAULT false,
    
    -- Media & Instructions
    image_url TEXT,
    video_url TEXT,
    instructions JSONB,
    tips TEXT,
    
    -- Stats
    popularity_score INT DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dishes_category ON public.dishes(category_id);
CREATE INDEX idx_dishes_meal_type ON public.dishes(meal_type);
CREATE INDEX idx_dishes_vegetarian ON public.dishes(is_vegetarian);
CREATE INDEX idx_dishes_popularity ON public.dishes(popularity_score DESC);

ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dishes are viewable by everyone"
    ON public.dishes FOR SELECT
    USING (true);

-- =====================================================
-- DISH INGREDIENTS
-- =====================================================

CREATE TABLE public.dish_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dish_id UUID NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES public.ingredients(id),
    quantity DECIMAL(8, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    is_optional BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dish_ingredients_dish ON public.dish_ingredients(dish_id);
CREATE INDEX idx_dish_ingredients_ingredient ON public.dish_ingredients(ingredient_id);

ALTER TABLE public.dish_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dish ingredients are viewable by everyone"
    ON public.dish_ingredients FOR SELECT
    USING (true);

-- =====================================================
-- TAGS
-- =====================================================

CREATE TABLE public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    name_vi VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags are viewable by everyone"
    ON public.tags FOR SELECT
    USING (true);

CREATE TABLE public.dish_tags (
    dish_id UUID NOT NULL REFERENCES public.dishes(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (dish_id, tag_id)
);

ALTER TABLE public.dish_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dish tags are viewable by everyone"
    ON public.dish_tags FOR SELECT
    USING (true);

-- =====================================================
-- MEAL PLANS
-- =====================================================

CREATE TABLE public.meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT,
    status VARCHAR(20) DEFAULT 'active',
    target_calories INT,
    target_budget DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meal_plans_user ON public.meal_plans(user_id);
CREATE INDEX idx_meal_plans_dates ON public.meal_plans(start_date, end_date);

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meal plans"
    ON public.meal_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans"
    ON public.meal_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans"
    ON public.meal_plans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans"
    ON public.meal_plans FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- MEAL PLAN ITEMS
-- =====================================================

CREATE TABLE public.meal_plan_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_plan_id UUID NOT NULL REFERENCES public.meal_plans(id) ON DELETE CASCADE,
    dish_id UUID NOT NULL REFERENCES public.dishes(id),
    meal_date DATE NOT NULL,
    meal_time VARCHAR(20) NOT NULL,
    servings INT DEFAULT 1,
    notes TEXT,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meal_plan_items_plan ON public.meal_plan_items(meal_plan_id);
CREATE INDEX idx_meal_plan_items_date ON public.meal_plan_items(meal_date);

ALTER TABLE public.meal_plan_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meal plan items"
    ON public.meal_plan_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.meal_plans
            WHERE meal_plans.id = meal_plan_items.meal_plan_id
            AND meal_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own meal plan items"
    ON public.meal_plan_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.meal_plans
            WHERE meal_plans.id = meal_plan_items.meal_plan_id
            AND meal_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own meal plan items"
    ON public.meal_plan_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.meal_plans
            WHERE meal_plans.id = meal_plan_items.meal_plan_id
            AND meal_plans.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own meal plan items"
    ON public.meal_plan_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.meal_plans
            WHERE meal_plans.id = meal_plan_items.meal_plan_id
            AND meal_plans.user_id = auth.uid()
        )
    );

-- =====================================================
-- SHOPPING LISTS
-- =====================================================

CREATE TABLE public.shopping_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    shopping_date DATE,
    estimated_total DECIMAL(10, 2),
    actual_total DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shopping_lists_user ON public.shopping_lists(user_id);

ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own shopping lists"
    ON public.shopping_lists FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- SHOPPING LIST ITEMS
-- =====================================================

CREATE TABLE public.shopping_list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shopping_list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES public.ingredients(id),
    quantity DECIMAL(8, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    estimated_price DECIMAL(10, 2),
    actual_price DECIMAL(10, 2),
    is_purchased BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shopping_list_items_list ON public.shopping_list_items(shopping_list_id);

ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own shopping list items"
    ON public.shopping_list_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.shopping_lists
            WHERE shopping_lists.id = shopping_list_items.shopping_list_id
            AND shopping_lists.user_id = auth.uid()
        )
    );

-- =====================================================
-- RESTAURANTS
-- =====================================================

CREATE TABLE public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cuisine_type VARCHAR(50),
    address TEXT NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    phone VARCHAR(20),
    website VARCHAR(255),
    price_range VARCHAR(20),
    price_min DECIMAL(10, 2),
    price_max DECIMAL(10, 2),
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    is_vegetarian_friendly BOOLEAN DEFAULT false,
    is_vegan_friendly BOOLEAN DEFAULT false,
    opening_hours JSONB,
    image_url TEXT,
    images TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_restaurants_location ON public.restaurants(latitude, longitude);
CREATE INDEX idx_restaurants_rating ON public.restaurants(rating_avg DESC);

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurants are viewable by everyone"
    ON public.restaurants FOR SELECT
    USING (true);

-- =====================================================
-- RESTAURANT DISHES
-- =====================================================

CREATE TABLE public.restaurant_dishes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    dish_id UUID REFERENCES public.dishes(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.restaurant_dishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurant dishes are viewable by everyone"
    ON public.restaurant_dishes FOR SELECT
    USING (true);

-- =====================================================
-- USER REVIEWS
-- =====================================================

CREATE TABLE public.user_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reviewable_type VARCHAR(20) NOT NULL,
    reviewable_id UUID NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    images TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_reviews_user ON public.user_reviews(user_id);
CREATE INDEX idx_user_reviews_reviewable ON public.user_reviews(reviewable_type, reviewable_id);

ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
    ON public.user_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create own reviews"
    ON public.user_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
    ON public.user_reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
    ON public.user_reviews FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- USER FAVORITES
-- =====================================================

CREATE TABLE public.user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    favorable_type VARCHAR(20) NOT NULL,
    favorable_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, favorable_type, favorable_id)
);

CREATE INDEX idx_user_favorites_user ON public.user_favorites(user_id);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites"
    ON public.user_favorites FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- NUTRITION LOGS
-- =====================================================

CREATE TABLE public.nutrition_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    meal_time VARCHAR(20),
    dish_id UUID REFERENCES public.dishes(id),
    meal_plan_item_id UUID REFERENCES public.meal_plan_items(id),
    calories INT,
    protein DECIMAL(5, 2),
    carbs DECIMAL(5, 2),
    fat DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_nutrition_logs_user_date ON public.nutrition_logs(user_id, log_date);

ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own nutrition logs"
    ON public.nutrition_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- EXPENSE LOGS
-- =====================================================

CREATE TABLE public.expense_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    shopping_list_id UUID REFERENCES public.shopping_lists(id),
    expense_date DATE NOT NULL,
    expense_type VARCHAR(20),
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expense_logs_user_date ON public.expense_logs(user_id, expense_date);

ALTER TABLE public.expense_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own expense logs"
    ON public.expense_logs FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- AI RECOMMENDATIONS
-- =====================================================

CREATE TABLE public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    dish_id UUID NOT NULL REFERENCES public.dishes(id),
    recommendation_type VARCHAR(50),
    reason TEXT,
    score DECIMAL(5, 2),
    is_viewed BOOLEAN DEFAULT false,
    is_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_ai_recommendations_user ON public.ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_expires ON public.ai_recommendations(expires_at);

ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations"
    ON public.ai_recommendations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
    ON public.ai_recommendations FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ingredients
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.dishes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.meal_plans
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.shopping_lists
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.restaurants
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto calculate dish rating
CREATE OR REPLACE FUNCTION public.update_dish_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reviewable_type = 'dish' THEN
        UPDATE public.dishes
        SET 
            rating_avg = (
                SELECT ROUND(AVG(rating)::NUMERIC, 2)
                FROM public.user_reviews
                WHERE reviewable_type = 'dish' AND reviewable_id = NEW.reviewable_id
            ),
            rating_count = (
                SELECT COUNT(*)
                FROM public.user_reviews
                WHERE reviewable_type = 'dish' AND reviewable_id = NEW.reviewable_id
            )
        WHERE id = NEW.reviewable_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_dish_rating_trigger
    AFTER INSERT OR UPDATE ON public.user_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_dish_rating();

-- Auto calculate restaurant rating
CREATE OR REPLACE FUNCTION public.update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reviewable_type = 'restaurant' THEN
        UPDATE public.restaurants
        SET 
            rating_avg = (
                SELECT ROUND(AVG(rating)::NUMERIC, 2)
                FROM public.user_reviews
                WHERE reviewable_type = 'restaurant' AND reviewable_id = NEW.reviewable_id
            ),
            rating_count = (
                SELECT COUNT(*)
                FROM public.user_reviews
                WHERE reviewable_type = 'restaurant' AND reviewable_id = NEW.reviewable_id
            )
        WHERE id = NEW.reviewable_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_restaurant_rating_trigger
    AFTER INSERT OR UPDATE ON public.user_reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_restaurant_rating();

-- =====================================================
-- REALTIME PUBLICATIONS (Supabase Realtime)
-- =====================================================

-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.meal_plan_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shopping_list_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.nutrition_logs;

-- =====================================================
-- HELPER FUNCTIONS FOR API
-- =====================================================

-- Get user's meal plan for specific date range
CREATE OR REPLACE FUNCTION public.get_meal_plan_for_week(
    p_user_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    meal_date DATE,
    meal_time VARCHAR,
    dish_name VARCHAR,
    dish_id UUID,
    calories INT,
    is_completed BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mpi.meal_date,
        mpi.meal_time,
        d.name_vi,
        d.id,
        d.calories,
        mpi.is_completed
    FROM public.meal_plan_items mpi
    JOIN public.meal_plans mp ON mpi.meal_plan_id = mp.id
    JOIN public.dishes d ON mpi.dish_id = d.id
    WHERE mp.user_id = p_user_id
        AND mpi.meal_date >= p_start_date
        AND mpi.meal_date <= p_end_date
    ORDER BY mpi.meal_date, 
        CASE mpi.meal_time
            WHEN 'breakfast' THEN 1
            WHEN 'lunch' THEN 2
            WHEN 'dinner' THEN 3
            WHEN 'snack' THEN 4
        END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get nutrition summary for a date
CREATE OR REPLACE FUNCTION public.get_daily_nutrition(
    p_user_id UUID,
    p_date DATE
)
RETURNS TABLE (
    total_calories BIGINT,
    total_protein NUMERIC,
    total_carbs NUMERIC,
    total_fat NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(nl.calories), 0)::BIGINT,
        COALESCE(SUM(nl.protein), 0)::NUMERIC,
        COALESCE(SUM(nl.carbs), 0)::NUMERIC,
        COALESCE(SUM(nl.fat), 0)::NUMERIC
    FROM public.nutrition_logs nl
    WHERE nl.user_id = p_user_id
        AND nl.log_date = p_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get weekly expense
CREATE OR REPLACE FUNCTION public.get_weekly_expense(
    p_user_id UUID,
    p_start_date DATE
)
RETURNS DECIMAL AS $$
DECLARE
    total_expense DECIMAL;
BEGIN
    SELECT COALESCE(SUM(amount), 0)
    INTO total_expense
    FROM public.expense_logs
    WHERE user_id = p_user_id
        AND expense_date >= p_start_date
        AND expense_date < p_start_date + INTERVAL '7 days';
    
    RETURN total_expense;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Search dishes by preferences
CREATE OR REPLACE FUNCTION public.search_dishes_by_preferences(
    p_user_id UUID,
    p_meal_type VARCHAR DEFAULT NULL,
    p_limit INT DEFAULT 10
)
RETURNS SETOF public.dishes AS $$
DECLARE
    v_dietary_type VARCHAR;
    v_allergies TEXT[];
BEGIN
    -- Get user preferences
    SELECT dietary_type, allergies
    INTO v_dietary_type, v_allergies
    FROM public.user_preferences
    WHERE user_id = p_user_id;

    -- Return dishes based on preferences
    RETURN QUERY
    SELECT d.*
    FROM public.dishes d
    WHERE (p_meal_type IS NULL OR d.meal_type = p_meal_type)
        AND (
            v_dietary_type IS NULL OR
            (v_dietary_type = 'vegetarian' AND d.is_vegetarian = true) OR
            (v_dietary_type = 'vegan' AND d.is_vegan = true) OR
            (v_dietary_type = 'omnivore')
        )
        -- Filter out dishes with allergens (simplified)
    ORDER BY d.popularity_score DESC, d.rating_avg DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


