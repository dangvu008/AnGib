-- =====================================================
-- DỮ LIỆU MẪU CHO DATABASE MEALPLAN AI
-- =====================================================

-- Insert Categories
INSERT INTO categories (id, name, name_vi, description, icon) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'main-dish', 'Món mặn', 'Món chính trong bữa ăn', 'utensils'),
('550e8400-e29b-41d4-a716-446655440002', 'soup', 'Món canh', 'Các loại canh và súp', 'soup'),
('550e8400-e29b-41d4-a716-446655440003', 'vegetable', 'Món rau', 'Các món từ rau củ', 'leaf'),
('550e8400-e29b-41d4-a716-446655440004', 'rice', 'Cơm và món bột', 'Cơm, bún, phở, mì', 'rice'),
('550e8400-e29b-41d4-a716-446655440005', 'dessert', 'Tráng miệng', 'Món tráng miệng và đồ ngọt', 'cake');

-- Insert Sample Ingredients (chay)
INSERT INTO ingredients (id, name, name_vi, category, unit, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, avg_price_per_unit, is_vegetarian, is_vegan) VALUES
-- Rau củ
('650e8400-e29b-41d4-a716-446655440001', 'tofu', 'Đậu hũ', 'protein', 'kg', 76, 8.0, 1.9, 4.8, 25000, true, true),
('650e8400-e29b-41d4-a716-446655440002', 'mushroom', 'Nấm hương', 'vegetable', 'kg', 22, 3.1, 3.3, 0.3, 80000, true, true),
('650e8400-e29b-41d4-a716-446655440003', 'tomato', 'Cà chua', 'vegetable', 'kg', 18, 0.9, 3.9, 0.2, 15000, true, true),
('650e8400-e29b-41d4-a716-446655440004', 'eggplant', 'Cà tím', 'vegetable', 'kg', 25, 1.0, 5.9, 0.2, 20000, true, true),
('650e8400-e29b-41d4-a716-446655440005', 'water-spinach', 'Rau muống', 'vegetable', 'kg', 19, 2.6, 2.1, 0.2, 12000, true, true),
('650e8400-e29b-41d4-a716-446655440006', 'cabbage', 'Cải xanh', 'vegetable', 'kg', 25, 1.3, 5.8, 0.2, 10000, true, true),
('650e8400-e29b-41d4-a716-446655440007', 'pumpkin', 'Bí đỏ', 'vegetable', 'kg', 26, 1.0, 6.5, 0.1, 8000, true, true),
('650e8400-e29b-41d4-a716-446655440008', 'carrot', 'Cà rốt', 'vegetable', 'kg', 41, 0.9, 9.6, 0.2, 15000, true, true),

-- Gia vị
('650e8400-e29b-41d4-a716-446655440009', 'garlic', 'Tỏi', 'spice', 'kg', 149, 6.4, 33.1, 0.5, 40000, true, true),
('650e8400-e29b-41d4-a716-446655440010', 'onion', 'Hành tây', 'spice', 'kg', 40, 1.1, 9.3, 0.1, 20000, true, true),
('650e8400-e29b-41d4-a716-446655440011', 'soy-sauce', 'Nước tương', 'condiment', 'liter', 60, 10.5, 5.6, 0.0, 25000, true, true),
('650e8400-e29b-41d4-a716-446655440012', 'sesame-oil', 'Dầu mè', 'condiment', 'liter', 884, 0.0, 0.0, 100.0, 80000, true, true),

-- Ngũ cốc
('650e8400-e29b-41d4-a716-446655440013', 'white-rice', 'Gạo trắng', 'grain', 'kg', 130, 2.7, 28.2, 0.3, 18000, true, true),
('650e8400-e29b-41d4-a716-446655440014', 'brown-rice', 'Gạo lứt', 'grain', 'kg', 111, 2.6, 23.0, 0.9, 25000, true, true);

