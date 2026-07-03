# 16. Source Map

Bản đồ source code để AI/dev biết file/folder nào phục vụ chức năng nào.

**Update rule:** cập nhật file này khi tạo/sửa/xóa module, route, service, constants, hoặc folder quan trọng. Không cần cập nhật cho từng component UI nhỏ nằm trong folder đã được map rõ.

---

## 1. Public Routes

| URL | File | Mô tả |
|---|---|---|
| `/` | `src/app/(public)/page.tsx` | Homepage / outfit feed |
| `/outfits` | `src/app/(public)/outfits/page.tsx` | Danh sách outfit public |
| `/outfit/[slugCode]` | `src/app/(public)/outfit/[slugCode]/page.tsx` | Chi tiết outfit public |
| `/robots.txt` | `src/app/robots.ts` | Robots.txt |
| `/sitemap.xml` | `src/app/sitemap.ts` | Sitemap |

---

## 2. Manager Routes

| URL | File | Mô tả |
|---|---|---|
| `/manager/login` | `src/app/manager/login/page.tsx` | Login page (outside protected group) |
| `/manager` | `src/app/manager/(protected)/page.tsx` | Manager dashboard |
| `/manager/products` | `src/app/manager/(protected)/products/page.tsx` | Danh sách products |
| `/manager/products/[id]` | `src/app/manager/(protected)/products/[id]/page.tsx` | Chi tiết/edit product |
| `/manager/outfits` | `src/app/manager/(protected)/outfits/page.tsx` | Danh sách outfits |
| `/manager/outfits/new` | `src/app/manager/(protected)/outfits/new/page.tsx` | Tạo outfit mới — Server Component, permission check, `OutfitForm mode="create"` |
| `/manager/outfits/[id]` | `src/app/manager/(protected)/outfits/[id]/page.tsx` | Sửa outfit — Server Component, scope check, `OutfitForm mode="edit"` + metadata sidebar |
| `/manager/analytics` | `src/app/manager/(protected)/analytics/page.tsx` | Analytics dashboard — `getAnalyticsScope()` → view_all: system-wide, view_own: scoped to user's outfits/assigned products |
| `/manager/sync-logs` | `src/app/manager/(protected)/sync-logs/page.tsx` | Sync logs page — `hasPermission(sync.view)` → danh sách sync_logs với filter status/date |
| `/manager/users` | `src/app/manager/(protected)/users/page.tsx` | Quản lý users |
| `/manager/roles` | `src/app/manager/(protected)/roles/page.tsx` | Quản lý roles |

---

## 3. API / Route Handlers

| URL | File | Method | Mô tả |
|---|---|---|---|
| `/api/auth/login` | `src/app/api/auth/login/route.ts` | POST | Login — set session cookie |
| `/api/auth/logout` | `src/app/api/auth/logout/route.ts` | POST | Logout — clear session cookie |
| `/api/auth/me` | `src/app/api/auth/me/route.ts` | GET | Lấy thông tin user hiện tại |
| `/api/cron/sync-products` | `src/app/api/cron/sync-products/route.ts` | GET | Cron sync products từ API |
| `/api/manager/products` | `src/app/api/manager/products/route.ts` | GET | Danh sách products — auth + scope check + filter/pagination |
| `/api/manager/products/[id]` | `src/app/api/manager/products/[id]/route.ts` | GET, PATCH | Lấy / cập nhật product (DNA, status) — auth + scope + per-field permission check |
| `/api/manager/outfits` | `src/app/api/manager/outfits/route.ts` | GET, POST | Danh sách outfits (GET); Tạo outfit mới (POST, multipart) — auth + permission + R2 upload |
| `/api/manager/outfits/[id]` | `src/app/api/manager/outfits/[id]/route.ts` | GET, PATCH | Lấy / cập nhật outfit — auth + scope + per-status permission check |
| `/api/manager/outfits/[id]/products` | `src/app/api/manager/outfits/[id]/products/route.ts` | GET, POST | GET: list products in outfit (ordered created_at ASC); GET?picker=1: search active products for picker; POST: add product — auth + outfits.add_product |
| `/api/manager/outfits/[id]/products/[productId]` | `src/app/api/manager/outfits/[id]/products/[productId]/route.ts` | DELETE | Remove product from outfit — auth + outfits.remove_product |
| `/api/manager/media/upload` | `src/app/api/manager/media/upload/route.ts` | POST | Upload mockup/cover — auth + permission check + call media.service |
| `/api/tracking/outfit-view` | `src/app/api/tracking/outfit-view/route.ts` | POST | Ghi outfit view log — validate input, manager preview skip, set tracking cookies, hash IP, ghi `outfit_view_logs` |
| `/go/[outfitCode]/[productId]` | `src/app/go/[outfitCode]/[productId]/route.ts` | GET | Validate outfit+product → pick h5Link\|\|affiliateUrl → set tracking cookies → `after()` ghi `click_logs` → redirect 302 |

