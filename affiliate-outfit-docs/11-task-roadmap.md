# 11. Task Roadmap — Build Order

Tài liệu này chia task theo thứ tự nên build để giảm rủi ro.

---

# Phase 0 — Project Setup

## 0.1. Init project

- [ ] Create Next.js App Router project.
- [ ] Add TypeScript.
- [ ] Add Tailwind CSS.
- [ ] Add shadcn/ui.
- [ ] Setup ESLint/Prettier.
- [ ] Setup env config loader.

## 0.2. Infrastructure local

- [ ] Setup PostgreSQL local/dev.
- [ ] Setup Prisma/Drizzle.
- [ ] Setup migration command.
- [ ] Setup seed command.

---

# Phase 1 — Database Foundation

## 1.1. Core schema

- [ ] Create users table.
- [ ] Create roles table.
- [ ] Create permissions table.
- [ ] Create user_roles table.
- [ ] Create role_permissions table.
- [ ] Create products table.
- [ ] Create outfits table.
- [ ] Create outfit_products table.
- [ ] Create logs/media/category tables.

## 1.2. Seed constants

- [ ] Seed roles.
- [ ] Seed permissions.
- [ ] Seed role_permissions.
- [ ] Seed first admin user.
- [ ] Seed default styles/outfit types if needed.

---

# Phase 2 — Auth & Permission

## 2.1. Authentication

- [ ] Build manager login page.
- [ ] Build logout.
- [ ] Build current user endpoint/helper.
- [ ] Protect `/manager/*` routes.

## 2.2. Authorization

- [ ] Build `getUserPermissions()`.
- [ ] Build `requirePermission()` helper.
- [ ] Apply permission to manager API.
- [ ] Hide/show UI action buttons by permission.

---

# Phase 3 — Product Sync

## 3.1. API integration

- [ ] Create source config by urlSuffix/groupId.
- [ ] Build mycollection API client.
- [ ] Support pagination.
- [ ] Map response to product DTO.

## 3.2. Upsert products

- [ ] Upsert by `(url_suffix, external_link_id)`.
- [ ] Create new product.
- [ ] Update existing product fields from API.
- [ ] Do not overwrite `product_dna`.
- [ ] Do not overwrite `mockup_image_url`.
- [ ] Mark missing products as `missing_from_source`.

## 3.3. Cron endpoint

- [ ] Create `/api/cron/sync-products`.
- [ ] Add CRON_SECRET check.
- [ ] Add retry logic.
- [ ] Add sync_logs.
- [ ] Configure cron interval 15 minutes.

---

# Phase 4 — Cloudflare R2 & Media

## 4.1. R2 setup

- [ ] Create R2 bucket.
- [ ] Configure access keys.
- [ ] Configure public URL/CDN domain.
- [ ] Add ENV vars.

## 4.2. Upload API

- [ ] Build media upload route.
- [ ] Validate MIME type.
- [ ] Validate file size.
- [ ] Upload to R2.
- [ ] Write media_assets.
- [ ] Update product mockup or outfit cover.

---

# Phase 5 — Manager Product Module

## 5.1. Product list

- [ ] Product list page.
- [ ] Search by keyword.
- [ ] Filter by urlSuffix.
- [ ] Filter by status.
- [ ] Filter hasDNA/hasMockup.
- [ ] Pagination.

## 5.2. Product detail/edit

- [ ] Edit product name/status if allowed.
- [ ] Edit product_dna.
- [ ] Upload mockup.
- [ ] Assign product to staff.
- [ ] Show raw_json/debug info optionally.

---

# Phase 6 — Manager Outfit Module

## 6.1. Outfit list

- [ ] Outfit list page.
- [ ] Filter by status/style/type.
- [ ] Search by name/code.
- [ ] Show views/clicks/CTR basics.

## 6.2. Outfit create/edit

- [ ] Create outfit draft.
- [ ] Generate outfit_code.
- [ ] Generate slug.
- [ ] Upload cover.
- [ ] Edit description/style/type.

## 6.3. Outfit products

- [ ] Product picker.
- [ ] Add product to outfit.
- [ ] Remove product from outfit.
- [ ] Prevent duplicates.
- [ ] Display mockup fallback image.

## 6.4. Publish/hide/delete

- [ ] Validate before publish.
- [ ] Publish outfit.
- [ ] Hide outfit.
- [ ] Soft delete outfit.

---

# Phase 7 — Public Site

## 7.1. Outfit list public

- [ ] Home/outfit feed.
- [ ] Outfit card with cover/name.
- [ ] Click outfit image → outfit detail.
- [ ] Pagination/infinite load optional.

## 7.2. Outfit detail public

- [ ] Render outfit cover.
- [ ] Render H1/description.
- [ ] Render product list.
- [ ] Product image/name links to `/go/{outfitCode}/{productId}`.
- [ ] No product price.
- [ ] No buy button.
- [ ] No creator page.

---

# Phase 8 — Tracking & Redirect

## 8.1. Cookie/session

- [ ] Create anonymous cookie ID.
- [ ] Create session ID.
- [ ] Session TTL 30 minutes.

## 8.2. View tracking

- [ ] Record outfit view.
- [ ] Save referrer/utm/user_agent/ip_hash.

## 8.3. Click tracking + redirect

- [ ] Build `/go/[outfitCode]/[productId]`.
- [ ] Validate outfit/product relation.
- [ ] Resolve redirect URL.
- [ ] Track click without delaying redirect.
- [ ] Redirect 302 to Shopee affiliate/app link.

## 8.4. Anti-spam

- [ ] Duplicate click 30s rule.
- [ ] Bot user-agent rule.
- [ ] Manager preview rule.
- [ ] Too many clicks per session rule.

---

# Phase 9 — SEO

## 9.1. Metadata

- [ ] Dynamic title for outfit detail.
- [ ] Dynamic description.
- [ ] OG image.
- [ ] Canonical URL.

## 9.2. Sitemap/robots

- [ ] `/robots.txt`.
- [ ] `/sitemap.xml`.
- [ ] `/sitemap-outfits.xml`.
- [ ] Exclude `/go`, `/api`, `/manager`.

## 9.3. JSON-LD

- [ ] BreadcrumbList.
- [ ] CollectionPage/WebPage.
- [ ] ItemList for products in outfit.

---

# Phase 10 — Dashboard & Analytics

## 10.1. Overview

- [ ] Total outfit views.
- [ ] Total valid clicks.
- [ ] CTR.
- [ ] Top outfits.
- [ ] Top products.

## 10.2. Filters

- [ ] Date range.
- [ ] urlSuffix.
- [ ] Outfit status.

## 10.3. Permission scope

- [ ] Admin/Manager view all.
- [ ] Staff view own/assigned if permission.

---

# Phase 11 — Hardening

- [ ] Error boundaries.
- [ ] Rate limit sensitive endpoints.
- [ ] Validate all inputs with Zod.
- [ ] Log cron errors.
- [ ] Back up database.
- [ ] Add basic monitoring.
- [ ] Add privacy policy page.
- [ ] Test production deploy.

---

# MVP completion definition

MVP được xem là xong khi:

- Cron sync product chạy ổn.
- Manager tạo outfit từ products được.
- Public outfit pages index được.
- Click product redirect Shopee affiliate được.
- Click/view tracking hoạt động.
- Admin xem dashboard cơ bản.
- Role/permission chặn đúng hành động.
