# TASKS.md — OutfitClick MVP Build Plan

> Vai trò áp dụng cho mọi task: **Senior Full-stack Developer**.  
> Mục tiêu: build hệ thống affiliate outfit-first, public chỉ xem outfit list/detail; trong outfit detail, user bấm ảnh hoặc tên sản phẩm thì tracking click/session behavior và redirect sang Shopee affiliate/app.

---

## 0. Quy tắc dùng file này

Mỗi task bên dưới đã có sẵn mục **Tài liệu bắt buộc phải đọc trước** để bạn copy thẳng vào prompt cho AI.

### Prompt mở đầu nên dùng cho mọi task

```text
Bạn là Senior Full-stack Developer trong project OutfitClick.

Task hiện tại:
[PASTE TASK ID + TITLE + CHECKLIST]

Tài liệu bắt buộc phải đọc trước:
[PASTE LIST TRONG TASK]

Quy tắc làm việc:
1. Chưa code ngay.
2. Trước tiên hãy đọc tài liệu và source liên quan.
3. Tóm tắt bạn hiểu task này là gì.
4. Liệt kê flow hiện tại nếu đã có code.
5. Liệt kê chính xác file sẽ sửa hoặc tạo mới.
6. Không sửa file ngoài danh sách nếu chưa được duyệt.
7. Không refactor unrelated code.
8. Không đổi schema/database/constants/routes/permission nếu task không yêu cầu.
9. Reuse function/service/helper hiện có, không viết duplicate logic.
10. Code phải type-safe, sạch, dễ maintain.
11. Sau khi code xong phải báo cáo: file đã sửa, logic đã thêm, logic cũ được giữ nguyên, test/check cần chạy, rủi ro có thể ảnh hưởng.

Bây giờ hãy phân tích task và đưa kế hoạch sửa trước, chưa code.
```

### Sau khi task hoàn thành

Bắt buộc cập nhật:

```text
- task-log.md
- 16-source-map.md nếu có thêm/sửa/di chuyển route, service, constants, schema, folder/module quan trọng
```

Không cần cập nhật `16-source-map.md` cho từng component UI nhỏ nếu component đó nằm trong folder đã được map rõ.

---

# PHASE 0 — AI Control, Source Map, Project Guardrails

## TASK 0.1 — Tạo hoặc cập nhật 16-source-map.md

**Mục tiêu:** tạo bản đồ source để AI biết file/folder nào phục vụ chức năng nào, tránh đọc/sửa lung tung.

**Tài liệu bắt buộc phải đọc trước:**

```text
- README.md
- 00-system-overview.md
- 14-project-structure.md
- rules.md
- coding-standards.md
- prompt.md
```

**Checklist:**

```text
- [ ] Tạo file 16-source-map.md nếu chưa có.
- [ ] Ghi rõ public routes.
- [ ] Ghi rõ manager routes.
- [ ] Ghi rõ API/route handlers.
- [ ] Ghi rõ services/repositories/schemas.
- [ ] Ghi rõ constants.
- [ ] Ghi rõ các file không được sửa nếu chưa được duyệt.
- [ ] Thêm rule: update file này khi tạo module/route/service quan trọng.
```

**Acceptance Criteria:**

```text
- AI có thể đọc file này để biết source code nằm ở đâu.
- File có mục “Do Not Modify Without Approval”.
- File có mục “Update Rule”.
```

---

## TASK 0.2 — Tạo task-log.md

**Mục tiêu:** lưu lịch sử mỗi task đã làm để AI biết lần trước vừa sửa gì, tránh đè logic cũ.

**Tài liệu bắt buộc phải đọc trước:**

```text
- README.md
- rules.md
- prompt.md
- coding-standards.md
- tasks.md
```

**Checklist:**

```text
- [ ] Tạo file task-log.md.
- [ ] Thêm format log theo ngày/task.
- [ ] Mỗi log phải có: task id, file changed, summary, behavior preserved, tests run, known risks.
- [ ] Thêm rule: sau mỗi task phải update task-log.md.
```

**Template đề xuất:**

```md
# Task Log

## YYYY-MM-DD — TASK X.X — Title

### Files changed
- ...

### Summary
- ...

### Existing behavior preserved
- ...

### Tests/checks run
- ...

### Risks / Notes
- ...
```

**Acceptance Criteria:**

```text
- task-log.md có format rõ ràng.
- Có thể đọc để hiểu task gần nhất đã sửa gì.
```

---

## TASK 0.3 — Chốt coding guardrails trong rules.md/prompt.md

**Mục tiêu:** khóa quy tắc làm việc với AI để hạn chế sửa bừa.

**Tài liệu bắt buộc phải đọc trước:**

```text
- README.md
- 00-system-overview.md
- rules.md
- prompt.md
- coding-standards.md
- 16-source-map.md
```

**Checklist:**

```text
- [ ] Thêm rule: mỗi task phải phân tích trước, chưa code ngay.
- [ ] Thêm rule: phải liệt kê file sẽ sửa.
- [ ] Thêm rule: không sửa file ngoài scope.
- [ ] Thêm rule: không refactor unrelated code.
- [ ] Thêm rule: không đổi schema/constants/routes nếu task không yêu cầu.
- [ ] Thêm rule: sau task update task-log.md.
```

**Acceptance Criteria:**

