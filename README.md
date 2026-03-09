# Blog Tu Tiên

Website blog SEO tiếng Việt về truyện tu tiên, tiên hiệp, huyền huyễn. Mục tiêu: xuất bản hàng trăm bài, tăng traffic từ Google và monetize bằng quảng cáo (AdSense) trong vòng 2 tháng.

## Công nghệ

- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend**: Next.js 14, TailwindCSS
- **Deploy**: Frontend → Vercel, Backend → Node server, DB → PostgreSQL (Railway, Neon, hoặc VPS)

## Cấu trúc project

```
blog-tu-tien/
├── backend/          # NestJS API + Prisma
│   └── prisma/       # schema.prisma, seed
├── frontend/         # Next.js (Tailwind)
├── database/         # SQL tham khảo (dùng Prisma migrate để tạo bảng)
├── DEPLOYMENT.md     # Hướng dẫn deploy
└── README.md
```

## Chạy local

### 1. Database (PostgreSQL)

- Cài PostgreSQL hoặc dùng Docker/Neon/Railway.
- Tạo database (vd: `blog_tu_tien`).
- Trong `backend`: đặt `DATABASE_URL` trong `.env`, ví dụ:
  `postgresql://user:password@localhost:5432/blog_tu_tien?schema=public`

### 2. Backend

```bash
cd backend
cp .env.example .env   # Điền DATABASE_URL và FRONTEND_URL
npm install
npx prisma migrate dev # Tạo bảng lần đầu
npx prisma db seed     # (tùy chọn) Seed dữ liệu mẫu
npm run start:dev
```

API: http://localhost:4000/api

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# Đặt NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev
```

Site: http://localhost:3000

**Nếu gặp lỗi "EMFILE: too many open files"** (thường trên macOS):
- Chạy: `npm run dev:safe` (dùng polling, ít watcher hơn), hoặc
- Trong terminal: `ulimit -n 10240` rồi chạy lại `npm run dev`

## Chuyên mục (slug)

- `tom-tat-truyen` – Tóm tắt truyện  
- `nhan-vat` – Nhân vật  
- `top-nhan-vat-manh-nhat` – Top nhân vật mạnh nhất  
- `he-thong-canh-gioi` – Hệ thống cảnh giới  
- `giai-thich-cot-truyen` – Giải thích cốt truyện  

## API chính

- `GET /api/categories` – Danh sách chuyên mục  
- `GET /api/novels`, `GET /api/novels/trending` – Truyện  
- `GET /api/articles/latest`, `GET /api/articles/popular` – Bài mới / đọc nhiều  
- `GET /api/articles/category/:categorySlug` – Bài theo chuyên mục  
- `GET /api/articles/category/:categorySlug/:articleSlug` – Chi tiết bài  
- `POST /api/generate-article` – Tạo bài (chuẩn bị cho AI)  

## SEO

- Sitemap: `/sitemap.xml`  
- Robots: `/robots.txt`  
- Canonical URL, meta title/description, Schema.org Article  
- Mục lục (TOC), internal link, bài liên quan  

## Quảng cáo

Đã bố trí 5 vị trí: top banner, sau đoạn đầu bài, giữa bài, sidebar, footer. Thay placeholder bằng AdSense khi được duyệt.

Chi tiết triển khai: [DEPLOYMENT.md](./DEPLOYMENT.md).
