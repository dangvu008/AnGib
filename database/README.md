# Database Schema - MealPlan AI

Tài liệu thiết kế cơ sở dữ liệu cho ứng dụng **MealPlan AI** - Trợ lý ẩm thực thông minh.

## 📋 Tổng quan

MealPlan AI là ứng dụng giúp người dùng:
- 🍽️ Lên kế hoạch bữa ăn thông minh
- 🥗 Quản lý dinh dưỡng cá nhân
- 🛒 Tạo danh sách mua sắm tự động
- 💰 Theo dõi chi tiêu thực phẩm
- 🤖 Nhận gợi ý món ăn từ AI
- 🌱 Hỗ trợ chế độ ăn đặc biệt (chay, ăn kiêng, v.v.)

## 🗃️ Cấu trúc Database

### 1. **Users & Preferences** (Người dùng)

#### `users`
Lưu trữ thông tin người dùng cơ bản
- `id`: UUID (Primary Key)
- `email`: Email đăng nhập (unique)
- `full_name`: Họ tên
- `avatar_url`: Ảnh đại diện
- `phone`: Số điện thoại
- `created_at`, `updated_at`: Timestamps

#### `user_preferences`
Lưu sở thích ăn uống và mục tiêu dinh dưỡng
- `user_id`: Foreign Key -> users
- `dietary_type`: Loại chế độ ăn (vegetarian, vegan, pescatarian, omnivore)
- `allergies`: Mảng các dị ứng (gluten, dairy, nuts, shellfish)
- `disliked_ingredients`: Nguyên liệu không thích
- `health_goals`: Mục tiêu sức khỏe (weight_loss, muscle_gain, maintain)
- `daily_calorie_target`: Mục tiêu calo hàng ngày
- `daily_protein_target`, `daily_carbs_target`, `daily_fat_target`: Mục tiêu dinh dưỡng
- `weekly_budget`: Ngân sách chi tiêu hàng tuần

### 2. **Food Data** (Dữ liệu món ăn)

#### `categories`
Danh mục món ăn (món mặn, canh, rau, cơm, tráng miệng)
- `id`: UUID
- `name`: Tên tiếng Anh
- `name_vi`: Tên tiếng Việt
- `description`: Mô tả
- `icon`: Icon hiển thị

#### `ingredients`
Nguyên liệu thực phẩm
- `id`: UUID
- `name`, `name_vi`: Tên nguyên liệu
- `category`: Phân loại (vegetable, protein, grain, dairy, spice)
- `unit`: Đơn vị đo (kg, gram, ml, liter, piece)
- `calories_per_100g`: Calo trên 100g
- `protein_per_100g`, `carbs_per_100g`, `fat_per_100g`: Dinh dưỡng
- `avg_price_per_unit`: Giá trung bình (VNĐ)
- `is_vegetarian`, `is_vegan`: Phân loại chay/thuần chay

#### `dishes`
Món ăn chi tiết
- `id`: UUID
- `name`, `name_vi`: Tên món
- `description`: Mô tả
- `category_id`: Foreign Key -> categories
- `meal_type`: Loại bữa ăn (breakfast, lunch, dinner, snack)
- `cuisine_type`: Ẩm thực (vietnamese, asian, western)
- `difficulty_level`: Độ khó (easy, medium, hard)
- `prep_time_minutes`: Thời gian chuẩn bị
- `cook_time_minutes`: Thời gian nấu
- `total_time_minutes`: Tổng thời gian
- `servings`: Số phần ăn
- **Dinh dưỡng**: `calories`, `protein`, `carbs`, `fat`, `fiber`
- `estimated_cost`: Chi phí ước tính
- **Phân loại**: `is_vegetarian`, `is_vegan`, `is_gluten_free`, `is_dairy_free`
- `image_url`, `video_url`: Media
- `instructions`: Hướng dẫn nấu (JSON array)
- `tips`: Mẹo vặt
- `popularity_score`: Điểm phổ biến
- `rating_avg`, `rating_count`: Đánh giá

#### `dish_ingredients`
Liên kết món ăn với nguyên liệu
- `dish_id`: Foreign Key -> dishes
- `ingredient_id`: Foreign Key -> ingredients
- `quantity`: Số lượng
- `unit`: Đơn vị
- `is_optional`: Có thể bỏ qua
- `notes`: Ghi chú

#### `tags`
Thẻ tag cho món ăn (nấu nhanh, lành mạnh, tiết kiệm, ...)
- `name`, `name_vi`: Tên tag

#### `dish_tags`
Liên kết món ăn với tags (Many-to-Many)

### 3. **Meal Planning** (Lên kế hoạch bữa ăn)