---

## 4. Constants

| File | Export | Mô tả |
|---|---|---|
| `src/constants/roles.ts` | `ROLE_CODES`, `RoleCode` | Role codes: admin, manager, product_staff, outfit_staff, viewer |
| `src/constants/permissions.ts` | `PERMISSIONS`, `Permission` | Permission codes đầy đủ theo 04-permission-matrix.md |
| `src/constants/status.ts` | `USER_STATUS`, `PRODUCT_STATUS`, `OUTFIT_STATUS`, `SYNC_STATUS` + types | Status enums |
| `src/constants/media.ts` | `MEDIA_ENTITY_TYPE`, `MEDIA_TYPE` + types | Media type enums |
| `src/constants/tracking.ts` | `TRACKING_COOKIE`, `TRACKING_CONFIG`, `CLICK_INVALID_REASON` + types | Tracking constants |
| `src/constants/routes.ts` | `PUBLIC_ROUTES`, `MANAGER_ROUTES`, `SEO_CONFIG` | Route và SEO constants |

---

## 5. Lib Helpers

| File | Task | Status | Mô tả |
|---|---|---|---|
| `src/lib/env.ts` | TASK 2.1 | ✅ done | Env validation helper — `requireEnv`, `optionalEnv`, export `env` typed object |
| `src/lib/db.ts` | TASK 2.2 | ✅ done | Prisma client singleton (globalThis pattern cho Next.js) |
| `src/lib/auth.ts` | TASK 3.1 | ✅ done | `hashPassword`, `verifyPassword`, `createSessionToken`, `verifySessionToken`, `getSession` |
| `src/lib/permissions.ts` | TASK 3.2, 11.2 | ✅ done | `getUserPermissions`, `hasPermission`, `requirePermission`, `getProductScope`, `getOutfitScope`, `getAnalyticsScope`, `ForbiddenError`, `DataScope` |
| `src/lib/require-auth.ts` | TASK 3.3 | ✅ done | `requireAuth()` — server guard: verify session + return SafeUser, redirect to login if invalid |
| `src/lib/r2.ts` | TASK 5.1 | ✅ done | `uploadToR2`, `deleteFromR2`, `getPublicUrl` — SigV4 implemented via Node.js crypto (no extra package) |
| `src/lib/tracking.ts` | TASK 9.1 | ✅ done | `getOrCreateTrackingIds()` — đọc/tạo `aos_uid` (365d) + `aos_sid` (30m), httpOnly/sameSite=lax, secure in prod; Route Handler/Action only |
| `src/lib/seo.ts` | TASK 10.1 | ✅ done | `buildOutfitCanonicalUrl()` + `generateOutfitMetadata()` — title/description/canonical/OG/robots cho outfit detail |
| `src/lib/slug.ts` | TASK 7.3 | ✅ done | `generateSlug()` — NFD normalize + strip diacritics + handle đ; `isValidSlug()` — format validation |
| `src/lib/outfit-code.ts` | TASK 7.1 | ✅ done | `generateOutfitCode()` — 6-char unique code, alphabet loại bỏ 0/O/1/I, DB unique check + 10 retries |
| `src/lib/ip-hash.ts` | TASK 9.1 | ✅ done | `hashIp(ip)` — HMAC-SHA256 với `TRACKING_IP_HASH_SECRET` (fallback SHA256 nếu không có secret) |
| `src/lib/utils.ts` | — | done | `cn()` (shadcn/ui), `getProductDisplayImage()` — shared display image helper (mockupImageUrl ?? imageUrl) |
| `src/lib/__tests__/permissions.test.mts` | TASK 12.2 | ✅ done | 17 unit tests cho `hasPermission`, `requirePermission`, `getProductScope`, `getOutfitScope`, `getAnalyticsScope`, `ForbiddenError` — mock prisma, test theo 04-permission-matrix.md |

