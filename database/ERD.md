# Entity Relationship Diagram (ERD)

## Sơ đồ quan hệ thực thể cho MealPlan AI

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ • id (PK)       │
│ • email         │
│ • full_name     │
│ • avatar_url    │
│ • phone         │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────┴──────────────────┐
│   USER_PREFERENCES        │
├───────────────────────────┤
│ • id (PK)                 │
│ • user_id (FK)            │
│ • dietary_type            │
│ • allergies[]             │
│ • health_goals[]          │
│ • daily_calorie_target    │
│ • daily_protein_target    │
│ • weekly_budget           │
└───────────────────────────┘


┌──────────────────┐
│   CATEGORIES     │
├──────────────────┤
│ • id (PK)        │         ┌──────────────────────┐
│ • name           │ 1       │      DISHES          │
│ • name_vi        │─────────│──────────────────────┤
│ • description    │       N │ • id (PK)            │
└──────────────────┘         │ • name               │
                             │ • name_vi            │
                             │ • category_id (FK)   │
                             │ • meal_type          │
┌──────────────────┐         │ • cuisine_type       │
│   INGREDIENTS    │         │ • difficulty_level   │
├──────────────────┤         │ • prep_time_minutes  │
│ • id (PK)        │         │ • cook_time_minutes  │
│ • name           │         │ • servings           │
│ • name_vi        │       N │ • calories           │
│ • category       │◄────────┤ • protein            │
│ • unit           │         │ • carbs              │
│ • calories_...   │         │ • fat                │
│ • protein_...    │         │ • estimated_cost     │
│ • avg_price      │         │ • is_vegetarian      │
│ • is_vegetarian  │         │ • is_vegan           │
│ • is_vegan       │         │ • image_url          │
└──────────────────┘         │ • instructions       │
         │                   │ • popularity_score   │
         │ N                 │ • rating_avg         │
         │                   └──────────┬───────────┘
         │                              │
         │                              │ N
         │                   ┌──────────┴───────────┐
         │                   │   DISH_INGREDIENTS   │
         └───────────────────┤──────────────────────┤
                           1 │ • dish_id (FK)       │
                             │ • ingredient_id (FK) │
                             │ • quantity           │
                             │ • unit               │
                             │ • is_optional        │
                             └──────────────────────┘


┌──────────────────┐         ┌──────────────────┐
│      TAGS        │ N     N │   DISH_TAGS      │
├──────────────────┤◄────────┤──────────────────┤
│ • id (PK)        │         │ • dish_id (FK)   │
│ • name           │         │ • tag_id (FK)    │
│ • name_vi        │         └──────────────────┘
└──────────────────┘


┌─────────────────┐
│     USERS       │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────┴──────────────────┐
│     MEAL_PLANS            │
├───────────────────────────┤
│ • id (PK)                 │
│ • user_id (FK)            │
│ • name                    │
│ • start_date              │
│ • end_date                │
│ • total_days              │
│ • status                  │
│ • target_calories         │
│ • target_budget           │
└───────────┬───────────────┘
            │ 1
            │
            │ N
┌───────────┴──────────────────────┐
│      MEAL_PLAN_ITEMS             │
├──────────────────────────────────┤
│ • id (PK)                        │
│ • meal_plan_id (FK)              │
│ • dish_id (FK) ──────────┐       │
│ • meal_date              │       │
│ • meal_time              │       │
│ • servings               │       │
│ • is_completed           │       │
└──────────────────────────┘       │
                                   │
                                   │ N
                              ┌────┴─────┐
                              │  DISHES  │
                              └──────────┘


┌─────────────────┐
│     USERS       │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────┴──────────────────┐
│   SHOPPING_LISTS          │
├───────────────────────────┤
│ • id (PK)                 │
│ • user_id (FK)            │
│ • meal_plan_id (FK)       │
│ • name                    │
│ • shopping_date           │
│ • estimated_total         │
│ • actual_total            │
│ • status                  │
└───────────┬───────────────┘
            │ 1
            │
            │ N
┌───────────┴──────────────────────┐
│   SHOPPING_LIST_ITEMS            │
├──────────────────────────────────┤
│ • id (PK)                        │
│ • shopping_list_id (FK)          │
│ • ingredient_id (FK) ────────┐   │
│ • quantity                   │   │
│ • unit                       │   │
│ • estimated_price            │   │
│ • actual_price               │   │
│ • is_purchased               │   │
└──────────────────────────────┘   │
                                   │ N
                             ┌─────┴────────┐
                             │ INGREDIENTS  │
                             └──────────────┘


┌────────────────────┐
│   RESTAURANTS      │
├────────────────────┤
│ • id (PK)          │
│ • name             │
│ • description      │
│ • cuisine_type     │
│ • address          │
│ • latitude         │
│ • longitude        │
│ • phone            │
│ • price_range      │
│ • price_min        │
│ • price_max        │
│ • rating_avg       │
│ • is_vegetarian... │
│ • opening_hours    │
│ • image_url        │
└─────────┬──────────┘
          │ 1
          │
          │ N
