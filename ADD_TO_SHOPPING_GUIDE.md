# 🛒 Hướng dẫn tính năng "Thêm vào Danh sách Mua sắm"

## 🎯 Tổng quan

Tính năng cho phép user **nhanh chóng thêm nguyên liệu** từ bất kỳ món ăn, thực đơn, hoặc kế hoạch nấu ăn vào danh sách mua sắm.

## ✨ Lợi ích

- ✅ **Tiết kiệm thời gian**: Không cần nhớ/ghi nguyên liệu thủ công
- ✅ **Tự động tính toán**: Số lượng nguyên liệu cho từng món
- ✅ **Gom tự động**: Nguyên liệu trùng lặp được cộng dồn
- ✅ **Theo dõi nguồn**: Biết nguyên liệu cho món nào
- ✅ **Workflow thực tế**: Chọn món → Đi chợ → Nấu

## 📦 Components

### 1. `AddDishToShoppingButton`

**Component đơn giản** để thêm **1 món** vào shopping list

#### Props:
```typescript
interface AddDishToShoppingButtonProps {
  dish: {
    id: string
    name: string
    ingredients?: Ingredient[]
    estimatedCost?: number
  }
  variant?: "default" | "outline" | "ghost" | "icon"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean  // Hiển thị text hay chỉ icon
  className?: string
  onAdded?: () => void  // Callback sau khi thêm thành công
}
```

#### Usage:
```tsx
import { AddDishToShoppingButton } from "@/components/AddDishToShoppingButton"

// Icon button (no text)
<AddDishToShoppingButton
  dish={dish}
  variant="outline"
  size="icon"
  showText={false}
/>

// Button với text
<AddDishToShoppingButton
  dish={dish}
  variant="default"
  size="sm"
  showText={true}
/>
```

#### Features:
- ✅ Thêm nguyên liệu vào localStorage
- ✅ Gom nguyên liệu trùng lặp tự động
- ✅ Cập nhật số lượng nếu đã tồn tại
- ✅ Hiển thị toast notification
- ✅ Animation checkmark khi thành công
- ✅ Tooltip khi hover (icon mode)

### 2. `AddToShoppingDialog`

**Component dialog lớn** để thêm **nhiều nguồn** cùng lúc

#### Props:
```typescript
interface AddToShoppingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddIngredients: (ingredients: Ingredient[]) => void
}
```

#### Features:
- ✅ 3 tabs: Công thức, Thực đơn, Kế hoạch tuần
- ✅ Multi-select với checkbox
- ✅ Search & filter
- ✅ Gom nguyên liệu từ nhiều nguồn
- ✅ Hiển thị tổng số món đã chọn
- ✅ Preview thông tin trước khi thêm

#### Usage:
```tsx
import { AddToShoppingDialog } from "@/components/AddToShoppingDialog"

const [showDialog, setShowDialog] = useState(false)

<AddToShoppingDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  onAddIngredients={(ingredients) => {
    // Handle adding ingredients
    console.log("Added:", ingredients)
  }}
/>
```

## 🎨 Tích hợp vào các trang

### ✅ Đã tích hợp:

#### 1. **Trang Món ăn** (`/dishes`)
- Button icon ở mỗi dish card
- Cạnh button "Xem công thức"

```tsx
<AddDishToShoppingButton
  dish={dish}
  variant="outline"
  size="sm"
  showText={false}
/>
```

### 🔜 Có thể tích hợp thêm:

#### 2. **Chi tiết món ăn** (`/cook/[id]`)
Thêm button lớn ở đầu trang:
```tsx
<AddDishToShoppingButton
  dish={dish}
  variant="default"
  size="lg"
  showText={true}
  className="w-full md:w-auto"
/>
```

#### 3. **Trang chủ** (`/`)
Ở card "Bữa ăn tiếp theo":
```tsx
<AddDishToShoppingButton
  dish={nextMeal}
  variant="outline"
  showText={true}
/>
```

#### 4. **Trang Menu** (`/menu`)
Button "Thêm cả menu":
```tsx
<Button onClick={() => setShowDialog(true)}>
  <ShoppingCart className="mr-2" />
  Thêm cả menu vào đi chợ
</Button>

<AddToShoppingDialog ... />
```

#### 5. **Kế hoạch tuần** (`/weekly-plan`)
Button "Chuẩn bị đi chợ cho tuần này":
```tsx
<Button onClick={() => setShowDialog(true)}>
  Chuẩn bị đi chợ tuần này
</Button>
```

## 🔧 Implementation Details

### Data Flow:

```
User clicks button
  ↓
Load dish ingredients (API or props)
  ↓
Get current shopping list (localStorage)
  ↓
Aggregate ingredients (merge duplicates)
  ↓
Update quantities & prices
  ↓
Add source notes (dish name)
  ↓
Save to localStorage
  ↓
Show success toast
  ↓
Visual feedback (checkmark)
```

### LocalStorage Structure:

