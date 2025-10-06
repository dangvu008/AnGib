-- =====================================================
-- SEED DATA FOR SHOPPING HISTORY DEMO
-- =====================================================
-- This file creates sample shopping history data for testing

-- Note: Replace 'YOUR_USER_ID' with actual user UUID from auth.users

-- Insert sample shopping lists (completed)
INSERT INTO public.shopping_lists (
    user_id,
    name,
    shopping_date,
    estimated_total,
    actual_total,
    status
) VALUES
-- This week
(
    'YOUR_USER_ID',
    'Đi chợ đầu tuần',
    CURRENT_DATE - INTERVAL '2 days',
    150000,
    145000,
    'completed'
),
(
    'YOUR_USER_ID',
    'Đi chợ cuối tuần',
    CURRENT_DATE - INTERVAL '5 days',
    200000,
    195000,
    'completed'
),
-- This month
(
    'YOUR_USER_ID',
    'Đi chợ tuần trước',
    CURRENT_DATE - INTERVAL '10 days',
    180000,
    175000,
    'completed'
),
(
    'YOUR_USER_ID',
    'Đi chợ tết',
    CURRENT_DATE - INTERVAL '15 days',
    300000,
    285000,
    'completed'
),
-- Last month
(
    'YOUR_USER_ID',
    'Đi chợ đầu tháng trước',
    CURRENT_DATE - INTERVAL '35 days',
    160000,
    155000,
    'completed'
);

-- Get shopping list IDs (you'll need to query these after insert)
-- Then insert shopping list items

-- Example for one shopping list:
-- First, get the ingredient IDs
DO $$
DECLARE
    v_user_id UUID := 'YOUR_USER_ID';
    v_shopping_list_id UUID;
    v_ingredient_id_tofu UUID;
    v_ingredient_id_tomato UUID;
    v_ingredient_id_cabbage UUID;
    v_ingredient_id_mushroom UUID;
BEGIN
    -- Get the most recent shopping list
    SELECT id INTO v_shopping_list_id
    FROM public.shopping_lists
    WHERE user_id = v_user_id
    AND shopping_date = CURRENT_DATE - INTERVAL '2 days'
    LIMIT 1;

    -- Get ingredient IDs (you may need to adjust these based on your data)
    -- For demo purposes, we'll create or find them
    
    -- Insert if ingredients don't exist
    INSERT INTO public.ingredients (name, name_vi, category, unit, avg_price_per_unit, is_vegetarian)
    VALUES ('Tofu', 'Đậu hũ', 'Đạm', 'hộp', 15000, true)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_ingredient_id_tofu;
    
    INSERT INTO public.ingredients (name, name_vi, category, unit, avg_price_per_unit, is_vegetarian)
    VALUES ('Tomato', 'Cà chua', 'Rau củ', 'kg', 40000, true)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_ingredient_id_tomato;
    
    INSERT INTO public.ingredients (name, name_vi, category, unit, avg_price_per_unit, is_vegetarian)
    VALUES ('Cabbage', 'Bí đỏ', 'Rau củ', 'kg', 18000, true)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_ingredient_id_cabbage;
    
    INSERT INTO public.ingredients (name, name_vi, category, unit, avg_price_per_unit, is_vegetarian)
    VALUES ('Mushroom', 'Nấm hương', 'Đạm', 'kg', 125000, true)
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_ingredient_id_mushroom;

    -- If not returned (conflict), fetch them
    IF v_ingredient_id_tofu IS NULL THEN
        SELECT id INTO v_ingredient_id_tofu FROM public.ingredients WHERE name_vi = 'Đậu hũ' LIMIT 1;
    END IF;
    IF v_ingredient_id_tomato IS NULL THEN
        SELECT id INTO v_ingredient_id_tomato FROM public.ingredients WHERE name_vi = 'Cà chua' LIMIT 1;
    END IF;
    IF v_ingredient_id_cabbage IS NULL THEN
        SELECT id INTO v_ingredient_id_cabbage FROM public.ingredients WHERE name_vi = 'Bí đỏ' LIMIT 1;
    END IF;
    IF v_ingredient_id_mushroom IS NULL THEN
        SELECT id INTO v_ingredient_id_mushroom FROM public.ingredients WHERE name_vi = 'Nấm hương' LIMIT 1;
    END IF;

    -- Insert shopping list items
    IF v_shopping_list_id IS NOT NULL THEN
        INSERT INTO public.shopping_list_items (
            shopping_list_id,
            ingredient_id,
            quantity,
            unit,
            estimated_price,
            actual_price,
            is_purchased
        ) VALUES
        (v_shopping_list_id, v_ingredient_id_tofu, 2, 'hộp', 30000, 30000, true),
        (v_shopping_list_id, v_ingredient_id_tomato, 0.5, 'kg', 20000, 20000, true),
        (v_shopping_list_id, v_ingredient_id_cabbage, 1, 'kg', 18000, 18000, true),
        (v_shopping_list_id, v_ingredient_id_mushroom, 0.2, 'kg', 25000, 25000, true);

        -- Create expense log
        INSERT INTO public.expense_logs (
            user_id,
            shopping_list_id,
            expense_date,
            expense_type,
            amount,
            description
        ) VALUES (
            v_user_id,
            v_shopping_list_id,
            CURRENT_DATE - INTERVAL '2 days',
            'groceries',
            145000,
            'Đi chợ đầu tuần'
        );
    END IF;
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check shopping lists
-- SELECT * FROM public.shopping_lists WHERE status = 'completed' ORDER BY shopping_date DESC;

-- Check shopping list items with ingredients
-- SELECT 
--     sl.name as list_name,
--     sl.shopping_date,
--     i.name_vi as ingredient_name,
--     sli.quantity,
--     sli.unit,
--     sli.actual_price
-- FROM public.shopping_lists sl
-- JOIN public.shopping_list_items sli ON sl.id = sli.shopping_list_id
-- JOIN public.ingredients i ON sli.ingredient_id = i.id
-- WHERE sl.status = 'completed'
-- ORDER BY sl.shopping_date DESC, i.name_vi;

-- Check expense logs
-- SELECT * FROM public.expense_logs ORDER BY expense_date DESC;

