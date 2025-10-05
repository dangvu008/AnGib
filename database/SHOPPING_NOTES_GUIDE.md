# 📝 Hướng dẫn Tính năng Ghi chú Mua sắm

## Tổng quan

Hệ thống ghi chú mua sắm nâng cao cho phép người dùng thêm nhiều loại thông tin chi tiết cho từng nguyên liệu trong danh sách mua sắm.

## 🎯 Các loại ghi chú

### 1. **Ghi chú cơ bản** (`notes`)
- Ghi chú tự do cho nguyên liệu
- Có sẵn trong bảng `shopping_list_items`

### 2. **Ghi chú mặc định** (`ingredient_shopping_notes`)
Ghi chú được gợi ý tự động dựa trên từng nguyên liệu:
- **quality_tip**: Mẹo chọn chất lượng
- **storage**: Cách bảo quản
- **selection**: Cách lựa chọn
- **substitution**: Nguyên liệu thay thế
- **custom**: Ghi chú tùy chỉnh

### 3. **Template của user** (`user_shopping_note_templates`)
Người dùng tạo template riêng để tái sử dụng:
- **reminder**: Lời nhắc
- **preference**: Sở thích cá nhân
- **quality**: Yêu cầu chất lượng
- **location**: Vị trí mua

### 4. **Thông tin bổ sung**
Các trường mới được thêm vào `shopping_list_items`:
- `custom_name`: Tên chi tiết hơn (VD: "Cà chua bi hữu cơ")
- `brand_preference`: Thương hiệu ưa thích
- `store_location`: Vị trí trong cửa hàng
- `priority`: Mức độ ưu tiên (0-2)
- `reminder`: Lời nhắc đặc biệt
- `photo_url`: Hình ảnh tham khảo

### 5. **Tags** (`shopping_list_item_tags`)
Đánh dấu nhanh cho nguyên liệu:
- `urgent`: Khẩn cấp
- `optional`: Tùy chọn
- `bulk_buy`: Mua số lượng lớn
- `fresh_only`: Chỉ mua tươi
- `organic_preferred`: Ưu tiên hữu cơ

## 📊 Cấu trúc Database

```sql
-- Bảng chính (đã có sẵn)
shopping_list_items
├── notes TEXT                    -- Ghi chú chính
├── custom_name VARCHAR(255)      -- Tên tùy chỉnh ⭐ MỚI
├── brand_preference VARCHAR(255) -- Thương hiệu ⭐ MỚI
├── store_location VARCHAR(255)   -- Vị trí ⭐ MỚI
├── priority INT                  -- Ưu tiên ⭐ MỚI
├── reminder TEXT                 -- Lời nhắc ⭐ MỚI
└── photo_url TEXT               -- Hình ảnh ⭐ MỚI

-- Ghi chú mặc định cho nguyên liệu
ingredient_shopping_notes
├── ingredient_id
├── note_type
├── note_text
├── is_default
└── priority

-- Template của user
user_shopping_note_templates
├── user_id
├── name
├── note_text
├── category
└── use_count

-- Tags
shopping_list_item_tags
├── shopping_list_item_id
└── tag
```

## 🚀 Cách sử dụng

### 1. Cài đặt Enhancement

Chạy file SQL:
```bash
psql $DATABASE_URL -f database/shopping_notes_enhancement.sql
```

Hoặc trong Supabase SQL Editor:
```sql
-- Copy toàn bộ nội dung shopping_notes_enhancement.sql
-- Paste và Run
```

### 2. Thêm ghi chú mặc định cho nguyên liệu

```sql
-- Thêm tip chọn chất lượng
INSERT INTO ingredient_shopping_notes (ingredient_id, note_type, note_text, is_default, priority)
VALUES (
    'ingredient-uuid',
    'quality_tip',
    'Chọn quả chắc, màu đỏ đều, không bị dập',
    true,  -- Hiển thị tự động
    1      -- Priority cao
);

-- Thêm cách bảo quản
INSERT INTO ingredient_shopping_notes (ingredient_id, note_type, note_text, is_default, priority)
VALUES (
    'ingredient-uuid',
    'storage',
    'Để ngăn mát tủ lạnh, tránh ánh nắng trực tiếp',
    false,  -- Không hiển thị tự động
    0
);
```