---

## 6. Server Modules

| Folder / File | Task | Status | Mô tả |
|---|---|---|---|
| `src/server/auth/auth.service.ts` | TASK 3.1 | ✅ done | `loginUser`, `getUserById`, `SafeUser` type — không expose passwordHash |
| `src/server/products/product.mapper.ts` | TASK 4.3 | ✅ done | `mapApiItemToProductUpsertData()` — map MyCollection API item → `ProductUpsertData` cho Prisma upsert |
| `src/server/products/product.repository.ts` | TASK 4.3 | ✅ done | `upsertProductFromSource()` — upsert theo unique (urlSuffix, externalLinkId), preserve mockupImageUrl/productDna |
| `src/server/products/product.service.ts` | TASK 6.1–6.2 | ✅ done | `listProducts()`, `getDistinctUrlSuffixes()`, `getProductById()`, `updateProductFields()`, `listProductsForPicker()` — filter/scope/pagination/edit/picker search |
| `src/server/outfits/outfit.service.ts` | TASK 7.2–7.4, 8.1–8.2, 10.2, 10.4 | ✅ done | `listOutfits()`, `getDistinctStyles()`, `getDistinctOutfitTypes()`; `createOutfit()`, `getOutfitById()`, `updateOutfitFields()`; `getOutfitProducts()`, `addProductToOutfit()`, `removeProductFromOutfit()`; `listPublicOutfits()`; `getPublicOutfitDetail()`; `getActiveOutfitsForSitemap()`; `getRelatedOutfits()` — CRUD + scope + outfit_products + public listing + public detail + sitemap + related outfits |
| `src/server/sync/mycollection.client.ts` | TASK 4.1 | ✅ done | `fetchStorefrontGroupProductList()` — HTTP client gọi MyCollection GQL API, pagination + timeout + error handling |
| `src/server/sync/sync-products.service.ts` | TASK 4.4 | ✅ done | `syncProducts()` — full pipeline: lock check, pagination, upsert, mark missing, sync_logs |
| `src/server/sync/sync-log.service.ts` | TASK 11.3 | ✅ done | `listSyncLogs()` — query sync_logs với filter status/date, pagination; trả `ListSyncLogsResult` |
| `src/server/tracking/view-tracking.service.ts` | TASK 9.2 | ✅ done | `OutfitViewLogInput` type + `recordOutfitView()` — ghi row vào `outfit_view_logs` |
| `src/server/tracking/click-tracking.service.ts` | TASK 9.3 | ✅ done | `resolveClickRedirect()` validate outfit+product, `ClickLogInput` type, `recordClick()` — ghi `click_logs` |
| `src/server/tracking/anti-spam.service.ts` | TASK 9.4 | ✅ done | `AntiSpamInput`, `AntiSpamResult` types + `checkAntiSpam()` — manager preview / bot UA / duplicate click 30s / too many clicks per session |
| `src/server/analytics/analytics.service.ts` | TASK 11.1, 11.2 | ✅ done | `getAnalyticsOverview()`, `getTopOutfits()`, `getTopProducts()` — system-wide (view_all); `getAnalyticsOverviewOwn()`, `getTopOutfitsOwn()`, `getTopProductsOwn()` — scoped to user's outfits/assigned products (view_own) |
| `src/server/media/media.service.ts` | TASK 5.2 | ✅ done | `uploadMediaAsset()` — validate MIME/size, upload R2, save media_assets, update product.mockupImageUrl / outfit.coverImageUrl |

---

## 7. Components

