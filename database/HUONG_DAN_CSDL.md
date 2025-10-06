# 📚 HƯỚNG DẪN CƠ SỞ DỮ LIỆU - MEALPLAN AI

## 📖 Mục lục
1. [Giới thiệu](#giới-thiệu)
2. [Bảng Người dùng](#bảng-người-dùng)
3. [Bảng Món ăn](#bảng-món-ăn)
4. [Bảng Nguyên liệu](#bảng-nguyên-liệu)
5. [Bảng Đơn vị đo](#bảng-đơn-vị-đo)
6. [Bảng Kế hoạch bữa ăn](#bảng-kế-hoạch-bữa-ăn)
7. [Bảng Mua sắm](#bảng-mua-sắm)
8. [Bảng Nhà hàng](#bảng-nhà-hàng)
9. [Bảng Theo dõi](#bảng-theo-dõi)
10. [Bảng AI](#bảng-ai)

---

## Giới thiệu

Cơ sở dữ liệu MealPlan AI được thiết kế để quản lý:
- ✅ Thông tin người dùng và sở thích ăn uống
- ✅ Món ăn, công thức nấu ăn và nguyên liệu
- ✅ Kế hoạch bữa ăn theo tuần/tháng
- ✅ Danh sách mua sắm thông minh
- ✅ Theo dõi dinh dưỡng và chi tiêu
- ✅ Gợi ý món ăn từ AI

---

## 1️⃣ BẢNG NGƯỜI DÙNG

### `users` - Thông tin người dùng

**Mục đích**: Lưu trữ thông tin cơ bản của người dùng ứng dụng.

| Trường | Kiểu dữ liệu | Giải thích | Ví dụ |
|--------|--------------|------------|-------|
| `id` | UUID | Mã định danh duy nhất của người dùng | `550e8400-e29b-41d4...` |
| `email` | VARCHAR(255) | Địa chỉ email (duy nhất, dùng để đăng nhập) | `nguyenvana@gmail.com` |
| `full_name` | VARCHAR(255) | Họ và tên đầy đủ | `Nguyễn Văn A` |
| `avatar_url` | TEXT | Đường dẫn ảnh đại diện | `https://...avatar.jpg` |
| `phone` | VARCHAR(20) | Số điện thoại liên hệ | `0901234567` |
| `created_at` | TIMESTAMPTZ | Thời điểm tạo tài khoản | `2025-01-15 10:30:00` |
| `updated_at` | TIMESTAMPTZ | Lần cập nhật thông tin gần nhất | `2025-10-05 14:20:00` |

**Lưu ý quan trọng**:
- Bảng này liên kết với `auth.users` của Supabase
- `id` phải trùng với `id` trong bảng xác thực của Supabase
- Email là duy nhất, không được trùng lặp

**Ví dụ dữ liệu**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "nguyenvana@gmail.com",
  "full_name": "Nguyễn Văn A",
  "avatar_url": "https://storage.supabase.co/avatars/user123.jpg",
  "phone": "0901234567",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-10-05T14:20:00Z"
}
```

---

### `user_preferences` - Sở thích ăn uống

**Mục đích**: Lưu thông tin về chế độ ăn uống, dị ứng, và mục tiêu dinh dưỡng của người dùng.

| Trường | Kiểu dữ liệu | Giải thích | Ví dụ |
|--------|--------------|------------|-------|
| `id` | UUID | Mã định danh | |
| `user_id` | UUID | Liên kết đến bảng `users` | |
| `dietary_type` | VARCHAR(50) | Loại chế độ ăn | `vegetarian`, `vegan`, `omnivore`, `pescatarian` |
| `allergies` | TEXT[] | Danh sách dị ứng thực phẩm | `['gluten', 'dairy', 'nuts']` |
| `disliked_ingredients` | TEXT[] | Nguyên liệu không thích | `['cà rốt', 'dưa chuột']` |
| `health_goals` | TEXT[] | Mục tiêu sức khỏe | `['weight_loss', 'muscle_gain']` |
| `daily_calorie_target` | INT | Mục tiêu calo mỗi ngày | `2000` (calo) |
| `daily_protein_target` | INT | Mục tiêu protein mỗi ngày | `50` (gram) |
| `daily_carbs_target` | INT | Mục tiêu carbohydrate mỗi ngày | `250` (gram) |
| `daily_fat_target` | INT | Mục tiêu chất béo mỗi ngày | `70` (gram) |
| `weekly_budget` | DECIMAL(10,2) | Ngân sách chi tiêu mỗi tuần | `1200000` (VNĐ) |

**Các giá trị dietary_type**:
- `vegetarian`: Ăn chay có trứng sữa
- `vegan`: Ăn chay thuần túy (không trứng, sữa)
- `lacto-ovo-vegetarian`: Ăn chay có trứng và sữa
- `pescatarian`: Ăn chay nhưng có hải sản
- `omnivore`: Ăn tất cả

**Ví dụ**:
```json
{
  "user_id": "550e8400...",
  "dietary_type": "vegetarian",
  "allergies": ["gluten", "nuts"],
  "disliked_ingredients": ["cà rốt"],
  "health_goals": ["weight_loss", "maintain"],
  "daily_calorie_target": 1800,
  "daily_protein_target": 60,
  "weekly_budget": 1200000.00
}
```

---

## 2️⃣ BẢNG MÓN ĂN

### `categories` - Danh mục món ăn

**Mục đích**: Phân loại món ăn theo nhóm (món mặn, canh, rau, cơm, tráng miệng...).

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `id` | UUID | Mã danh mục | |
| `name` | VARCHAR(100) | Tên tiếng Anh | `main-dish`, `soup`, `vegetable` |
| `name_vi` | VARCHAR(100) | Tên tiếng Việt | `Món mặn`, `Món canh`, `Món rau` |
| `description` | TEXT | Mô tả chi tiết | `Các món chính trong bữa ăn` |
| `icon` | VARCHAR(50) | Tên icon hiển thị | `utensils`, `soup`, `leaf` |

**Ví dụ danh mục**:
- Món mặn (main-dish)
- Món canh (soup)
- Món rau (vegetable)
- Cơm và món bột (rice)
- Tráng miệng (dessert)

---

### `dishes` - Món ăn

**Mục đích**: Lưu trữ chi tiết về món ăn, công thức, dinh dưỡng, và đánh giá.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `id` | UUID | Mã món ăn | |
| `name` | VARCHAR(255) | Tên tiếng Anh | `Braised Tofu with Tomato` |
| `name_vi` | VARCHAR(255) | Tên tiếng Việt | `Đậu hũ sốt cà` |
| `description` | TEXT | Mô tả món ăn | `Món đậu hũ chiên giòn nấu cùng cà chua tươi...` |
| `category_id` | UUID | Thuộc danh mục nào | Liên kết đến `categories` |
| `meal_type` | VARCHAR(20) | Bữa ăn nào | `breakfast`, `lunch`, `dinner`, `snack` |
| `cuisine_type` | VARCHAR(50) | Loại ẩm thực | `vietnamese`, `asian`, `western`, `fusion` |
| `difficulty_level` | VARCHAR(20) | Độ khó | `easy`, `medium`, `hard` |
| `prep_time_minutes` | INT | Thời gian chuẩn bị (phút) | `10` |
| `cook_time_minutes` | INT | Thời gian nấu (phút) | `15` |
| `total_time_minutes` | INT | Tổng thời gian (phút) | `25` |
| `servings` | INT | Số phần ăn | `2` |

**Thông tin dinh dưỡng** (trên 1 phần ăn):

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `calories` | INT | Năng lượng (calo) | `180` |
| `protein` | DECIMAL(5,2) | Protein (gram) | `12.50` |
| `carbs` | DECIMAL(5,2) | Carbohydrate (gram) | `15.00` |
| `fat` | DECIMAL(5,2) | Chất béo (gram) | `8.00` |
| `fiber` | DECIMAL(5,2) | Chất xơ (gram) | `3.50` |

**Phân loại**:

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `is_vegetarian` | BOOLEAN | Món chay (có trứng, sữa) | `true` |
| `is_vegan` | BOOLEAN | Món chay thuần túy | `true` |
| `is_gluten_free` | BOOLEAN | Không chứa gluten | `true` |
| `is_dairy_free` | BOOLEAN | Không có sữa | `false` |

**Media và hướng dẫn**:

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `image_url` | TEXT | Hình ảnh món ăn | `https://...dish.jpg` |
| `video_url` | TEXT | Video hướng dẫn | `https://youtube.com/...` |
| `instructions` | JSONB | Các bước nấu (JSON) | `["Bước 1...", "Bước 2..."]` |
| `tips` | TEXT | Mẹo nấu ăn | `Nên chọn cà chua chín đỏ...` |

**Thống kê**:

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `estimated_cost` | DECIMAL(10,2) | Giá ước tính (VNĐ) | `35000` |
| `popularity_score` | INT | Điểm phổ biến (0-100) | `95` |
| `rating_avg` | DECIMAL(3,2) | Đánh giá trung bình (1-5) | `4.80` |
| `rating_count` | INT | Số lượt đánh giá | `120` |

**Ví dụ món ăn**:
```json
{
  "name_vi": "Đậu hũ sốt cà",
  "description": "Món đậu hũ chiên giòn nấu cùng cà chua tươi, thơm ngon bổ dưỡng",
  "meal_type": "lunch",
  "cuisine_type": "vietnamese",
  "difficulty_level": "easy",
  "prep_time_minutes": 10,
  "cook_time_minutes": 15,
  "total_time_minutes": 25,
  "servings": 2,
  "calories": 180,
  "protein": 12.0,
  "carbs": 15.0,
  "fat": 8.0,
  "estimated_cost": 35000,
  "is_vegetarian": true,
  "is_vegan": true,
  "instructions": [
    "Cắt đậu hũ thành miếng vuông",
    "Chiên đậu hũ đến khi vàng",
    "Xào cà chua với tỏi",
    "Cho đậu hũ vào đảo đều",
    "Nêm gia vị và nấu 5 phút"
  ]
}
```

---

### `dish_ingredients` - Nguyên liệu của món ăn

**Mục đích**: Liên kết món ăn với nguyên liệu cần dùng (bảng trung gian).

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `id` | UUID | Mã định danh | |
| `dish_id` | UUID | Món ăn nào | Liên kết `dishes` |
| `ingredient_id` | UUID | Nguyên liệu gì | Liên kết `ingredients` |
| `quantity` | DECIMAL(8,2) | Số lượng cần dùng | `300.00` |
| `unit` | VARCHAR(20) | Đơn vị đo | `gram`, `kg`, `muỗng canh` |
| `is_optional` | BOOLEAN | Có thể bỏ qua không | `false` |
| `notes` | TEXT | Ghi chú thêm | `Chọn đậu hũ tươi` |

**Ví dụ**:
```json
{
  "dish_id": "món-đậu-hũ-sốt-cà-id",
  "ingredient_id": "đậu-hũ-id",
  "quantity": 300,
  "unit": "gram",
  "is_optional": false,
  "notes": "Chọn đậu hũ non, tươi"
}
```

---

### `tags` - Thẻ tag

**Mục đích**: Gắn nhãn cho món ăn để dễ tìm kiếm và lọc.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `name` | VARCHAR(100) | Tên tag tiếng Anh | `quick`, `healthy`, `budget-friendly` |
| `name_vi` | VARCHAR(100) | Tên tag tiếng Việt | `Nấu nhanh`, `Lành mạnh`, `Tiết kiệm` |

**Các tag phổ biến**:
- `quick` - Nấu nhanh
- `healthy` - Lành mạnh
- `budget-friendly` - Tiết kiệm
- `high-protein` - Giàu protein
- `low-carb` - Ít carb
- `comfort-food` - Món quen thuộc
- `traditional` - Truyền thống

---

## 3️⃣ BẢNG NGUYÊN LIỆU

### `ingredients` - Nguyên liệu thực phẩm

**Mục đích**: Lưu trữ thông tin về nguyên liệu, dinh dưỡng, và giá cả.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `id` | UUID | Mã nguyên liệu | |
| `name` | VARCHAR(255) | Tên tiếng Anh | `tofu`, `tomato`, `garlic` |
| `name_vi` | VARCHAR(255) | Tên tiếng Việt | `Đậu hũ`, `Cà chua`, `Tỏi` |
| `category` | VARCHAR(50) | Phân loại | `vegetable`, `protein`, `grain`, `dairy`, `spice` |
| `unit` | VARCHAR(20) | Đơn vị bán chính | `kg`, `gram`, `liter` |

**Dinh dưỡng** (trên 100g):

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `calories_per_100g` | DECIMAL(6,2) | Calo | `76.00` |
| `protein_per_100g` | DECIMAL(5,2) | Protein (g) | `8.00` |
| `carbs_per_100g` | DECIMAL(5,2) | Carbs (g) | `1.90` |
| `fat_per_100g` | DECIMAL(5,2) | Chất béo (g) | `4.80` |

**Giá cả và phân loại**:

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `avg_price_per_unit` | DECIMAL(10,2) | Giá trung bình (VNĐ) | `25000` |
| `is_vegetarian` | BOOLEAN | Phù hợp cho người ăn chay | `true` |
| `is_vegan` | BOOLEAN | Phù hợp cho người ăn chay thuần | `true` |
| `image_url` | TEXT | Hình ảnh nguyên liệu | |

**Ví dụ**:
```json
{
  "name": "tofu",
  "name_vi": "Đậu hũ",
  "category": "protein",
  "unit": "kg",
  "calories_per_100g": 76,
  "protein_per_100g": 8.0,
  "carbs_per_100g": 1.9,
  "fat_per_100g": 4.8,
  "avg_price_per_unit": 25000,
  "is_vegetarian": true,
  "is_vegan": true
}
```

---

## 4️⃣ BẢNG ĐỎN VỊ ĐO

### `units` - Đơn vị đo lường

**Mục đích**: Quản lý các đơn vị đo lường đa văn hóa (kg, gram, lạng, cân, quả, bó...).

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `code` | VARCHAR(20) | Mã đơn vị (duy nhất) | `kg`, `lang`, `qua`, `bo` |
| `name` | VARCHAR(100) | Tên đầy đủ tiếng Anh | `Kilogram`, `Tael` |
| `name_vi` | VARCHAR(100) | Tên tiếng Việt | `Ki-lô-gam`, `Lạng` |
| `symbol` | VARCHAR(20) | Ký hiệu | `kg`, `lạng`, `quả` |
| `category` | VARCHAR(50) | Loại đơn vị | `weight`, `volume`, `count`, `length` |
| `system` | VARCHAR(20) | Hệ đo | `metric`, `imperial`, `traditional_vietnam` |

**Vùng miền và văn hóa**:

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `regions` | TEXT[] | Vùng miền sử dụng | `['vietnam', 'asia']` |
| `countries` | TEXT[] | Quốc gia | `['VN', 'CN', 'TH']` |
| `is_universal` | BOOLEAN | Phổ biến toàn cầu | `true` (kg, g, ml) |

**Chuyển đổi đơn vị**:

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `base_unit` | VARCHAR(20) | Đơn vị chuẩn | `g` (cho weight), `ml` (cho volume) |
| `conversion_factor` | DECIMAL(15,6) | Hệ số chuyển đổi | `100` (1 lạng = 100g) |
| `usage_context` | TEXT | Ngữ cảnh sử dụng | `Thường dùng cho rau củ ở chợ` |
| `examples` | TEXT[] | Ví dụ quy đổi | `['1 kg = 10 lạng', '1 lạng = 100g']` |

**Ví dụ đơn vị Việt Nam**:
```json
{
  "code": "lang",
  "name": "Tael",
  "name_vi": "Lạng",
  "symbol": "lạng",
  "category": "weight",
  "system": "traditional_vietnam",
  "regions": ["vietnam"],
  "countries": ["VN"],
  "is_universal": false,
  "base_unit": "g",
  "conversion_factor": 100,
  "usage_context": "Phổ biến ở chợ truyền thống Việt Nam",
  "examples": ["1 lạng = 100g", "10 lạng = 1 kg"]
}
```

**Các đơn vị phổ biến ở Việt Nam**:
- **Cân lường**: kg, gram, lạng, cân, tạ, yến
- **Thể tích**: lít, ml, chén, muỗng canh, muỗng cà phê
- **Đếm**: quả, trái, củ, cành, bó, chùm, hộp, gói, tấm, miếng

---

### `ingredient_units` - Đơn vị cho từng nguyên liệu

**Mục đích**: Chỉ định đơn vị nào phù hợp cho từng nguyên liệu cụ thể.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `ingredient_id` | UUID | Nguyên liệu nào | Liên kết `ingredients` |
| `unit_id` | UUID | Đơn vị gì | Liên kết `units` |
| `is_primary` | BOOLEAN | Đơn vị chính | `true` (kg cho cà chua) |
| `is_recommended` | BOOLEAN | Được khuyến nghị | `true` |
| `display_order` | INT | Thứ tự hiển thị | `1, 2, 3...` |
| `usage_context` | TEXT | Dùng ở đâu | `Phổ biến ở siêu thị`, `Thường dùng ở chợ` |

**Chuyển đổi đặc biệt**:

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `standard_conversion_value` | DECIMAL(10,3) | Giá trị chuyển từ | `1` |
| `standard_conversion_unit_id` | UUID | Đơn vị chuyển từ | `qua` (quả) |
| `converts_to_value` | DECIMAL(10,3) | Giá trị chuyển đến | `150` |
| `converts_to_unit_id` | UUID | Đơn vị chuyển đến | `g` (gram) |
| `conversion_notes` | TEXT | Ghi chú | `Quả trung bình` |

**Ví dụ - Cà chua có nhiều đơn vị**:
```json
[
  {
    "ingredient_id": "cà-chua-id",
    "unit_id": "kg-id",
    "is_primary": true,
    "display_order": 1,
    "usage_context": "Phổ biến ở siêu thị"
  },
  {
    "ingredient_id": "cà-chua-id",
    "unit_id": "lạng-id",
    "is_primary": false,
    "display_order": 2,
    "usage_context": "Phổ biến ở chợ truyền thống"
  },
  {
    "ingredient_id": "cà-chua-id",
    "unit_id": "quả-id",
    "is_primary": false,
    "display_order": 3,
    "usage_context": "Mua lẻ",
    "standard_conversion_value": 1,
    "converts_to_value": 150,
    "conversion_notes": "1 quả trung bình = 150g"
  }
]
```

---

## 5️⃣ BẢNG KẾ HOẠCH BỮA ĂN

### `meal_plans` - Kế hoạch bữa ăn

**Mục đích**: Tạo kế hoạch bữa ăn theo tuần, tháng cho người dùng.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `id` | UUID | Mã kế hoạch | |
| `user_id` | UUID | Của người dùng nào | Liên kết `users` |
| `name` | VARCHAR(255) | Tên kế hoạch | `Thực đơn tuần này`, `Kế hoạch giảm cân` |
| `description` | TEXT | Mô tả | `Kế hoạch ăn chay 7 ngày` |
| `start_date` | DATE | Ngày bắt đầu | `2025-10-06` |
| `end_date` | DATE | Ngày kết thúc | `2025-10-12` |
| `total_days` | INT | Tổng số ngày | `7` |
| `status` | VARCHAR(20) | Trạng thái | `active`, `completed`, `cancelled` |
| `target_calories` | INT | Mục tiêu calo | `1800` |
| `target_budget` | DECIMAL(10,2) | Ngân sách (VNĐ) | `500000` |

**Ví dụ**:
```json
{
  "user_id": "user-123-id",
  "name": "Thực đơn chay tuần này",
  "description": "Kế hoạch 7 ngày với các món chay giàu protein",
  "start_date": "2025-10-06",
  "end_date": "2025-10-12",
  "total_days": 7,
  "status": "active",
  "target_calories": 1800,
  "target_budget": 500000
}
```

---

### `meal_plan_items` - Chi tiết các bữa ăn

**Mục đích**: Lưu từng bữa ăn cụ thể trong kế hoạch.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `meal_plan_id` | UUID | Thuộc kế hoạch nào | Liên kết `meal_plans` |
| `dish_id` | UUID | Món ăn gì | Liên kết `dishes` |
| `meal_date` | DATE | Ngày nào | `2025-10-06` |
| `meal_time` | VARCHAR(20) | Bữa nào | `breakfast`, `lunch`, `dinner`, `snack` |
| `servings` | INT | Số phần ăn | `2` |
| `notes` | TEXT | Ghi chú | `Thêm rau xào` |
| `is_completed` | BOOLEAN | Đã hoàn thành chưa | `false` |
| `completed_at` | TIMESTAMPTZ | Thời điểm hoàn thành | `2025-10-06 12:30:00` |

**Ví dụ**:
```json
{
  "meal_plan_id": "plan-123-id",
  "dish_id": "đậu-hũ-sốt-cà-id",
  "meal_date": "2025-10-06",
  "meal_time": "lunch",
  "servings": 2,
  "notes": "Thêm ít ớt",
  "is_completed": false
}
```

**Meal time (Bữa ăn)**:
- `breakfast` - Bữa sáng
- `lunch` - Bữa trưa
- `dinner` - Bữa tối
- `snack` - Bữa phụ/Ăn vặt

---

## 6️⃣ BẢNG MUA SẮM

### `shopping_lists` - Danh sách đi chợ

**Mục đích**: Tạo danh sách mua sắm từ kế hoạch bữa ăn hoặc thủ công.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `id` | UUID | Mã danh sách | |
| `user_id` | UUID | Của ai | Liên kết `users` |
| `meal_plan_id` | UUID | Từ kế hoạch nào (tùy chọn) | Liên kết `meal_plans` |
| `name` | VARCHAR(255) | Tên danh sách | `Đi chợ cuối tuần`, `Mua sắm tháng 10` |
| `shopping_date` | DATE | Dự kiến đi chợ ngày nào | `2025-10-06` |
| `estimated_total` | DECIMAL(10,2) | Tổng tiền ước tính (VNĐ) | `350000` |
| `actual_total` | DECIMAL(10,2) | Tổng tiền thực tế (VNĐ) | `380000` |
| `status` | VARCHAR(20) | Trạng thái | `pending`, `shopping`, `completed` |

**Status (Trạng thái)**:
- `pending` - Chưa đi
- `shopping` - Đang đi chợ
- `completed` - Đã hoàn thành

**Ví dụ**:
```json
{
  "user_id": "user-123-id",
  "meal_plan_id": "plan-123-id",
  "name": "Đi chợ cuối tuần",
  "shopping_date": "2025-10-06",
  "estimated_total": 350000,
  "actual_total": 380000,
  "status": "completed"
}
```

---

### `shopping_list_items` - Các món trong danh sách

**Mục đích**: Chi tiết từng nguyên liệu cần mua.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `shopping_list_id` | UUID | Thuộc danh sách nào | |
| `ingredient_id` | UUID | Nguyên liệu gì | Liên kết `ingredients` |
| `quantity` | DECIMAL(8,2) | Số lượng | `2.00` |
| `unit` | VARCHAR(20) | Đơn vị | `kg`, `lạng`, `quả`, `bó` |
| `estimated_price` | DECIMAL(10,2) | Giá ước tính (VNĐ) | `50000` |
| `actual_price` | DECIMAL(10,2) | Giá thực tế (VNĐ) | `55000` |
| `is_purchased` | BOOLEAN | Đã mua chưa | `true` |
| `notes` | TEXT | Ghi chú | `Chọn quả chắc, màu đỏ đều` |

**Thông tin mở rộng** (từ `shopping_notes_enhancement.sql`):

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `custom_name` | VARCHAR(255) | Tên chi tiết hơn | `Cà chua bi hữu cơ Đà Lạt` |
| `brand_preference` | VARCHAR(255) | Thương hiệu ưa thích | `Dalat Hasfarm` |
| `store_location` | VARCHAR(255) | Vị trí trong cửa hàng | `Quầy rau tươi, hàng 3` |
| `priority` | INT | Mức độ ưu tiên | `0` (bình thường), `1` (quan trọng), `2` (khẩn cấp) |
| `reminder` | TEXT | Lời nhắc đặc biệt | `Hỏi nhân viên xem hàng mới về chưa` |
| `photo_url` | TEXT | Hình ảnh tham khảo | `https://...tomato.jpg` |

**Ví dụ**:
```json
{
  "shopping_list_id": "list-123-id",
  "ingredient_id": "cà-chua-id",
  "quantity": 2,
  "unit": "kg",
  "estimated_price": 30000,
  "actual_price": 35000,
  "is_purchased": true,
  "notes": "Chọn quả chắc, màu đỏ đều, không bị dập",
  "custom_name": "Cà chua bi hữu cơ",
  "brand_preference": "Dalat Hasfarm",
  "store_location": "Quầy rau hữu cơ, hàng 2",
  "priority": 1,
  "reminder": "Mua vào sáng sớm để tươi"
}
```

---

### `shopping_list_item_tags` - Tags cho shopping items

**Mục đích**: Gắn nhãn nhanh cho các món cần mua.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `shopping_list_item_id` | UUID | Item nào | |
| `tag` | VARCHAR(50) | Nhãn | `urgent`, `optional`, `bulk_buy`, `fresh_only`, `organic_preferred` |

**Các tag phổ biến**:
- `urgent` - Khẩn cấp
- `optional` - Tùy chọn (có thể không mua)
- `bulk_buy` - Mua số lượng lớn
- `fresh_only` - Chỉ mua tươi (không mua đông lạnh)
- `organic_preferred` - Ưu tiên hữu cơ

---

## 7️⃣ BẢNG NHÀ HÀNG

### `restaurants` - Thông tin nhà hàng

**Mục đích**: Lưu trữ thông tin nhà hàng, quán ăn để gợi ý người dùng.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `id` | UUID | Mã nhà hàng | |
| `name` | VARCHAR(255) | Tên nhà hàng | `Quán Chay Tịnh Tâm` |
| `description` | TEXT | Mô tả | `Quán chay thuần túy, món ăn đa dạng` |
| `cuisine_type` | VARCHAR(50) | Loại ẩm thực | `vietnamese`, `asian`, `western` |
| `address` | TEXT | Địa chỉ | `123 Nguyễn Huệ, Q1, TP.HCM` |
| `latitude` | DECIMAL(10,7) | Vĩ độ GPS | `10.7769000` |
| `longitude` | DECIMAL(10,7) | Kinh độ GPS | `106.7009000` |
| `phone` | VARCHAR(20) | Số điện thoại | `0283822333` |
| `website` | VARCHAR(255) | Website | `https://quanchaytinhtam.vn` |

**Giá cả và đánh giá**:

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `price_range` | VARCHAR(20) | Phân khúc giá | `budget`, `moderate`, `expensive` |
| `price_min` | DECIMAL(10,2) | Giá thấp nhất (VNĐ) | `40000` |
| `price_max` | DECIMAL(10,2) | Giá cao nhất (VNĐ) | `70000` |
| `rating_avg` | DECIMAL(3,2) | Đánh giá TB (1-5) | `4.90` |
| `rating_count` | INT | Số lượt đánh giá | `350` |

**Phân loại**:

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `is_vegetarian_friendly` | BOOLEAN | Thân thiện với người ăn chay | `true` |
| `is_vegan_friendly` | BOOLEAN | Có món chay thuần | `true` |
| `opening_hours` | JSONB | Giờ mở cửa (JSON) | `{"mon": "8:00-22:00", ...}` |
| `image_url` | TEXT | Hình đại diện | |
| `images` | TEXT[] | Nhiều hình ảnh | `['img1.jpg', 'img2.jpg']` |

**Ví dụ**:
```json
{
  "name": "Quán Chay Tịnh Tâm",
  "description": "Quán chay thuần túy với nhiều món ăn truyền thống",
  "cuisine_type": "vietnamese",
  "address": "123 Nguyễn Huệ, Quận 1, TP.HCM",
  "latitude": 10.7769000,
  "longitude": 106.7009000,
  "phone": "0283822333",
  "price_range": "budget",
  "price_min": 40000,
  "price_max": 70000,
  "rating_avg": 4.9,
  "is_vegetarian_friendly": true,
  "is_vegan_friendly": true,
  "opening_hours": {
    "mon": "8:00-22:00",
    "tue": "8:00-22:00",
    "wed": "8:00-22:00",
    "thu": "8:00-22:00",
    "fri": "8:00-22:00",
    "sat": "7:00-23:00",
    "sun": "7:00-23:00"
  }
}
```

---

### `restaurant_dishes` - Món ăn tại nhà hàng

**Mục đích**: Lưu menu của từng nhà hàng.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `restaurant_id` | UUID | Nhà hàng nào | |
| `dish_id` | UUID | Liên kết món trong hệ thống (tùy chọn) | |
| `name` | VARCHAR(255) | Tên món | `Đậu hũ sốt nấm hương` |
| `description` | TEXT | Mô tả | `Đậu hũ chiên giòn với nấm hương` |
| `price` | DECIMAL(10,2) | Giá (VNĐ) | `55000` |
| `image_url` | TEXT | Hình ảnh | |
| `is_available` | BOOLEAN | Còn phục vụ không | `true` |

---

## 8️⃣ BẢNG THEO DÕI

### `user_reviews` - Đánh giá của người dùng

**Mục đích**: Người dùng đánh giá món ăn hoặc nhà hàng.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `user_id` | UUID | Ai đánh giá | |
| `reviewable_type` | VARCHAR(20) | Đánh giá gì | `dish`, `restaurant` |
| `reviewable_id` | UUID | Mã món/nhà hàng | |
| `rating` | INT | Điểm (1-5 sao) | `5` |
| `review_text` | TEXT | Nội dung đánh giá | `Món rất ngon, đậu hũ giòn...` |
| `images` | TEXT[] | Hình ảnh kèm theo | `['review1.jpg', 'review2.jpg']` |

**Ví dụ**:
```json
{
  "user_id": "user-123-id",
  "reviewable_type": "dish",
  "reviewable_id": "đậu-hũ-sốt-cà-id",
  "rating": 5,
  "review_text": "Món rất ngon! Đậu hũ giòn, sốt cà chua đậm đà. Dễ làm và nhanh.",
  "images": ["review_photo1.jpg"]
}
```

---

### `user_favorites` - Danh sách yêu thích

**Mục đích**: Người dùng lưu món ăn hoặc nhà hàng yêu thích.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `user_id` | UUID | Ai lưu | |
| `favorable_type` | VARCHAR(20) | Loại | `dish`, `restaurant` |
| `favorable_id` | UUID | Mã món/nhà hàng | |

---

### `nutrition_logs` - Nhật ký dinh dưỡng

**Mục đích**: Theo dõi dinh dưỡng hàng ngày của người dùng.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `user_id` | UUID | Của ai | |
| `log_date` | DATE | Ngày nào | `2025-10-06` |
| `meal_time` | VARCHAR(20) | Bữa nào | `breakfast`, `lunch`, `dinner` |
| `dish_id` | UUID | Món gì (tùy chọn) | |
| `meal_plan_item_id` | UUID | Từ kế hoạch (tùy chọn) | |
| `calories` | INT | Calo thực tế | `520` |
| `protein` | DECIMAL(5,2) | Protein (g) | `25.50` |
| `carbs` | DECIMAL(5,2) | Carbs (g) | `60.00` |
| `fat` | DECIMAL(5,2) | Chất béo (g) | `15.00` |
| `notes` | TEXT | Ghi chú | `Ăn no, ngon` |

**Ví dụ**:
```json
{
  "user_id": "user-123-id",
  "log_date": "2025-10-06",
  "meal_time": "lunch",
  "dish_id": "đậu-hũ-sốt-cà-id",
  "calories": 520,
  "protein": 25.5,
  "carbs": 60.0,
  "fat": 15.0,
  "notes": "Bữa trưa ngon, no lâu"
}
```

---

### `expense_logs` - Nhật ký chi tiêu

**Mục đích**: Theo dõi chi tiêu thực phẩm.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `user_id` | UUID | Của ai | |
| `shopping_list_id` | UUID | Từ danh sách mua sắm (tùy chọn) | |
| `expense_date` | DATE | Ngày chi | `2025-10-06` |
| `expense_type` | VARCHAR(20) | Loại chi | `shopping`, `dining_out`, `other` |
| `amount` | DECIMAL(10,2) | Số tiền (VNĐ) | `350000` |
| `description` | TEXT | Mô tả | `Đi chợ cuối tuần` |
| `notes` | TEXT | Ghi chú | `Mua nhiều rau củ` |

**Expense type**:
- `shopping` - Đi chợ/Siêu thị
- `dining_out` - Ăn ngoài
- `other` - Khác

---

## 9️⃣ BẢNG AI

### `ai_recommendations` - Gợi ý từ AI

**Mục đích**: Lưu các gợi ý món ăn do AI tạo ra cho người dùng.

| Trường | Kiểu | Giải thích | Ví dụ |
|--------|------|------------|-------|
| `user_id` | UUID | Gợi ý cho ai | |
| `dish_id` | UUID | Gợi ý món nào | |
| `recommendation_type` | VARCHAR(50) | Loại gợi ý | `personalized`, `trending`, `seasonal`, `budget_friendly` |
| `reason` | TEXT | Lý do gợi ý | `Phù hợp với chế độ ăn chay của bạn` |
| `score` | DECIMAL(5,2) | Điểm phù hợp (0-100) | `95.50` |
| `is_viewed` | BOOLEAN | Đã xem chưa | `false` |
| `is_accepted` | BOOLEAN | Đã chọn chưa | `false` |
| `expires_at` | TIMESTAMPTZ | Hết hạn lúc nào | `2025-10-13 00:00:00` |

**Recommendation types**:
- `personalized` - Cá nhân hóa (dựa trên sở thích)
- `trending` - Đang thịnh hành
- `seasonal` - Theo mùa
- `budget_friendly` - Tiết kiệm

**Ví dụ**:
```json
{
  "user_id": "user-123-id",
  "dish_id": "đậu-hũ-sốt-cà-id",
  "recommendation_type": "personalized",
  "reason": "Món ăn chay giàu protein, phù hợp với chế độ ăn của bạn. Dễ nấu và tiết kiệm.",
  "score": 95.5,
  "is_viewed": false,
  "is_accepted": false,
  "expires_at": "2025-10-13T00:00:00Z"
}
```

---

## 🔗 MỐI QUAN HỆ GIỮA CÁC BẢNG

### Quan hệ 1-N (One-to-Many)

```
users (1) ----< (N) user_preferences
users (1) ----< (N) meal_plans
users (1) ----< (N) shopping_lists
users (1) ----< (N) user_reviews
users (1) ----< (N) nutrition_logs
users (1) ----< (N) expense_logs

categories (1) ----< (N) dishes
dishes (1) ----< (N) dish_ingredients
ingredients (1) ----< (N) ingredient_units

meal_plans (1) ----< (N) meal_plan_items
shopping_lists (1) ----< (N) shopping_list_items
restaurants (1) ----< (N) restaurant_dishes
```

### Quan hệ N-N (Many-to-Many)

```
dishes (N) ----< dish_ingredients >---- (N) ingredients
dishes (N) ----< dish_tags >---- (N) tags
```

---

## 💡 VÍ DỤ SỬ DỤNG

### Tạo kế hoạch bữa ăn

```sql
-- 1. Tạo meal plan
INSERT INTO meal_plans (user_id, name, start_date, end_date)
VALUES ('user-id', 'Tuần này', '2025-10-06', '2025-10-12');

-- 2. Thêm món vào kế hoạch
INSERT INTO meal_plan_items (meal_plan_id, dish_id, meal_date, meal_time)
VALUES 
  ('plan-id', 'đậu-hũ-sốt-cà-id', '2025-10-06', 'lunch'),
  ('plan-id', 'canh-bí-đỏ-id', '2025-10-06', 'lunch');
```

### Tạo danh sách mua sắm

```sql
-- 1. Tạo shopping list
INSERT INTO shopping_lists (user_id, name, shopping_date)
VALUES ('user-id', 'Đi chợ cuối tuần', '2025-10-06');

-- 2. Thêm nguyên liệu
INSERT INTO shopping_list_items 
(shopping_list_id, ingredient_id, quantity, unit, notes)
VALUES 
  ('list-id', 'đậu-hũ-id', 300, 'gram', 'Chọn đậu tươi'),
  ('list-id', 'cà-chua-id', 2, 'kg', 'Quả chắc, màu đỏ');
```

### Chuyển đổi đơn vị

```sql
-- Chuyển 2 kg sang lạng
SELECT convert_unit('kg', 'lang', 2);
-- Kết quả: 20 (2 kg = 20 lạng)

-- Chuyển 5 quả cà chua sang gram
SELECT convert_unit('qua', 'g', 5, 'cà-chua-id');
-- Kết quả: 750 (5 quả × 150g = 750g)
```

---

## 📞 HỖ TRỢ

Nếu có thắc mắc về cấu trúc database, vui lòng xem:
- `database/schema.sql` - Schema đầy đủ
- `database/ERD.md` - Sơ đồ quan hệ
- `database/SUPABASE_README.md` - Hướng dẫn Supabase

---

**Chúc bạn sử dụng database thành công! 🚀**