```text
- Có thể dùng prompt.md làm prompt mặc định cho AI.
- rules.md nêu rõ các hành vi bị cấm.
```

---

# PHASE 1 — Project Setup

## TASK 1.1 — Init Next.js project

**Mục tiêu:** tạo source project Next.js chuẩn cho OutfitClick.

**Tài liệu bắt buộc phải đọc trước:**

```text
- README.md
- 00-system-overview.md
- 13-env-config.md
- 14-project-structure.md
- 16-source-map.md
- rules.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Init Next.js App Router + TypeScript.
- [ ] Bật Tailwind CSS.
- [ ] Bật ESLint.
- [ ] Dùng src directory.
- [ ] Set alias @/*.
- [ ] Tạo file .env.example.
- [ ] Tạo README project-level nếu cần.
```

**Acceptance Criteria:**

```text
- App chạy được local.
- TypeScript hoạt động.
- Tailwind hoạt động.
- Có cấu trúc src/ ban đầu.
```

---

## TASK 1.2 — Setup shadcn/ui và base components

**Mục tiêu:** chuẩn bị UI component cho manager và public site.

**Tài liệu bắt buộc phải đọc trước:**

```text
- README.md
- 00-system-overview.md
- 10-manager-workflows.md
- 14-project-structure.md
- coding-standards.md
- 16-source-map.md
```

**Checklist:**

```text
- [ ] Init shadcn/ui.
- [ ] Add button, input, label, card, table, dialog, dropdown-menu, select, badge, tabs, textarea, form.
- [ ] Tạo layout/theme cơ bản.
- [ ] Không custom UI quá nhiều ở task này.
```

**Acceptance Criteria:**

```text
- Component shadcn dùng được.
- Không làm thay đổi business logic.
```

---

## TASK 1.3 — Tạo project structure theo tài liệu

**Mục tiêu:** tạo folder chuẩn để AI/dev không viết code lộn xộn.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 14-project-structure.md
- 16-source-map.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Tạo src/constants.
- [ ] Tạo src/lib.
- [ ] Tạo src/server.
- [ ] Tạo src/server/auth.
- [ ] Tạo src/server/products.
- [ ] Tạo src/server/outfits.
- [ ] Tạo src/server/sync.
- [ ] Tạo src/server/tracking.
- [ ] Tạo src/server/media.
- [ ] Tạo src/components/public.
- [ ] Tạo src/components/manager.
- [ ] Update 16-source-map.md.
```

**Acceptance Criteria:**

```text
- Folder structure khớp 14-project-structure.md.
- 16-source-map.md phản ánh folder mới.
```

---

# PHASE 2 — Environment, Database, Constants

## TASK 2.1 — Setup env config

**Mục tiêu:** chuẩn hóa env cho app, database, auth, cron, product sync, R2, tracking.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 13-env-config.md
- 03-constants.md
- 06-cron-sync-products.md
- 09-storage-media.md
- 07-tracking-redirect.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo .env.example.
- [ ] Tạo src/lib/env.ts.
- [ ] Validate env bằng Zod hoặc helper rõ ràng.
- [ ] Không hard-code secrets.
- [ ] Không commit .env thật.
```

**Acceptance Criteria:**

```text
- App fail fast nếu thiếu env bắt buộc.
- .env.example đủ biến cần thiết.
```

---

## TASK 2.2 — Setup Prisma + PostgreSQL

**Mục tiêu:** chuẩn bị ORM và connection database.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 01-database-schema.md
- 02-database-relationships.md
- 13-env-config.md
- 14-project-structure.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Cài Prisma và @prisma/client.
- [ ] Tạo prisma/schema.prisma.
- [ ] Tạo src/lib/prisma.ts singleton client.
- [ ] Kết nối PostgreSQL local/dev.
```

**Acceptance Criteria:**

```text
- Prisma connect được database.
- Không có Prisma client duplicate trong dev hot reload.
```

---

## TASK 2.3 — Viết schema.prisma MVP

**Mục tiêu:** tạo schema database MVP gọn đúng mô hình.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 00-system-overview.md
- 01-database-schema.md
- 02-database-relationships.md
- 03-constants.md
- 04-permission-matrix.md
- 07-tracking-redirect.md
- 09-storage-media.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo users.
- [ ] Tạo roles.
- [ ] Tạo permissions.
- [ ] Tạo user_roles.
- [ ] Tạo role_permissions.
- [ ] Tạo products.
- [ ] Tạo outfits.
- [ ] Tạo outfit_products.
- [ ] Tạo outfit_view_logs.
- [ ] Tạo click_logs.
- [ ] Tạo sync_logs.
- [ ] Tạo media_assets.
- [ ] Tạo styles.
- [ ] Tạo outfit_types.
- [ ] Tạo product_categories.
- [ ] Thêm unique/index theo 02-database-relationships.md.
- [ ] Không thêm creators/api_sources/source_groups/tasks/product_links ở MVP.
```

**Acceptance Criteria:**

```text
- Schema generate/migrate được.
- Có unique(url_suffix, external_link_id) cho products.
- Có unique(outfit_code) cho outfits.
- Có unique(outfit_id, product_id) cho outfit_products.
```

---

## TASK 2.4 — Tạo constants TypeScript