#### `meal_plans`
Kế hoạch bữa ăn theo tuần/tháng
- `id`: UUID
- `user_id`: Foreign Key -> users
- `name`: Tên kế hoạch
- `description`: Mô tả
- `start_date`, `end_date`: Thời gian
- `total_days`: Tổng số ngày
- `status`: Trạng thái (active, completed, cancelled)
- `target_calories`: Mục tiêu calo
- `target_budget`: Mục tiêu ngân sách

#### `meal_plan_items`
Các bữa ăn cụ thể trong kế hoạch
- `meal_plan_id`: Foreign Key -> meal_plans
- `dish_id`: Foreign Key -> dishes
- `meal_date`: Ngày
- `meal_time`: Bữa (breakfast, lunch, dinner, snack)
- `servings`: Số phần
- `is_completed`: Đã hoàn thành chưa
- `completed_at`: Thời gian hoàn thành

### 4. **Shopping** (Đi chợ)

#### `shopping_lists`
Danh sách mua sắm
- `id`: UUID
- `user_id`: Foreign Key -> users
- `meal_plan_id`: Liên kết với kế hoạch bữa ăn (optional)
- `name`: Tên danh sách
- `shopping_date`: Ngày đi chợ
- `estimated_total`: Tổng tiền ước tính
- `actual_total`: Tổng tiền thực tế
- `status`: Trạng thái (pending, shopping, completed)

#### `shopping_list_items`
Các mặt hàng trong danh sách mua
- `shopping_list_id`: Foreign Key -> shopping_lists
- `ingredient_id`: Foreign Key -> ingredients
- `quantity`: Số lượng
- `unit`: Đơn vị
- `estimated_price`: Giá ước tính
- `actual_price`: Giá thực tế
- `is_purchased`: Đã mua chưa
- `notes`: Ghi chú

### 5. **Restaurants** (Nhà hàng)

#### `restaurants`
Thông tin nhà hàng
- `id`: UUID
- `name`: Tên nhà hàng
- `description`: Mô tả
- `cuisine_type`: Loại ẩm thực
- `address`: Địa chỉ
- `latitude`, `longitude`: Tọa độ GPS
- `phone`, `website`: Liên hệ
- `price_range`: Phân khúc giá (budget, moderate, expensive)
- `price_min`, `price_max`: Khoảng giá
- `rating_avg`, `rating_count`: Đánh giá
- `is_vegetarian_friendly`, `is_vegan_friendly`: Thân thiện với người ăn chay
- `opening_hours`: Giờ mở cửa (JSONB)
- `image_url`, `images`: Hình ảnh

#### `restaurant_dishes`
Món ăn tại nhà hàng
- `restaurant_id`: Foreign Key -> restaurants
- `dish_id`: Liên kết với món ăn trong hệ thống (optional)
- `name`: Tên món
- `price`: Giá
- `is_available`: Còn hàng không

### 6. **Reviews & Favorites** (Đánh giá & Yêu thích)

#### `user_reviews`
Đánh giá từ người dùng
- `user_id`: Foreign Key -> users
- `reviewable_type`: Loại (dish, restaurant)
- `reviewable_id`: ID của món/nhà hàng
- `rating`: Điểm (1-5)
- `review_text`: Nội dung đánh giá
- `images`: Hình ảnh đính kèm

#### `user_favorites`
Danh sách yêu thích
- `user_id`: Foreign Key -> users
- `favorable_type`: Loại (dish, restaurant)
- `favorable_id`: ID của món/nhà hàng

### 7. **Tracking** (Theo dõi)

#### `nutrition_logs`
Nhật ký dinh dưỡng hàng ngày
- `user_id`: Foreign Key -> users
- `log_date`: Ngày
- `meal_time`: Bữa ăn
- `dish_id`: Món ăn
- `calories`, `protein`, `carbs`, `fat`: Dinh dưỡng thực tế
- `notes`: Ghi chú

#### `expense_logs`
Nhật ký chi tiêu
- `user_id`: Foreign Key -> users
- `shopping_list_id`: Liên kết với danh sách mua (optional)
- `expense_date`: Ngày chi tiêu
- `expense_type`: Loại (shopping, dining_out, other)
- `amount`: Số tiền
- `description`: Mô tả

### 8. **AI Features** (Tính năng AI)

#### `ai_recommendations`
Gợi ý món ăn từ AI
- `user_id`: Foreign Key -> users
- `dish_id`: Foreign Key -> dishes
- `recommendation_type`: Loại gợi ý (personalized, trending, seasonal, budget_friendly)
- `reason`: Lý do gợi ý
- `score`: Điểm độ phù hợp
- `is_viewed`: Đã xem chưa
- `is_accepted`: Đã chấp nhận chưa
- `expires_at`: Thời gian hết hạn

## 🔗 Quan hệ giữa các bảng