-- Insert Sample Dishes (món chay)
INSERT INTO dishes (id, name, name_vi, description, category_id, meal_type, cuisine_type, difficulty_level, prep_time_minutes, cook_time_minutes, total_time_minutes, servings, calories, protein, carbs, fat, estimated_cost, is_vegetarian, is_vegan, is_gluten_free, image_url, instructions, popularity_score) VALUES
-- Món mặn chay
('750e8400-e29b-41d4-a716-446655440001', 'Braised Tofu with Tomato', 'Đậu hũ sốt cà', 'Món đậu hũ chiên giòn nấu cùng cà chua tươi, thơm ngon bổ dưỡng', '550e8400-e29b-41d4-a716-446655440001', 'lunch', 'vietnamese', 'easy', 10, 15, 25, 2, 180, 12.0, 15.0, 8.0, 35000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Cắt đậu hũ thành miếng vuông", "Chiên đậu hũ đến khi vàng", "Xào cà chua với tỏi", "Cho đậu hũ vào đảo đều", "Nêm gia vị và nấu 5 phút"]', 95),

('750e8400-e29b-41d4-a716-446655440002', 'Stir-fried Mushroom with Vegetables', 'Nấm xào rau củ', 'Nấm tươi xào cùng nhiều loại rau củ đầy màu sắc', '550e8400-e29b-41d4-a716-446655440001', 'lunch', 'vietnamese', 'easy', 8, 12, 20, 2, 150, 8.0, 18.0, 5.0, 45000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Rửa và cắt nấm, rau củ", "Xào tỏi thơm", "Cho nấm xào nhanh", "Thêm rau củ và đảo đều", "Nêm nấm và hoàn thành"]', 88),

('750e8400-e29b-41d4-a716-446655440003', 'Crispy Fried Tofu', 'Đậu phụ chiên giòn', 'Đậu hũ chiên giòn rụm, ăn kèm nước chấm', '550e8400-e29b-41d4-a716-446655440001', 'lunch', 'vietnamese', 'easy', 5, 18, 23, 2, 220, 15.0, 12.0, 14.0, 28000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Cắt đậu hũ", "Thấm khô nước", "Chiên ngập dầu đến vàng giòn", "Vớt ra để ráo", "Ăn kèm nước mắm chay"]', 82),

('750e8400-e29b-41d4-a716-446655440004', 'Stir-fried Eggplant with Garlic', 'Cà tím xào tỏi', 'Cà tím mềm thơm xào với tỏi thơm lừng', '550e8400-e29b-41d4-a716-446655440001', 'lunch', 'vietnamese', 'easy', 7, 10, 17, 2, 140, 4.0, 20.0, 6.0, 25000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Cắt cà tím", "Ngâm nước muối", "Xào tỏi thơm", "Xào cà tím đến mềm", "Nêm nấm hoàn thành"]', 75),

-- Món canh chay
('750e8400-e29b-41d4-a716-446655440005', 'Pumpkin Soup', 'Canh bí đỏ', 'Canh bí đỏ ngọt thanh, bổ dưỡng', '550e8400-e29b-41d4-a716-446655440002', 'lunch', 'vietnamese', 'easy', 5, 10, 15, 2, 80, 2.0, 15.0, 2.0, 18000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Gọt và cắt bí đỏ", "Đun sôi nước", "Cho bí vào nấu chín", "Nêm nấm vừa ăn", "Rắc hành lá"]', 90),

('750e8400-e29b-41d4-a716-446655440006', 'Vegetarian Sour Soup', 'Canh chua chay', 'Canh chua thanh mát với nhiều loại rau', '550e8400-e29b-41d4-a716-446655440002', 'lunch', 'vietnamese', 'medium', 10, 15, 25, 2, 90, 3.0, 18.0, 2.5, 35000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Chuẩn bị rau và nấm", "Đun sôi nước", "Cho rau củ vào nấu", "Nêm chua ngọt", "Rắc rau thơm"]', 85),

('750e8400-e29b-41d4-a716-446655440007', 'Water Spinach Soup', 'Canh rau ngót', 'Canh rau ngót đơn giản, mát lành', '550e8400-e29b-41d4-a716-446655440002', 'lunch', 'vietnamese', 'easy', 3, 8, 11, 2, 60, 2.5, 10.0, 1.5, 15000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Rửa rau ngót", "Đun sôi nước", "Cho rau vào", "Nêm nấm", "Tắt bếp"]', 78),

('750e8400-e29b-41d4-a716-446655440008', 'Mushroom Soup', 'Canh nấm hương', 'Canh nấm hương thơm ngon bổ dưỡng', '550e8400-e29b-41d4-a716-446655440002', 'lunch', 'vietnamese', 'easy', 5, 12, 17, 2, 70, 5.0, 12.0, 2.0, 40000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Ngâm nấm nở", "Đun sôi nước dùng", "Cho nấm vào nấu", "Nêm nấm vừa ăn", "Rắc hành lá"]', 88),

-- Món rau
('750e8400-e29b-41d4-a716-446655440009', 'Stir-fried Water Spinach', 'Rau muống xào', 'Rau muống xào tỏi giòn ngon', '550e8400-e29b-41d4-a716-446655440003', 'lunch', 'vietnamese', 'easy', 3, 5, 8, 2, 60, 3.0, 8.0, 3.0, 15000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Rửa rau muống", "Xào tỏi thơm", "Cho rau vào xào nhanh", "Nêm nấm", "Tắt bếp"]', 92),

('750e8400-e29b-41d4-a716-446655440010', 'Boiled Cabbage', 'Cải xanh luộc', 'Cải xanh luộc chấm nước mắm chay', '550e8400-e29b-41d4-a716-446655440003', 'lunch', 'vietnamese', 'easy', 2, 5, 7, 2, 40, 2.0, 7.0, 1.0, 12000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Rửa cải", "Đun sôi nước", "Luộc cải 3 phút", "Vớt ra", "Chấm nước mắm chay"]', 70),

('750e8400-e29b-41d4-a716-446655440011', 'Stir-fried Pea Shoots', 'Đậu cove xào', 'Đậu cove xào giòn ngọt', '550e8400-e29b-41d4-a716-446655440003', 'lunch', 'vietnamese', 'easy', 3, 6, 9, 2, 50, 3.5, 8.0, 2.0, 18000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Rửa đậu cove", "Xào tỏi", "Cho rau vào xào", "Nêm nấm nhẹ", "Hoàn thành"]', 75),

('750e8400-e29b-41d4-a716-446655440012', 'Stir-fried Amaranth with Garlic', 'Rau dền xào tỏi', 'Rau dền xào tỏi bổ dưỡng', '550e8400-e29b-41d4-a716-446655440003', 'lunch', 'vietnamese', 'easy', 3, 7, 10, 2, 55, 3.0, 9.0, 2.5, 15000, true, true, true, '/healthy-salad-bowl-colorful-vegetables.jpg', '["Nhặt rau dền", "Xào tỏi băm", "Xào rau nhanh tay", "Nêm gia vị", "Dọn ra đĩa"]', 72);

-- Insert Dish Ingredients (liên kết món ăn với nguyên liệu)
INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity, unit, is_optional) VALUES
-- Đậu hũ sốt cà
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 300, 'gram', false),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 200, 'gram', false),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440009', 20, 'gram', false),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440011', 30, 'ml', false),

-- Nấm xào rau củ
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 200, 'gram', false),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440008', 100, 'gram', false),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440009', 15, 'gram', false),

-- Canh bí đỏ
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440007', 400, 'gram', false),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440010', 50, 'gram', false),

-- Rau muống xào
('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440005', 300, 'gram', false),
('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440009', 20, 'gram', false);

-- Insert Tags
INSERT INTO tags (id, name, name_vi) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'quick', 'Nấu nhanh'),
('850e8400-e29b-41d4-a716-446655440002', 'healthy', 'Lành mạnh'),
('850e8400-e29b-41d4-a716-446655440003', 'budget-friendly', 'Tiết kiệm'),
('850e8400-e29b-41d4-a716-446655440004', 'high-protein', 'Giàu protein'),
('850e8400-e29b-41d4-a716-446655440005', 'low-carb', 'Ít carb'),
('850e8400-e29b-41d4-a716-446655440006', 'comfort-food', 'Món quen thuộc'),
('850e8400-e29b-41d4-a716-446655440007', 'traditional', 'Truyền thống');

-- Insert Dish Tags
INSERT INTO dish_tags (dish_id, tag_id) VALUES
('750e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002'),
('750e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440004'),
('750e8400-e29b-41d4-a716-446655440009', '850e8400-e29b-41d4-a716-446655440001'),
('750e8400-e29b-41d4-a716-446655440009', '850e8400-e29b-41d4-a716-446655440003');

-- Insert Sample Restaurants
INSERT INTO restaurants (id, name, description, cuisine_type, address, latitude, longitude, price_range, price_min, price_max, rating_avg, is_vegetarian_friendly, is_vegan_friendly, image_url) VALUES
('950e8400-e29b-41d4-a716-446655440001', 'Quán Chay Tịnh Tâm', 'Quán chay thuần túy với nhiều món ăn truyền thống', 'vietnamese', '123 Nguyễn Huệ, Quận 1, TP.HCM', 10.7769, 106.7009, 'budget', 40000, 70000, 4.9, true, true, '/restaurant-interior-cozy-dining.jpg'),
('950e8400-e29b-41d4-a716-446655440002', 'Nhà Hàng Chay Sen Việt', 'Nhà hàng chay cao cấp với không gian sang trọng', 'vietnamese', '456 Lê Lợi, Quận 3, TP.HCM', 10.7756, 106.6917, 'moderate', 80000, 150000, 4.7, true, true, '/restaurant-interior-cozy-dining.jpg');