### 3. Tạo template cá nhân

```typescript
// Tạo template
const { data, error } = await supabase
  .from('user_shopping_note_templates')
  .insert({
    user_id: userId,
    name: 'Nhớ hỏi giá mới',
    note_text: 'Hỏi nhân viên xem có giá khuyến mãi không',
    category: 'reminder'
  })

// Lấy templates phổ biến
const { data: templates } = await supabase
  .rpc('get_popular_note_templates', {
    p_user_id: userId,
    p_limit: 5
  })
```

### 4. Thêm nguyên liệu với ghi chú đầy đủ

```typescript
const { data, error } = await supabase
  .from('shopping_list_items')
  .insert({
    shopping_list_id: listId,
    ingredient_id: ingredientId,
    quantity: 2,
    unit: 'kg',
    
    // Ghi chú cơ bản
    notes: 'Chọn quả chắc, màu đỏ đều',
    
    // Thông tin bổ sung
    custom_name: 'Cà chua bi hữu cơ Đà Lạt',
    brand_preference: 'Dalat Hasfarm',
    store_location: 'Quầy rau tươi, hàng 3',
    priority: 1,  // Quan trọng
    reminder: 'Hỏi xem hàng mới về chưa',
    photo_url: 'https://example.com/tomato.jpg'
  })

// Thêm tags
await supabase
  .from('shopping_list_item_tags')
  .insert([
    { shopping_list_item_id: itemId, tag: 'fresh_only' },
    { shopping_list_item_id: itemId, tag: 'organic_preferred' }
  ])
```

### 5. Lấy ghi chú mặc định

```typescript
// Khi thêm ingredient vào shopping list
const { data: defaultNotes } = await supabase
  .rpc('get_ingredient_default_notes', {
    p_ingredient_id: ingredientId
  })

// Hiển thị gợi ý cho user
defaultNotes.forEach(note => {
  console.log(`${note.note_type}: ${note.note_text}`)
})
```

### 6. Tìm kiếm với notes

```typescript
const { data: items } = await supabase
  .rpc('search_shopping_items_with_notes', {
    p_shopping_list_id: listId,
    p_search_query: 'hữu cơ'
  })

// Tìm tất cả items có từ "hữu cơ" trong:
// - Tên nguyên liệu
// - Ghi chú
// - Tên tùy chỉnh
```

### 7. Sử dụng View

```sql
-- Lấy shopping items với đầy đủ thông tin
SELECT * FROM shopping_list_items_detailed
WHERE shopping_list_id = 'list-uuid'
ORDER BY priority DESC, is_purchased ASC;

-- Xem tổng quan ghi chú của từng nguyên liệu
SELECT * FROM ingredient_notes_summary
WHERE ingredient_id = 'ingredient-uuid';
```

## 💡 Use Cases

### Case 1: Mua rau tươi
```typescript
await supabase.from('shopping_list_items').insert({
  shopping_list_id: listId,
  ingredient_id: 'rau-muong-id',
  quantity: 1,
  unit: 'bó',
  custom_name: 'Rau muống nước',
  notes: 'Chọn lá xanh tươi, thân mềm',
  store_location: 'Quầy rau hữu cơ',
  priority: 2,  // Khẩn cấp - mua tươi hôm nay
  reminder: 'Mua vào sáng sớm để tươi nhất'
})

// Add tag
await supabase.from('shopping_list_item_tags').insert({
  shopping_list_item_id: itemId,
  tag: 'fresh_only'
})
```

