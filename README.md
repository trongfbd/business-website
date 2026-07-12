# Website Doanh Nghiệp – Next.js + SQLite + Admin Nội Bộ

Website doanh nghiệp chuẩn SEO, tối ưu chuyển đổi khách hàng (Omnichannel Contact Hub), blog SEO tích hợp Admin CMS riêng (không dùng WordPress).

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TailwindCSS + Lucide Icons
- **Database:** SQLite (better-sqlite3) – không cần server DB riêng
- **Auth:** JWT + bcrypt (cookie HttpOnly)
- **Content:** Markdown → HTML (marked) lưu trong SQLite
- **SEO:** sitemap.xml, robots.txt, JSON-LD tự động (Organization, LocalBusiness, Article, FAQ, Breadcrumb)

---

## 1. Cài đặt lần đầu

```bash
# Cài dependencies
npm install

# Tạo file .env.local (đã có sẵn .env.example để tham khảo)
cp .env.example .env.local
# Sửa JWT_SECRET thành chuỗi ngẫu nhiên dài, và NEXT_PUBLIC_BASE_URL

# Khởi tạo database (tạo bảng + tài khoản admin mặc định)
npm run db:init
```

Sau khi chạy `db:init`, tài khoản quản trị mặc định là:

```
Tên đăng nhập: admin
Mật khẩu:      Admin@123456
```

**Quan trọng:** Đăng nhập vào `/admin` và đổi mật khẩu này ngay khi triển khai thật (xem mục "Đổi mật khẩu admin" bên dưới).

## 2. Chạy thử trên máy (development)

```bash
npm run dev
```

Mở `http://localhost:3000` để xem trang chủ, và `http://localhost:3000/admin/login` để vào trang quản trị.

## 3. Cập nhật thông tin doanh nghiệp

Toàn bộ thông tin liên hệ, mạng xã hội, hotline... nằm trong **`public/config.json`**. Sửa file này, không cần build lại code:

```json
{
  "companyName": "Tên công ty của bạn",
  "hotline": "+84909123456",
  "hotlineDisplay": "0909 123 456",
  "email": "info@congty.vn",
  "address": "Địa chỉ công ty",
  "facebook": "https://facebook.com/...",
  "zalo": "https://zalo.me/0909123456",
  "messenger": "https://m.me/...",
  "tiktok": "https://tiktok.com/@...",
  "googleMapEmbed": "URL nhúng Google Maps (Share > Embed a map)",
  "gaId": "G-XXXXXXXXXX"
}
```

## 4. Cấu trúc thư mục

```
src/
  app/                  # Routes (App Router)
    page.tsx            # Trang chủ
    blog/                # Blog (danh sách + chi tiết bài viết)
    admin/               # Trang quản trị (bảo vệ bằng JWT)
    api/                 # API routes (auth, posts, analytics, upload)
    sitemap.ts           # Tự sinh sitemap.xml
    robots.ts            # Tự sinh robots.txt
  components/
    layout/              # Header, Footer
    contact/             # Omnichannel Contact Hub (desktop + mobile)
    sections/            # Hero, Services, About, Testimonials, Contact, CTA
    admin/               # PostEditor (CMS)
    ui/                  # JSON-LD schema components
  lib/
    db.ts                # Kết nối + khởi tạo schema SQLite
    auth.ts              # JWT + bcrypt
    config.ts             # Đọc config.json
    rate-limit.ts        # Rate limit đơn giản cho API
database/
  site.db               # File database SQLite (tự sinh, KHÔNG commit lên git)
public/
  config.json           # Cấu hình website (sửa ở đây)
  uploads/              # Ảnh upload từ trang Admin
scripts/
  init-db.js            # Script khởi tạo DB + tài khoản admin
```

## 5. Quản lý nội dung (Admin CMS)

Truy cập `/admin/login`, sau khi đăng nhập sẽ thấy:

- **Dashboard**: tổng số bài viết/sản phẩm, lượt xem, bài nháp/đã đăng, top bài viết
- **Quản lý bài viết** (`/admin/posts`): danh sách, sửa, xóa
- **Tạo bài viết mới** (`/admin/posts/new`): nhập tiêu đề, mô tả, nội dung Markdown, ảnh đại diện (upload trực tiếp), Meta Title/Description/Keywords cho SEO, danh mục, tags, FAQ (định dạng JSON), trạng thái (nháp/xuất bản)

Bài viết được lưu bằng **Markdown** trong SQLite, hiển thị ở `/blog/[slug]` kèm schema Article + FAQ tự động cho SEO.

### Quản lý Sản phẩm

- **Danh sách sản phẩm** (`/admin/products`): xem nhanh ảnh đại diện, danh mục, giá, trạng thái, đánh dấu nổi bật
- **Thêm/sửa sản phẩm** (`/admin/products/new`, `/admin/products/[id]`):
  - Tên, mô tả ngắn, mô tả chi tiết (Markdown)
  - **Upload nhiều ảnh cùng lúc** — ảnh đầu tiên tự động là ảnh đại diện, có thể bấm ★ để đổi ảnh đại diện hoặc ✕ để xóa từng ảnh
  - Danh mục (gõ tự do, dùng để lọc ở trang `/san-pham`)
  - Giá (VNĐ) — **để trống sẽ tự hiển thị "Liên hệ báo giá"** thay vì giá 0đ
  - Thứ tự hiển thị (số nhỏ hơn hiện trước)
  - Trạng thái: Bản nháp (ẩn khỏi site) / Hiển thị công khai
  - Checkbox **Sản phẩm nổi bật** — các sản phẩm này được ưu tiên hiển thị ở trang chủ (mục "Thiết Bị PCCC Nổi Bật")
  - SEO riêng từng sản phẩm: Meta Title, Meta Description, Keywords