**Mục tiêu:** không hard-code status/role/permission trong code.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 03-constants.md
- 04-permission-matrix.md
- 01-database-schema.md
- coding-standards.md
- 16-source-map.md
```

**Checklist:**

```text
- [ ] Tạo src/constants/roles.ts.
- [ ] Tạo src/constants/permissions.ts.
- [ ] Tạo src/constants/status.ts.
- [ ] Tạo src/constants/routes.ts.
- [ ] Tạo src/constants/tracking.ts.
- [ ] Tạo src/constants/media.ts.
- [ ] Export type union từ constants.
```

**Acceptance Criteria:**

```text
- Không dùng string role/status/permission rải rác.
- Constants type-safe.
```

---

## TASK 2.5 — Migration + seed dữ liệu nền

**Mục tiêu:** tạo database ban đầu và seed roles/permissions/admin/style/type/category.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 01-database-schema.md
- 03-constants.md
- 04-permission-matrix.md
- 13-env-config.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Chạy initial migration.
- [ ] Tạo prisma/seed.ts.
- [ ] Seed roles: admin, manager, product_staff, outfit_staff, viewer.
- [ ] Seed permissions theo 04-permission-matrix.md.
- [ ] Seed role_permissions.
- [ ] Seed admin user đầu tiên bằng env.
- [ ] Seed styles/outfit_types/product_categories mẫu.
```

**Acceptance Criteria:**

```text
- Database có admin user đăng nhập được sau này.
- Roles/permissions khớp tài liệu.
- Seed chạy lại không tạo trùng.
```

---

# PHASE 3 — Auth & Permission

## TASK 3.1 — Xây auth service cơ bản

**Mục tiêu:** login/logout/session cho manager.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 00-system-overview.md
- 01-database-schema.md
- 03-constants.md
- 04-permission-matrix.md
- 05-api-routes.md
- 14-project-structure.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Tạo auth service.
- [ ] Tạo password hashing/verify.
- [ ] Tạo session strategy.
- [ ] Tạo login action/API.
- [ ] Tạo logout action/API.
- [ ] Không expose password_hash.
```

**Acceptance Criteria:**

```text
- Admin seed user login được.
- User disabled không login được.
- Session đọc được user hiện tại.
```

---

## TASK 3.2 — Tạo permission service

**Mục tiêu:** check quyền tập trung, không check rải rác.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 04-permission-matrix.md
- 03-constants.md
- 01-database-schema.md
- 14-project-structure.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Tạo hasPermission(userId, permissionCode).
- [ ] Tạo requirePermission(permissionCode).
- [ ] Tạo getUserPermissions(userId).
- [ ] Tạo helper check data scope: all/own/assigned.
- [ ] Không duplicate permission logic.
```

**Acceptance Criteria:**

```text
- Permission lấy từ DB roles/permissions.
- Manager API có thể dùng requirePermission.
```

---

## TASK 3.3 — Manager route protection

**Mục tiêu:** bảo vệ toàn bộ /manager.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 04-permission-matrix.md
- 05-api-routes.md
- 10-manager-workflows.md
- 14-project-structure.md
- 16-source-map.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo /manager/login.
- [ ] Tạo /manager layout.
- [ ] Redirect user chưa login về /manager/login.
- [ ] User đã login vào được manager.
- [ ] Tạo guard component/helper.
```

**Acceptance Criteria:**

```text
- Không login không vào được /manager.
- Login xong vào được dashboard shell.
```

---

# PHASE 4 — Product Sync API

## TASK 4.1 — Tạo MyCollection API client

**Mục tiêu:** gọi API lấy sản phẩm theo urlSuffix/groupId ổn định.

**Tài liệu bắt buộc phải đọc trước:**

```text
- api-get-data.md
- 06-cron-sync-products.md
- 13-env-config.md
- 01-database-schema.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Tạo src/server/sync/mycollection.client.ts.
- [ ] Tạo function fetchStorefrontGroupProductList(input).
- [ ] Payload khớp api-get-data.md.
- [ ] Hỗ trợ pagination offset/limit.
- [ ] Có timeout/error handling.
- [ ] Không log secrets.
```

**Acceptance Criteria:**

```text
- Client gọi API và parse response được.
- Response type-safe ở mức cần thiết.
```

---

## TASK 4.2 — Tạo mapper API → Product

**Mục tiêu:** map field API sang products database.

**Tài liệu bắt buộc phải đọc trước:**

```text
- api-get-data.md
- 01-database-schema.md
- 02-database-relationships.md
- 06-cron-sync-products.md
- 03-constants.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo mapper riêng.
- [ ] Map linkId → external_link_id.
- [ ] Map itemId → external_item_id.
- [ ] Map linkName → name.
- [ ] Map image → image_url.
- [ ] Map link → affiliate_url.
- [ ] Map h5Link → h5_link.
- [ ] Map groupId/groupName nếu có.
- [ ] Gắn url_suffix từ config/request.
- [ ] Lưu raw_json.
```

**Acceptance Criteria:**

```text
- Mapper không ghi đè mockup_image_url/product_dna.
- Mapper không phụ thuộc UI.
```

---

## TASK 4.3 — Tạo product upsert service

**Mục tiêu:** sync không tạo trùng và không ghi đè dữ liệu Staff xử lý.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 01-database-schema.md
- 02-database-relationships.md
- 03-constants.md
- 06-cron-sync-products.md
- 12-test-plan.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo src/server/products/product.repository.ts nếu chưa có.
- [ ] Tạo upsertProductFromSource().
- [ ] Unique theo url_suffix + external_link_id.
- [ ] Create product mới nếu chưa có.
- [ ] Update product cũ nếu đã có.
- [ ] Preserve product_dna.
- [ ] Preserve mockup_image_url.
- [ ] Update name/image_url/affiliate_url/h5_link/status/last_synced_at/raw_json.
```

