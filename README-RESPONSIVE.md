# Responsive Design Guide

## Kích thước màn hình

Ứng dụng tự động nhận diện và tối ưu hiển thị cho các kích thước màn hình:

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px  
- **Desktop**: ≥ 1024px

### Hooks Available

#### 1. `useIsMobile()`
Trả về `boolean` để kiểm tra xem đang ở mobile hay không.

```tsx
import { useIsMobile } from "@/hooks/use-is-mobile"

function MyComponent() {
  const isMobile = useIsMobile()
  
  return (
    <div>
      {isMobile ? "Mobile view" : "Desktop view"}
    </div>
  )
}
```

#### 2. `useIsTablet()`
Trả về `boolean` để kiểm tra xem đang ở tablet hay không.

```tsx
import { useIsTablet } from "@/hooks/use-is-mobile"

function MyComponent() {
  const isTablet = useIsTablet()
  
  return (
    <div>
      {isTablet && "Tablet-specific content"}
    </div>
  )
}
```

#### 3. `useScreenSize()`
Trả về object với đầy đủ thông tin về màn hình.

```tsx
import { useScreenSize } from "@/hooks/use-is-mobile"

function MyComponent() {
  const { width, height, isMobile, isTablet, isDesktop } = useScreenSize()
  
  return (
    <div>
      <p>Width: {width}px</p>
      <p>Height: {height}px</p>
      {isMobile && <p>Mobile</p>}
      {isTablet && <p>Tablet</p>}
      {isDesktop && <p>Desktop</p>}
    </div>
  )
}
```

## Responsive Design Patterns

### 1. CSS-First Approach (Preferred)

Ưu tiên sử dụng Tailwind CSS responsive classes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### 2. Conditional Rendering (When Necessary)

Chỉ sử dụng JavaScript hooks khi cần:
- Ẩn/hiện sections hoàn toàn
- Thay đổi số lượng items hiển thị
- Thay đổi logic/behavior

```tsx
const isMobile = useIsMobile()

return (
  <>
    {/* Always render with CSS */}
    <div className="hidden md:block">
      Desktop only content
    </div>
    
    {/* Conditional rendering for logic */}
    {isMobile ? (
      <MobileComponent />
    ) : (
      <DesktopComponent />
    )}
  </>
)
```

## Tối ưu hiệu năng

### 1. Lazy Loading
```tsx
import { ClientOnly } from "@/components/ClientOnly"

function MyPage() {
  return (
    <ClientOnly fallback={<LoadingSkeleton />}>
      <HeavyComponent />
    </ClientOnly>
  )
}
```

### 2. Debounce Resize Events

Hook `useScreenSize` đã tự động tối ưu, nhưng nếu cần custom:

```tsx
import { useState, useEffect } from "react"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

## Best Practices

### ✅ DO:
- Ưu tiên sử dụng Tailwind responsive classes
- Sử dụng `useIsMobile` cho conditional logic
- Test trên nhiều kích thước màn hình
- Tối ưu images với responsive sizes
- Sử dụng `ClientOnly` để tránh hydration mismatch

### ❌ DON'T:
- Không hardcode pixel values
- Không dùng inline styles cho responsive
- Không check `window.innerWidth` trực tiếp trong render
- Không tạo quá nhiều breakpoints phức tạp

## Examples

### Responsive Grid

```tsx
// ✅ Good: CSS-first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// ✅ Good: Conditional items count
const isMobile = useIsMobile()
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.slice(0, isMobile ? 2 : 6).map(item => <Card key={item.id} {...item} />)}
</div>
```

### Responsive Typography

```tsx
// ✅ Good: Tailwind classes
<h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
  Title
</h1>

<p className="text-sm md:text-base text-gray-600">
  Description
</p>
```

### Responsive Spacing

```tsx
// ✅ Good: Responsive padding/margin
<div className="p-3 md:p-6 mb-4 md:mb-8">
  Content
</div>
```

## Testing

### Browser DevTools
1. Open DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Test các kích thước:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1024px+)

### Real Devices
Test trên thiết bị thật:
- iPhone/Android phone
- iPad/Android tablet
- Desktop browser

## Performance Metrics

Target metrics cho mobile:
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.8s
- Cumulative Layout Shift: < 0.1

