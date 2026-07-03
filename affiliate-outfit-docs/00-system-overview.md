# 00. System Overview

## 1. Mô hình sản phẩm

Hệ thống là website affiliate dạng **outfit-first**.

```txt
Cron/API lấy sản phẩm theo urlSuffix
→ lưu product nội bộ
→ Staff/Admin xử lý product_dna + mockup
→ Admin/Staff tạo outfit từ products
→ public user xem outfit
→ user click ảnh/tên sản phẩm trong outfit detail
→ tracking click/session
→ redirect Shopee affiliate/app link
```

## 2. Mục tiêu kinh doanh

- Kéo traffic từ Google vào các trang outfit.
- Tối ưu CTR từ outfit detail sang Shopee affiliate.
- Không làm user phân tâm bằng giá sản phẩm hoặc shop UI quá nặng.
- Không vận hành như ecommerce store.
- Không cần product detail public.

## 3. Actor

### Public User

Được phép:

- Xem danh sách outfit public.
- Click ảnh outfit để vào trang chi tiết outfit.
- Xem danh sách ảnh/tên sản phẩm trong outfit detail.
- Click ảnh hoặc tên sản phẩm để sang Shopee affiliate/app.

Không có:

- Trang creator.
- Trang danh sách sản phẩm public.
- Trang product detail public.
- Nút mua riêng.
- Giá sản phẩm.

### Admin

Được phép:

- Toàn quyền manager.
- Quản lý users, roles, permissions.
- Quản lý products, outfits, media.
- Publish/hide/delete outfit.
- Xem toàn bộ analytics.
- Xem sync logs/click logs/view logs.

### Manager

Được phép:

- Quản lý products/outfits.
- Publish/hide outfit nếu được cấp quyền.
- Xem analytics tổng hoặc theo quyền.
- Không quản lý role/permission nếu không được cấp quyền.

### Product Staff

Được phép tùy permission:

- Xem product được giao hoặc tất cả product.
- Cập nhật `product_dna`.
- Upload `mockup_image_url`.
- Không publish outfit nếu không có quyền.

### Outfit Staff

Được phép tùy permission:

- Tạo/sửa outfit.
- Gắn/gỡ product khỏi outfit.
- Upload cover outfit.
- Preview outfit.
- Không publish nếu không có permission.

## 4. Scope MVP

### Có trong MVP

- Public outfit list.
- Public outfit detail.
- Click ảnh/tên sản phẩm → tracking → redirect Shopee affiliate.
- Manager login.
- Roles/permissions cơ bản.
- Product list từ cron sync.
- Product edit: DNA, mockup, status, assigned_to.
- Outfit CRUD.
- Gắn/gỡ product vào outfit.
- Publish/hide outfit.
- View/click tracking.
- Basic analytics: view, click, CTR.
- Cronjob sync products 15 phút/lần.
- Cloudflare R2 upload media.
- SEO: sitemap, robots, canonical, metadata.

### Không có trong MVP

- Creator public page.
- Product public page.
- Giá sản phẩm.
- Cart/checkout.
- Import/export file product.
- Kanban task system.
- api_sources UI.
- source_groups UI.
- Advanced behavioral analytics như scroll/heatmap.
- A/B testing.
- Multi-platform affiliate phức tạp.

## 5. Route public chính

```txt
/                            Home hoặc outfit feed
/outfits                     Danh sách outfit
/outfit/[slug]-[code]         Chi tiết outfit SEO
/go/[outfitCode]/[productId]  Tracking + redirect affiliate
```

## 6. Nguyên tắc dữ liệu

- Product là dữ liệu nội bộ.
- Outfit là dữ liệu public.
- Click sản phẩm là conversion action chính.
- `urlSuffix` là field quan trọng để phân nguồn/creator/source API.
- Không hiển thị price để tránh user cân nhắc trước khi click affiliate.
- Không index route `/go`, `/api`, `/manager`.