**Acceptance Criteria:**

```text
- Sync chạy lại không tạo trùng.
- product_dna/mockup_image_url không bị mất.
```

---

## TASK 4.4 — Tạo sync-products service

**Mục tiêu:** gom API client + mapper + upsert + sync_logs.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 06-cron-sync-products.md
- 01-database-schema.md
- 03-constants.md
- 12-test-plan.md
- 13-env-config.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo src/server/sync/sync-products.service.ts.
- [ ] Lấy config urlSuffix/groupId từ env/config.
- [ ] Fetch tất cả page cần thiết.
- [ ] Upsert products.
- [ ] Ghi sync_logs started/finished.
- [ ] Ghi total_fetched/created/updated/failed.
- [ ] Retry 2-3 lần khi API lỗi.
- [ ] Không chạy song song cùng source nếu có lock đơn giản.
```

**Acceptance Criteria:**

```text
- Chạy sync trả summary rõ ràng.
- Lỗi API được ghi sync_logs.
```

---

## TASK 4.5 — Tạo cron endpoint sync-products

**Mục tiêu:** endpoint để Vercel Cron/external cron gọi 15 phút/lần.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 05-api-routes.md
- 06-cron-sync-products.md
- 13-env-config.md
- 14-project-structure.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Tạo /api/cron/sync-products route handler.
- [ ] Bảo vệ bằng CRON_SECRET.
- [ ] Chỉ cho method phù hợp.
- [ ] Gọi sync-products service.
- [ ] Return JSON summary.
- [ ] Không expose secret/API payload nhạy cảm.
```

**Acceptance Criteria:**

```text
- Không có CRON_SECRET thì bị từ chối.
- Có secret đúng thì sync chạy.
```

---

# PHASE 5 — Cloudflare R2 & Media

## TASK 5.1 — Setup Cloudflare R2 client

**Mục tiêu:** kết nối R2 để lưu mockup/cover.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 09-storage-media.md
- 13-env-config.md
- 01-database-schema.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Tạo src/lib/r2.ts hoặc src/server/media/r2.client.ts.
- [ ] Validate env R2.
- [ ] Tạo upload helper.
- [ ] Tạo delete helper nếu cần.
- [ ] Tạo public URL builder.
```

**Acceptance Criteria:**

```text
- Upload thử file lên R2 được.
- Public URL load được ảnh.
```

---

## TASK 5.2 — Tạo media upload API/service

**Mục tiêu:** upload cover outfit và mockup product.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 09-storage-media.md
- 04-permission-matrix.md
- 05-api-routes.md
- 01-database-schema.md
- 14-project-structure.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo media service.
- [ ] Validate MIME/type/size.
- [ ] Upload lên R2 theo key rule.
- [ ] Lưu media_assets.
- [ ] Update product.mockup_image_url khi upload product mockup.
- [ ] Update outfit.cover_image_url khi upload outfit cover.
- [ ] Check permission trước upload.
```

**Acceptance Criteria:**

```text
- Upload mockup cập nhật product đúng.
- Upload cover cập nhật outfit đúng.
- File sai MIME/size bị reject.
```

---

# PHASE 6 — Manager Product Module

## TASK 6.1 — Product list manager page

**Mục tiêu:** staff/admin xem và lọc sản phẩm đã sync.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 10-manager-workflows.md
- 01-database-schema.md
- 03-constants.md
- 04-permission-matrix.md
- 05-api-routes.md
- 14-project-structure.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo /manager/products.
- [ ] Table hiển thị image fallback, name, url_suffix, status, có DNA, có mockup, last_synced_at.
- [ ] Search theo name.
- [ ] Filter theo url_suffix.
- [ ] Filter theo status.
- [ ] Pagination.
- [ ] Check permission products.view.
```

**Acceptance Criteria:**

```text
- Admin/Manager xem danh sách products được.
- Product Staff chỉ xem theo scope được cấp nếu có.
```

---

## TASK 6.2 — Product edit detail

**Mục tiêu:** cập nhật PRODUCT DNA, mockup và status.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 01-database-schema.md
- 03-constants.md
- 04-permission-matrix.md
- 09-storage-media.md
- 10-manager-workflows.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo product detail/edit UI.
- [ ] Cho sửa product_dna.
- [ ] Cho upload mockup_image_url qua media service.
- [ ] Cho đổi status active/inactive nếu có quyền.
- [ ] Không cho sửa external ids nếu không cần.
- [ ] Không cho sửa affiliate_url nếu chưa có quyền cụ thể.
```

**Acceptance Criteria:**

```text
- Cập nhật DNA không ảnh hưởng sync.
- Upload mockup xong display image ưu tiên mockup.
```

---

## TASK 6.3 — Product display image helper