| File | Task | Mô tả |
|---|---|---|
| `src/components/ui/` | — | shadcn/ui components (button, input, label, card, table, dialog, dropdown-menu, select, badge, tabs, textarea) |
| `src/components/public/OutfitCard.tsx` | TASK 8.1 / UI-2.1 | ✅ done — Card hiển thị outfit trong public list; 4:5 ratio, rounded-2xl, border, hover; link → `/outfit/{slug}-{code.toLowerCase()}`; optional style/type badges; missing image fallback |
| `src/components/public/ProductClickCard.tsx` | TASK 8.2 / UI-2.1 | ✅ done — Card sản phẩm: ảnh + tên → link `/go/{outfitCode}/{productId}`; rounded-2xl, border hover; lazy load; alt text per SEO spec; missing image fallback |
| `src/components/public/TrackOutfitView.tsx` | TASK 9.2 | ✅ done — Client Component: fire-and-forget POST `/api/tracking/outfit-view`; đọc referrer + UTM từ browser |
| `src/components/public/PublicHeader.tsx` | UI-2.1 | ✅ done — Client Component: sticky header 64px, logo left → home, nav right (Outfit link), active state dùng `usePathname` |
| `src/components/public/PublicFooter.tsx` | UI-2.1 | ✅ done — Server Component: footer nhẹ, site name + nav links + copyright |
| `src/components/public/OutfitGrid.tsx` | UI-2.1 | ✅ done — Server Component: responsive grid 2/3/4 columns (mobile/tablet/desktop), wrapper cho OutfitCard |
| `src/components/public/OutfitHero.tsx` | UI-2.1 | ✅ done — Server Component: breadcrumb nav + cover image (4:5, rounded-2xl) + title/code/badges/description cho outfit detail page |
| `src/components/public/SeoContentBlock.tsx` | UI-2.1 | ✅ done — Server Component: SEO text section (heading + body) dùng ở cuối list/detail page |
| `src/components/public/RelatedOutfits.tsx` | UI-2.1 | ✅ done — Server Component: section "Outfit liên quan", dùng OutfitGrid + OutfitCard, ẩn nếu rỗng |
| `src/app/(public)/layout.tsx` | UI-2.1 | ✅ done — Server Layout: wrap tất cả public pages với PublicHeader + PublicFooter |
| `src/components/manager/ManagerShell.tsx` | UI-3.1 | ✅ done — Server Component: shell wrapper bọc ManagerSidebar + ManagerTopbar + content, nhận `user` prop từ layout |
| `src/components/manager/ManagerSidebar.tsx` | UI-3.1 | ✅ done — Server Component: sidebar 240px, logo link → dashboard, ManagerNav, user info + LogoutButton |
| `src/components/manager/ManagerTopbar.tsx` | UI-3.1 | ✅ done — Server Component: topbar 56px, user avatar initial + name ở phải |
| `src/components/manager/PageHeader.tsx` | UI-3.1 | ✅ done — Server Component: title (text-2xl) + optional description + optional actions slot |
| `src/components/manager/StatusBadge.tsx` | UI-3.1 | ✅ done — Pure component: map status string → colored rounded-full badge; covers product/outfit/sync/user statuses từ constants |
| `src/components/manager/SearchFilterBar.tsx` | UI-3.1 | ✅ done — Server Component: flex-wrap layout wrapper cho search + filter inputs |
| `src/components/manager/EmptyState.tsx` | UI-3.1 | ✅ done — Server Component: empty data UI với icon placeholder, title, optional description + action slot |
| `src/components/manager/LoadingState.tsx` | UI-3.1 | ✅ done — Server Component: skeleton rows (animate-pulse), configurable `rows` prop |
| `src/components/manager/ConfirmDialog.tsx` | UI-3.1 | ✅ done — Client Component: controlled Dialog cho dangerous actions (hide/delete/inactive); variant danger → destructive button |
| `src/components/manager/ProductTable.tsx` | TASK 6.1–6.2 | ✅ done — Table hiển thị image/name(link→detail)/source/status/DNA/mockup/lastSynced |
| `src/components/manager/ProductFilters.tsx` | TASK 6.1 | ✅ done — Client Component: keyword search + urlSuffix + status filter, URL-based state |
| `src/components/manager/ProductEditForm.tsx` | TASK 6.2 | ✅ done — Client Component: DNA textarea, status radio, mockup upload — permission-gated |
| `src/components/manager/OutfitTable.tsx` | TASK 7.2 | ✅ done — Table hiển thị cover/name(link→detail)/code/status/productCount/publishedAt |
| `src/components/manager/OutfitFilters.tsx` | TASK 7.2 | ✅ done — Client Component: keyword search + status + style + type filter, URL-based state |
| `src/components/manager/OutfitForm.tsx` | TASK 7.3–7.4 | ✅ done — Client Component create/edit outfit — auto-slug, cover upload, style/type select, status gated by permissions |
| `src/components/manager/ProductPicker.tsx` | TASK 7.4 | ✅ done — Client Component: hiển thị danh sách products trong outfit + Dialog search/add product; canAdd/canRemove gated |
| `src/components/manager/AnalyticsDateFilter.tsx` | TASK 11.1 | ✅ done — Client Component: from/to date inputs, URL-based state, Apply button, useTransition |
| `src/components/manager/SyncLogFilters.tsx` | TASK 11.3 | ✅ done — Client Component: status select + date range form, URL-based state |
| `src/components/manager/PermissionGate.tsx` | TASK 3.2 | ✅ done — Async Server Component ẩn/hiện UI theo permission |
| `src/components/manager/LogoutButton.tsx` | TASK 3.3 | ✅ done — Client Component: POST /api/auth/logout → redirect login |
| `src/components/manager/ManagerNav.tsx` | TASK 3.3 | ✅ done — Client Component: sidebar nav với active state dùng usePathname |
| `src/app/manager/(protected)/layout.tsx` | TASK 3.3 / UI-3.1 | ✅ done — Async Server layout: requireAuth → truyền user vào ManagerShell |

