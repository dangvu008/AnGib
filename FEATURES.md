# 🔍 Global Search - Hướng dẫn sử dụng

## Tính năng tìm kiếm toàn cục thông minh

### 🎯 Có thể tìm kiếm:

1. **📋 Thực đơn** - Kế hoạch bữa ăn (7 ngày, 14 ngày, gia đình...)
2. **🍲 Món ăn** - Công thức nấu ăn (chay, giảm cân, nhanh...)
3. **🥕 Nguyên liệu** - Vật liệu cần mua (rau củ, đạm, gia vị...)
4. **🏪 Nhà hàng** - Quán ăn gần bạn (rating, khoảng cách, giá...)

### 🎤 Voice Search - Tìm bằng giọng nói

#### Cách sử dụng:
1. Mở search (Cmd+K hoặc click nút Search)
2. Click icon **🎤 Voice** hoặc nút "Voice" ở góc phải
3. Nói tên món/nguyên liệu (tiếng Việt)
4. Kết quả tự động hiển thị

#### Ví dụ voice commands:
- "Đậu hũ sốt cà"
- "Canh bí đỏ"
- "Thực đơn chay"
- "Quán chay gần đây"

#### Yêu cầu:
- ✅ Trình duyệt: Chrome, Edge (có Web Speech API)
- ✅ Microphone permission
- ✅ Kết nối internet

#### Toast feedback:
```
🎤 Đang lắng nghe...
→ Hãy nói tên món ăn hoặc nguyên liệu

✅ Đã nghe: "Đậu hũ sốt cà"
→ Kết quả hiển thị
```

### ⌨️ Keyboard Shortcuts

| Phím tắt | Chức năng |
|----------|-----------|
| `Cmd+K` (Mac) | Mở search |
| `Ctrl+K` (Windows) | Mở search |
| `↵ Enter` | Chọn kết quả |
| `ESC` | Đóng search |
| `↑↓ Arrows` | Di chuyển |

### 📍 Có mặt ở mọi trang

- ✅ **Trang chủ** (`/`) - Header navigation
- ✅ **Thực đơn** (`/menu`) - Full width dưới header
- ✅ **Món ăn** (`/dishes`) - Kết hợp với local search
- ✅ **Đi chợ** (`/shopping`) - Full width
- ✅ **Nấu ăn** (`/cook`) - Quick access

### 🎨 UI/UX Features

#### Search Button
```
┌─────────────────────────┐
│ 🔍 Tìm kiếm...      ⌘K │
└─────────────────────────┘
```

#### Command Palette
```
╔═══════════════════════════════════════╗
║ 🔍 [Input field]            🎤 Voice ║
╠═══════════════════════════════════════╣
║ 📋 Thực đơn                          ║
║   • Thực đơn chay 7 ngày             ║
║     21 bữa • 1,400-1,600 calo/ngày   ║
╠═══════════════════════════════════════╣
║ 🍲 Món ăn                            ║
║   • Đậu hũ sốt cà chua    [Chay]    ║
║     🔥 180 calo  ⏰ 15 phút          ║
╠═══════════════════════════════════════╣
║ 🥕 Nguyên liệu                       ║
║   • Đậu hũ                           ║
║     Đạm • 7,500₫/hộp                 ║
╠═══════════════════════════════════════╣
║ 🏪 Nhà hàng                          ║
║   • Quán Chay Tịnh Tâm  ⭐ 4.9      ║
║     📍 0.8 km • 40-70k               ║
╚═══════════════════════════════════════╝
```

### 🚀 Search Results Actions

| Loại | Action khi click |
|------|------------------|
| Thực đơn | → `/menu` + toast "Đã chọn: Thực đơn chay 7 ngày" |
| Món ăn | → `/dishes` + toast "Đã chọn món: Đậu hũ sốt cà" |
| Nguyên liệu | → `/shopping` + toast "Đã thêm vào giỏ: Cà chua" |
| Nhà hàng | Toast "🍜 Đang mở bản đồ..." + distance |

### ⚡ Quick Actions (khi chưa nhập)

Nếu input trống, hiển thị 4 quick actions:
- 📋 Xem tất cả thực đơn → `/menu`
- 🍲 Khám phá món ăn → `/dishes`
- 🛒 Danh sách mua sắm → `/shopping`
- 🎲 Tạo thực đơn ngẫu nhiên → Toast

### 🎯 Smart Features

#### Auto-complete
- Gõ "đậu" → Hiện tất cả món có đậu
- Gõ "chay" → Filter món chay
- Gõ "nhanh" → Món nấu nhanh

#### Category Icons
- 📋 Màu cam - Thực đơn
- 🍲 Màu xanh lá - Món ăn
- 🥕 Màu vàng - Nguyên liệu
- 🏪 Màu tím - Nhà hàng

#### Badge Tags
- 🌿 Chay
- 🔥 Calo count
- ⏰ Thời gian
- ⭐ Rating
- 📍 Khoảng cách

### 📱 Mobile Support

- ✅ Touch-optimized
- ✅ Voice button lớn, dễ tap
- ✅ Responsive keyboard hints
- ✅ Auto-focus input
- ✅ Smooth animations

### 🛠️ Technical Details

#### Web Speech API
```typescript
const SpeechRecognition = 
  window.webkitSpeechRecognition || 
  window.SpeechRecognition

recognition.lang = "vi-VN"
recognition.continuous = false
recognition.interimResults = false
```

#### Event Handlers
```typescript
onstart → Toast "Đang lắng nghe..."
onresult → setSearch(transcript)
onerror → Toast error
onend → setIsListening(false)
```

#### Keyboard Listener
```typescript
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOpen(true)
    }
  }
  // ...
}, [])
```

### 🎨 Visual States

| State | Visual |
|-------|--------|
| Idle | Search icon xám |
| Listening | 🎤 Đỏ + animate-pulse |
| Results | Group theo category |
| Empty | "Không tìm thấy" + icon |
| Hover | Background highlight |

### 🔗 Integration Points

1. **Header** - Luôn hiển thị search button
2. **All Pages** - Component có mặt ở 5 trang
3. **Navigation** - Click result → route đến trang phù hợp
4. **Notifications** - Toast feedback cho mọi action

### 💡 Tips

- Dùng Cmd+K để mở nhanh
- Click Voice để tìm bằng giọng nói
- Arrow keys để navigate
- Enter để chọn
- ESC để đóng

### 🔮 Future Enhancements

- [ ] Search history
- [ ] Recent searches
- [ ] Popular searches
- [ ] Search analytics
- [ ] AI suggestions
- [ ] Fuzzy search
- [ ] Multi-language voice

---

**Trải nghiệm ngay tại http://localhost:3001**

Bấm `Cmd+K` hoặc click nút Search ở header! 🎉