Sản phẩm hiển thị công khai tại:
- `/san-pham` — toàn bộ sản phẩm dạng lưới, lọc theo danh mục, phân trang 12 sản phẩm/trang
- `/san-pham/[slug]` — trang chi tiết với gallery ảnh, mô tả Markdown, sản phẩm liên quan cùng danh mục, schema Product cho SEO
- Trang chủ — tự động lấy tối đa 6 sản phẩm nổi bật; nếu chưa đủ 6 sản phẩm nổi bật, hệ thống tự bổ sung thêm sản phẩm mới nhất cho đủ

### Đổi mật khẩu admin

Cách đơn giản nhất là chạy script Node nhỏ:

```bash
node -e "
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const db = new Database('./database/site.db');
const hash = bcrypt.hashSync('MAT_KHAU_MOI_CUA_BAN', 12);
db.prepare('UPDATE users SET password = ? WHERE username = ?').run(hash, 'admin');
console.log('Đã đổi mật khẩu!');
"
```

## 6. SEO đã tích hợp sẵn

- `sitemap.xml` và `robots.txt` tự sinh từ danh sách bài viết và **sản phẩm** đã published
- Schema JSON-LD: Organization, LocalBusiness, WebSite, Article, FAQPage, BreadcrumbList, **Product** (giá, tình trạng còn hàng)
- Meta Title/Description/Keywords tùy chỉnh theo từng bài viết và từng sản phẩm
- Open Graph + Twitter Card tự động lấy từ `config.json`

## 7. Analytics


Các sự kiện click được tự động gửi tới bảng `analytics` trong SQLite và (nếu có `gaId` trong config) tới Google Analytics 4: `call_click`, `zalo_click`, `messenger_click`, `tiktok_click`, `email_click`, `map_click`.

## 8. Build production

```bash
npm run build
npm start
```

**Lưu ý về `better-sqlite3`:** đây là native module, cần biên dịch khi `npm install`. Hầu hết các nền tảng deploy (Vibe Hosting, Vercel với Node runtime, VPS chạy Node trực tiếp...) tự build được vì có sẵn build tools + network để tải Node headers. Nếu gặp lỗi build (môi trường hạn chế mạng/network sandbox), liên hệ đơn vị hosting để xác nhận môi trường cho phép `node-gyp`/`prebuild-install` hoạt động — đây là yêu cầu chuẩn cho mọi ứng dụng Node dùng SQLite, không phải lỗi của mã nguồn.

## 9. Triển khai lên Vibe Hosting

1. Đẩy code lên GitHub repository
2. Trên Vibe Hosting, kết nối GitHub repo (GitHub Integration → Auto Deploy)
3. Khai báo Environment Variables trên dashboard hosting:
   - `JWT_SECRET` – chuỗi bí mật ngẫu nhiên, dài (vd: `openssl rand -base64 32`)
   - `NEXT_PUBLIC_BASE_URL` – domain thật, ví dụ `https://congtyabc.vn`
   - `NODE_ENV=production`
4. Build command: `npm install && npm run db:init && npm run build`
5. Start command: `npm start`
6. Bật SSL tự động (Let's Encrypt) trên hosting
7. Sau khi deploy lần đầu, vào `/admin/login`, đăng nhập, đổi mật khẩu mặc định ngay
8. Cấu hình Rollback trên dashboard hosting nếu bản deploy mới có lỗi

### Lưu ý về dữ liệu khi deploy

- File `database/site.db` lưu trên ổ đĩa server. Nếu hosting dùng container/ephemeral storage (mỗi lần deploy reset ổ đĩa), cần mount một **persistent volume** trỏ tới thư mục `database/` và `public/uploads/` để không mất dữ liệu bài viết và ảnh sau mỗi lần deploy.
- Backup định kỳ file `database/site.db` (chỉ là 1 file, copy trực tiếp là đủ).

## 10. Bảo mật đã áp dụng

- Mật khẩu admin hash bằng bcrypt (cost factor 12)
- Session admin dùng JWT lưu trong cookie `httpOnly`, `secure` (production), `sameSite=lax`
- Rate limit cho API login (5 lần/phút) và analytics (60 lần/phút) theo IP
- Security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Validate loại file & kích thước khi upload ảnh (chỉ ảnh, tối đa 5MB)
- Route `/admin/*` được middleware chặn truy cập khi chưa đăng nhập; mọi API ghi dữ liệu (POST/PUT/DELETE) đều kiểm tra session phía server

## 11. Mở rộng sau này

- **Chatbot AI:** có thể thêm widget chat ở `src/components/contact/`, gọi tới API riêng hoặc nhúng third-party chatbot script trong `layout.tsx`
- **Đa ngôn ngữ:** dùng `next-intl` hoặc tách `config.json` theo từng locale
- **Thêm trường dữ liệu bài viết:** sửa schema trong `src/lib/db.ts` và `scripts/init-db.js`, sau đó cập nhật `PostEditor.tsx`

---

Nếu cần hỗ trợ thêm tính năng hoặc tùy biến giao diện, hãy quay lại đây và mô tả yêu cầu cụ thể.