**Mục tiêu:** dùng chung logic ảnh sản phẩm.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 02-database-relationships.md
- 01-database-schema.md
- 10-manager-workflows.md
- 14-project-structure.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo helper getProductDisplayImage(product).
- [ ] Ưu tiên mockup_image_url.
- [ ] Fallback image_url.
- [ ] Dùng helper trong manager và public.
- [ ] Không duplicate logic fallback.
```

**Acceptance Criteria:**

```text
- Product có mockup hiển thị mockup.
- Product không có mockup hiển thị ảnh API.
```

---

# PHASE 7 — Manager Outfit Module

## TASK 7.1 — Outfit code generator

**Mục tiêu:** sinh mã outfit random 6 ký tự không trùng.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 02-database-relationships.md
- 03-constants.md
- 01-database-schema.md
- 12-test-plan.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo generateOutfitCode().
- [ ] Dùng alphabet loại bỏ ký tự dễ nhầm.
- [ ] Check unique trong DB.
- [ ] Retry nếu trùng.
- [ ] Viết test nếu có test setup.
```

**Acceptance Criteria:**

```text
- Code 6 ký tự.
- Không trùng outfit_code đã tồn tại.
```

---

## TASK 7.2 — Outfit list manager page

**Mục tiêu:** quản lý danh sách outfit.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 10-manager-workflows.md
- 01-database-schema.md
- 03-constants.md
- 04-permission-matrix.md
- 05-api-routes.md
- 14-project-structure.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo /manager/outfits.
- [ ] Hiển thị cover, name, outfit_code, status, product count, published_at.
- [ ] Search theo name/outfit_code.
- [ ] Filter theo status/style/type.
- [ ] Pagination.
- [ ] Check permission outfits.view.
```

**Acceptance Criteria:**

```text
- Xem/search/filter outfits được.
- Không thấy outfit bị deleted nếu không yêu cầu.
```

---

## TASK 7.3 — Create/Edit outfit

**Mục tiêu:** tạo/sửa outfit cơ bản.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 01-database-schema.md
- 02-database-relationships.md
- 03-constants.md
- 04-permission-matrix.md
- 08-seo-spec.md
- 09-storage-media.md
- 10-manager-workflows.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo /manager/outfits/new.
- [ ] Tạo /manager/outfits/[id]/edit.
- [ ] Field: name, slug, description, cover_image_url, style_id, outfit_type_id, status.
- [ ] Tự sinh outfit_code khi tạo mới.
- [ ] Upload cover qua media service.
- [ ] Validate slug.
- [ ] Không có creator/price.
```

**Acceptance Criteria:**

```text
- Tạo outfit draft được.
- Sửa outfit không làm đổi outfit_code.
- Không có field creator/price trong UI.
```

---

## TASK 7.4 — Product picker trong outfit edit

**Mục tiêu:** chọn sản phẩm từ danh sách products để thêm vào outfit.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 01-database-schema.md
- 02-database-relationships.md
- 03-constants.md
- 04-permission-matrix.md
- 10-manager-workflows.md
- 14-project-structure.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo product picker modal/drawer.
- [ ] Search/filter product theo name/url_suffix/status.
- [ ] Hiển thị ảnh fallback mockup → image_url.
- [ ] Add product vào outfit_products.
- [ ] Không add trùng product vào cùng outfit.
- [ ] Chỉ add product active.
- [ ] Không cần sort_order.
```

**Acceptance Criteria:**

```text
- Add/gỡ product khỏi outfit được.
- Product duplicate bị chặn.
- Product list trong outfit order theo created_at ASC.
```

---

## TASK 7.5 — Publish/Hide/Delete outfit

**Mục tiêu:** quản lý trạng thái public của outfit.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 02-database-relationships.md
- 03-constants.md
- 04-permission-matrix.md
- 08-seo-spec.md
- 10-manager-workflows.md
- 12-test-plan.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Publish outfit với validation.
- [ ] Không publish nếu thiếu cover.
- [ ] Không publish nếu không có product.
- [ ] Không publish nếu product link thiếu affiliate_url/h5_link.
- [ ] Set status active + published_at.
- [ ] Hide outfit: status hidden.
- [ ] Delete outfit: soft delete/status deleted.
```

**Acceptance Criteria:**

```text
- Chỉ outfit active xuất hiện public/sitemap.
- Hidden/deleted không public.
```

---

# PHASE 8 — Public Site

## TASK 8.1 — Public outfit listing page

**Mục tiêu:** trang danh sách outfit để user click ảnh outfit vào chi tiết.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 00-system-overview.md
- 05-api-routes.md
- 08-seo-spec.md
- 01-database-schema.md
- 03-constants.md
- 14-project-structure.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo public homepage hoặc /outfits.
- [ ] Chỉ lấy outfit active.
- [ ] Hiển thị cover, name, description ngắn nếu cần.
- [ ] Click ảnh outfit/name → vào detail outfit.
- [ ] Không hiển thị product list ở list page.
- [ ] Không hiển thị giá.
- [ ] Không hiển thị creator.
```

**Acceptance Criteria:**

```text
- User bấm outfit vào detail.
- Hidden/deleted outfit không xuất hiện.
```

---

## TASK 8.2 — Public outfit detail page

**Mục tiêu:** trang chi tiết outfit hiển thị sản phẩm trong outfit.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 00-system-overview.md
- 01-database-schema.md
- 02-database-relationships.md
- 05-api-routes.md
- 07-tracking-redirect.md
- 08-seo-spec.md
- 10-manager-workflows.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo /outfit/[slug] hoặc route theo URL đã chốt.
- [ ] Query outfit active theo slug/code.
- [ ] Hiển thị cover outfit.
- [ ] Hiển thị name, description SEO.
- [ ] Hiển thị danh sách product trong outfit.
- [ ] Product dùng display image helper.
- [ ] Bấm ảnh hoặc tên product → route /go/[outfitCode]/[productId].
- [ ] Không link thẳng affiliate_url ở frontend.
- [ ] Không hiển thị giá.
- [ ] Không có nút mua.
- [ ] Không có creator.
```

