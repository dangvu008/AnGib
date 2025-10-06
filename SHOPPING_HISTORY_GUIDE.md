# 📊 Hướng dẫn sử dụng tính năng Lịch sử Mua sắm

## Tổng quan

Tính năng **Lịch sử Mua sắm** giúp người dùng theo dõi chi tiêu cho nguyên liệu và thống kê tài chính theo thời gian.

## Các tính năng chính

### 1. 📈 Thống kê Tổng quan

Hiển thị các chỉ số quan trọng:
- **Tổng chi tiêu**: Tổng số tiền đã chi trong khoảng thời gian
- **Lần đi chợ**: Số lần đi chợ đã hoàn thành
- **Trung bình/tuần**: Chi tiêu trung bình mỗi tuần
- **Trung bình/tháng**: Chi tiêu trung bình mỗi tháng

### 2. 🎯 Filter theo thời gian

Ba tùy chọn filter:
- **Tuần này**: 7 ngày gần nhất
- **Tháng này**: 30 ngày gần nhất
- **Tất cả**: Tất cả lịch sử (1 năm)

### 3. 📊 Chi tiêu theo danh mục

Biểu đồ thanh tiến độ hiển thị:
- Phần trăm chi tiêu cho mỗi loại nguyên liệu
- Số tiền chi tiêu cho từng danh mục
- So sánh giữa các danh mục

### 4. 📝 Danh sách Lịch sử

Hiển thị chi tiết từng lần đi chợ:
- Tên và ngày đi chợ
- Tổng chi phí
- Số lượng món đã mua
- Chi tiết nguyên liệu (khi mở rộng)

## API Endpoints

### 1. GET `/api/shopping-history`

Lấy lịch sử mua sắm của user.

**Query Parameters:**
- `period`: `'week'` | `'month'` | `'all'` (mặc định: `'week'`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Đi chợ đầu tuần",
      "shopping_date": "2025-10-04",
      "actual_total": 145000,
      "estimated_total": 150000,
      "status": "completed",
      "items": [
        {
          "id": "uuid",
          "quantity": 2,
          "unit": "hộp",
          "actual_price": 30000,
          "ingredient": {
            "name_vi": "Đậu hũ",
            "category": "Đạm"
          }
        }
      ]
    }
  ],
  "period": "week",
  "startDate": "2025-09-29T00:00:00.000Z",
  "endDate": "2025-10-06T00:00:00.000Z"
}
```

### 2. GET `/api/spending-summary`

Lấy thống kê chi tiêu tổng hợp.

**Query Parameters:**
- `period`: `'week'` | `'month'` | `'all'`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalAmount": 540000,
      "averagePerDay": 77142,
      "averagePerWeek": 180000,
      "averagePerMonth": 540000,
      "transactionCount": 5,
      "shoppingCount": 3
    },
    "expensesByDate": {
      "2025-10-04": 145000,
      "2025-10-01": 195000
    },
    "expensesByType": {
      "groceries": 540000
    },
    "recentExpenses": [...]
  }
}
```

### 3. POST `/api/shopping-history`

Tạo một bản ghi lịch sử mua sắm mới.

**Request Body:**
```json
{
  "name": "Đi chợ hôm nay",
  "shopping_date": "2025-10-06",
  "actual_total": 150000,
  "items": [
    {
      "ingredient_id": "uuid",
      "quantity": 2,
      "unit": "hộp",
      "price": 30000,
      "notes": "Chọn hộp tươi"
    }
  ]
}
```

## Database Schema

### Tables liên quan

