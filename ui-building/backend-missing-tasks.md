# Backend Missing Tasks — OutfitClick

> Mục tiêu: hoàn thiện backend còn thiếu theo MVP, không đập lại database/schema/logic cũ nếu chưa được duyệt. File này dùng sau khi đã có source và muốn tiếp tục backend theo từng module.

## Prompt mở đầu áp dụng cho mọi backend task

```text
Bạn là Senior Full-stack Developer phụ trách project OutfitClick.

Task hiện tại:
[PASTE TASK ID + TITLE + CHECKLIST]

Tài liệu bắt buộc phải đọc trước:
[PASTE LIST TRONG TASK]

Quy tắc bắt buộc:
1. Chưa code ngay.
2. Trước tiên hãy đọc docs và source liên quan.
3. Tóm tắt task cần làm gì.
4. Trace flow hiện tại nếu đã có code.
5. Liệt kê file sẽ sửa/tạo.
6. Không sửa database/schema nếu task không yêu cầu rõ.
7. Không sửa UI nếu task backend không yêu cầu.
8. Không refactor unrelated code.
9. Không đổi public routes/API contract nếu chưa được duyệt.
10. Reuse service/helper hiện có.
11. Code phải type-safe, clean, có validation.
12. Sau khi code xong chạy lint/build/test nếu có.
13. Cập nhật task-log.md.
14. Cập nhật 16-source-map.md nếu thêm/sửa route/service/module quan trọng.

Bây giờ hãy phân tích và đưa kế hoạch trước, chưa code.
```

---

# PHASE BE-1 — Backend Gap Audit

## TASK BE-1.1 — Audit Backend Current State

