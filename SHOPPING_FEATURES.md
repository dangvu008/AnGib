# 🛒 Hệ thống Đi chợ - Phân chia tính năng

## 🎯 Mục đích khác nhau

### 1️⃣ "Chuẩn bị đi chợ" (Trang chủ - Sheet)
**Scope:** Chỉ cho **BỮA ĂN HIỆN TẠI**

#### Mục đích:
- ✅ Quick check nguyên liệu cho 1 bữa cụ thể
- ✅ Xem % sẵn sàng để nấu
- ✅ Quyết định nấu hay đi mua thêm

#### Use Case:
```
User chọn bữa trưa: 
- Đậu hũ sốt cà
- Canh bí đỏ  
- Rau muống xào

→ Click "Chuẩn bị đi chợ"
→ Xem: Có 62% nguyên liệu (5/8 món)
→ Quyết định:
   • Đủ 100% → "Bắt đầu nấu ngay"
   • Thiếu → "Thêm vào danh sách đi chợ"
```

#### Features:
- 📊 Progress bar % sẵn sàng
- ✅ Checkbox đánh dấu có/không
- 💰 Tính chi phí CẦN MUA
- 🎯 Focus vào 1 bữa ăn
- ⚡ Quick actions: Đặt lại, Đánh dấu tất cả

#### Actions:
1. **Đủ 100%** → "Bắt đầu nấu ngay" → `/cook`
2. **Thiếu** → "Thêm vào danh sách đi chợ" → Merge vào shopping list

---

### 2️⃣ Trang "Đi chợ" (/shopping)
**Scope:** TỔNG HỢP cho **NHIỀU BỮA / CẢ TUẦN**

#### Mục đích:
- 🗂️ Danh sách tổng hợp tất cả nguyên liệu
- 📝 Quản lý chi tiết (notes, prices)
- 💾 Lưu trữ lâu dài
- 📊 Thống kê tuần/tháng

#### Use Case:
```
User lên kế hoạch cả tuần:
- Thứ 2: Đậu hũ + Canh bí
- Thứ 3: Nấm xào + Canh chua
- Thứ 4: Gỏi cuốn + Rau luộc

→ Mỗi bữa thêm vào danh sách
→ Trang /shopping gom tất cả
→ Đi chợ 1 lần cho cả tuần
```

#### Features:
- 💬 **Ghi chú riêng** cho từng món (max 50 chars)
- 💰 **Edit giá** với validation
- 🏷️ **Badge source**: "Cho bữa Đậu hũ sốt cà"
- 📦 **Gom theo category**: Đạm, Rau củ, Gia vị
- 🗑️ **Xóa từng món** hoặc xóa hàng loạt
- 💾 **LocalStorage** tự động lưu
- 📊 **Thống kê tuần**: Tổng món, % hoàn thành

#### Actions:
1. **Xóa đã mua** → Loại bỏ items checked
2. **Hoàn thành tuần** → Toast + reset list (sau 2s)

---

## 🔄 Workflow Integration

### Flow 1: Nấu bữa đơn lẻ
```
Trang chủ 
→ Chọn bữa ăn
→ "Chuẩn bị đi chợ"
→ Check có đủ không?
   ├─ Đủ → "Nấu ngay" → /cook
   └─ Thiếu → Đi mua ngay tại chợ/siêu thị
```

### Flow 2: Lên kế hoạch cả tuần
```
Trang chủ
→ Lần 1: Bữa A → "Thêm vào list" → 3 món
→ Lần 2: Bữa B → "Thêm vào list" → 5 món
→ Lần 3: Bữa C → "Thêm vào list" → 4 món
→ Vào /shopping → Xem 12 món tổng hợp
→ Đi chợ 1 lần → Tick dần
→ "Hoàn thành tuần" → Reset
```

### Flow 3: Quản lý chi tiết
```
/shopping
→ Click giá → Edit "25000" → Save
→ Thêm note "Chọn tươi, non"
→ Tick đã mua
→ Xem tổng chi: 156,000₫
```

---

## 📊 Sự khác biệt

| Aspect | Chuẩn bị đi chợ (Home) | Trang Đi chợ (/shopping) |
|--------|------------------------|--------------------------|
| **Scope** | 1 bữa ăn | Nhiều bữa / Cả tuần |
| **UI** | Sheet (overlay) | Full page |
| **Data** | 8 món cố định | Dynamic list |
| **Purpose** | Quick check | Quản lý chi tiết |
| **Notes** | ❌ Không có | ✅ Có (editable) |
| **Edit price** | ❌ Không | ✅ Có (validation) |
| **Delete** | ❌ Không | ✅ Có |
| **Storage** | Sync status only | Full persistence |
| **Action** | Add to list / Cook | Complete week |

