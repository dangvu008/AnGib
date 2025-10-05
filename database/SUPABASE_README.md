# 🚀 Supabase Setup Guide - MealPlan AI

Hướng dẫn chi tiết để setup database MealPlan AI trên Supabase.

## 📋 Tổng quan

Database này được tối ưu cho Supabase với:
- ✅ **Row Level Security (RLS)** - Bảo mật cấp dòng
- ✅ **Supabase Auth Integration** - Tích hợp xác thực
- ✅ **Realtime Subscriptions** - Cập nhật theo thời gian thực
- ✅ **Storage Integration** - Quản lý file
- ✅ **Edge Functions Ready** - Sẵn sàng cho serverless functions
- ✅ **Full Text Search** - Tìm kiếm toàn văn
- ✅ **Optimized Indexes** - Indexes tối ưu

## 🎯 Bước 1: Tạo Project Supabase

1. Truy cập [supabase.com](https://supabase.com)
2. Đăng nhập/Đăng ký
3. Tạo project mới:
   - **Name**: MealPlan AI
   - **Database Password**: Lưu lại password này!
   - **Region**: Chọn gần nhất (Singapore cho VN)
4. Đợi project khởi tạo (~2 phút)

## 🗄️ Bước 2: Chạy Database Schema

### Option 1: Sử dụng SQL Editor (Khuyến nghị)

1. Vào Supabase Dashboard
2. Chọn **SQL Editor** ở sidebar
3. Tạo **New Query**
4. Copy toàn bộ nội dung file `supabase_schema.sql`
5. Paste vào editor
6. Click **Run** hoặc `Cmd/Ctrl + Enter`
7. Chờ hoàn thành (có thể mất 1-2 phút)

### Option 2: Sử dụng CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push --file supabase_schema.sql
```

## 📦 Bước 3: Chạy Migration (Tùy chọn)

Chạy file `supabase_migration.sql` để thêm:
- Storage buckets
- Storage policies
- Analytics views
- Full-text search
- Helper functions

```bash
# Trong SQL Editor
# Copy và paste nội dung supabase_migration.sql
# Run
```

## 🎨 Bước 4: Setup Storage

### 4.1 Tạo Storage Buckets

Vào **Storage** trong Supabase Dashboard, tạo các buckets:

| Bucket Name | Public | Description |
|-------------|--------|-------------|
| `dish-images` | ✅ Yes | Hình ảnh món ăn |
| `user-avatars` | ✅ Yes | Avatar người dùng |
| `restaurant-images` | ✅ Yes | Hình ảnh nhà hàng |
| `review-images` | ✅ Yes | Hình ảnh đánh giá |

### 4.2 Storage Policies

Policies đã được định nghĩa trong `supabase_migration.sql`. Nếu chưa có, thêm thủ công:

```sql
-- Cho phép public đọc dish-images
CREATE POLICY "Public can view dish images"
ON storage.objects FOR SELECT
USING (bucket_id = 'dish-images');

-- Cho phép authenticated users upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'dish-images' 
    AND auth.role() = 'authenticated'
);
```

## 🔐 Bước 5: Xác minh RLS

Kiểm tra Row Level Security đã được bật:

```sql
-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

Tất cả tables phải có `rowsecurity = true`.

## 🌱 Bước 6: Seed Data (Tùy chọn)

Chạy file `seed_data.sql` để thêm dữ liệu mẫu:

```sql
-- Copy nội dung seed_data.sql vào SQL Editor
-- Chỉnh sửa lại user_id để phù hợp với auth.users
-- Run
```

**Lưu ý**: Cần có user trong `auth.users` trước khi chạy seed data.

## 🔑 Bước 7: Lấy API Keys

1. Vào **Settings** > **API**
2. Copy các giá trị sau:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (Giữ bí mật!)
```

3. Tạo file `.env.local` trong project:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📡 Bước 8: Kết nối từ Next.js

### 8.1 Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 8.2 Tạo Supabase Client

Tạo file `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 8.3 Sử dụng trong Components

