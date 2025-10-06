# 🐘 Hướng dẫn sử dụng PostgreSQL Local (Offline)

Bạn đang dùng PostgreSQL local thay vì Supabase cloud. Đây là hướng dẫn setup và sử dụng.

## ✅ Đã có sẵn

Bạn đã có:
- ✅ PostgreSQL running locally
- ✅ Database: `angi_mealplan`
- ✅ Connection: `localhost:5432`
- ✅ User: `postgres`

## 🔧 Cấu hình hiện tại

File `.env.local` đã được cấu hình:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/angi_mealplan?schema=public"
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 Chạy Schema cho PostgreSQL Local

### Option 1: Dùng SQL trực tiếp

```bash
# Connect to database
psql -h localhost -U postgres -d angi_mealplan

# Hoặc nếu dùng pgAdmin, GUI tool, etc.
```

Sau đó chạy các file SQL theo thứ tự:

1. **Main schema**: `database/supabase_schema.sql`
2. **Sample data**: `database/seed_data.sql` (optional)
3. **Shopping history**: `database/seed_shopping_history.sql` (optional)

### Option 2: Dùng Prisma (Recommended)

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run seed data
npm run db:seed
```

## 🔄 Sử dụng với API Routes

### Cách 1: Dùng Prisma (Recommended for local)

File `lib/db.ts` đã được tạo với helper functions:

```typescript
import { prisma, getShoppingHistory, getSpendingSummary } from '@/lib/db'

// Sử dụng trong API routes
const history = await getShoppingHistory(userId, 'week')
const summary = await getSpendingSummary(userId, 'month')
```

### Cách 2: Cập nhật API routes hiện tại

Thay vì dùng Supabase client, bạn có thể:

**Before (Supabase):**
```typescript
const { data } = await supabase
  .from('shopping_lists')
  .select('*')
  .eq('user_id', userId)
```

**After (Prisma/PostgreSQL):**
```typescript
const data = await prisma.shopping_lists.findMany({
  where: { user_id: userId }
})
```

## ⚠️ Limitations khi dùng Local

Các tính năng Supabase sau sẽ KHÔNG hoạt động:
- ❌ Supabase Auth (email/password, OAuth)
- ❌ Supabase Storage (file uploads)
- ❌ Realtime subscriptions
- ❌ Row Level Security (RLS) policies

### Giải pháp thay thế:

1. **Authentication**: 
   - Dùng NextAuth.js (đã có config trong project)
   - Hoặc tự implement với JWT

2. **File uploads**:
   - Local file system
   - Cloudinary, UploadThing, etc.

3. **Realtime**:
   - Socket.io
   - Polling

4. **Security**:
   - Implement trong API routes
   - Middleware authentication

## 🚀 Cập nhật API Routes cho Local

Tôi sẽ tạo version mới của API routes support cả Supabase và local:

```typescript
// app/api/shopping-history/route.ts
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Check if using Supabase or local
  const useLocal = !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co')
  
  if (useLocal) {
    // Use Prisma for local PostgreSQL
    const history = await prisma.shopping_lists.findMany({
      where: { status: 'completed' },
      include: {
        items: {
          include: {
            ingredient: true
          }
        }
      }
    })
    return NextResponse.json({ data: history })
  } else {
    // Use Supabase client
    // ... existing Supabase code
  }
}
```

## 🔍 Kiểm tra Connection

Test PostgreSQL connection:

```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Connect to database
psql -h localhost -U postgres -d angi_mealplan -c "\dt"

# Test query
psql -h localhost -U postgres -d angi_mealplan -c "SELECT COUNT(*) FROM users;"
```

## 📝 Prisma Schema

Nếu chưa có, tạo file `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model shopping_lists {
  id              String   @id @default(uuid())
  user_id         String
  name            String
  shopping_date   DateTime
  estimated_total Decimal?
  actual_total    Decimal?
  status          String   @default("pending")
  created_at      DateTime @default(now())
  updated_at      DateTime @updatedAt
  
  items shopping_list_items[]
  
  @@map("shopping_lists")
}

model shopping_list_items {
  id                String   @id @default(uuid())
  shopping_list_id  String
  ingredient_id     String
  quantity          Decimal
  unit              String
  estimated_price   Decimal?
  actual_price      Decimal?
  is_purchased      Boolean  @default(false)
  notes             String?
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  
  shopping_list shopping_lists @relation(fields: [shopping_list_id], references: [id])
  ingredient    ingredients    @relation(fields: [ingredient_id], references: [id])
  
  @@map("shopping_list_items")
}

// Add other models...
```

## 🎯 Next Steps

1. **Chạy schema SQL** vào PostgreSQL local
2. **Generate Prisma client**: `npm run db:generate`
3. **Test connection**: Check tables được tạo chưa
4. **Cập nhật API routes** để dùng Prisma thay vì Supabase
5. **Test shopping history**: Thử tạo data và xem

## 🔄 Migrate từ Local sang Supabase Cloud (tương lai)

Khi muốn chuyển sang Supabase cloud:

1. Export data từ local:
```bash
pg_dump -h localhost -U postgres angi_mealplan > backup.sql
```

2. Import vào Supabase:
- Tạo project trên Supabase.com
- Vào SQL Editor, paste backup.sql
- Cập nhật `.env.local` với Supabase credentials
- Restart app

## 📚 Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [NextAuth.js](https://next-auth.js.org/)

## ❓ Troubleshooting

### Lỗi: "relation does not exist"
```bash
# Check if tables exist
psql -h localhost -U postgres -d angi_mealplan -c "\dt"

# Run schema
psql -h localhost -U postgres -d angi_mealplan -f database/supabase_schema.sql
```

### Lỗi: "password authentication failed"
- Check password trong `database.env`
- Update `DATABASE_URL` trong `.env.local`

### Lỗi Prisma: "Table not found"
```bash
# Sync Prisma schema with database
npm run db:push
```