### Case 2: Mua nguyên liệu đặc biệt
```typescript
await supabase.from('shopping_list_items').insert({
  shopping_list_id: listId,
  ingredient_id: 'nam-huong-id',
  quantity: 500,
  unit: 'gram',
  custom_name: 'Nấm hương Nhật khô',
  brand_preference: 'Shiitake Premium',
  notes: 'Nấm khô, màu nâu đều, mùi thơm',
  store_location: 'Kệ thực phẩm khô, hàng B',
  priority: 1,
  reminder: 'Kiểm tra hạn sử dụng',
  photo_url: '/reference/shiitake.jpg'
})
```

### Case 3: Template nhanh
```typescript
// Tạo template "Kiểm tra giá"
const { data: template } = await supabase
  .from('user_shopping_note_templates')
  .insert({
    user_id: userId,
    name: 'So sánh giá',
    note_text: 'Hỏi giá ở quầy khác để so sánh',
    category: 'reminder'
  })
  .select()
  .single()

// Sử dụng template
await supabase.from('shopping_list_items').insert({
  ...itemData,
  notes: template.note_text
})

// Tăng use_count
await supabase.rpc('increment_template_use_count', {
  p_template_id: template.id
})
```

## 🎨 UI Component

File `components/shopping/ShoppingItemNotes.tsx` cung cấp:
- Dialog để thêm/sửa ghi chú
- Gợi ý ghi chú mặc định
- Templates của user
- Tags selector
- Upload hình ảnh
- Priority picker

### Sử dụng Component

```tsx
import { ShoppingItemNotes } from '@/components/shopping/ShoppingItemNotes'

<ShoppingItemNotes
  itemId={item.id}
  ingredientId={item.ingredient_id}
  ingredientName={item.ingredient_name}
  currentNotes={item.notes}
  customName={item.custom_name}
  brandPreference={item.brand_preference}
  storeLocation={item.store_location}
  priority={item.priority}
  reminder={item.reminder}
  photoUrl={item.photo_url}
  onUpdate={() => refetch()}
/>
```

## 🔍 Queries hay dùng

### Lấy items theo priority
```sql
SELECT * FROM shopping_list_items_detailed
WHERE shopping_list_id = 'list-uuid'
  AND is_purchased = false
ORDER BY priority DESC, created_at ASC;
```

### Lấy items có tag cụ thể
```sql
SELECT sli.*
FROM shopping_list_items sli
JOIN shopping_list_item_tags slit ON sli.id = slit.shopping_list_item_id
WHERE sli.shopping_list_id = 'list-uuid'
  AND slit.tag = 'urgent';
```

### Thống kê notes của user
```sql
SELECT 
    COUNT(*) as total_items,
    COUNT(notes) FILTER (WHERE notes IS NOT NULL) as items_with_notes,
    COUNT(custom_name) FILTER (WHERE custom_name IS NOT NULL) as items_with_custom_name,
    AVG(priority) as avg_priority
FROM shopping_list_items sli
JOIN shopping_lists sl ON sli.shopping_list_id = sl.id
WHERE sl.user_id = 'user-uuid';
```

## 📱 Mobile-Friendly Features

1. **Quick Tags**: Tap nhanh để thêm tags
2. **Voice Notes**: Có thể mở rộng để thêm voice-to-text
3. **Photo Capture**: Chụp ảnh trực tiếp từ camera
4. **Templates**: Chọn nhanh từ templates hay dùng
5. **Smart Suggestions**: AI gợi ý dựa trên history

## 🚀 Tính năng nâng cao (TODO)

- [ ] Voice notes recording
- [ ] Barcode scanning cho brand_preference
- [ ] Location từ GPS của cửa hàng
- [ ] Share templates giữa users
- [ ] AI suggestions dựa trên mùa, thời tiết
- [ ] Reminder notifications
- [ ] Shopping route optimization dựa trên store_location

## 📊 Analytics

Track được:
- Templates nào được dùng nhiều nhất
- Nguyên liệu nào cần nhiều notes nhất
- Priority distribution
- Tag usage patterns
- Notes completion rate

---

**Happy Shopping! 🛒**