```typescript
import { supabase } from '@/lib/supabase'

// Get dishes
const { data: dishes, error } = await supabase
  .from('dishes')
  .select('*')
  .eq('is_vegetarian', true)
  .limit(10)

// Insert meal plan
const { data, error } = await supabase
  .from('meal_plans')
  .insert({
    user_id: user.id,
    name: 'Kế hoạch tuần này',
    start_date: '2025-10-06',
    end_date: '2025-10-12'
  })
```

## 🔄 Bước 9: Setup Realtime (Tùy chọn)

Bật Realtime cho tables cần thiết:

1. Vào **Database** > **Replication**
2. Enable cho các tables:
   - `meal_plan_items`
   - `shopping_list_items`
   - `nutrition_logs`

Code example:

```typescript
// Subscribe to meal plan items changes
const channel = supabase
  .channel('meal-plan-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'meal_plan_items',
      filter: `meal_plan_id=eq.${mealPlanId}`
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

## 🎭 Bước 10: Setup Authentication

### 10.1 Configure Auth Providers

Vào **Authentication** > **Providers**, bật các providers cần thiết:
- ✅ Email
- ✅ Google (tùy chọn)
- ✅ Facebook (tùy chọn)

### 10.2 Auth Flow Example

```typescript
// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'Nguyễn Văn A',
      avatar_url: 'https://...'
    }
  }
})

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Sign Out
await supabase.auth.signOut()
```

## 📊 Bước 11: Test API Endpoints

### Test Queries

```typescript
// 1. Get dishes for vegetarian
const { data } = await supabase
  .rpc('search_dishes_by_preferences', {
    p_user_id: userId,
    p_meal_type: 'lunch',
    p_limit: 10
  })

// 2. Get meal plan for week
const { data } = await supabase
  .rpc('get_meal_plan_for_week', {
    p_user_id: userId,
    p_start_date: '2025-10-06',
    p_end_date: '2025-10-12'
  })

// 3. Get daily nutrition
const { data } = await supabase
  .rpc('get_daily_nutrition', {
    p_user_id: userId,
    p_date: '2025-10-06'
  })

// 4. Full-text search
const { data } = await supabase
  .rpc('search_dishes', {
    search_query: 'tofu'
  })
```

## 🛡️ Best Practices

### Security

1. **Never expose** `SUPABASE_SERVICE_ROLE_KEY` ở client-side
2. **Luôn dùng RLS** - Không disable Row Level Security
3. **Validate input** trước khi insert/update
4. **Use prepared statements** - Supabase client tự động làm

### Performance

1. **Use indexes** - Đã có sẵn trong schema
2. **Limit queries** - Luôn dùng `.limit()`
3. **Select specific columns** - Không dùng `SELECT *` khi không cần
4. **Use pagination** - Với `.range(0, 9)`

### Error Handling

```typescript
const { data, error } = await supabase
  .from('dishes')
  .select('*')

if (error) {
  console.error('Error:', error.message)
  // Handle error
} else {
  // Use data
}
```

## 🔍 Troubleshooting

### Issue: "new row violates row-level security policy"

**Solution**: Kiểm tra policies của table. User có quyền INSERT/UPDATE không?

```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

### Issue: "relation does not exist"

**Solution**: Schema chưa chạy đúng. Chạy lại `supabase_schema.sql`.

### Issue: Authentication không hoạt động

**Solution**: 
1. Check `.env.local` có đúng keys
2. Verify email confirmation (nếu bật)
3. Check Auth providers đã enable

## 📚 Tài liệu tham khảo

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)
- [Storage](https://supabase.com/docs/guides/storage)

## 🎉 Hoàn thành!

Database của bạn đã sẵn sàng! Bây giờ bạn có thể:
- ✅ CRUD operations với RLS
- ✅ Upload/download files
- ✅ Realtime subscriptions
- ✅ Full-text search
- ✅ Custom functions

## 📞 Support

Nếu gặp vấn đề, check:
1. Supabase Dashboard > Logs
2. Browser Console
3. Network tab (DevTools)

---

**Happy Coding! 🚀**

