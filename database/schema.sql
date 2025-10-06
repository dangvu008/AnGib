-- =====================================================
-- CSDL CHO ỨNG DỤNG MEALPLAN AI
-- Ứng dụng trợ lý ẩm thực thông minh
-- =====================================================

-- Bảng Users - Quản lý người dùng
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng User Preferences - Sở thích ăn uống của người dùng
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dietary_type VARCHAR(50), -- 'vegetarian', 'vegan', 'lacto-ovo-vegetarian', 'pescatarian', 'omnivore'
    allergies TEXT[], -- Mảng các dị ứng: ['gluten', 'dairy', 'nuts', 'shellfish']
    disliked_ingredients TEXT[], -- Nguyên liệu không thích
    health_goals TEXT[], -- Mục tiêu sức khỏe: ['weight_loss', 'muscle_gain', 'maintain']
    daily_calorie_target INT DEFAULT 2000,
    daily_protein_target INT DEFAULT 50,
    daily_carbs_target INT DEFAULT 250,
    daily_fat_target INT DEFAULT 70,
    weekly_budget DECIMAL(10, 2), -- Ngân sách tuần (VNĐ)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Categories - Danh mục món ăn
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    name_vi VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Ingredients - Nguyên liệu
CREATE TABLE ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_vi VARCHAR(255) NOT NULL,
    category VARCHAR(50), -- 'vegetable', 'protein', 'grain', 'dairy', 'spice', 'condiment'
    unit VARCHAR(20), -- 'kg', 'gram', 'ml', 'liter', 'piece', 'cup'
    calories_per_100g DECIMAL(6, 2),
    protein_per_100g DECIMAL(5, 2),
    carbs_per_100g DECIMAL(5, 2),
    fat_per_100g DECIMAL(5, 2),
    avg_price_per_unit DECIMAL(10, 2), -- Giá trung bình (VNĐ)
    is_vegetarian BOOLEAN DEFAULT true,
    is_vegan BOOLEAN DEFAULT false,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Dishes - Món ăn
CREATE TABLE dishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_vi VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    meal_type VARCHAR(20), -- 'breakfast', 'lunch', 'dinner', 'snack'
    cuisine_type VARCHAR(50), -- 'vietnamese', 'asian', 'western', 'fusion'
    difficulty_level VARCHAR(20), -- 'easy', 'medium', 'hard'
    prep_time_minutes INT,
    cook_time_minutes INT,
    total_time_minutes INT,
    servings INT DEFAULT 2,
    
    -- Thông tin dinh dưỡng (trên 1 phần ăn)
    calories INT,
    protein DECIMAL(5, 2),
    carbs DECIMAL(5, 2),
    fat DECIMAL(5, 2),
    fiber DECIMAL(5, 2),
    
    -- Chi phí
    estimated_cost DECIMAL(10, 2), -- Ước tính chi phí (VNĐ)
    
    -- Phân loại
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    is_dairy_free BOOLEAN DEFAULT false,
    
    -- Hình ảnh và hướng dẫn
    image_url TEXT,
    video_url TEXT,
    instructions TEXT, -- JSON array của các bước
    tips TEXT,
    
    -- Thống kê
    popularity_score INT DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Dish Ingredients - Nguyên liệu của món ăn