#### `shopping_lists`
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- meal_plan_id: UUID (FK -> meal_plans.id, nullable)
- name: VARCHAR(255)
- shopping_date: DATE
- estimated_total: DECIMAL(10,2)
- actual_total: DECIMAL(10,2)
- status: VARCHAR(20) -- 'pending', 'in_progress', 'completed'
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### `shopping_list_items`
```sql
- id: UUID (PK)
- shopping_list_id: UUID (FK -> shopping_lists.id)
- ingredient_id: UUID (FK -> ingredients.id)
- quantity: DECIMAL(8,2)
- unit: VARCHAR(20)
- estimated_price: DECIMAL(10,2)
- actual_price: DECIMAL(10,2)
- is_purchased: BOOLEAN
- notes: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### `expense_logs`
```sql
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- shopping_list_id: UUID (FK -> shopping_lists.id, nullable)
- expense_date: DATE
- expense_type: VARCHAR(20) -- 'groceries', 'dining', 'other'
- amount: DECIMAL(10,2)
- description: TEXT
- notes: TEXT
- created_at: TIMESTAMPTZ
```

## Custom Hook

### `useShoppingHistory(period)`

Hook để fetch và quản lý dữ liệu lịch sử mua sắm.

**Usage:**
```tsx
import { useShoppingHistory } from '@/hooks/useShoppingHistory'

function MyComponent() {
  const {
    shoppingHistory,
    spendingSummary,
    categoryBreakdown,
    loading,
    error,
    refresh
  } = useShoppingHistory('week')

  if (loading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <div>
      <p>Total: {spendingSummary.totalAmount}</p>
      {shoppingHistory.map(history => (
        <ShoppingCard key={history.id} data={history} />
      ))}
    </div>
  )
}
```

## Seed Data

Để test tính năng, chạy script seed:

```sql
-- 1. Update YOUR_USER_ID với user ID thực tế
-- 2. Chạy file: database/seed_shopping_history.sql
```

## Row Level Security (RLS)

Tất cả dữ liệu được bảo vệ bởi RLS:
- Users chỉ thấy lịch sử mua sắm của chính họ
- Không thể xem hoặc chỉnh sửa dữ liệu của users khác

## Workflow

1. **Người dùng tạo danh sách mua sắm** (shopping list) với status `'pending'`
2. **Đi chợ và đánh dấu items đã mua** (`is_purchased = true`)
3. **Cập nhật giá thực tế** cho mỗi item
4. **Hoàn thành** và đổi status thành `'completed'`
5. **Hệ thống tự động**:
   - Tạo `expense_log` entry
   - Cập nhật `actual_total` trong `shopping_lists`
   - Hiển thị trong lịch sử

## UI Components

### Page: `/app/shopping/page.tsx`
- Hiển thị trang lịch sử mua sắm đầy đủ
- Filter theo thời gian
- Thống kê tổng quan
- Danh sách lịch sử có thể mở rộng

### Components được sử dụng:
- `Card`, `CardContent`, `CardHeader` - Từ shadcn/ui
- `Badge` - Hiển thị tags và counts
- `Button` - Actions và filters
- `motion` - Animations từ Framer Motion

## Future Enhancements

### Planned Features:
1. **Biểu đồ chi tiêu** - Line chart theo thời gian
2. **So sánh chi tiêu** - Giữa các tháng
3. **Export dữ liệu** - CSV/Excel
4. **Thông báo ngân sách** - Cảnh báo khi vượt ngân sách
5. **Phân tích xu hướng** - AI insights về chi tiêu
6. **Chia sẻ lịch sử** - Share với gia đình

### Technical Improvements:
- Caching với React Query
- Infinite scroll cho lịch sử dài
- Real-time updates với Supabase Realtime
- Offline support với IndexedDB

## Troubleshooting

### Không thấy dữ liệu
- Kiểm tra xem user đã đăng nhập chưa
- Kiểm tra có shopping lists với status `'completed'` không
- Kiểm tra RLS policies trong Supabase

### Số liệu không khớp
- Kiểm tra `actual_price` trong `shopping_list_items`
- Đảm bảo `actual_total` đã được cập nhật
- Verify expense_logs được tạo đúng

### Performance issues
- Thêm indexes cho các queries thường dùng
- Implement pagination cho danh sách dài
- Cache dữ liệu với React Query hoặc SWR

## Contact & Support

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team phát triển.