```typescript
// Key: "angi-shopping-list"
// Value: Array<ShoppingItem>

interface ShoppingItem {
  id: number
  name: string
  quantity: string  // "2kg", "500g"
  price: number
  category: string  // "Rau củ", "Đạm", "Gia vị"
  checked: boolean
  note: string      // "Cho bữa: Phở gà", "Cho 3 món"
}
```

### Category Detection:

Auto-categorize ingredients based on name:
```typescript
const getCategoryFromIngredient = (name: string) => {
  if (includes('đậu', 'nấm', 'thịt', 'cá')) return 'Đạm'
  if (includes('rau', 'củ', 'cà', 'bí')) return 'Rau củ'
  if (includes('dầu', 'tỏi', 'muối', 'nước mắm')) return 'Gia vị'
  if (includes('gạo', 'bún', 'bánh')) return 'Tinh bột'
  return 'Khác'
}
```

### Duplicate Handling:

```typescript
// If ingredient exists:
- Cộng dồn quantity
- Cộng dồn price
- Thêm source vào note

// Example:
Before: "Cà chua - 500g - Cho bữa: Phở"
After:  "Cà chua - 1kg - Cho bữa: Phở, Bún"
```

## 🎨 UI/UX Features

### States:
- **Normal**: Shopping cart icon
- **Adding**: "Đang thêm..." text + disabled
- **Added**: Green checkmark + success message
- **Error**: Red X + error toast

### Visual Feedback:
```tsx
// Success state
className={`${isAdded ? 'bg-green-50 border-green-200' : ''}`}
icon={isAdded ? <Check /> : <ShoppingCart />}
```

### Toast Messages:
```
✅ Success: "Đã thêm vào danh sách mua sắm"
           "5 nguyên liệu mới, 2 đã cập nhật • 150,000₫"

⚠️ Warning: "Món này chưa có thông tin nguyên liệu"

❌ Error:   "Không thể thêm vào danh sách"
```

## 📱 Responsive Design

### Desktop:
- Button với text đầy đủ
- Tooltip khi hover
- Smooth animations

### Mobile:
- Icon button (tiết kiệm space)
- Touch-friendly size (minimum 44x44px)
- Haptic feedback (nếu supported)

## 🚀 Future Enhancements

### Phase 2:
1. **API Integration**: Lưu vào database thay vì localStorage
2. **Sync across devices**: Real-time với Supabase
3. **Smart suggestions**: AI gợi ý thêm nguyên liệu
4. **Price comparison**: So sánh giá các chợ/siêu thị
5. **Shopping modes**: "Đi chợ gần nhất", "Đi siêu thị"

### Phase 3:
1. **Share shopping list**: Chia sẻ với gia đình
2. **Collaborative**: Nhiều người cùng edit
3. **Voice input**: Nói để thêm nguyên liệu
4. **Barcode scanner**: Scan để check off items
5. **Receipt OCR**: Scan hóa đơn tự động

## 🎯 Best Practices

### When to use AddDishToShoppingButton:
- ✅ Card listings (dishes, recipes)
- ✅ Detail pages
- ✅ Quick actions
- ✅ Single item additions

### When to use AddToShoppingDialog:
- ✅ Batch operations
- ✅ Menu planning
- ✅ Weekly meal prep
- ✅ Multiple source selections

## 📊 Metrics to Track

1. **Usage rate**: Bao nhiêu % users dùng feature
2. **Items added**: Trung bình số món thêm/user
3. **Completion rate**: % shopping lists được hoàn thành
4. **Time saved**: So với manual entry

## 🐛 Common Issues & Solutions

### Issue: Ingredients not showing
```typescript
// Solution: Ensure dish has ingredients array
if (!dish.ingredients || dish.ingredients.length === 0) {
  toast.warning("Món này chưa có thông tin nguyên liệu")
  return
}
```

### Issue: Duplicate not merging
```typescript
// Solution: Use exact name matching
const key = ingredient.name.toLowerCase().trim()
```

### Issue: localStorage quota exceeded
```typescript
// Solution: Implement cleanup old items
// Remove checked items older than 7 days
```

## 📚 Related Documents

- [SHOPPING_HISTORY_GUIDE.md](./SHOPPING_HISTORY_GUIDE.md) - Lịch sử mua sắm
- [SHOPPING_FEATURES.md](./SHOPPING_FEATURES.md) - Tất cả tính năng shopping
- [LOCAL_POSTGRESQL_SETUP.md](./LOCAL_POSTGRESQL_SETUP.md) - Database setup

## ✅ Checklist Integration

Khi tích hợp vào trang mới:

- [ ] Import component
- [ ] Pass correct dish data structure
- [ ] Handle onAdded callback (optional)
- [ ] Test on mobile
- [ ] Test with empty ingredients
- [ ] Test duplicate merging
- [ ] Test localStorage persistence
- [ ] Add analytics tracking

---

**Made with ❤️ for Vietnamese home cooks**