```
users (1) ----< (N) user_preferences
users (1) ----< (N) meal_plans
users (1) ----< (N) shopping_lists
users (1) ----< (N) user_reviews
users (1) ----< (N) user_favorites
users (1) ----< (N) nutrition_logs
users (1) ----< (N) expense_logs
users (1) ----< (N) ai_recommendations

categories (1) ----< (N) dishes
dishes (1) ----< (N) dish_ingredients
ingredients (N) ----< (N) dishes (qua dish_ingredients)
dishes (N) ----< (N) tags (qua dish_tags)

meal_plans (1) ----< (N) meal_plan_items
dishes (1) ----< (N) meal_plan_items

shopping_lists (1) ----< (N) shopping_list_items
ingredients (1) ----< (N) shopping_list_items

restaurants (1) ----< (N) restaurant_dishes
dishes (1) ----< (N) restaurant_dishes
```

## 🚀 Cài đặt

### Yêu cầu
- PostgreSQL 13+ (khuyến nghị sử dụng PostgreSQL vì hỗ trợ UUID, JSONB, Arrays)
- hoặc MySQL 8.0+ / MariaDB 10.5+

### Cách chạy

1. **Tạo database**
```bash
createdb mealplan_ai
```

2. **Chạy schema**
```bash
psql -d mealplan_ai -f schema.sql
```

3. **Chạy seed data (dữ liệu mẫu)**
```bash
psql -d mealplan_ai -f seed_data.sql
```

## 📊 Indexes

Schema đã bao gồm các indexes tối ưu cho:
- Tìm kiếm theo email người dùng
- Lọc món ăn theo category, meal_type, dietary preferences
- Sắp xếp theo popularity, rating
- Tìm kiếm theo location (latitude, longitude)
- Truy vấn logs theo user và date

## ⚡ Triggers

Hệ thống có các triggers tự động:
- **Auto-update `updated_at`**: Tự động cập nhật timestamp khi có thay đổi
- **Auto-calculate ratings**: Tự động tính điểm trung bình và số lượng đánh giá cho dishes và restaurants

## 🔐 Bảo mật

Khuyến nghị:
- Sử dụng Row Level Security (RLS) trong PostgreSQL
- Thêm indexes cho các trường thường xuyên query
- Backup database định kỳ
- Sử dụng prepared statements để tránh SQL injection

## 📈 Mở rộng trong tương lai

Có thể thêm các bảng:
- `meal_plan_templates`: Mẫu kế hoạch có sẵn
- `user_meal_history`: Lịch sử bữa ăn
- `ingredient_substitutions`: Nguyên liệu thay thế
- `cooking_equipment`: Dụng cụ nấu nướng
- `meal_prep_schedules`: Lịch chuẩn bị món ăn
- `nutrition_goals_tracking`: Theo dõi mục tiêu dinh dưỡng chi tiết
- `social_features`: Tính năng xã hội (follow, share recipes)

## 🛠️ Tech Stack khuyến nghị

### Backend
- **Node.js** với Express hoặc NestJS
- **Prisma** hoặc **TypeORM** cho ORM
- **PostgreSQL** cho database

### Frontend
- **Next.js 15** (đã có sẵn)
- **React Query** hoặc **SWR** cho data fetching
- **Zustand** hoặc **Redux** cho state management

### API
- GraphQL với Apollo Server hoặc
- REST API với Express

### AI/ML
- OpenAI API cho gợi ý món ăn
- TensorFlow.js cho dự đoán sở thích người dùng
- Vector database (Pinecone, Weaviate) cho semantic search

## 📝 Ví dụ Queries

### Tìm món ăn chay có calo thấp
```sql
SELECT * FROM dishes
WHERE is_vegetarian = true 
  AND calories < 300
ORDER BY popularity_score DESC
LIMIT 10;
```

### Lấy kế hoạch bữa ăn tuần này
```sql
SELECT mp.*, mpi.*, d.*
FROM meal_plans mp
JOIN meal_plan_items mpi ON mp.id = mpi.meal_plan_id
JOIN dishes d ON mpi.dish_id = d.id
WHERE mp.user_id = 'user-uuid'
  AND mpi.meal_date >= CURRENT_DATE
  AND mpi.meal_date < CURRENT_DATE + INTERVAL '7 days'
ORDER BY mpi.meal_date, mpi.meal_time;
```

### Tính tổng chi tiêu tuần này
```sql
SELECT SUM(amount) as total_spending
FROM expense_logs
WHERE user_id = 'user-uuid'
  AND expense_date >= DATE_TRUNC('week', CURRENT_DATE)
  AND expense_date < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week';
```

### Tìm nhà hàng chay gần nhất
```sql
SELECT *,
  SQRT(POW(latitude - 10.7769, 2) + POW(longitude - 106.7009, 2)) as distance
FROM restaurants
WHERE is_vegetarian_friendly = true
ORDER BY distance
LIMIT 5;
```

## 📞 Hỗ trợ

Nếu có câu hỏi về database schema, vui lòng liên hệ team phát triển.

---

**MealPlan AI** - Giải quyết câu hỏi "Hôm nay ăn gì?" 🍜