---

## 💡 Smart Features

### Auto-merge logic
```typescript
// Khi thêm từ trang chủ
newItems.note = `Cho bữa ${currentDishes.savory}`

// Tại /shopping hiển thị badge
if (note.startsWith("Cho bữa")) {
  <Badge>📅 Cho bữa Đậu hũ sốt cà</Badge>
}
```

### Deduplication (Future)
```typescript
// Check trùng tên + quantity
// Merge nếu giống nhau
// Ghi chú gộp: "Cho bữa A, B, C"
```

### Weekly Reset
```typescript
// Sau khi "Hoàn thành tuần"
setTimeout(() => {
  setShoppingList([])
  toast.info("Danh sách đã được reset")
}, 2000)
```

---

## 🎨 Visual Distinction

### Sheet "Chuẩn bị đi chợ"
```
┌─────────────────────────────────┐
│ 🛒 Chuẩn bị đi chợ              │
├─────────────────────────────────┤
│ Đã có: 5/8   62%   46,000₫     │
│ [██████████░░░░] 62%           │
├─────────────────────────────────┤
│ ⚠️ Còn thiếu 3 nguyên liệu     │
├─────────────────────────────────┤
│ Đạm:                            │
│   ☑️ Đậu hũ                     │
│   ☐ Nấm hương      25,000₫     │
├─────────────────────────────────┤
│ [Đặt lại] [Có tất cả]          │
│ [➕ Thêm vào danh sách (3 món)]│
│ 💡 Chỉ cho bữa này             │
└─────────────────────────────────┘
```

### Page "/shopping"
```
┌─────────────────────────────────┐
│ 🛒 Danh sách đi chợ tổng hợp    │
│ Tất cả nguyên liệu cho cả tuần  │
├─────────────────────────────────┤
│ 📦 Danh sách từ nhiều nguồn:    │
│ • Từ "Chuẩn bị đi chợ"          │
│ • Thêm thủ công                 │
│ • Tự động gom theo category     │
├─────────────────────────────────┤
│ ☐ Đậu hũ      [📅 Cho bữa X]   │
│    2 hộp          [✏️] 15,000₫ │
│    [+ Thêm ghi chú]             │
├─────────────────────────────────┤
│ [Xóa đã mua] [Hoàn thành tuần] │
│ 📊 7 món | 28% | 156k           │
└─────────────────────────────────┘
```

---

## 🚀 User Journey

### Scenario 1: Nấu ngay
```
1. Trang chủ → Chọn món
2. "Chuẩn bị đi chợ"
3. ✅ 100% sẵn sàng
4. → "Bắt đầu nấu ngay" → /cook
```

### Scenario 2: Đi mua ngay
```
1. Trang chủ → Chọn món
2. "Chuẩn bị đi chợ"
3. ⚠️ Thiếu 3 món
4. Nhìn danh sách → Đi chợ ngay
5. Không cần thêm vào list
```

### Scenario 3: Lên kế hoạch tuần
```
1. Thứ 2 → "Thêm vào list" (3 món)
2. Thứ 3 → "Thêm vào list" (4 món)
3. Thứ 4 → "Thêm vào list" (2 món)
4. /shopping → Xem 9 món tổng
5. Đi chợ cuối tuần
6. Tick dần khi mua
7. "Hoàn thành tuần"
```

---

## 📱 Toast Messages

### "Chuẩn bị đi chợ"
```
📝 Đã thêm 3 món vào danh sách đi chợ!
   Xem trong trang Đi chợ
   [Xem ngay] ← Action button
```

### Trang Shopping
```
✅ Đã mua: Cà chua
💡 Đã lưu ghi chú
💰 Đã cập nhật giá
🗑️ Đã xóa 2 món đã mua
🎉 Hoàn thành đi chợ tuần này!
   Tổng chi: 156,000₫
```

---

## 🎯 Key Differences

**"Chuẩn bị đi chợ"** = **Instant Decision Tool**
- Nhanh, lightweight
- Read-only list
- Just checkboxes
- No persistence
- Binary decision: Cook or Buy

**Trang Shopping** = **Weekly Management Hub**  
- Chi tiết, comprehensive
- Full CRUD
- Notes + Prices editable
- LocalStorage
- Long-term planning

---

**Không còn trùng lặp! Mỗi tính năng có vai trò riêng!** ✨

