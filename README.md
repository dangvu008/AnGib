# 🍽️ MealPlan AI - Trợ lý ẩm thực thông minh

> Giải quyết câu hỏi "Hôm nay ăn gì?" với kế hoạch bữa ăn cá nhân hóa, quản lý dinh dưỡng và chi tiêu

## ✨ Tính năng chính

### 🏠 Trang chủ (/)
- **Hero Card**: Bữa ăn tiếp theo với swipe gestures
  - ⬅️ Vuốt trái = Đổi món
  - ➡️ Vuốt phải = Đánh dấu đã ăn
- **Gợi ý theo mùa**: Tự động gợi ý món phù hợp với thời tiết
- **Stats Dashboard**: Theo dõi dinh dưỡng, chi tiêu, lịch trình
- **Quick Actions**: Đổi món ngẫu nhiên, chọn món khác, ăn ngoài

### 📋 Thực đơn (/menu)
- Danh sách thực đơn theo mục tiêu (chay, giảm cân, gia đình)
- Xem chi tiết kế hoạch 7-14 ngày
- Thống kê tổng quan

### 🍲 Món ăn (/dishes)
- Kho công thức nấu ăn
- Tìm kiếm và filter thông minh
- Rating và yêu thích
- Xem công thức chi tiết

### 🛒 Lịch sử Mua sắm (/shopping)
- 📊 Lịch sử mua sắm đã hoàn thành
- 💰 Thống kê chi tiêu theo tuần/tháng
- 📈 Biểu đồ phân bổ chi tiêu theo danh mục
- 🔍 Filter theo thời gian (tuần/tháng/tất cả)
- 📝 Chi tiết nguyên liệu đã mua
- Xem [Hướng dẫn chi tiết](./SHOPPING_HISTORY_GUIDE.md)

### 👨‍🍳 Nấu ăn (/cook)
- Hướng dẫn từng bước chi tiết
- Progress tracking
- Timer cho mỗi bước
- Checklist interactive

## 🎨 UX Highlights

### Micro Animations
- ✅ Tick "Đã ăn" → Animation celebration
- 🖱️ Hover cards → Phóng to + nâng lên
- 🎭 Transitions mượt mà giữa các sections
- 🌊 Fade-in khi scroll vào viewport

### Smart Interactions
- 🔍 **Quick Filters**: Ít calo, Nhanh, Phổ biến
- 🎲 **Random buttons**: Đổi món 1 click
- 📱 **Swipe gestures**: Mobile-optimized
- 🔔 **Toast notifications**: Feedback rõ ràng

### Gamification
- 🎯 **Mini Missions**: Thử thách hàng tuần
- 📊 **Progress tracking**: X/3 hoàn thành
- 🎉 **Rewards**: Animation khi hoàn thành

### Community Features
- 👥 **Community Feed**: Xem người khác nấu gì
- ❤️ **Likes & Comments**: Tương tác cộng đồng
- 💡 **Daily Tips**: Mẹo nấu ăn hàng ngày

## 🚀 Công nghệ sử dụng

- **Framework**: Next.js 15.2.4 (App Router)
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS 4.1.9
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Font**: Geist Sans & Mono

## 📱 Navigation Map

```
/ (Trang chủ)
├── /menu (Thực đơn)
├── /dishes (Món ăn)
├── /shopping (Đi chợ)
└── /cook (Hướng dẫn nấu)
```

## 🎯 Features Implementation Status

| Tính năng | Status | Mô tả |
|-----------|--------|-------|
| Gợi ý theo mùa | ✅ | Tự động detect mùa + gợi ý món |
| Micro animations | ✅ | Hover, transitions, celebrations |
| Hero card | ✅ | Netflix-style với ảnh lớn |
| Swipe gestures | ✅ | Mobile swipe left/right |
| Mini missions | ✅ | Weekly challenges |
| Community feed | ✅ | Social features |
| Daily tips | ✅ | Cooking tips animation |
| Smart filters | ✅ | Sort by calo/time/popularity |
| Toast notifications | ✅ | Feedback cho mọi action |
| Shopping history | ✅ | History + spending analytics |
| Recipe steps | ✅ | Step-by-step cooking guide |

## 🎨 Design System

### Colors
- Primary: `oklch(0.52 0.2 40)` - Xanh ấm
- Chart-1: Cam
- Chart-2: Xanh lá (Chay)
- Chart-3: Vàng
- Chart-4: Tím
- Chart-5: Đỏ cam

### Spacing Philosophy
- Compact spacing cho mobile
- Generous padding cho desktop
- Consistent gap scale: 2, 2.5, 3, 4, 5, 6

### Typography
- Headings: Bold, gradient text cho emphasis
- Body: Regular, muted-foreground cho hierarchy
- Badges: Uppercase tracking-wide cho labels

## 📦 Cài đặt

```bash
# Clone repo
git clone <repo-url>
cd AnGi

# Cài dependencies
npm install

# Chạy dev server
npm run dev

# Mở http://localhost:3000
```

## 🎯 Roadmap

- [x] Kết nối Supabase database
- [x] Authentication & user profiles
- [x] Shopping history & expense tracking
- [ ] AI meal planning algorithm
- [ ] Weather API integration
- [ ] Recipe recommendations ML model
- [ ] Social features (share, comment)
- [ ] Budget notifications & alerts
- [ ] Spending trend analysis with charts
- [ ] Push notifications
- [ ] PWA support
- [ ] Multi-language support

## 👨‍💻 Developer Notes

### File Structure
```
app/
├── page.tsx          # Trang chủ
├── menu/page.tsx     # Thực đơn
├── dishes/page.tsx   # Món ăn
├── shopping/page.tsx # Đi chợ
├── cook/page.tsx     # Nấu ăn
├── layout.tsx        # Root layout + Toaster
└── globals.css       # Custom styles
```

### Key Components
- Smart dish selection sheets với filters
- Animated mission cards
- Community feed cards
- Season-aware suggestions
- Progress tracking components

### State Management
- Local state với React hooks
- Filter states cho mỗi category
- Mission completion tracking
- Shopping list checkboxes

---

Made with ❤️ for Vietnamese home cooks

