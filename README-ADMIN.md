# AuraSound Admin Dashboard

Hệ thống quản trị Admin Dashboard được xây dựng với Next.js 16, Auth.js (NextAuth v5), Prisma và PostgreSQL.

## 📋 Tính năng đã triển khai

### 1. Authentication System
- **Credentials Provider**: Đăng nhập Email/Password với bcrypt
- **OAuth Providers**: Google & GitHub OAuth
- **Phân quyền**: ADMIN / CUSTOMER

### 2. Database Schema (Prisma)
- User, Account, Session, VerificationToken (chuẩn NextAuth)
- Category, Brand, Product, ProductVariant

### 3. Route Protection
- Middleware bảo vệ `/admin/*` - chỉ ADMIN được truy cập
- Redirect chưa đăng nhập → `/login`
- Redirect không phải ADMIN → `/login?error=403`

### 4. Admin Dashboard UI
- Sidebar Navigation (có thể thu gọn)
- Header với User avatar, Search, Notifications, Sign Out
- Metrics Cards (Product Count, Categories, Brands)
- Product Distribution Chart

### 5. Product Management
- Data Table với pagination, filter, search
- Form thêm/sửa sản phẩm với variants động

## 🚀 Cài đặt

### 1. Khởi động PostgreSQL

```bash
docker-compose up -d
# Hoặc sử dụng PostgreSQL đã có sẵn
```

### 2. Cấu hình Environment

Sao chép `.env.example` thành `.env.local` và cập nhật:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL="postgresql://thanhphat:mysecretpassword@localhost:5432/aurasound_db"
AUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

### 3. Tạo AUTH_SECRET

```bash
openssl rand -base64 32
```

### 4. Chạy Migration

```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

### 5. Khởi động Development

```bash
pnpm dev
```

## 📁 Cấu trúc thư mục

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout
│   │   ├── page.tsx             # Dashboard
│   │   ├── products/
│   │   │   ├── page.tsx         # Product list
│   │   │   └── new/
│   │   │       ├── page.tsx     # New product page
│   │   │       └── _components/
│   │   │           └── product-form.tsx
│   │   ├── categories/page.tsx
│   │   └── brands/page.tsx
│   ├── api/auth/[...nextauth]/route.ts
│   ├── api/admin/products/route.ts
│   └── login/page.tsx
├── components/
│   └── admin/
│       ├── index.ts
│       ├── sidebar.tsx
│       ├── header.tsx
│       ├── metric-card.tsx
│       └── product-table.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── validations/
│       └── auth.schema.ts
└── actions/
    └── product-actions.ts
```

## 🔑 Tài khoản mặc định

Sau khi chạy seed:
- Email: `admin@aurasound.local`
- Password: `admin123`

## 📝 Lưu ý

- Đảm bảo PostgreSQL đang chạy trước khi chạy migration
- Đối với OAuth, cần tạo credentials tại Google Cloud Console và GitHub Developer Settings
- Các API route admin đều có middleware kiểm tra quyền ADMIN