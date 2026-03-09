# Hướng dẫn triển khai – Blog Tu Tiên

## Tổng quan

- **Frontend**: Next.js → Vercel  
- **Backend**: NestJS → Node server (Railway, Render, hoặc VPS)  
- **Database**: PostgreSQL (Neon, Railway, Supabase Postgres, hoặc VPS)  

---

## 1. Database (PostgreSQL)

1. Tạo database PostgreSQL (Neon, Railway, Supabase, hoặc self-hosted).
2. Lấy **connection string** (vd: `postgresql://user:pass@host:5432/dbname?schema=public`).
3. Trong repo `backend`:
   - Đặt biến `DATABASE_URL` = connection string.
   - Chạy: `npx prisma migrate deploy` (production) hoặc `npx prisma migrate dev` (dev, tạo migration nếu chưa có).
   - (Tùy chọn) Seed: `npx prisma db seed`.

---

## 2. Backend (NestJS + Prisma)

### Biến môi trường

Tạo file `.env` (hoặc cấu hình trên host):

```env
PORT=4000
FRONTEND_URL=https://your-frontend.vercel.app
DATABASE_URL="postgresql://user:password@host:5432/blog_tu_tien?schema=public"
```

### Chạy local

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run build
npm run start:dev
```

API: `http://localhost:4000/api`

### Triển khai lên server

**Railway / Render:**

- Kết nối repo, chọn thư mục `backend`.
- Build command: `npm install && npx prisma generate && npm run build`
- Start command: `npm run start:prod` (hoặc `npx prisma migrate deploy && npm run start:prod` nếu cần chạy migration khi deploy).
- Khai báo đủ biến môi trường (PORT, DATABASE_URL, FRONTEND_URL).

**VPS (Node):**

```bash
cd backend
npm ci
npx prisma generate
npm run build
# Lần đầu: npx prisma migrate deploy
PORT=4000 node dist/main.js
```

Dùng PM2 hoặc systemd để chạy nền.

---

## 3. Frontend (Next.js – Vercel)

### Biến môi trường (Vercel)

- `NEXT_PUBLIC_API_URL`: URL backend (vd: `https://your-api.railway.app/api`)
- `NEXT_PUBLIC_SITE_URL`: URL site (vd: `https://blogtutien.vn`)

### Deploy

1. Import repo vào [vercel.com](https://vercel.com).
2. Root Directory: `frontend`.
3. Framework Preset: Next.js.
4. Thêm 2 biến môi trường trên.
5. Deploy.

Sau khi deploy, cấu hình domain (vd: `blogtutien.vn`) trong Vercel.

---

## 4. CORS

Trên backend, `FRONTEND_URL` phải trùng domain frontend (vd: `https://blogtutien.vn`) để CORS hoạt động.

---

## 5. SEO & quảng cáo

- **Sitemap**: Tự sinh tại `/sitemap.xml`.
- **Robots**: Tự sinh tại `/robots.txt`.
- **Ad slots**: Đã đặt sẵn (top banner, trong bài, giữa bài, sidebar, footer). Khi được duyệt AdSense, thay placeholder bằng script/component quảng cáo.

---

## 6. Tạo bài viết bằng API (AI sau này)

```bash
curl -X POST https://your-api/api/generate-article \
  -H "Content-Type: application/json" \
  -d '{
    "type": "tom-tat-truyen",
    "novel_id": "uuid-of-novel",
    "title": "Tóm tắt truyện XYZ",
    "content": "<p>Nội dung HTML...</p>",
    "meta_title": "Tóm tắt truyện XYZ",
    "meta_description": "Mô tả ngắn."
  }'
```

Khi tích hợp AI, gọi API nội bộ hoặc dịch vụ bên ngoài để sinh `title` và `content` rồi gửi vào endpoint trên.