---

## 8. Route Groups

| Group | Path | Mô tả |
|---|---|---|
| `(protected)` | `src/app/manager/(protected)/` | Tất cả manager pages yêu cầu auth (URL không đổi) |

Login page `/manager/login` nằm ngoài `(protected)` để tránh auth loop.

---

## 9. Middleware (Edge)

| File | Task | Status | Mô tả |
|---|---|---|---|
| `src/middleware.ts` | TASK 3.1 | ✅ done | Redirect `/manager/*` về `/manager/login` nếu không có session cookie (Edge-compatible) |

---

## 10. Database / Prisma

| File | Task | Status | Mô tả |
|---|---|---|---|
| `prisma/schema.prisma` | TASK 2.2 | ✅ done | Full MVP schema — 15 models, indexes, constraints, relations |
| `src/lib/db.ts` | TASK 2.2 | ✅ done | Prisma client singleton (globalThis pattern cho Next.js) |
| `prisma/seed.ts` | TASK 2.5 | ✅ done | Seed roles, permissions, role_permissions, admin user, styles, outfit_types, product_categories. `SEED_SAMPLE_DATA=true` → 8 sample products (dev only) |

---

## 11. Do Not Modify Without Approval

Các file/folder sau **không được sửa** nếu task hiện tại không yêu cầu:

```txt
src/constants/*.ts           — chỉ sửa khi có task về constants/roles/permissions
src/app/robots.ts            — ✅ done TASK 10.2
src/app/sitemap.ts           — ✅ done TASK 10.2
src/app/layout.tsx           — chỉ sửa khi có task về layout/SEO meta
affiliate-outfit-docs/*.md   — không sửa nội dung spec
rules.md                     — không sửa
coding-standards.md          — không sửa
prompt.md                    — không sửa
api-get-data.md              — không sửa
```

Không được thêm database schema, Prisma client, hoặc auth logic cho đến khi có task tương ứng (TASK 2.2, 2.3, 3.1).

---

## 12. Update Rule

Bắt buộc cập nhật file này khi:

- Thêm route mới (public, manager, API)
- Tạo service/repository/helper mới trong `src/server/` hoặc `src/lib/`
- Thêm constants mới vào `src/constants/`
- Di chuyển hoặc đổi tên folder/module quan trọng
- Tạo bảng database mới (cập nhật mục 8)

Không cần cập nhật khi:
- Thêm component UI nhỏ vào folder đã được map
- Sửa nội dung bên trong file đã được map rõ