┌─────────┴─────────────────────┐
│   RESTAURANT_DISHES           │
├───────────────────────────────┤
│ • id (PK)                     │
│ • restaurant_id (FK)          │
│ • dish_id (FK)                │
│ • name                        │
│ • description                 │
│ • price                       │
│ • is_available                │
└───────────────────────────────┘


┌─────────────────┐
│     USERS       │
└────────┬────────┘
         │ 1
         │
         ├─────────────────────┐
         │ N                   │ N
┌────────┴────────────┐  ┌─────┴────────────┐
│   USER_REVIEWS      │  │  USER_FAVORITES  │
├─────────────────────┤  ├──────────────────┤
│ • id (PK)           │  │ • id (PK)        │
│ • user_id (FK)      │  │ • user_id (FK)   │
│ • reviewable_type   │  │ • favorable_type │
│ • reviewable_id     │  │ • favorable_id   │
│ • rating            │  └──────────────────┘
│ • review_text       │
│ • images[]          │
└─────────────────────┘


┌─────────────────┐
│     USERS       │
└────────┬────────┘
         │ 1
         │
         ├─────────────────────┐
         │ N                   │ N
┌────────┴──────────────┐ ┌────┴───────────────┐
│   NUTRITION_LOGS      │ │   EXPENSE_LOGS     │
├───────────────────────┤ ├────────────────────┤
│ • id (PK)             │ │ • id (PK)          │
│ • user_id (FK)        │ │ • user_id (FK)     │
│ • log_date            │ │ • expense_date     │
│ • meal_time           │ │ • expense_type     │
│ • dish_id (FK)        │ │ • amount           │
│ • calories            │ │ • description      │
│ • protein             │ └────────────────────┘
│ • carbs               │
│ • fat                 │
└───────────────────────┘


┌─────────────────┐
│     USERS       │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────┴──────────────────────┐
│    AI_RECOMMENDATIONS         │
├───────────────────────────────┤
│ • id (PK)                     │
│ • user_id (FK)                │
│ • dish_id (FK) ───────────┐   │
│ • recommendation_type     │   │
│ • reason                  │   │
│ • score                   │   │
│ • is_viewed               │   │
│ • is_accepted             │   │
│ • expires_at              │   │
└───────────────────────────┘   │
                                │ N
                          ┌─────┴────┐
                          │  DISHES  │
                          └──────────┘
```

## 📝 Giải thích quan hệ

### Quan hệ 1-N (One-to-Many)
- 1 User có nhiều Preferences, Meal Plans, Shopping Lists, Reviews, Favorites, Logs
- 1 Category có nhiều Dishes
- 1 Dish có nhiều Dish Ingredients
- 1 Meal Plan có nhiều Meal Plan Items
- 1 Shopping List có nhiều Shopping List Items
- 1 Restaurant có nhiều Restaurant Dishes

### Quan hệ N-N (Many-to-Many)
- Dishes ↔ Ingredients (qua bảng trung gian `dish_ingredients`)
- Dishes ↔ Tags (qua bảng trung gian `dish_tags`)

### Quan hệ Polymorphic
- `user_reviews`: Có thể review Dishes hoặc Restaurants (reviewable_type, reviewable_id)
- `user_favorites`: Có thể favorite Dishes hoặc Restaurants (favorable_type, favorable_id)

## 🎯 Các trường hợp sử dụng chính

### 1. Tạo kế hoạch bữa ăn
```
User → Meal Plan → Meal Plan Items → Dishes → Dish Ingredients → Ingredients
```

### 2. Tạo danh sách đi chợ
```
Meal Plan → Shopping List → Shopping List Items → Ingredients
```

### 3. Tính dinh dưỡng
```
User → Nutrition Logs → Dishes
```

### 4. Tìm nhà hàng phù hợp
```
User → User Preferences → Restaurants (filter by dietary_type)
```

### 5. Nhận gợi ý AI
```
User → User Preferences → AI Recommendations → Dishes
```

## 🔑 Lưu ý về khóa

- **Primary Key (PK)**: UUID cho tất cả các bảng
- **Foreign Key (FK)**: Liên kết giữa các bảng
- **Unique Constraints**: email trong users, (user_id, favorable_type, favorable_id) trong user_favorites
- **Check Constraints**: rating từ 1-5 trong user_reviews

## 📊 Cardinaliry Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| Users → User Preferences | 1:1 | Mỗi user có 1 preferences |
| Users → Meal Plans | 1:N | 1 user có nhiều meal plans |
| Users → Shopping Lists | 1:N | 1 user có nhiều shopping lists |
| Categories → Dishes | 1:N | 1 category có nhiều dishes |
| Dishes → Ingredients | N:N | Nhiều dishes dùng nhiều ingredients |
| Dishes → Tags | N:N | Nhiều dishes có nhiều tags |
| Meal Plans → Meal Plan Items | 1:N | 1 plan có nhiều items |
| Shopping Lists → Shopping List Items | 1:N | 1 list có nhiều items |
| Restaurants → Restaurant Dishes | 1:N | 1 restaurant có nhiều dishes |