**Acceptance Criteria:**

```text
- Detail page đúng flow affiliate.
- Click product đi qua tracking route.
```

---

## TASK 8.3 — Empty/error public states

**Mục tiêu:** xử lý case outfit không tồn tại, hidden, không có product.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 00-system-overview.md
- 03-constants.md
- 05-api-routes.md
- 08-seo-spec.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Outfit không tồn tại → 404.
- [ ] Outfit hidden/deleted → 404 hoặc notFound.
- [ ] Outfit active nhưng product rỗng → hiển thị fallback an toàn hoặc không cho publish từ manager.
- [ ] Không expose internal error.
```

**Acceptance Criteria:**

```text
- Public không thấy draft/hidden/deleted.
- Error state sạch, không leak dữ liệu nội bộ.
```

---

# PHASE 9 — Tracking & Redirect

## TASK 9.1 — Session/cookie tracking helper

**Mục tiêu:** tạo cookie_id/session_id anonymous để hiểu hành vi người dùng.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 07-tracking-redirect.md
- 01-database-schema.md
- 03-constants.md
- 13-env-config.md
- coding-standards.md
- rules.md
```

**Checklist:**

```text
- [ ] Tạo affiliate_site_uid cookie dài hạn.
- [ ] Tạo affiliate_site_sid cookie phiên.
- [ ] Tạo helper getOrCreateTrackingIds().
- [ ] Cookie httpOnly/sameSite phù hợp nếu dùng server.
- [ ] Không lưu PII.
- [ ] IP hash nếu cần lưu.
```

**Acceptance Criteria:**

```text
- Một user có cookie_id ổn định.
- Session mới được tạo theo rule timeout.
```

---

## TASK 9.2 — Outfit view log

**Mục tiêu:** ghi lượt xem trang chi tiết outfit.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 07-tracking-redirect.md
- 01-database-schema.md
- 03-constants.md
- 08-seo-spec.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo tracking service/repository.
- [ ] Ghi outfit_view_logs khi user vào detail outfit.
- [ ] Lưu session_id/cookie_id/referrer/utm/user_agent/ip_hash.
- [ ] Không block render quá lâu.
- [ ] Không tính manager preview nếu có rule.
```

**Acceptance Criteria:**

```text
- Vào outfit detail tạo view log.
- Log đủ dữ liệu để tính CTR.
```

---

## TASK 9.3 — Product click redirect route

**Mục tiêu:** user bấm ảnh/tên product → ghi click + redirect Shopee affiliate/app.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 00-system-overview.md
- 01-database-schema.md
- 02-database-relationships.md
- 03-constants.md
- 05-api-routes.md
- 07-tracking-redirect.md
- 12-test-plan.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo /go/[outfitCode]/[productId] route.
- [ ] Validate outfit active.
- [ ] Validate product thuộc outfit.
- [ ] Validate product active.
- [ ] Chọn redirect_url = h5_link || affiliate_url.
- [ ] Ghi click_logs.
- [ ] Redirect nhanh, không chờ các job phụ không cần thiết.
- [ ] Không await Promise.all tracking phụ trước redirect.
- [ ] Nếu dùng after()/queue thì ghi rõ.
```

**Acceptance Criteria:**

```text
- Click hợp lệ redirect sang Shopee.
- Click invalid trả 404/redirect fallback an toàn.
- click_logs lưu đúng outfit_id/product_id/session/redirect_url.
```

---

## TASK 9.4 — Anti-spam/bot click rule

**Mục tiêu:** giảm click ảo nhưng vẫn redirect cho user thật.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 07-tracking-redirect.md
- 03-constants.md
- 01-database-schema.md
- 12-test-plan.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Duplicate click cùng session/outfit/product trong 30s → is_valid=false.
- [ ] Bot user-agent phổ biến → is_suspicious=true hoặc is_valid=false tùy rule.
- [ ] Too many clicks từ cùng session/ip_hash → suspicious.
- [ ] Manager preview không tính valid analytics.
- [ ] Vẫn redirect nếu click không nguy hiểm.
```

**Acceptance Criteria:**

```text
- Duplicate click không làm tăng valid CTR.
- Log vẫn giữ để phân tích hành vi.
```

---

# PHASE 10 — SEO

## TASK 10.1 — Dynamic metadata cho outfit pages

**Mục tiêu:** mỗi outfit có title/description/canonical/OG riêng.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 08-seo-spec.md
- 00-system-overview.md
- 01-database-schema.md
- 03-constants.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] generateMetadata cho outfit detail.
- [ ] Title theo format SEO.
- [ ] Meta description từ description outfit.
- [ ] OG image dùng cover_image_url.
- [ ] Canonical duy nhất.
- [ ] Hidden/deleted không index.
```