**Mục tiêu:** xác định backend đã làm tới đâu, còn thiếu gì so với MVP. Không code.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/02-database-relationships.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/04-permission-matrix.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/06-cron-sync-products.md
- affiliate-outfit-docs/07-tracking-redirect.md
- affiliate-outfit-docs/09-storage-media.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/12-test-plan.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Check auth/RBAC status.
- [ ] Check product module status.
- [ ] Check outfit module status.
- [ ] Check media/R2 status.
- [ ] Check tracking redirect status.
- [ ] Check cron sync status.
- [ ] Check analytics status.
- [ ] Check SEO routes status.
- [ ] List missing backend tasks in priority order.
- [ ] Do not code.
```

**Acceptance Criteria:**

```text
- Có backend gap list rõ ràng.
- Có priority order cho task tiếp theo.
```

---

# PHASE BE-2 — Auth & RBAC Completion

## TASK BE-2.1 — Complete Manager Route Protection

**Mục tiêu:** đảm bảo `/manager/*` và `/api/manager/*` được bảo vệ bằng auth/permission nếu chưa hoàn chỉnh.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/04-permission-matrix.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Inspect existing auth/session code.
- [ ] Ensure manager pages require login.
- [ ] Ensure manager API routes require auth.
- [ ] Add permission helper only if missing.
- [ ] Do not change role/permission constants unless required.
- [ ] Preserve existing login flow.
- [ ] Lint/build/test.
- [ ] Update task-log.md.
- [ ] Update 16-source-map.md if auth service/helper added.
```

**Acceptance Criteria:**

```text
- Unauthenticated user cannot access manager.
- Permission checks are centralized.
- Existing UI behavior preserved.
```

---

# PHASE BE-3 — Product Backend Completion

## TASK BE-3.1 — Complete Product List API & Query Filters

**Mục tiêu:** product list API/manager query hỗ trợ search/filter cần thiết.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/06-cron-sync-products.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- coding-standards.md
- rules.md
```

**Required filters:**

```text
- search by product name
- urlSuffix
- status
- has mockup / missing mockup
- has product_dna / missing product_dna
- pagination
```

**Checklist:**

```text
- [ ] Inspect existing product repository/service/API.
- [ ] Add only missing filters.
- [ ] Validate query params.
- [ ] Do not change product schema.
- [ ] Do not add price fields.
- [ ] Preserve sync-updated fields.
- [ ] Lint/build/test.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Manager can filter products efficiently.
- No public product page introduced.
```

---

## TASK BE-3.2 — Complete Product Edit API

**Mục tiêu:** update Product DNA, mockup_image_url, status, assigned_to nếu schema có.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/04-permission-matrix.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/09-storage-media.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- coding-standards.md
- rules.md
```

**Allowed update fields:**

```text
product_dna
mockup_image_url
status
assigned_to if exists
```

**Checklist:**

```text
- [ ] Validate request body.
- [ ] Check permission.
- [ ] Update only allowed fields.
- [ ] Do not update external IDs/urlSuffix from edit UI.
- [ ] Do not update price fields.
- [ ] Preserve existing product sync behavior.
- [ ] Lint/build/test.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Staff/Admin can update product enrichment data.
- Source/API fields remain protected.
```

---

# PHASE BE-4 — Outfit Backend Completion

## TASK BE-4.1 — Complete Outfit CRUD API

**Mục tiêu:** tạo/sửa/xóa mềm/publish/hide outfit theo MVP.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/02-database-relationships.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/04-permission-matrix.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Inspect existing outfit service/API.
- [ ] Ensure create generates unique 6-character outfit_code.
- [ ] Ensure edit validates allowed fields.
- [ ] Ensure publish validation exists.
- [ ] Ensure hide/delete soft behavior if schema supports.
- [ ] Do not add creator.
- [ ] Do not add price/total price.
- [ ] Do not add product sort order.
- [ ] Lint/build/test.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Outfit CRUD works for manager.
- Public only sees active outfits.
```

---

## TASK BE-4.2 — Complete Attach/Detach Products To Outfit

**Mục tiêu:** gắn/gỡ product khỏi outfit, không sort order.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/02-database-relationships.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Validate outfit exists.
- [ ] Validate products exist and active if required.
- [ ] Prevent duplicate outfit-product rows.
- [ ] Detach product safely.
- [ ] No sort_order logic.
- [ ] Product display image fallback handled by UI/service if needed.
- [ ] Lint/build/test.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Manager can select products for outfit.
- Public detail can read products in outfit.
```

---

# PHASE BE-5 — Tracking & Redirect Completion

## TASK BE-5.1 — Complete Outfit View Tracking

**Mục tiêu:** ghi view khi user vào outfit detail, dùng session/cookie anonymous.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/07-tracking-redirect.md
- affiliate-outfit-docs/12-test-plan.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Inspect existing tracking cookie/session helper.
- [ ] Ensure view log captures outfit_id/session_id/cookie_id/referrer/user_agent/ip_hash if available.
- [ ] Do not store raw personal data unnecessarily.
- [ ] Avoid blocking page render if possible.
- [ ] Lint/build/test.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Outfit detail view is tracked.
- Tracking does not noticeably slow public page.
```

---

## TASK BE-5.2 — Complete Product Click Redirect Tracking

**Mục tiêu:** click ảnh/tên sản phẩm trong outfit detail -> log click -> redirect nhanh sang Shopee affiliate/app.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/07-tracking-redirect.md
- affiliate-outfit-docs/12-test-plan.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Validate outfit active.
- [ ] Validate product belongs to outfit.
- [ ] Resolve redirect URL = h5_link || affiliate_url.
- [ ] Log click with session/cookie/referrer/user_agent/ip_hash.
- [ ] Redirect quickly.
- [ ] Add duplicate click anti-spam if missing.
- [ ] Do not expose raw affiliate link in public product card.
- [ ] Lint/build/test.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Product image/name click goes through /go.
- Click is logged.
- User redirects to Shopee affiliate/app link.
- Old view tracking behavior remains.
```

---

# PHASE BE-6 — Cron Sync Completion

## TASK BE-6.1 — Complete Product Sync Retry & Non-Overwrite Rules

**Mục tiêu:** cron sync sản phẩm 15 phút/lần, upsert an toàn, không ghi đè Product DNA/mockup.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/06-cron-sync-products.md
- affiliate-outfit-docs/12-test-plan.md
- affiliate-outfit-docs/13-env-config.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- api-get-data.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Inspect current sync client/service.
- [ ] Add retry 2-3 times if missing.
- [ ] Upsert by url_suffix + external_link_id.
- [ ] Preserve product_dna.
- [ ] Preserve mockup_image_url.
- [ ] Write sync_logs.
- [ ] Mark missing source product inactive if rule exists.
- [ ] Do not add api_sources/source_groups tables unless explicitly approved.
- [ ] Lint/build/test.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Sync is reliable enough for MVP.
- Manual enrichment data is not overwritten.
```

---

# PHASE BE-7 — Media Completion

## TASK BE-7.1 — Complete Media Upload With R2

**Mục tiêu:** hoàn thiện upload ảnh mockup/cover vào Cloudflare R2 nếu chưa hoàn chỉnh.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/09-storage-media.md
- affiliate-outfit-docs/13-env-config.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Validate file type image only.
- [ ] Validate file size.
- [ ] Validate media folder/type.
- [ ] Upload to R2.
- [ ] Return public URL.
- [ ] If media_assets table/service exists, save metadata.
- [ ] Do not store file in database.
- [ ] Lint/build/test.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Mockup/cover images can be uploaded and displayed from R2 public URL.
```

---

# PHASE BE-8 — Analytics Completion

## TASK BE-8.1 — Complete Basic Analytics Queries

**Mục tiêu:** dashboard analytics cơ bản: view, click, CTR, top outfit/product.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/04-permission-matrix.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/07-tracking-redirect.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- coding-standards.md
- rules.md
```

**Metrics:**

```text
- total views
- total clicks
- CTR = clicks / views
- top outfits by clicks
- top products by clicks
- by date range if already supported
```

**Checklist:**

```text
- [ ] Inspect tracking tables/services.
- [ ] Add analytics query service if missing.
- [ ] Check permission scope all/own if existing.
- [ ] Avoid expensive queries without pagination/limit.
- [ ] Lint/build/test.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Dashboard can show basic analytics.
- Staff/Admin scope is respected if implemented.
```

---

# PHASE BE-9 — SEO Completion

## TASK BE-9.1 — Complete Sitemap, Robots, Canonical, Metadata

**Mục tiêu:** public outfit pages có SEO foundation đúng.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/08-seo-spec.md
- affiliate-outfit-docs/13-env-config.md
- affiliate-outfit-docs/14-project-structure.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] sitemap includes only active public outfits and allowed pages.
- [ ] robots disallows /manager, /api, /go or /r.
- [ ] outfit detail uses canonical.
- [ ] outfit detail has dynamic title/description.
- [ ] JSON-LD if already planned.
- [ ] Do not index product internal pages.
- [ ] Lint/build/test.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Public SEO foundation works.
- Internal/redirect routes are not indexed intentionally.
```