CREATE TABLE dish_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id),
    quantity DECIMAL(8, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    is_optional BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Tags - Thẻ tag cho món ăn
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    name_vi VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Dish Tags - Liên kết món ăn với tags
CREATE TABLE dish_tags (
    dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (dish_id, tag_id)
);

-- Bảng Meal Plans - Kế hoạch bữa ăn
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
    
    -- Mục tiêu
    target_calories INT,
    target_budget DECIMAL(10, 2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Meal Plan Items - Các bữa ăn trong kế hoạch
CREATE TABLE meal_plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
    dish_id UUID NOT NULL REFERENCES dishes(id),
    meal_date DATE NOT NULL,
    meal_time VARCHAR(20) NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
    servings INT DEFAULT 1,
    notes TEXT,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Shopping Lists - Danh sách đi chợ
CREATE TABLE shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    shopping_date DATE,
    estimated_total DECIMAL(10, 2),
    actual_total DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'shopping', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Shopping List Items - Các mục trong danh sách đi chợ
CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopping_list_id UUID NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES ingredients(id),
    quantity DECIMAL(8, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    estimated_price DECIMAL(10, 2),
    actual_price DECIMAL(10, 2),
    is_purchased BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Restaurants - Nhà hàng
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cuisine_type VARCHAR(50),
    address TEXT NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    phone VARCHAR(20),
    website VARCHAR(255),
    
    -- Giá và rating
    price_range VARCHAR(20), -- 'budget', 'moderate', 'expensive'
    price_min DECIMAL(10, 2),
    price_max DECIMAL(10, 2),
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    
    -- Phân loại
    is_vegetarian_friendly BOOLEAN DEFAULT false,
    is_vegan_friendly BOOLEAN DEFAULT false,
    
    -- Giờ mở cửa (JSON)
    opening_hours JSONB,
    
    -- Hình ảnh
    image_url TEXT,
    images TEXT[], -- Mảng các hình ảnh
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Restaurant Dishes - Món ăn tại nhà hàng
CREATE TABLE restaurant_dishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    dish_id UUID REFERENCES dishes(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng User Reviews - Đánh giá của người dùng
CREATE TABLE user_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewable_type VARCHAR(20) NOT NULL, -- 'dish', 'restaurant'
    reviewable_id UUID NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    images TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng User Favorites - Món yêu thích
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    favorable_type VARCHAR(20) NOT NULL, -- 'dish', 'restaurant'
    favorable_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, favorable_type, favorable_id)
);

-- Bảng Nutrition Logs - Nhật ký dinh dưỡng
CREATE TABLE nutrition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    meal_time VARCHAR(20), -- 'breakfast', 'lunch', 'dinner', 'snack'
    dish_id UUID REFERENCES dishes(id),
    meal_plan_item_id UUID REFERENCES meal_plan_items(id),
    
    -- Dinh dưỡng thực tế
    calories INT,
    protein DECIMAL(5, 2),
    carbs DECIMAL(5, 2),
    fat DECIMAL(5, 2),
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Expense Logs - Nhật ký chi tiêu
CREATE TABLE expense_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shopping_list_id UUID REFERENCES shopping_lists(id),
    expense_date DATE NOT NULL,
    expense_type VARCHAR(20), -- 'shopping', 'dining_out', 'other'
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng AI Recommendations - Gợi ý của AI
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dish_id UUID NOT NULL REFERENCES dishes(id),
    recommendation_type VARCHAR(50), -- 'personalized', 'trending', 'seasonal', 'budget_friendly'
    reason TEXT,
    score DECIMAL(5, 2),
    is_viewed BOOLEAN DEFAULT false,
    is_accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- =====================================================
-- INDEXES cho tối ưu hiệu suất
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);

-- Dish indexes
CREATE INDEX idx_dishes_category ON dishes(category_id);
CREATE INDEX idx_dishes_meal_type ON dishes(meal_type);
CREATE INDEX idx_dishes_vegetarian ON dishes(is_vegetarian);
CREATE INDEX idx_dishes_vegan ON dishes(is_vegan);
CREATE INDEX idx_dishes_popularity ON dishes(popularity_score DESC);

-- Meal Plan indexes
CREATE INDEX idx_meal_plans_user ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_dates ON meal_plans(start_date, end_date);
CREATE INDEX idx_meal_plan_items_date ON meal_plan_items(meal_date);

-- Shopping List indexes
CREATE INDEX idx_shopping_lists_user ON shopping_lists(user_id);
CREATE INDEX idx_shopping_lists_status ON shopping_lists(status);

-- Restaurant indexes
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX idx_restaurants_rating ON restaurants(rating_avg DESC);

-- Nutrition & Expense logs
CREATE INDEX idx_nutrition_logs_user_date ON nutrition_logs(user_id, log_date);
CREATE INDEX idx_expense_logs_user_date ON expense_logs(user_id, expense_date);

-- AI Recommendations
CREATE INDEX idx_ai_recommendations_user ON ai_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_expires ON ai_recommendations(expires_at);

-- =====================================================
-- TRIGGERS cho tự động cập nhật
-- =====================================================

-- Trigger cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dishes_updated_at BEFORE UPDATE ON dishes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON shopping_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger tính toán rating trung bình cho dishes
CREATE OR REPLACE FUNCTION update_dish_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE dishes
    SET 
        rating_avg = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM user_reviews
            WHERE reviewable_type = 'dish' AND reviewable_id = NEW.reviewable_id
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM user_reviews
            WHERE reviewable_type = 'dish' AND reviewable_id = NEW.reviewable_id
        )
    WHERE id = NEW.reviewable_id AND NEW.reviewable_type = 'dish';
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_dish_rating_trigger
    AFTER INSERT OR UPDATE ON user_reviews
    FOR EACH ROW
    WHEN (NEW.reviewable_type = 'dish')
    EXECUTE FUNCTION update_dish_rating();

-- Trigger tính toán rating trung bình cho restaurants
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restaurants
    SET 
        rating_avg = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM user_reviews
            WHERE reviewable_type = 'restaurant' AND reviewable_id = NEW.reviewable_id
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM user_reviews
            WHERE reviewable_type = 'restaurant' AND reviewable_id = NEW.reviewable_id
        )
    WHERE id = NEW.reviewable_id AND NEW.reviewable_type = 'restaurant';
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_restaurant_rating_trigger
    AFTER INSERT OR UPDATE ON user_reviews
    FOR EACH ROW
    WHEN (NEW.reviewable_type = 'restaurant')
    EXECUTE FUNCTION update_restaurant_rating();