**Acceptance Criteria:**

```text
- View source có metadata đúng.
- Mỗi outfit active có canonical đúng.
```

---

## TASK 10.2 — Sitemap và robots

**Mục tiêu:** Google index đúng trang cần index, chặn route nội bộ/redirect.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 08-seo-spec.md
- 05-api-routes.md
- 03-constants.md
- 01-database-schema.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo sitemap.ts.
- [ ] Chỉ include outfit active.
- [ ] Include home/style/type nếu đã có.
- [ ] Không include /manager, /api, /go, draft/hidden/deleted.
- [ ] Tạo robots.ts.
- [ ] Disallow /manager, /api, /go, /r.
- [ ] Khai báo sitemap URL.
```

**Acceptance Criteria:**

```text
- sitemap chỉ có URL public indexable.
- robots chặn internal/redirect routes.
```

---

## TASK 10.3 — JSON-LD outfit detail

**Mục tiêu:** giúp search engine hiểu trang outfit/lookbook.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 08-seo-spec.md
- 01-database-schema.md
- 00-system-overview.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Thêm CollectionPage JSON-LD.
- [ ] Thêm ItemList cho products trong outfit.
- [ ] Thêm BreadcrumbList nếu có breadcrumb.
- [ ] Không dùng Product Offer nếu không hiển thị giá.
- [ ] Escape JSON an toàn.
```

**Acceptance Criteria:**

```text
- JSON-LD valid.
- Không có giá/offer nếu site không hiển thị giá.
```

---

## TASK 10.4 — SEO content template cho outfit

**Mục tiêu:** tránh trang thin content, tăng khả năng index/rank.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 08-seo-spec.md
- 10-manager-workflows.md
- 01-database-schema.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Outfit detail có H1 rõ ràng.
- [ ] Có mô tả 100-200 từ nếu dữ liệu có.
- [ ] Product image có alt text.
- [ ] Cover image có alt text.
- [ ] Có internal links tới outfit liên quan nếu có.
```

**Acceptance Criteria:**

```text
- Outfit page không chỉ có ảnh.
- Nội dung public không leak dữ liệu nội bộ.
```

---

# PHASE 11 — Dashboard & Analytics

## TASK 11.1 — Admin analytics overview

**Mục tiêu:** Admin xem tổng quan view/click/CTR.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 00-system-overview.md
- 01-database-schema.md
- 04-permission-matrix.md
- 07-tracking-redirect.md
- 10-manager-workflows.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tổng outfit active/draft/hidden.
- [ ] Tổng products active/inactive.
- [ ] Tổng views.
- [ ] Tổng valid clicks.
- [ ] CTR = valid_clicks / views.
- [ ] Top outfits theo click.
- [ ] Top products theo click.
- [ ] Filter date range cơ bản.
```

**Acceptance Criteria:**

```text
- Admin xem all system.
- CTR không tính invalid clicks.
```

---

## TASK 11.2 — Staff scoped analytics

**Mục tiêu:** Staff chỉ xem dữ liệu theo quyền/scope.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 04-permission-matrix.md
- 01-database-schema.md
- 07-tracking-redirect.md
- 10-manager-workflows.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Staff xem own/assigned data theo permission.
- [ ] Không thấy số liệu toàn hệ thống nếu không có analytics.view_all.
- [ ] Reuse permission/data scope service.
```

**Acceptance Criteria:**

```text
- Product Staff/Outfit Staff không xem nhầm all analytics.
- Admin/Manager có quyền phù hợp xem được all.
```

---

## TASK 11.3 — Sync logs page

**Mục tiêu:** theo dõi cron sync chạy có lỗi không.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 06-cron-sync-products.md
- 01-database-schema.md
- 04-permission-matrix.md
- 10-manager-workflows.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Tạo manager page xem sync_logs.
- [ ] Hiển thị status, url_suffix, group_id, total_fetched, total_created, total_updated, error_message, started_at, finished_at.
- [ ] Filter status/date.
- [ ] Chỉ user có quyền mới xem.
```

**Acceptance Criteria:**

```text
- Dễ debug cronjob.
- Không expose log nhạy cảm cho public.
```

---

# PHASE 12 — Tests & Hardening

## TASK 12.1 — Test product sync core

**Mục tiêu:** bảo vệ logic sync không phá dữ liệu Staff.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 12-test-plan.md
- 06-cron-sync-products.md
- 01-database-schema.md
- 02-database-relationships.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Test tạo product mới.
- [ ] Test không tạo trùng product.
- [ ] Test không ghi đè product_dna.
- [ ] Test không ghi đè mockup_image_url.
- [ ] Test API lỗi ghi sync_logs failed.
```

**Acceptance Criteria:**

```text
- Test sync pass.
- Function upsert an toàn khi cron chạy nhiều lần.
```

---

## TASK 12.2 — Test permission core

**Mục tiêu:** tránh Staff thấy/sửa sai quyền.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 12-test-plan.md
- 04-permission-matrix.md
- 03-constants.md
- 01-database-schema.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Test admin có full quyền.
- [ ] Test product_staff upload mockup/update DNA.
- [ ] Test outfit_staff không publish nếu không có quyền.
- [ ] Test viewer không edit.
- [ ] Test data scope own/assigned.
```

