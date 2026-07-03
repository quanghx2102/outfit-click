# Affiliate Outfit System — MVP Documentation

Bộ tài liệu này dùng để bắt đầu build hệ thống website affiliate dạng **outfit-first**.

## Mục tiêu hệ thống

- Public user chỉ thấy danh sách outfit và trang chi tiết outfit.
- Khi bấm ảnh outfit ở danh sách, user vào trang chi tiết outfit.
- Trong trang chi tiết outfit, user thấy các sản phẩm thuộc outfit đó.
- Khi user bấm ảnh hoặc tên sản phẩm, hệ thống ghi tracking rồi redirect sang Shopee affiliate/app link.
- Không có trang product public.
- Không có trang creator public.
- Không hiển thị giá sản phẩm.
- Product là dữ liệu nội bộ lấy từ API theo `urlSuffix`.
- Staff/Admin xử lý `product_dna`, `mockup_image_url`, outfit cover và publish outfit.
- Manager dùng roles/permissions để kiểm soát quyền.

## Stack đề xuất

- Framework: Next.js App Router + TypeScript
- Backend: Node.js runtime trong Next.js Route Handlers
- UI: Tailwind CSS + shadcn/ui
- Database: PostgreSQL
- ORM: Prisma hoặc Drizzle. Khuyến nghị MVP: Prisma
- Storage ảnh: Cloudflare R2
- Cron: Vercel Cron hoặc external cron gọi endpoint sync
- Deploy: Vercel
- Tracking: PostgreSQL logs + anonymous cookie/session
- SEO: sitemap, robots, canonical, metadata, JSON-LD, Google Search Console

## Danh sách tài liệu

1. `00-system-overview.md` — tổng quan hệ thống, actor, scope MVP.
2. `01-database-schema.md` — schema database MVP cuối cùng.
3. `02-database-relationships.md` — quan hệ bảng, index, unique constraint.
4. `03-constants.md` — roles, permissions, statuses, enums, constants backend/frontend.
5. `04-permission-matrix.md` — ma trận phân quyền Admin/Manager/Staff.
6. `05-api-routes.md` — API routes public, manager, cron, tracking.
7. `06-cron-sync-products.md` — rule cronjob 15 phút/lần và upsert products.
8. `07-tracking-redirect.md` — tracking click/view/session và redirect Shopee affiliate.
9. `08-seo-spec.md` — sitemap, robots, canonical, metadata, outfit page SEO.
10. `09-storage-media.md` — Cloudflare R2, media assets, upload rules.
11. `10-manager-workflows.md` — workflow quản trị product/outfit.
12. `11-task-roadmap.md` — task build theo thứ tự tiến trình.
13. `12-test-plan.md` — test cho task phức tạp.
14. `13-env-config.md` — biến môi trường, config, secret.
15. `14-project-structure.md` — cấu trúc thư mục Next.js gợi ý.

## Nguyên tắc MVP

- Không over-engineer.
- Không thêm `api_sources`, `source_groups`, `tasks` ở MVP nếu chưa cần UI quản lý nguồn hoặc giao việc dạng Kanban.
- Vẫn thiết kế đủ trường để sau này mở rộng mà không phải đập database.
- Public pages phải ưu tiên SEO, tốc độ, ảnh nhẹ và internal link.
- Tracking không được làm chậm redirect sang Shopee affiliate.
