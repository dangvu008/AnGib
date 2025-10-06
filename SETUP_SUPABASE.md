# 🚀 Hướng dẫn Cấu hình Supabase

## Bước 1: Tạo Project Supabase

1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng nhập hoặc tạo tài khoản mới
3. Click **"New Project"**
4. Điền thông tin:
   - Project name: `angi` (hoặc tên bất kỳ)
   - Database password: Tạo password mạnh
   - Region: Chọn `Southeast Asia (Singapore)` để độ trễ thấp
5. Click **"Create new project"** và đợi 2-3 phút

## Bước 2: Lấy API Keys

1. Vào project vừa tạo
2. Click vào **Settings** (icon ⚙️) ở sidebar trái
3. Click vào **API** trong menu Settings
4. Bạn sẽ thấy:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Project API keys**:
     - `anon` / `public` key: Key này an toàn để dùng ở client-side

## Bước 3: Cấu hình Environment Variables

1. Mở file `.env.local` trong project (đã được tạo sẵn)
2. Thay thế các giá trị:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save file

## Bước 4: Chạy SQL Schema

1. Trong Supabase dashboard, click **SQL Editor** ở sidebar
2. Click **"New query"**
3. Copy toàn bộ nội dung file `database/supabase_schema.sql`
4. Paste vào SQL Editor
5. Click **"Run"** để tạo các tables, functions, RLS policies

Hoặc chạy từng file theo thứ tự:
- `database/supabase_schema.sql` - Main schema
- `database/seed_data.sql` - Sample data (optional)
- `database/seed_shopping_history.sql` - Shopping history samples (optional)

## Bước 5: Test Connection

1. Restart dev server:
```bash
npm run dev
```

2. Mở console trong browser (F12)
3. Không nên thấy lỗi liên quan đến Supabase
4. Try đăng ký/đăng nhập

## Bước 6: Kiểm tra API

Test các endpoints:
- `GET /api/shopping-history?period=week`
- `GET /api/spending-summary?period=week`

Nếu trả về `401 Unauthorized`, có nghĩa là chưa đăng nhập.

## Troubleshooting

### Lỗi: "supabaseUrl is required"
- Kiểm tra file `.env.local` có đúng format không
- Restart dev server sau khi thay đổi env vars

### Lỗi: "Invalid API key"
- Kiểm tra lại anon key từ Supabase dashboard
- Đảm bảo không có khoảng trắng thừa

### Lỗi: "relation does not exist"
- Chưa chạy SQL schema
- Vào SQL Editor và chạy `database/supabase_schema.sql`

### Data không hiển thị
- Kiểm tra RLS policies đã được enable
- Đảm bảo user đã đăng nhập
- Check network tab xem API có trả về 200 không

## Cấu trúc Database

Các tables chính:
- `users` - Thông tin người dùng
- `shopping_lists` - Danh sách mua sắm
- `shopping_list_items` - Chi tiết items
- `expense_logs` - Log chi tiêu
- `ingredients` - Nguyên liệu
- `dishes` - Món ăn
- `meal_plans` - Kế hoạch bữa ăn

## Row Level Security (RLS)

Tất cả tables đều có RLS enabled:
- Users chỉ thấy data của chính mình
- Không thể access data của users khác
- Public data (dishes, ingredients, restaurants) được phép xem bởi tất cả

## Next Steps

1. ✅ Cấu hình Supabase credentials
2. ✅ Chạy database schema
3. ✅ Test connection
4. 🔄 Thêm sample data (optional)
5. 🔄 Configure Authentication (email, Google, etc.)
6. 🔄 Test shopping history features

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Shopping History Guide](./SHOPPING_HISTORY_GUIDE.md)

## Support

Nếu gặp vấn đề, check:
1. Supabase dashboard > Logs
2. Browser console
3. Network tab trong DevTools
4. Server logs trong terminal