**Acceptance Criteria:**

```text
- Permission check không bị bypass.
- API manager đều có guard cần thiết.
```

---

## TASK 12.3 — Test outfit publish flow

**Mục tiêu:** chỉ public outfit đủ điều kiện.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 12-test-plan.md
- 02-database-relationships.md
- 03-constants.md
- 10-manager-workflows.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Test không publish nếu thiếu cover.
- [ ] Test không publish nếu không có product.
- [ ] Test không publish nếu product thiếu redirect link.
- [ ] Test publish thành công set active/published_at.
- [ ] Test hidden/deleted không public.
```

**Acceptance Criteria:**

```text
- Public pages/sitemap chỉ lấy outfit active.
```

---

## TASK 12.4 — Test tracking redirect

**Mục tiêu:** bảo vệ flow click affiliate quan trọng nhất.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 12-test-plan.md
- 07-tracking-redirect.md
- 01-database-schema.md
- 02-database-relationships.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Test click product hợp lệ tạo click_log và redirect.
- [ ] Test product không thuộc outfit → không redirect affiliate.
- [ ] Test outfit hidden → không redirect affiliate.
- [ ] Test duplicate click 30s is_valid=false.
- [ ] Test bot user-agent suspicious.
```

**Acceptance Criteria:**

```text
- Không mất click log quan trọng.
- Không redirect sai product/outfit.
```

---

## TASK 12.5 — Test SEO basics

**Mục tiêu:** public page index đúng, internal route không index.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 12-test-plan.md
- 08-seo-spec.md
- 05-api-routes.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Test active outfit có trong sitemap.
- [ ] Test hidden/deleted không trong sitemap.
- [ ] Test robots disallow /manager /api /go.
- [ ] Test canonical outfit đúng.
- [ ] Test metadata outfit đúng.
```

**Acceptance Criteria:**

```text
- SEO spec khớp 08-seo-spec.md.
```

---

# PHASE 13 — Deploy & Production Readiness

## TASK 13.1 — Production env checklist

**Mục tiêu:** chuẩn bị biến môi trường production.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 13-env-config.md
- 06-cron-sync-products.md
- 09-storage-media.md
- 07-tracking-redirect.md
- 08-seo-spec.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] DATABASE_URL production.
- [ ] AUTH_SECRET/session secret.
- [ ] CRON_SECRET.
- [ ] MyCollection API config.
- [ ] R2 credentials.
- [ ] Public site URL.
- [ ] Tracking cookie names.
```

**Acceptance Criteria:**

```text
- Production deploy không thiếu env.
- Secrets không commit vào git.
```

---

## TASK 13.2 — Deploy MVP

**Mục tiêu:** deploy bản MVP lên hosting.

**Tài liệu bắt buộc phải đọc trước:**

```text
- README.md
- 13-env-config.md
- 14-project-structure.md
- 08-seo-spec.md
- 06-cron-sync-products.md
- coding-standards.md
```

**Checklist:**

```text
- [ ] Deploy Next.js app.
- [ ] Run migration production.
- [ ] Run seed production an toàn.
- [ ] Test login manager.
- [ ] Test sync cron endpoint.
- [ ] Test upload R2.
- [ ] Test public outfit page.
- [ ] Test /go redirect.
```

**Acceptance Criteria:**

```text
- Website chạy production.
- Public + manager + tracking + sync hoạt động.
```

---

## TASK 13.3 — Setup SEO indexing tools

**Mục tiêu:** đưa website vào quy trình index Google.

**Tài liệu bắt buộc phải đọc trước:**

```text
- 08-seo-spec.md
- 13-env-config.md
- 00-system-overview.md
```

**Checklist:**

```text
- [ ] Setup Google Search Console.
- [ ] Submit sitemap.xml.
- [ ] Kiểm tra robots.txt.
- [ ] Kiểm tra canonical outfit page.
- [ ] Kiểm tra page speed cơ bản.
- [ ] Kiểm tra rich result/schema nếu có.
```

**Acceptance Criteria:**

```text
- Search Console nhận sitemap.
- Không có route internal bị index nhầm.
```

---

# MVP Completion Definition

MVP được xem là hoàn thành khi:

```text
- [ ] Cron sync được products theo url_suffix.
- [ ] Manager login được.
- [ ] Role/permission cơ bản hoạt động.
- [ ] Admin/Staff xem và xử lý products được.
- [ ] Upload mockup product được.
- [ ] Tạo outfit được.
- [ ] Gắn products vào outfit được.
- [ ] Publish/hide/delete outfit được.
- [ ] Public outfit list/detail hoạt động.
- [ ] Click ảnh/tên sản phẩm trong outfit detail đi qua /go route.
- [ ] /go ghi click_logs và redirect Shopee affiliate/app.
- [ ] Outfit view logs hoạt động.
- [ ] Duplicate/bot click rule MVP hoạt động.
- [ ] Sitemap/robots/canonical/metadata hoạt động.
- [ ] Không có creator, không có giá, không có product public page, không có nút mua.
- [ ] task-log.md và 16-source-map.md được cập nhật sau các task chính.
```
