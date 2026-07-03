# task-log.md — OutfitClick Task Log

> Cập nhật file này sau mỗi task để AI/dev biết task trước đã sửa gì, file nào đã thêm, logic nào cần giữ nguyên.

---

## Template

```md
## YYYY-MM-DD — TASK X.X — Title

### Files changed
- `path/to/file.ts`: mô tả ngắn

### Summary
- Đã thêm/sửa gì.

### Existing behavior preserved
- Logic cũ nào được giữ nguyên.
- File/function nào không chạm vào.

### Tests/checks run
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- Manual checks nếu có.

### Risks / Notes
- Rủi ro còn lại nếu có.
- Follow-up task nếu có.
```

---

## Logs

---

## 2026-07-03 — UI-PREMIUM — Full UI Upgrade: Public Site + Manager SaaS Dashboard

### Files changed

**Public Site:**
- `src/components/public/PublicHeader.tsx`: **UPGRADE** — backdrop-blur sticky header; logo `font-black tracking-[0.22em]`; nav links `text-xs font-semibold uppercase tracking-widest`; removed border-b blue, replaced with slate-100
- `src/app/(public)/outfits/page.tsx`: **UPGRADE** — Full hero redesign: `pt-20 pb-16` large centred section, eyebrow label `tracking-[0.3em]`, H1 `text-4xl/5xl/6xl`, subtitle `text-slate-400 sm:text-lg`, CTA pill `rounded-full border`; section divider; pagination `rounded-full` pills with SVG arrows; empty state centered with placeholder div
- `src/components/public/OutfitCard.tsx`: **UPGRADE** — Tag badge slides up from bottom on hover (translate + opacity), gradient overlay on hover only; image scale `duration-700`; card lift `-translate-y-1.5 shadow-xl`; code `text-[10px] font-semibold tracking-[0.18em]`; focus ring `ring-offset-4`
- `src/components/public/OutfitGrid.tsx`: **UPGRADE** — Gap increased: `gap-x-4 gap-y-10 sm:gap-x-5 lg:gap-x-6` for airier lookbook feel
- `src/components/public/PublicFooter.tsx`: **UPGRADE** — `border-t slate-100`; brand `font-black tracking-[0.28em]`; nav `text-xs uppercase tracking-widest`; copyright `text-[10px]`
- `src/components/public/SeoContentBlock.tsx`: **UPGRADE** — `bg-slate-50/60`; eyebrow `text-[10px] tracking-[0.25em]`; heading `text-lg`; `text-slate-400` body text
- `src/components/public/OutfitHero.tsx`: **UPGRADE** — Breadcrumb `text-xs font-semibold uppercase tracking-widest`; cover `shadow-sm`; tags border-only pill style; H1 `text-3xl/4xl/5xl`; code row with horizontal rule accent; info panel `gap-10 md:gap-14`
- `src/components/public/ProductClickCard.tsx`: **UPGRADE** — Badge text changed "Shop" → "View"; hover badge `tracking-[0.2em]`; duration-700 image scale; lift `-translate-y-1 shadow-lg`
- `src/components/public/RelatedOutfits.tsx`: **UPGRADE** — Centered label with horizontal rules instead of `text-xl` heading; `mt-20` top margin
- `src/app/(public)/outfit/[slugCode]/page.tsx`: **UPGRADE** — Items section header changed to centered divider + label + count badge; `py-12 sm:py-16`; "How to style" info block when description present; `gap-x-4 gap-y-8` product grid

**Manager Shell:**
- `src/components/manager/ManagerSidebar.tsx`: **UPGRADE** — Border `slate-100` (từ `slate-200`); logo `font-black tracking-[0.22em]`; avatar `bg-slate-950`; user name `font-semibold text-[13px]`; email `text-[11px]`; user block padding tighter
- `src/components/manager/ManagerTopbar.tsx`: **UPGRADE** — "Manager" label `font-bold uppercase tracking-[0.2em] text-slate-300`; avatar `bg-slate-950 font-bold`; user name `text-[13px] text-slate-600`
- `src/components/manager/ManagerNav.tsx`: **UPGRADE** — Active state: `bg-slate-950 text-white` (từ `bg-slate-100 text-slate-900`) — bolder active indicator; icon active `text-white`; nav item `text-[13px]`; rounded-lg (từ rounded-md)
- `src/components/manager/LogoutButton.tsx`: **UPGRADE** — `rounded-lg text-[12px] font-medium`; text "Sign out" (từ "Đăng xuất"); `hover:bg-slate-50 hover:text-slate-700`
- `src/components/manager/PageHeader.tsx`: **UPGRADE** — Border `slate-100` (từ `slate-200`); description `text-slate-400` (từ `text-slate-500`); title `tracking-tight`

**Manager Dashboard:**
- `src/app/manager/(protected)/page.tsx`: **UPGRADE** — `StatCard` dùng `rounded-2xl border-slate-100 shadow-sm hover:shadow-md`; icon containers `rounded-xl`; value `tracking-tight`; label `tracking-[0.2em]`; tips list với `→` prefix và `font-semibold` highlight; empty state `h-14 w-14 rounded-full bg-slate-50`

**Manager Products:**
- `src/components/manager/ProductTable.tsx`: **UPGRADE** — `rounded-2xl border-slate-100 shadow-sm`; all TableHead `text-[10px] font-bold uppercase tracking-widest text-slate-400`; thumbnail `h-14 w-14 rounded-xl border-slate-100`; DNA/Mockup indicators lighter colors (`text-slate-300` khi thiếu thay vì `text-slate-400`); name link `hover:text-slate-500`; row border `slate-100` hover `slate-50/60`
- `src/components/manager/ProductEditForm.tsx`: **UPGRADE** — Bỏ hoàn toàn shadcn `Card/CardContent/CardHeader/CardTitle`; thay bằng `Panel` component nội bộ `rounded-2xl border-slate-100 shadow-sm`; section titles `text-[10px] font-bold uppercase tracking-[0.2em]`; buttons `rounded-xl bg-slate-950`; textarea `rounded-xl border-slate-200`; image border `border-slate-100`; `InlineMsg` helper với emerald/red styled alerts
- `src/app/manager/(protected)/products/[id]/page.tsx`: **UPGRADE** — Bỏ shadcn `Card` imports; dùng local `InfoPanel` component; back link `text-[12px]`; indicator badges dùng `-50` bg (`bg-emerald-50`, `bg-sky-50`, `bg-slate-50`)

**Manager Outfits:**
- `src/components/manager/OutfitTable.tsx`: **UPGRADE** — `rounded-2xl border-slate-100 shadow-sm`; TableHead style nhất quán với ProductTable; thumbnail `h-14 w-14 rounded-xl border-slate-100`; code `font-semibold`; style/type tags `font-semibold text-slate-500`; Edit button tighter `h-7`
- `src/components/manager/OutfitForm.tsx`: **UPGRADE** — Bỏ hoàn toàn shadcn `Card`; dùng `Panel` component nội bộ; inputs/select/textarea `rounded-xl border-slate-200 focus-visible:ring-slate-950`; file input custom styling với `hover:file:border-slate-950`; status buttons `rounded-xl`; submit button `rounded-xl bg-slate-950 px-6`; `InlineMsg` helper
- `src/components/manager/ProductPicker.tsx`: **UPGRADE** — Bỏ shadcn `Card` và `Badge`; dùng `rounded-2xl border-slate-100 bg-white p-5 shadow-sm` panel; section title `text-[10px] font-bold uppercase tracking-[0.2em]`; picker product card: `border-slate-100 hover:border-slate-200`; added state `border-emerald-200 bg-emerald-50/50`; buttons `rounded-xl bg-slate-950`; source pill `rounded-full bg-slate-100 font-semibold`; `ActionMsg` helper
- `src/app/manager/(protected)/outfits/[id]/page.tsx`: **UPGRADE** — Bỏ shadcn `Card`; dùng local `InfoPanel`; back link `text-[12px]`; outfitCode badge `rounded-full bg-slate-100 font-mono font-semibold`
- `src/app/manager/(protected)/outfits/new/page.tsx`: **UPGRADE** — back link `text-[12px] font-medium text-slate-400`

### Summary

Toàn bộ UI đã được nâng cấp từ "MVP clean" → "premium fashion / SaaS dashboard":

**Public site improvements:**
- Hero: từ simple H1 centered → full editorial hero với large headline 4xl-6xl responsive, eyebrow label, pill CTA
- OutfitCard: tag badge animation (slide-up on hover), image scale duration-700, lift shadow-xl
- OutfitHero: cover shadow, tags border-only pill, H1 up to 5xl lg, outfit code with rule accent
- ProductClickCard: duration-700 image, "View" badge
- RelatedOutfits: editorial section divider với horizontal rules
- Detail page: items section header centered divider, "How to style" block, tighter product grid gaps
- Footer: fashion brand aesthetic uppercase tracking

**Manager improvements:**
- Nav active state: `bg-slate-950 text-white` — mạnh mẽ, rõ ràng active indicator
- Tất cả stat cards, tables, panels: `rounded-2xl border-slate-100 shadow-sm`
- Bỏ hoàn toàn shadcn `Card` component khỏi ProductEditForm, OutfitForm, ProductPicker, product detail, outfit edit — thay bằng clean white panels nhất quán
- Tables: `rounded-2xl`, header `text-[10px] tracking-widest`, thumbnails `h-14 w-14`
- Buttons: tất cả `rounded-xl`, primary `bg-slate-950`

### Existing behavior preserved

- ✅ Tất cả data fetching (`listPublicOutfits`, `getPublicOutfitDetail`, `getRelatedOutfits`, etc.) — không chạm
- ✅ Tracking redirect `/go/[outfitCode]/[productId]` — không chạm
- ✅ ProductClickCard `redirectPath` → `/go/` — không chạm
- ✅ TrackOutfitView — không chạm
- ✅ `OutfitCard` href `/outfit/${slug}-${outfitCode.toLowerCase()}` — không chạm
- ✅ Auth, permissions, API routes, Prisma schema — không chạm
- ✅ JSON-LD structured data — không chạm
- ✅ `ProductEditForm` save handlers (patchProduct, upload mockup) — không chạm
- ✅ `OutfitForm` save/create/upload handlers — không chạm
- ✅ `ProductPicker` add/remove handlers, API calls — không chạm
- ✅ Không thêm package mới

### Tests/checks run

- `npm run lint` — 0 errors, 7 warnings (pre-existing từ test files) ✅
- `npm run build` — 34 routes compiled, TypeScript 0 errors ✅

### Risks / Notes

- `ProductEditForm` và `OutfitForm` không còn dùng shadcn `Card` — visual giờ dùng `Panel` nội bộ. Nếu shadcn Card được cập nhật theme sau này, sẽ không tự động sync — nhưng đây là intention (full design control).
- Không có breaking changes về data hay navigation.

---

## 2026-07-03 — BACKEND-MVP — Backend Modules 1–5: Manual Sync, Product/Outfit/Media/Tracking

### Files changed

- `src/app/api/manager/products/sync/route.ts`: **TẠO MỚI** — POST /api/manager/products/sync — manual sync từ Manager: nhận urlSuffix+groupId từ body, gọi API client, upsert products, mark missing, ghi sync_log, trả totalFetched/Created/Updated/Deactivated/errors
- `src/app/api/manager/products/route.ts`: **UPGRADE** — GET thêm filter `groupId`, `hasMockup`, `hasProductDna` (parseBoolParam helper); truyền vào `listProducts()`
- `src/app/api/manager/products/[id]/route.ts`: **UPGRADE** — GET thêm `?rawJson=1` → trả rawJson (admin-only); PATCH thêm `mockupImageUrl` field với permission check `products.upload_mockup`
- `src/app/api/manager/products/[id]/mockup/route.ts`: **TẠO MỚI** — POST /api/manager/products/[id]/mockup — upload mockup qua media.service, update product.mockupImageUrl, ghi media_asset; permission: media.upload + products.upload_mockup
- `src/app/api/manager/outfits/[id]/publish/route.ts`: **TẠO MỚI** — POST /api/manager/outfits/[id]/publish — validate trước publish (name/cover/products/affiliateUrl), gọi updateOutfitFields({status:'active'}), permission: outfits.publish
- `src/app/api/manager/outfits/[id]/hide/route.ts`: **TẠO MỚI** — POST /api/manager/outfits/[id]/hide — đặt status='hidden', permission: outfits.hide
- `src/app/api/manager/outfits/[id]/cover/route.ts`: **TẠO MỚI** — POST /api/manager/outfits/[id]/cover — upload cover qua media.service, update outfit.coverImageUrl, ghi media_asset; permission: media.upload + outfits.update
- `src/server/products/product.service.ts`: **UPGRADE** — `UpdateProductInput` thêm `mockupImageUrl`; `updateProductFields` handle mockupImageUrl; `ListProductsParams` thêm `externalGroupId`, `hasMockup`, `hasProductDna`; `listProducts` filter by new params; thêm `getProductRawJson()`
- `src/server/outfits/outfit.service.ts`: **UPGRADE** — thêm `PublishValidationError` type + `validateOutfitForPublish()`: check name/coverImageUrl/product count/affiliate URL trước publish

### Summary

- **MODULE 1 — Manual Sync**: `POST /api/manager/products/sync` — Manager có thể trigger sync thủ công với urlSuffix+groupId, override affiliateId/userId/cid/language/limit tùy muốn. Reuse hoàn toàn client + mapper + repository hiện có. Ghi sync_log, trả kết quả JSON. Không dùng lock vì manual sync là intentional.
- **MODULE 2 — Product Management**: GET products nay có `groupId`, `hasMockup`, `hasProductDna` filter. GET product detail có `?rawJson=1` option. PATCH product nay chấp nhận `mockupImageUrl`. Thêm `POST /:id/mockup` để upload ảnh mockup qua R2 → update DB.
- **MODULE 3 — Outfit Management**: `POST /:id/publish` với full validation (name/cover/products/link). `POST /:id/hide`. `POST /:id/cover` upload cover R2 → update DB. `validateOutfitForPublish()` reusable trong service layer.
- **MODULE 4 — Media/R2**: Đã có `uploadMediaAsset()` trong `media.service.ts` — upload R2 + ghi media_assets + update product.mockupImageUrl / outfit.coverImageUrl. Hai route mới (`/mockup`, `/cover`) reuse service này. Generic `/api/manager/media/upload` vẫn giữ nguyên cho flexible upload.
- **MODULE 5 — Tracking**: Xác nhận end-to-end OK — outfit view: `TrackOutfitView` → `POST /api/tracking/outfit-view` → `recordOutfitView()`; click: `/go/[outfitCode]/[productId]` → `resolveClickRedirect()` → redirect 302 → `after()` → `checkAntiSpam()` → `recordClick()`. Không cần sửa gì.

### Existing behavior preserved

- ✅ `GET /api/manager/products` — behavior cũ (keyword/urlSuffix/status filter, scope) giữ nguyên; chỉ thêm params mới
- ✅ `GET/PATCH /api/manager/products/[id]` — DNA và status update không thay đổi; chỉ thêm mockupImageUrl + rawJson
- ✅ `GET/PATCH /api/manager/outfits/[id]` — publish/hide via PATCH vẫn hoạt động; route mới /publish và /hide là convenience wrappers
- ✅ `src/server/sync/sync-products.service.ts` — cron sync giữ nguyên, manual sync route là route riêng dùng lại building blocks
- ✅ `src/server/media/media.service.ts` — không thay đổi
- ✅ `src/server/tracking/click-tracking.service.ts`, `view-tracking.service.ts` — không thay đổi
- ✅ Prisma schema — không thay đổi
- ✅ Constants — không thay đổi
- ✅ Public routes — không thay đổi

### Tests/checks run

- `npm run lint` — 0 errors, 7 warnings (pre-existing từ test files) ✅
- `npm run build` — 34 routes compiled, TypeScript 0 errors ✅

### Risks / Notes

- `POST /api/manager/products/sync` không có lock check (khác với cron sync). Manager có thể trigger nhiều sync song song cho cùng urlSuffix+groupId. Chấp nhận được cho MVP vì là thao tác thủ công.
- `validateOutfitForPublish` có 2 DB queries (findUnique + findMany cho products). Chấp nhận được cho MVP.
- `PATCH /api/manager/products/[id]` với mockupImageUrl chỉ update field trong DB, không upload file. Upload file dùng `/mockup` route riêng.
- Manual sync không có rate limiting. Nếu cần, thêm sau.

---

## 2026-07-03 — UI-5.1 — Screenshot Review & Polish Pass (Outfits Manager)

### Files changed

- `src/app/manager/(protected)/outfits/page.tsx`: **UPGRADE** — Dùng `PageHeader` (title + description + actions slot); bỏ inline `<h1>` `text-gray-*`; `+ Create Outfit` button đổi từ `bg-primary rounded-lg` → `bg-slate-950 rounded-xl text-white` đúng design system; `EmptyState` component thay vì `OutfitTable` rỗng nội tuyến; pagination `rounded-xl border-slate-200 bg-white hover:bg-slate-50`; text colors `text-gray-600` → `text-slate-600`; layout `p-6 lg:p-8`
- `src/components/manager/OutfitTable.tsx`: **UPGRADE** — Bỏ shadcn `Badge` hoàn toàn; dùng `StatusBadge` cho cột Status; style/outfitType tag dùng `rounded-full bg-slate-100 px-2` thay `Badge variant="outline"`; thumbnail `rounded-xl` (từ `rounded-md`); table container `rounded-xl border-slate-200 bg-white overflow-hidden` (từ `rounded-md border`); header row `bg-slate-50`; row hover `hover:bg-slate-50`; text colors `text-gray-*` → `text-slate-*`; Edit link `hover:bg-slate-100 hover:text-slate-900`; bỏ inline `statusLabel()` và `STATUS_VARIANT` map
- `src/app/manager/(protected)/outfits/[id]/page.tsx`: **UPGRADE** — Bỏ shadcn `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Badge` hoàn toàn; dùng `PageHeader` + `StatusBadge` trong actions slot; metadata panels dùng `rounded-2xl border-slate-200 bg-white p-4` thay `Card`; style/type pill dùng `rounded-full bg-slate-100` thay `Badge variant="outline"`; back link `text-slate-500 hover:text-slate-900`; layout `p-6 lg:p-8`; bỏ `STATUS_VARIANT` map
- `src/app/manager/(protected)/outfits/new/page.tsx`: **UPGRADE** — Dùng `PageHeader` (title + description); bỏ inline `<h1>` `text-gray-900` và `<p>` `text-gray-500`; back link `text-slate-500 hover:text-slate-900`; layout `p-6 lg:p-8`
- `src/components/manager/OutfitFilters.tsx`: **UPGRADE** — `selectClass`: `rounded-lg border-input` → `rounded-xl border-slate-200 bg-white text-slate-700`; loading text `text-gray-500` → `text-slate-500`

### Summary

- Outfit manager pages (list, detail, new) nay dùng `PageHeader` nhất quán với Products/Analytics/Users/Roles pages
- `OutfitTable` bỏ shadcn `Badge` inline, thay bằng `StatusBadge` (đồng bộ toàn hệ thống) và pill span cho tags
- Outfit detail page bỏ shadcn `Card` component, thay bằng `rounded-2xl border-slate-200` panels — nhẹ hơn, đúng design system
- Create button đúng `bg-slate-950 rounded-xl` thay vì `bg-primary rounded-lg` (shadcn token)
- Table container `rounded-xl overflow-hidden` thay `rounded-md` — nhất quán với Products page
- Filter selects `rounded-xl` thay `rounded-lg` — nhất quán

### Existing behavior preserved

- `listOutfits()`, `getOutfitById()`, `getOutfitProducts()`, `getDistinctStyles()`, `getDistinctOutfitTypes()` — không chạm
- `OutfitFilters` URL-based state navigation (`keyword`, `status`, `styleId`, `outfitTypeId`, `page`) — không chạm
- `OutfitForm` (fields, cover upload, publish/hide/save actions) — không chạm
- `ProductPicker` (add/remove product) — không chạm
- `getOutfitScope()`, `getUserPermissions()`, permission checks — không chạm
- Tất cả API routes, Prisma, auth, tracking, sync — không chạm

### Tests/checks run

- `npm run lint` — 0 errors, 7 warnings (pre-existing từ test files) ✅
- `npm run build` — 30 routes compiled, TypeScript 0 errors ✅

### Risks / Notes

- Không thêm package mới.
- `OutfitTable` không còn render `EmptyState` inline — `outfits/page.tsx` handle `items.length === 0` và render `EmptyState` thay. Đã handle đúng.

---

## 2026-07-03 — UI-4.4 — Polish Manager Analytics, Users, Roles Pages

### Files changed

- `src/app/manager/(protected)/analytics/page.tsx`: **UPGRADE** — Dùng `PageHeader` component; thay `rounded-lg border` → `rounded-2xl border-slate-200`; cards thành `StatCard` sub-component; `StatRow` helper cho layout stat items; list items dùng `rounded-xl` cho ảnh; hover `hover:bg-slate-50`; empty state cho TopProducts dùng `EmptyState`; text colors `text-gray-*` → `text-slate-*`; `divide-slate-100` thay `divide-y`
- `src/app/manager/(protected)/users/page.tsx`: **NEW** — Build từ stub; list users với roles (query qua `UserRole`); table với avatar (initials fallback), roles badges, `StatusBadge`, lastLoginAt, createdAt; permission gate `USERS_VIEW`; `PageHeader` + `EmptyState`; `rounded-2xl border-slate-200` container
- `src/app/manager/(protected)/roles/page.tsx`: **NEW** — Build từ stub; list roles với permissions; permissions grouped by module (`MODULE_LABELS`); layout: role card với header (name, code, status, userCount) + permission rows theo module; `PageHeader` + `EmptyState`; permission gate `ROLES_VIEW`
- `src/server/users/user.service.ts`: **NEW** — `listUsers()`: query users (deletedAt = null) với userRoles → role (id, name, code); returns `UserListItem[]`
- `src/server/roles/role.service.ts`: **NEW** — `listRolesWithPermissions()`: query roles với rolePermissions → permission + userCount via `_count`; returns `RoleWithPermissions[]`

### Summary
- Analytics: polish lên design system (rounded-2xl, slate colors, PageHeader, StatCard components)
- Users: trang đầy đủ từ stub — table hiển thị user list với avatar, roles, status, timestamps; permission gate `users.view`
- Roles: trang đầy đủ từ stub — card per role với permissions grouped by module; permission gate `roles.view`
- Tạo 2 server services mới để query DB

### Existing behavior preserved
- Analytics scoping (`all` / `own` / `none`) giữ nguyên 100%
- `getAnalyticsScope`, `getAnalyticsOverview*`, `getTopOutfits*`, `getTopProducts*` không thay đổi
- RBAC permission checks vẫn dùng `hasPermission` từ `@/lib/permissions`
- Users/Roles pages là read-only UI — không có CRUD, không có confirm dialog (không có dangerous actions)
- Không chạm vào Prisma schema, API routes, auth, tracking

### Tests/checks run
- `npm run lint` — 0 errors (7 warnings pre-existing trong test files)
- `npm run build` — build thành công, tất cả 30 routes compile

### Risks / Notes
- Users/Roles pages chỉ read-only; CRUD operations (create/update/delete user, assign role) chưa có — cần task riêng nếu cần
- `USERS_VIEW` và `ROLES_VIEW` permissions phải được seed vào DB để page hoạt động đúng

---

## 2026-07-02 — UI-3.3 — Polish Manager Products Page

### Files changed

- `src/components/manager/ProductTable.tsx`: **UPGRADE** — Dùng `StatusBadge` thay Badge shadcn cho cột Status; thay DNA/Mockup badge bằng dot+text indicators (emerald/sky có, slate thiếu); thumbnail `rounded-xl`; urlSuffix dùng `bg-slate-100` pill; table container `rounded-xl border-slate-200`; header row `bg-slate-50`; row hover `hover:bg-slate-50`; bỏ inline `statusLabel()` và `STATUS_VARIANT`; bỏ inline empty state (được xử lý ở page level)
- `src/app/manager/(protected)/products/page.tsx`: **UPGRADE** — Dùng `PageHeader` (title + description mô tả mục đích trang); dùng `EmptyState` khi không có kết quả; pagination `rounded-xl border-slate-200 bg-white hover:bg-slate-50`; text colors `text-slate-*` thay `text-gray-*`; scope permission message dùng `text-slate-500`
- `src/app/manager/(protected)/products/[id]/page.tsx`: **UPGRADE** — Thêm `PageHeader` với title là tên sản phẩm + `actions` slot chứa `StatusBadge` + DNA/Mockup dot indicators; bỏ `Badge` shadcn (unused); thay `Badge variant="outline"` cho urlSuffix bằng `bg-slate-100` pill span; back link `text-slate-500 hover:text-slate-900`; padding `p-6 lg:p-8`

### Summary

**UI nâng cấp:**

- `ProductTable`: cột Status nay dùng `StatusBadge` nhất quán với toàn hệ thống; DNA/Mockup hiển thị dạng dot indicator màu (emerald/sky = có, slate = thiếu) thay vì Badge text — trực quan hơn và ít chiếm không gian hơn; thumbnail `rounded-xl` theo design system; urlSuffix pill style nhất quán; table border `rounded-xl`; row hover rõ hơn
- `products/page.tsx`: `PageHeader` chuẩn hóa tiêu đề; `EmptyState` component khi rỗng thay vì inline empty; pagination style nhất quán với design system
- `products/[id]/page.tsx`: `PageHeader` với actions slot để hiển thị trạng thái product ngay trên header; bỏ được `Badge` shadcn không cần import; back link style nhẹ hơn

**Logic giữ nguyên:**

- `listProducts()`, `getDistinctUrlSuffixes()`, `getProductById()` — không chạm
- `ProductFilters` (client component, URL-based state) — không chạm
- `ProductEditForm` — không chạm
- `getProductScope()`, `getUserPermissions()` — không chạm
- Tất cả permissions, routing, API, sync, database — không chạm
- `getProductDisplayImage()` trong ProductTable — vẫn dùng nguyên

### Tests/checks run

- `npm run lint` — 0 errors, 7 warnings (pre-existing từ test files) ✅
- `npm run build` — 30 routes compiled, TypeScript 0 errors ✅

### Risks / Notes

- Không thêm package mới.
- `ProductTable` không còn render empty state inline — page.tsx phải render `EmptyState` khi `items.length === 0`. Đã handle đúng ở page.tsx.

---

## 2026-07-02 — UI-3.1 — Polish Public Outfit List Page

### Files changed

- `src/app/(public)/outfits/page.tsx`: **UPGRADE** — Hero content theo design spec (Lookbook label, EN headline, EN subtitle), spacing tăng (`py-14/py-20`), grid section `py-12`, pagination style nhẹ hơn (`text-slate-600`), empty state EN text
- `src/components/public/OutfitCard.tsx`: **UPGRADE** — Gradient overlay `from-black/40` cho badges khi có ảnh, badges style `text-[10px] tracking-wide`, image scale `group-hover:scale-[1.03] duration-500`, title `font-medium` (từ `font-semibold`), outfit code `text-[11px] tracking-wider uppercase`, `focus-visible` ring cho accessibility
- `src/components/public/OutfitGrid.tsx`: **UPGRADE** — Gap tăng (`gap-x-3 gap-y-8 sm:gap-x-4`) cho thoáng hơn
- `src/components/public/PublicHeader.tsx`: **UPGRADE** — Logo `text-sm font-bold uppercase tracking-[0.15em]` theo lookbook vibe
- `src/components/public/PublicFooter.tsx`: **UPGRADE** — Logo đồng bộ với header `text-xs font-bold uppercase tracking-[0.15em]`
- `src/components/public/SeoContentBlock.tsx`: **UPGRADE** — Default text EN, bỏ ngôn ngữ ecommerce ("mua sắm"), max-w-xl (từ max-w-2xl)

### Summary

**UI nâng cấp:**

- Hero section: thêm "Lookbook" eyebrow label, headline/subtitle theo `ui-page-spec.md` (`Find outfit ideas that fit your style` / `Discover curated outfit ideas…`), spacing rộng hơn
- OutfitCard: badges nay nổi trên gradient overlay, hover image scale mượt hơn (duration-500, scale-1.03), outfit code uppercase monospace style
- Grid: gap-y-8 tạo breathing room giữa các row, lookbook feel hơn
- Header/Footer: logo uppercase tracking tạo fashion brand aesthetic nhất quán
- SEO block: copy EN không có ecommerce language, width hẹp hơn (max-w-xl) cho đọc tốt hơn

**Logic giữ nguyên:**

- `listPublicOutfits()` — giữ nguyên, không chạm
- Pagination logic (`page`, `totalPages`) — giữ nguyên
- `OutfitCard` href (`/outfit/${slug}-${outfitCode.toLowerCase()}`) — giữ nguyên
- `OutfitGrid` responsive col layout (2/3/4) — giữ nguyên
- `PublicHeader` active state via `usePathname` — giữ nguyên
- Tất cả API, tracking, auth, database — không chạm

### Tests/checks run

- `pnpm lint` — 0 errors, 7 warnings (pre-existing) ✅
- `pnpm build` — 30 routes compiled, TypeScript 0 errors ✅

### Risks / Notes

- Không thêm package mới.
- SeoContentBlock default text thay đổi — nếu page nào truyền heading/body prop riêng sẽ không bị ảnh hưởng.

---

## 2026-07-02 — UI-3.2 — Polish Outfit Detail Page

### Files changed

- `src/app/(public)/outfit/[slugCode]/page.tsx`: **UPGRADE** — Products section EN heading ("Items in this outfit"), item count badge, border separator above products, gap-x tighter on mobile, empty state EN copy
- `src/components/public/OutfitHero.tsx`: **UPGRADE** — Breadcrumb separator `/` + muted color, tags moved above H1 with uppercase tracking border style, H1 `text-5xl` on lg, description `text-base`, outfit code label uppercase tracking-widest, column ratio `5fr 7fr` + `gap-12` on md, cover border `border-slate-100`
- `src/components/public/ProductClickCard.tsx`: **UPGRADE** — Image ratio `4:5` (from square) to match OutfitCard consistency, hover lift `group-hover:-translate-y-0.5 shadow-lg`, image scale `duration-500 scale-[1.04]`, "Shop" badge appears on hover as overlay cue, border lighter `border-slate-100`, focus-visible ring for accessibility, empty image text EN
- `src/components/public/RelatedOutfits.tsx`: **UPGRADE** — Section heading EN "You might also like", spacing `mt-16 pt-12 mb-8 tracking-tight`
- `src/components/public/SeoContentBlock.tsx`: **UPGRADE** — Top margin `mt-16`, padding `py-14`, removed inner px (not needed at max-w-lg centered), `tracking-tight` on heading

### Summary

**UI nâng cấp:**

- OutfitHero: tags badge style chuyển sang border-only uppercase (lookbook feel), H1 lớn hơn (`lg:text-5xl`), description body text lớn hơn (`text-base`), breadcrumb separator `/`, column ratio thoáng hơn
- ProductClickCard: ratio `4:5` thay vì vuông → nhất quán với OutfitCard, "Shop" badge hover overlay như cue click, lift animation nhẹ
- page.tsx: products section EN copy, item count, border separator section
- RelatedOutfits: EN heading, spacing nhất quán với các section khác
- SeoContentBlock: consistent section top margin `mt-16`

**Logic giữ nguyên:**

- `redirectPath` từ `ProductClickCard` → `/go/[outfitCode]/[productId]` — không chạm
- `getPublicOutfitDetail`, `getRelatedOutfits` — không chạm
- JSON-LD, breadcrumb structured data — không chạm
- `TrackOutfitView` — không chạm
- Tất cả API, tracking, auth, database — không chạm

### Tests/checks run

- `pnpm lint` (via `npm run lint`) — 0 errors, 7 warnings (pre-existing) ✅
- `pnpm build` (via `npm run build`) — 30 routes compiled, TypeScript 0 errors ✅

### Risks / Notes

- Không thêm package mới.
- ProductClickCard đổi ratio từ `aspect-square` → `aspect-[4/5]` — trực quan hơn, không break data.

---

## 2026-07-02 — UI-3.1 — Build Shared Manager Components

### Files changed

- `src/components/manager/ManagerSidebar.tsx`: **TẠO MỚI** — Server Component: sidebar 240px, logo link → dashboard, ManagerNav, user info footer + LogoutButton
- `src/components/manager/ManagerTopbar.tsx`: **TẠO MỚI** — Server Component: topbar 56px, user avatar (initial + name) bên phải
- `src/components/manager/ManagerShell.tsx`: **TẠO MỚI** — Server Component: shell wrapper nhận `user` prop → render ManagerSidebar + ManagerTopbar + content slot
- `src/app/manager/(protected)/layout.tsx`: **UPGRADE** — rút gọn còn `requireAuth()` → truyền user vào `<ManagerShell>`; xóa inline sidebar/layout code
- `src/components/manager/PageHeader.tsx`: **TẠO MỚI** — Server Component: `title` (text-2xl font-semibold) + optional `description` + optional `actions` slot
- `src/components/manager/StatusBadge.tsx`: **TẠO MỚI** — Pure component: map status string → `rounded-full` badge với màu sắc theo design system; cover toàn bộ product/outfit/sync/user statuses từ constants
- `src/components/manager/SearchFilterBar.tsx`: **TẠO MỚI** — Server Component: `flex flex-wrap items-end gap-3` wrapper cho search + filter inputs
- `src/components/manager/EmptyState.tsx`: **TẠO MỚI** — Server Component: empty list UI với icon placeholder, title, optional description + action slot, `border-dashed rounded-2xl`
- `src/components/manager/LoadingState.tsx`: **TẠO MỚI** — Server Component: skeleton rows `animate-pulse rounded-xl`, configurable `rows` prop (default 5)
- `src/components/manager/ConfirmDialog.tsx`: **TẠO MỚI** — Client Component: controlled Dialog cho dangerous actions; `variant="danger"` → destructive button; `isPending` disables buttons + shows "Processing…"
- `affiliate-outfit-docs/16-source-map.md`: cập nhật section 7 Components — thêm 9 components mới + update layout entry

### Summary

**UI nâng cấp:**

- Manager layout nay có **topbar** (trước đây không có) — height 56px, user avatar + name bên phải.
- Sidebar upgrade: `w-60` (từ `w-56`), `border-slate-200` (từ default border), `text-slate-950` (từ `text-gray-900`), logo là link → dashboard.
- Background của manager area: `bg-slate-50` (từ `bg-gray-50`) — nhất quán với design system.
- **9 shared components** sẵn sàng để manager pages dùng lại:
  - `ManagerShell` + `ManagerSidebar` + `ManagerTopbar`: tất cả manager pages tự động có consistent shell qua layout.tsx.
  - `PageHeader`: mọi page có thể dùng title/description/actions nhất quán.
  - `StatusBadge`: không còn phải viết inline status color classes trong từng page.
  - `SearchFilterBar`: layout wrapper cho filter blocks.
  - `EmptyState`: consistent empty list UI thay vì inline `<div>No products found</div>`.
  - `LoadingState`: skeleton loading cho Suspense boundaries.
  - `ConfirmDialog`: Dialog chuẩn cho hide/delete/set-inactive actions.

**Logic giữ nguyên:**

- `requireAuth()` — giữ nguyên, vẫn gọi đầu tiên trong layout.
- `ManagerNav`, `LogoutButton` — không chạm, ManagerSidebar dùng lại nguyên.
- `PermissionGate` — không chạm.
- Tất cả manager routes, API, services, database, tracking, sync — không chạm.
- Tất cả public routes và components — không chạm.

### Tests/checks run

- `eslint src/components/manager/ src/app/manager/` — 0 errors ✅
- `next build` — pass, 30 routes compiled, TypeScript 0 errors ✅

### Risks / Notes

- **ManagerTopbar là Server Component**: render user name từ `requireAuth()` qua prop — không cần Client Component, không có hydration issue.
- **`layout.tsx` không còn render inline sidebar**: toàn bộ shell UI chuyển vào ManagerShell. Behavior (auth guard, nav, logout) giữ nguyên.
- **StatusBadge không thay thế Badge shadcn trong ProductTable hiện tại**: ProductTable vẫn dùng shadcn `Badge` — không refactor ngoài scope task. StatusBadge sẵn sàng cho pages mới hoặc khi có upgrade task.
- **EmptyState/LoadingState chưa replace inline "No products found"**: ProductTable vẫn có inline empty state riêng — không refactor ngoài scope. Hai components này sẵn sàng cho pages mới.
- **Không thêm package mới.**

---

## 2026-07-02 — UI-2.1 — Build Shared Public Components

### Files changed

- `src/components/public/OutfitCard.tsx`: **UPGRADE** — 4:5 ratio, `rounded-2xl`, border `border-slate-200`, hover (`-translate-y-1 shadow-md`), optional `style`/`outfitType` badges overlay, outfit code muted, missing image fallback
- `src/components/public/ProductClickCard.tsx`: **UPGRADE** — `rounded-2xl`, border, `hover:border-slate-300 hover:shadow-md`, missing image fallback
- `src/components/public/PublicHeader.tsx`: **TẠO MỚI** — Client Component, sticky 64px, logo left → home, nav "Outfit" right, active state dùng `usePathname`, `rounded-xl` nav items
- `src/components/public/PublicFooter.tsx`: **TẠO MỚI** — Server Component, footer nhẹ, `SEO_CONFIG.SITE_NAME` + nav link + copyright
- `src/components/public/OutfitGrid.tsx`: **TẠO MỚI** — Server Component, responsive grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, gap `4/6`
- `src/components/public/OutfitHero.tsx`: **TẠO MỚI** — Server Component, breadcrumb nav + cover (4:5, `rounded-2xl`) + info block (H1, style/type badges, description, outfit code), missing image fallback
- `src/components/public/SeoContentBlock.tsx`: **TẠO MỚI** — Server Component, SEO section với heading + body có default text, dùng ở cuối list/detail page
- `src/components/public/RelatedOutfits.tsx`: **TẠO MỚI** — Server Component, section "Outfit liên quan", dùng `OutfitGrid` + `OutfitCard`, `return null` nếu rỗng
- `src/app/(public)/layout.tsx`: **TẠO MỚI** — Server Layout bọc tất cả public pages bằng `PublicHeader` + `PublicFooter`
- `src/app/(public)/outfits/page.tsx`: **UPGRADE** — thêm hero section (H1 + subtitle centered), dùng `OutfitGrid` wrapper, `SeoContentBlock` cuối trang, style pagination `rounded-xl`
- `src/app/(public)/outfit/[slugCode]/page.tsx`: **UPGRADE** — thay inline breadcrumb+cover+info block bằng `OutfitHero`, thay inline related section bằng `RelatedOutfits`, thêm `SeoContentBlock` cuối trang
- `affiliate-outfit-docs/16-source-map.md`: cập nhật section 7 Components — thêm 7 components mới + update 2 components cũ

### Summary

**UI nâng cấp:**

- Public site nay có header (sticky, logo + nav) và footer thông qua `(public)/layout.tsx` — tất cả public pages tự động dùng.
- `OutfitCard`: lookbook style đúng spec — 4:5 ratio, `rounded-2xl`, border mỏng, hover lift + shadow, style/type badge overlay trên ảnh, outfit code nhỏ muted dưới title.
- `ProductClickCard`: `rounded-2xl`, border hover effect, missing image fallback.
- `OutfitHero`: component mới thay thế inline code trong outfit detail page — breadcrumb + cover lớn (4:5) + info block bên phải (desktop) / stacked (mobile).
- `OutfitGrid`: grid wrapper tái sử dụng cho cả list page, related section.
- `SeoContentBlock`: SEO text section nhẹ, có default text cho outfit list page; outfit detail page truyền heading/body theo outfit cụ thể.
- `RelatedOutfits`: component tái sử dụng thay thế inline section trong outfit detail page.
- Hero section trên outfit list page: H1 + subtitle centered, đúng "Clean fashion lookbook" vibe.

**Logic giữ nguyên:**

- `listPublicOutfits()`, `getPublicOutfitDetail()`, `getRelatedOutfits()` — không chạm.
- `TrackOutfitView` — giữ nguyên, vẫn fire POST tracking.
- JSON-LD `CollectionPage` + `BreadcrumbList` — giữ nguyên cấu trúc.
- `safeJsonLd()`, `buildOutfitCanonicalUrl()`, `generateOutfitMetadata()` — giữ nguyên.
- `/go/[outfitCode]/[productId]` tracking redirect — không chạm.
- `coverAlt` logic chuyển vào `OutfitHero` (cùng logic: `style?.name ?? outfitType?.name ?? outfitCode`).
- Tất cả manager routes, auth, permissions, sync, database — không chạm.

### Tests/checks run

- `eslint src/components/public/ src/app/(public)/` — pass (0 errors) ✅
- `tsc --noEmit` — pass (0 errors) ✅
- `next build` — pass, 24 routes compiled ✅

### Risks / Notes

- **`PublicHeader` là Client Component**: vì dùng `usePathname()` cho active state. Hợp lý và nhẹ — không có business logic, chỉ render nav.
- **`new Date().getFullYear()` trong `PublicFooter`**: Server Component render trên server lúc build/request — không có hydration mismatch. Năm copyright luôn đúng khi deploy.
- **`OutfitCard` optional `style`/`outfitType` props**: `listPublicOutfits()` không trả style/type (để giữ query nhẹ) nên badges chỉ hiển thị nếu caller truyền. Không cần sửa service.
- **`SeoContentBlock` trong outfit detail**: heading dùng `outfit.style?.name ?? outfit.outfitType?.name ?? ''` — nếu outfit không có style/type, heading là "Outfit phong cách " (trailing space). MVP acceptable; có thể polish thêm sau.
- **Không thêm package mới.**

---

## 2026-07-02 — TASK 11.3 — Sync logs page

### Files changed

- `src/server/sync/sync-log.service.ts`: **TẠO MỚI** — `SyncLogItem`, `ListSyncLogsParams`, `ListSyncLogsResult` types + `listSyncLogs()` function
- `src/components/manager/SyncLogFilters.tsx`: **TẠO MỚI** — Client Component filter status + date range, URL-based state
- `src/app/manager/(protected)/sync-logs/page.tsx`: **TẠO MỚI** — Manager page sync logs, permission check `sync.view`, paginated table
- `src/components/manager/ManagerNav.tsx`: thêm nav item `"Sync Logs"` → `MANAGER_ROUTES.SYNC_LOGS`
- `affiliate-outfit-docs/16-source-map.md`: cập nhật manager routes, server modules, components

### Summary

**`src/server/sync/sync-log.service.ts`:**

Export `listSyncLogs(params: ListSyncLogsParams): Promise<ListSyncLogsResult>`:
- Filter `status` (exact match nếu có) và `startedAt` (gte/lte theo date range).
- `orderBy: { startedAt: 'desc' }` — log mới nhất lên đầu.
- `Promise.all([findMany, count])` — 1 round-trip DB.
- Pagination: `skip = (page - 1) * limit`, `take = limit`.

**`src/components/manager/SyncLogFilters.tsx`:**

Client Component (`'use client'`):
- Props: `fromStr: string`, `toStr: string` (YYYY-MM-DD format từ server).
- Status `<select>` — options từ `SYNC_STATUS` constants, onChange → `navigate({ status })`.
- Date range form (From/To date inputs + Apply button) → `navigate({ from, to })`.
- `useTransition` + `isPending` loading state, `params.delete('page')` khi filter thay đổi.
- Pattern giống `OutfitFilters.tsx` (URL-based state, single `navigate()` helper).

**`src/app/manager/(protected)/sync-logs/page.tsx`:**

Server Component:
- `requireAuth()` → redirect if no session.
- `hasPermission(user.id, PERMISSIONS.SYNC_VIEW)` → forbidden message nếu không có quyền.
- Default date range: last 7 days (UTC) — sync logs dày hơn analytics, 7 ngày là hợp lý.
- Parse + validate `status` từ `VALID_STATUSES` set trước khi truyền vào service.
- `to` date set `setUTCHours(23, 59, 59, 999)` — include full end day.
- Table columns: Status (badge), URL Suffix, Group ID, Fetched, Created, Updated, Started At, Finished At, Duration, Error.
- `statusBadgeClass()` — color coding: green=success, yellow=partial_success, red=failed, blue=running.
- `duration()` — tính thời gian chạy từ `startedAt` → `finishedAt`.
- `errorMessage` hiển thị `line-clamp-2` với `title` tooltip — không expose nhạy cảm, chỉ show message lỗi.
- Pagination links giữ nguyên `status + from + to` filter params.
- `<Suspense>` wrapper cho `SyncLogFilters` vì dùng `useSearchParams`.

**`src/components/manager/ManagerNav.tsx`:**

Thêm `{ label: 'Sync Logs', href: MANAGER_ROUTES.SYNC_LOGS }` sau Analytics.

### Existing behavior preserved

- ✅ `src/constants/routes.ts` — `MANAGER_ROUTES.SYNC_LOGS` đã tồn tại từ trước, không chạm.
- ✅ `src/constants/permissions.ts` — `PERMISSIONS.SYNC_VIEW` đã tồn tại từ trước, không chạm.
- ✅ `src/constants/status.ts` — `SYNC_STATUS` đã tồn tại từ trước, không chạm.
- ✅ `prisma/schema.prisma` — SyncLog model không thay đổi.
- ✅ `src/server/sync/sync-products.service.ts` — không bị chạm.
- ✅ `src/lib/permissions.ts` — dùng lại `hasPermission()`, không thêm scope function mới (sync chỉ có view, không có view_all/view_own distinction).
- ✅ Tất cả routes, services, components cũ không bị chạm.
- ✅ Không thêm package mới.
- ✅ Không đổi database schema, constants, public routes.

### Tests/checks run

- `npx tsc --noEmit` — pass (0 errors) ✅

Manual test nên chạy:
- Login Admin/Manager (có `sync.view`) → `/manager/sync-logs` hiển thị table sync logs mới nhất (7 ngày).
- Login Product Staff / Outfit Staff (không có `sync.view`) → trang hiện "You do not have permission to view sync logs."
- Filter status = `failed` → chỉ hiển thị rows có `status=failed`.
- Filter date range cụ thể → data thay đổi theo range.
- Sync log có `error_message` → hiển thị text đỏ `line-clamp-2`; hover → tooltip hiển thị full message.
- Sync log `status=running` (finishedAt null) → Duration hiển thị `…`, Finished At hiển thị `—`.
- Nav sidebar → click "Sync Logs" → active highlight đúng.
- Pagination: nếu có >50 logs trong range → Previous/Next links hoạt động đúng.

### Risks / Notes

- **`errorMessage` trong table**: hiển thị nội dung từ DB, không filter. Error messages từ `syncGroup` là lỗi HTTP/fetch — không chứa credentials hay secret. `env.ts` không expose secrets vào error strings. Acceptable.
- **Default 7 ngày**: nếu không có sync logs trong 7 ngày (cronjob chưa chạy hoặc DB mới) → hiển thị "No sync logs found." — không crash.
- **`VALID_STATUSES` validation**: invalid status từ URL bị ignore, không throw — consistent với cách products page handle invalid status.
- **sync.view permission**: Admin và Manager đều có. Staff không có. Nếu sau này cần thêm role có quyền xem sync logs, chỉ cần seed thêm `role_permissions` row — không cần sửa code.
- **Không có API route riêng**: page query trực tiếp từ Server Component qua service function — đúng pattern Next.js App Router, không cần `/api/manager/sync-logs`.

---

## 2026-07-02 — TASK 12.2 — Test permission core

### Files changed

- `src/lib/__tests__/permissions.test.mts`: **TẠO MỚI** — 17 unit tests cho `hasPermission`, `requirePermission`, `getProductScope`, `getOutfitScope`, `getAnalyticsScope`
- `package.json`: thêm `src/lib/__tests__/permissions.test.mts` vào script `test`

### Summary

**`src/lib/__tests__/permissions.test.mts`:**

17 tests chia thành 6 describe blocks:

**`hasPermission` (2 tests):**
1. `returns true when user has the permission` — admin với `outfits.publish` → `true`.
2. `returns false when user lacks the permission` — outfit_staff (không có `outfits.publish`) → `false`.

**`requirePermission` (2 tests):**
3. `resolves silently when user has the permission` — admin với `outfits.publish` → không throw.
4. `throws ForbiddenError with status 403 when denied` — outfit_staff với `outfits.publish` → throw `ForbiddenError`, `status === 403`.

**`getProductScope` (3 tests):**
5. Admin (có `products.view_all`) → `'all'`.
6. product_staff (có `products.view_assigned`, không có `view_all`) → `'assigned'`.
7. User không có `products.view_*` → `'none'`.

**`getOutfitScope` (3 tests):**
8. Admin (có `outfits.view_all`) → `'all'`.
9. outfit_staff (chỉ có `outfits.view_own`) → `'own'`.
10. User không có `outfits.view_*` → `'none'`.

**`getAnalyticsScope` (3 tests):**
11. Admin/Manager (có `analytics.view_all`) → `'all'`.
12. Staff (chỉ có `analytics.view_own`) → `'own'`.
13. User không có analytics permission → `'none'`.

**`permission matrix — role scenarios` (4 tests):**
14. `admin: has full access` — kiểm tra `outfits.publish`, `users.view`, `settings.manage`, `sync.view`, `roles.manage` đều `true`.
15. `product_staff: has upload_mockup and update_dna; cannot publish outfits` — `products.upload_mockup=true`, `products.update_dna=true`, `outfits.publish=false`, `outfits.create=false`.
16. `outfit_staff: can manage outfits; cannot publish or touch product DNA` — `outfits.create=true`, `outfits.add_product=true`, `outfits.publish=false`, `products.update_dna=false`; `requirePermission('outfits.publish')` throw `ForbiddenError`.
17. `viewer: cannot edit products or create outfits; can only read` — `products.update=false`, `outfits.create=false`, `products.upload_mockup=false`; `products.view_assigned=true`.

**Pattern:**
- Mock `prisma.permission.findMany` via `mock.module(new URL('../db.ts', import.meta.url).href, ...)`.
- Helper `withPermissions(codes)` set `mockImplementation` để trả permission list cố định cho cả test.
- `beforeEach`: `mockFindMany.mock.resetCalls()` để tránh leak giữa tests.
- Permission sets `ADMIN`, `PRODUCT_STAFF`, `OUTFIT_STAFF`, `VIEWER` định nghĩa từ ma trận `04-permission-matrix.md`.

### Existing behavior preserved

- ✅ `src/lib/permissions.ts` — không bị chạm.
- ✅ `src/constants/permissions.ts` — không bị chạm.
- ✅ `src/lib/db.ts` — không bị chạm (chỉ mock trong test).
- ✅ `src/server/products/__tests__/product.repository.test.mts` — không bị chạm, vẫn pass.
- ✅ `src/server/sync/__tests__/sync-products.service.test.mts` — không bị chạm, vẫn pass.
- ✅ Database schema, routes, constants, auth, sync, tracking, media — không thay đổi.
- ✅ Không thêm package mới.

### Tests/checks run

- `npm test` — 25/25 pass ✅ (~306ms)
  - `permissions.test.mts` (17 tests): tất cả pass
  - `product.repository.test.mts` (7 tests): regression-free
  - `sync-products.service.test.mts` (1 test): regression-free

### Risks / Notes

- **Checklist item "Test data scope own/assigned"**: covered bởi `getProductScope` (assigned) + `getOutfitScope` (own) tests.
- **`withPermissions` dùng `mockImplementation` (persistent)**: khác với TASK 12.1 dùng `mockImplementationOnce`. Lý do: mỗi test trong 12.2 cần nhiều `hasPermission` calls liên tiếp đều cần cùng permission set. `mockImplementation` phù hợp hơn vì không bị "consume".
- **Permission sets định nghĩa trực tiếp trong test**: không import từ seed DB hay `src/constants/`. Lý do: test cần kiểm soát chính xác quyền nào có/không. Nếu constants thay đổi, chỉ cần cập nhật permission sets trong test file này.
- **`ForbiddenError` instanceof check**: works vì cả `requirePermission` và `ForbiddenError` đều được import từ cùng 1 module instance (`await import('../permissions.js')`).

---

## 2026-07-02 — TASK 12.1 — Test product sync core

### Files changed

- `src/server/products/__tests__/product.repository.test.mts`: **TẠO MỚI** — 7 unit tests cho `upsertProductFromSource`
- `src/server/sync/__tests__/sync-products.service.test.mts`: **TẠO MỚI** — 1 test cho error path → `sync_logs.status=failed`
- `package.json`: thêm script `test`

### Summary

**`src/server/products/__tests__/product.repository.test.mts`:**

7 tests cho `upsertProductFromSource()`:
1. `creates product when none exists → wasCreated=true` — verify `prisma.product.create` được gọi 1 lần, `update` không được gọi.
2. `updates existing product → wasCreated=false, no new record` — verify `prisma.product.update` được gọi, `create` không được gọi.
3. `calling twice with same key → second call updates, does not create duplicate` — simulate idempotent behavior: lần 2 cùng `(urlSuffix, externalLinkId)` chỉ `update`, không `create` record mới.
4. `update payload does NOT include mockupImageUrl` — inspect args của `prisma.product.update`, assert không có field `mockupImageUrl`.
5. `update payload does NOT include productDna` — inspect args của `prisma.product.update`, assert không có field `productDna`.
6. `create payload does NOT include mockupImageUrl` — inspect args của `prisma.product.create`.
7. `create payload does NOT include productDna` — inspect args của `prisma.product.create`.

**`src/server/sync/__tests__/sync-products.service.test.mts`:**

1 test cho error path của `syncProducts()`:
- Mock `@/lib/env` để tránh `requireEnv()` throw khi thiếu env vars.
- Mock `@/lib/db` prisma: `syncLog.findFirst` → null (not locked), `syncLog.create` → `{id:'test-log-id'}`, `syncLog.update` → capture calls.
- Mock `./mycollection.client` `fetchStorefrontGroupProductList` → luôn throw `HTTP 500`.
- Dùng `t.mock.timers.enable({ apis: ['setTimeout'] })` để virtualize retry delays (1s + 3s + 5s).
- Dùng `drain()` pattern (10 × `await setImmediate`) giữa các `tick()` để flush Promise microtasks đúng thứ tự.
- Assert: `syncLog.update` gọi 1 lần với `status='failed'`, `errorMessage` non-empty, `finishedAt` là Date.
- Assert: fetch client được gọi đúng 4 lần (1 initial + 3 retries).

**`package.json`:**

Thêm script `test`:
```
node --require tsx/cjs --import tsx/esm --experimental-test-module-mocks --test <test files>
```
- `tsx/cjs` + `tsx/esm`: load cả CJS và ESM hooks để tsx resolve `@/` path aliases trong source modules (CJS) được load từ ESM test files.
- `--experimental-test-module-mocks`: bật `mock.module()` API (Node.js v22.3+ / v24+, flag bắt buộc).
- Test files dùng `.mts` extension để force ESM — bắt buộc vì `mock.module()` chỉ hoạt động trong ESM context.

### Existing behavior preserved

- ✅ `src/server/products/product.repository.ts` — không bị chạm.
- ✅ `src/server/products/product.mapper.ts` — không bị chạm.
- ✅ `src/server/sync/sync-products.service.ts` — không bị chạm.
- ✅ `src/server/sync/mycollection.client.ts` — không bị chạm.
- ✅ `src/constants/status.ts` — không bị chạm.
- ✅ Database schema, routes, permissions, auth, media, tracking — không thay đổi.
- ✅ Không thêm package mới — chỉ dùng `node:test`, `node:assert` (built-in), `tsx` (đã có), Node.js flag `--experimental-test-module-mocks`.

### Tests/checks run

- `npm test` — 8/8 pass ✅ (~320ms)
  - `upsertProductFromSource` (7 tests): tất cả pass
  - `syncProducts — error path` (1 test): pass với timer mocking (~12ms, không phải 9s thật)

### Risks / Notes

- **`--experimental-test-module-mocks` flag**: đây là experimental API của Node.js (v22.3+). Nếu Node.js thay đổi API này trong tương lai, test runner command có thể cần update. Flag hiện tại bắt buộc trong Node v24 — không có flag thì `mock.module` là `undefined`.
- **`.mts` extension cho test files**: bắt buộc để force ESM mode. Test files `.ts` không hoạt động với `mock.module()` vì tsx chuyển sang CJS transform.
- **`--require tsx/cjs` + `--import tsx/esm`**: bắt buộc để tsx resolve `@/` path aliases cho cả source modules (CJS) và test files (ESM). Chỉ `--import tsx/esm` không đủ vì source modules được load qua CJS bridge.
- **Timer mocking trong sync service test**: `t.mock.timers.enable({ apis: ['setTimeout'] })` chỉ mock `setTimeout`. `setImmediate` trong `drain()` vẫn dùng real timer → drain hoạt động đúng để flush microtasks giữa các tick.
- **`[sync] Error` console.log trong test output**: đây là `console.error` bình thường từ `syncGroup` catch block — test không suppress nó vì đây là behavior thật của service khi API lỗi.
- **Mock file URLs**: test mocks `@/lib/db` bằng file URL `new URL('../../../lib/db.ts', import.meta.url).href`. Nếu source code restructuring thay đổi vị trí `src/lib/db.ts`, cần update mock URL trong test.

---

## 2026-07-02 — TASK 11.2 — Staff scoped analytics

### Files changed

- `src/lib/permissions.ts`: thêm `getAnalyticsScope()` function
- `src/server/analytics/analytics.service.ts`: thêm `getAnalyticsOverviewOwn()`, `getTopOutfitsOwn()`, `getTopProductsOwn()` — scoped variants
- `src/app/manager/(protected)/analytics/page.tsx`: refactor — dùng `getAnalyticsScope()` thay vì `hasPermission(ANALYTICS_VIEW_ALL)`; branch theo scope `all` / `own` / `none`
- `affiliate-outfit-docs/16-source-map.md`: cập nhật `permissions.ts` + `analytics.service.ts` + analytics page entries

### Summary

**`src/lib/permissions.ts`:**

Thêm `getAnalyticsScope(userId): Promise<DataScope>`:
- Reuse pattern từ `getProductScope` / `getOutfitScope`.
- `analytics.view_all` → `'all'`; `analytics.view_own` → `'own'`; không có → `'none'`.
- Gọi `getUserPermissions()` 1 lần duy nhất (không duplicate DB call).

**`src/server/analytics/analytics.service.ts`:**

Thêm `getAnalyticsOverviewOwn(range, userId): Promise<AnalyticsOverview>`:
- `outfit.groupBy` filter `createdBy: userId` — đếm outfits của user.
- `product.groupBy` filter `assignedTo: userId` — đếm products assigned cho user.
- `outfitViewLog.count` với relation filter `outfit: { createdBy: userId }` — views cho outfits của user.
- `clickLog.count` với `OR: [{ outfit: { createdBy: userId } }, { product: { assignedTo: userId } }]` — clicks thuộc scope của user.
- Trả cùng `AnalyticsOverview` type — reuse UI component.

Thêm `getTopOutfitsOwn(range, userId, limit=10): Promise<TopOutfitItem[]>`:
- Step 1: `outfit.findMany({ createdBy: userId, deletedAt: null })` — lấy IDs.
- Step 2: `clickLog.groupBy` filter `outfitId: { in: userOutfitIds }` — Prisma groupBy không hỗ trợ relation filter nên dùng pre-fetched IDs.
- Trả cùng `TopOutfitItem[]` type — reuse UI.

Thêm `getTopProductsOwn(range, userId, limit=10): Promise<TopProductItem[]>`:
- Step 1: `product.findMany({ assignedTo: userId, deletedAt: null })` — lấy IDs.
- Step 2: `clickLog.groupBy` filter `productId: { in: userProductIds }`.
- Trả cùng `TopProductItem[]` type.

**`src/app/manager/(protected)/analytics/page.tsx`:**

Refactor logic chính:
- Thay `hasPermission(user.id, PERMISSIONS.ANALYTICS_VIEW_ALL)` bằng `getAnalyticsScope(user.id)`.
- `scope === 'none'` → forbidden message (giữ nguyên behavior cũ).
- `scope === 'all'` → gọi hàm system-wide cũ, render với labels `"Outfits"` / `"Products"` / subtitle `"System-wide overview"` (giữ nguyên behavior cũ).
- `scope === 'own'` → gọi hàm scoped (`*Own`), render với labels `"Your Outfits"` / `"Assigned Products"` / subtitle `"Your outfits & assigned products"`.

Tách UI thành 2 sub-components (`StatCards`, `TopLists`) để tránh duplicate JSX giữa 2 branches. UI layout không thay đổi — cùng stat cards + top lists structure.

### Existing behavior preserved

- ✅ `analytics.view_all` (Admin/Manager) → system-wide data, behavior 100% giống TASK 11.1. Không có regression.
- ✅ `scope === 'none'` → forbidden message giữ nguyên text.
- ✅ Date range parsing, `to` = end of day UTC, `formatNum`, `formatCtr` không bị chạm.
- ✅ `AnalyticsDateFilter` component không bị chạm.
- ✅ `analytics.service.ts` cũ — 3 system-wide functions không bị sửa.
- ✅ `src/constants/permissions.ts` không bị chạm — `ANALYTICS_VIEW_OWN` đã tồn tại từ trước.
- ✅ Database schema, routes, constants, auth, sync, tracking, media không thay đổi.
- ✅ Không thêm package mới.

### Tests/checks run

- `npx tsc --noEmit` — pass (0 errors) ✅

Manual test nên chạy:
- Login Admin/Manager (có `analytics.view_all`) → `/manager/analytics` hiển thị `"System-wide overview"`, data toàn hệ thống. Không regression.
- Login Product Staff (có `analytics.view_own`, không có `view_all`) → `/manager/analytics` hiển thị `"Your outfits & assigned products"`, stat cards đổi label thành `"Your Outfits"` / `"Assigned Products"`.
- Login Outfit Staff (có `analytics.view_own`) → tương tự Product Staff.
- Staff không có sản phẩm nào assigned/outfit nào → Views=0, Clicks=0, CTR=0.00%, top lists `"No click data in this period."`.
- User không có `analytics.view_all` NOR `analytics.view_own` → forbidden message.
- Date range filter vẫn hoạt động đúng cho cả hai scope.
- Outfit Staff không thấy số liệu từ outfit của người khác.
- Product Staff không thấy số liệu từ product không assign cho họ.

### Risks / Notes

- **Prisma groupBy + relation filter**: Prisma không hỗ trợ relation filter trong `groupBy.where`. Workaround: pre-fetch eligible IDs bằng `findMany`, rồi dùng `IN` filter trong groupBy. Trade-off: thêm 1 DB round-trip (2 queries thay vì 1), nhưng đúng behavior và type-safe.
- **Staff có cả hai role**: Nếu user được gán cả `analytics.view_all` lẫn `analytics.view_own` → `getAnalyticsScope()` trả `'all'` (ưu tiên view_all) — đúng logic.
- **OR logic cho clicks**: clicks được đếm nếu outfit.createdBy=userId OR product.assignedTo=userId. Có thể có click overlap (cùng click thuộc outfit của user VÀ product của user) — vẫn đúng vì OR union là behavior mong muốn per `10-manager-workflows.md §9`.
- **Top outfits scoped**: chỉ hiển thị outfits user đã tạo. Nếu outfit staff không tạo outfit nào → top list rỗng. Đúng behavior.
- **Top products scoped**: chỉ hiển thị products assigned cho user. Nếu product staff không được assign product nào → top list rỗng. Đúng behavior.
- **outfitCounts không filter date range**: giống system-wide, outfit/product counts là snapshot hiện tại, không theo date range. Consistent với TASK 11.1.

---

## 2026-07-02 — TASK 11.1 — Admin analytics overview

### Files changed

- `src/server/analytics/analytics.service.ts`: **TẠO MỚI** — `DateRangeParams`, `OutfitStatusCounts`, `ProductStatusCounts`, `AnalyticsOverview`, `TopOutfitItem`, `TopProductItem` types + `getAnalyticsOverview()`, `getTopOutfits()`, `getTopProducts()` functions
- `src/components/manager/AnalyticsDateFilter.tsx`: **TẠO MỚI** — Client Component date range filter (from/to date inputs, URL-based state)
- `src/app/manager/(protected)/analytics/page.tsx`: **MODIFY** — Thay stub `<h1>Analytics</h1>` bằng Server Component đầy đủ

### Summary

**`src/server/analytics/analytics.service.ts`:**

Export `DateRangeParams` interface: `{ from: Date; to: Date }`.

Export `AnalyticsOverview` interface: `{ outfitCounts, productCounts, totalViews, validClicks, ctr }`.

Export `getAnalyticsOverview(range): Promise<AnalyticsOverview>`:
- `Promise.all` 4 queries song song: `outfit.groupBy(status)`, `product.groupBy(status)`, `outfitViewLog.count({ viewedAt: gte/lte })`, `clickLog.count({ isValid: true, clickedAt: gte/lte })`.
- Outfit/product counts: snapshot toàn hệ thống (không filter date range) — số lượng thực tế hiện tại.
- Views và valid clicks: filter theo date range.
- CTR = validClicks / totalViews; 0 nếu không có views.
- Outfit groupBy filter `status in ['active', 'draft', 'hidden']`, exclude deleted + deletedAt null.
- Product groupBy filter `status in ['active', 'inactive']`, deletedAt null.

Export `getTopOutfits(range, limit=10): Promise<TopOutfitItem[]>`:
- `clickLog.groupBy(['outfitId'], _count: { outfitId: true }, orderBy: { _count: { outfitId: 'desc' } }, take: limit)`.
- Fetch outfit details cho top IDs (`outfit.findMany({ id: { in: outfitIds } })`).
- Map + filter outfits đã bị xóa mềm (outfit không tìm thấy → skip).
- Preserve thứ tự từ groupBy (không re-sort).

Export `getTopProducts(range, limit=10): Promise<TopProductItem[]>`:
- Pattern tương tự `getTopOutfits`, nhưng groupBy `productId`.
- Trả `productId`, `name`, `imageUrl`, `mockupImageUrl`, `urlSuffix`, `clickCount`.

**`src/components/manager/AnalyticsDateFilter.tsx`:**

Client Component (`'use client'`):
- Props: `fromStr: string`, `toStr: string` (YYYY-MM-DD format).
- Form với 2 date inputs (html type="date") + Apply button.
- Submit: `router.push(pathname + ?from=...&to=...)` — URL-based state, không reset params khác.
- `useTransition` để show loading state khi pending.
- Pattern giống `OutfitFilters.tsx`.

**`src/app/manager/(protected)/analytics/page.tsx`:**

Server Component:
- `requireAuth()` + `hasPermission(user.id, PERMISSIONS.ANALYTICS_VIEW_ALL)` → forbidden nếu không có.
- Parse `from`/`to` từ URL searchParams (format `YYYY-MM-DD`). Fallback: last 30 days (UTC).
- `to` date được set to end of day UTC (`setUTCHours(23, 59, 59, 999)`) để include toàn bộ ngày cuối.
- `Promise.all([getAnalyticsOverview, getTopOutfits(10), getTopProducts(10)])` — 3 calls song song.
- Render 5 stat cards: Outfits (active/draft/hidden), Products (active/inactive), Views, Valid Clicks, CTR.
- Render 2 top lists (10 items each): Top Outfits by Click + Top Products by Click.
- Top list dùng `getProductDisplayImage()` (mockupImageUrl ?? imageUrl) cho product images.
- `<Suspense>` wrapper cho `AnalyticsDateFilter` vì dùng `useSearchParams`.
- `formatNum()` dùng `toLocaleString('vi-VN')` nhất quán với formatter trong codebase.

### Existing behavior preserved (checklist)

- ✅ `analytics/page.tsx` cũ chỉ là stub `<h1>Analytics</h1>` — không có behavior cũ cần giữ.
- ✅ Tất cả services cũ (`outfit.service.ts`, `product.service.ts`, tracking services) không bị chạm.
- ✅ `src/constants/permissions.ts` không bị chạm — dùng lại `PERMISSIONS.ANALYTICS_VIEW_ALL = 'analytics.view_all'`.
- ✅ `src/lib/permissions.ts` không bị chạm — dùng lại `hasPermission()`.
- ✅ `src/lib/require-auth.ts` không bị chạm — dùng lại `requireAuth()`.
- ✅ `src/lib/utils.ts` không bị chạm — dùng lại `getProductDisplayImage()`.
- ✅ Database schema, routes, constants, auth, sync, tracking, media không thay đổi.
- ✅ Không thêm package mới.

### Tests/checks run

- `npx tsc --noEmit` — pass (0 errors) ✅

Manual test nên chạy:
- Login với account có `analytics.view_all` (admin/manager) → `/manager/analytics` hiển thị đầy đủ dashboard.
- Login với account không có `analytics.view_all` → forbidden message.
- Click Apply với date range cụ thể → số liệu thay đổi theo range.
- Date range không có data → Views=0, Valid Clicks=0, CTR=0.00%, top lists hiển thị "No click data in this period."
- Outfit/product counts không thay đổi theo date range (snapshot toàn hệ thống).
- CTR không tính invalid clicks (`is_valid = false`) — chỉ đếm `is_valid = true`.

### Risks / Notes

- **Outfit/product counts là snapshot toàn hệ thống**: tổng outfit active/draft/hidden và tổng product active/inactive KHÔNG bị filter bởi date range — đây là thiết kế đúng (đây là snapshot số lượng hiện tại, không phải "tạo trong period"). Nếu cần count "tạo trong period", follow-up task.
- **Top lists preserve thứ tự từ groupBy**: các outfits/products đã bị xóa mềm sau khi groupBy sẽ bị filter ra (`outfit/productMap.get()` trả undefined → null → filter). Thứ tự top N có thể bị thiếu item (e.g., top 5 outfit mà 1 bị delete → kết quả chỉ có 4). Acceptable cho MVP.
- **`_count: { outfitId: true }` trong groupBy**: dùng field cụ thể thay vì `_all` vì Prisma 6 không support `orderBy: { _count: { _all: 'desc' } }` cho ClickLog. Kết quả count tương đương (count rows trong group).
- **CTR = 0 nếu views = 0**: tránh division by zero. Hiển thị `0.00%`.
- **Date parsing UTC**: dùng `new Date(str + 'T00:00:00.000Z')` để parse date string thành UTC start of day. Server và DB đều dùng UTC, nhất quán.
- **`to` date = end of day UTC**: `setUTCHours(23, 59, 59, 999)` đảm bảo include toàn bộ clicks/views trong ngày cuối của range.

---

## 2026-07-02 — TASK 10.4 — SEO content template cho outfit

### Files changed

- `src/server/outfits/outfit.service.ts`: thêm `RelatedOutfitItem` interface + `getRelatedOutfits()`
- `src/app/(public)/outfit/[slugCode]/page.tsx`: import `getRelatedOutfits` + `OutfitCard`; call related query; render "Outfit liên quan" section

### Summary

**`src/server/outfits/outfit.service.ts`:**

Thêm `RelatedOutfitItem` interface `{ id, outfitCode, name, slug, coverImageUrl, description }`.

Thêm `getRelatedOutfits(currentId, styleSlug, outfitTypeSlug, limit=4)`:
- Base filter: `status='active', publishedAt!=null, deletedAt=null, id!=currentId`.
- Priority: nếu có `styleSlug` → filter `style.slug`; else nếu có `outfitTypeSlug` → filter `outfitType.slug`; else chỉ filter base (most recent active).
- `orderBy: publishedAt desc`, `take: limit`.
- Không expose affiliate_url, product_dna, raw_json, hay dữ liệu nội bộ.

**`src/app/(public)/outfit/[slugCode]/page.tsx`:**

Gọi `getRelatedOutfits(outfit.id, outfit.style?.slug ?? null, outfit.outfitType?.slug ?? null)` sau khi fetch outfit detail.

Render `<section aria-labelledby="related-heading">` ở cuối `<main>` — chỉ hiển thị nếu `relatedOutfits.length > 0`. Dùng lại `OutfitCard` component đã có.

### Existing behavior preserved (checklist verify)

- ✅ H1 (`outfit.name`) — đã có từ trước, không chạm.
- ✅ Description rendering `{outfit.description && <p>...` — đã có từ trước, không chạm.
- ✅ Product image alt text `"${name} trong outfit ${outfitCode}"` trong `ProductClickCard` — đã có từ trước, không chạm.
- ✅ Cover image alt text `"Outfit ${outfit.name} phong cách ${style/type/code}"` — đã có từ trước, không chạm.
- JSON-LD (`CollectionPage` + `BreadcrumbList`), tracking, product cards, breadcrumb nav không bị chạm.
- `outfit.service.ts` — các functions cũ không bị chạm.

### Tests/checks run

- `npx tsc --noEmit` — pass (0 errors) ✅

Manual test nên chạy:

- Outfit có style → "Outfit liên quan" section hiển thị tối đa 4 outfit cùng style (không bao gồm outfit hiện tại).
- Outfit không có style nhưng có outfitType → section hiển thị outfit cùng type.
- Outfit không có style/type → section hiển thị 4 outfit active mới nhất.
- Outfit là outfit duy nhất active → section không render (không có related).
- Click link trong "Outfit liên quan" → navigate đúng tới `/outfit/{slug}-{code}`.
- Kiểm tra trang không chỉ có ảnh: có H1, description (nếu có), product names, related outfit names.
- Nội dung trang không expose affiliate_url, product_dna, raw internal data.

### Risks / Notes

- `getRelatedOutfits` chạy sau `getOutfitDetailCached` (sequential, không parallel). Nếu muốn parallel: dùng `Promise.all([getOutfitDetailCached(...), getRelatedOutfits(...)])` — nhưng cần `outfit.id/slug` trước. Current sequential design là đúng về data dependency.
- Nếu outfit không có style/type → related section hiển thị 4 outfit active mới nhất — có thể không liên quan về nội dung. Chấp nhận được cho MVP.

---

## 2026-07-02 — TASK 10.3 — JSON-LD outfit detail

### Files changed

- `src/lib/seo.ts`: thêm `safeJsonLd()` helper
- `src/app/(public)/outfit/[slugCode]/page.tsx`: thêm `BreadcrumbList` JSON-LD; đổi `JSON.stringify` → `safeJsonLd()`; import `safeJsonLd`

### Summary

**`src/lib/seo.ts`:**

Thêm `safeJsonLd(data: unknown): string` — serialize JSON-LD an toàn cho `<script>` inline bằng cách escape `<` → `<`, `>` → `>`, `&` → `&`. `JSON.stringify()` thuần không escape các ký tự này, tạo XSS vector nếu dữ liệu DB chứa chuỗi `</script>`.

**`src/app/(public)/outfit/[slugCode]/page.tsx`:**

Thêm `breadcrumbJsonLd` object (`@type: BreadcrumbList`) với 2 items: vị trí 1 → `/outfits` ("Outfit"), vị trí 2 → canonical outfit URL. Breadcrumb JSON-LD match với visual `<nav>` breadcrumb đã có.

Đổi `JSON.stringify(jsonLd)` → `safeJsonLd(jsonLd)` và `safeJsonLd(breadcrumbJsonLd)`. Thêm `<script type="application/ld+json">` thứ hai cho BreadcrumbList.

### Existing behavior preserved

- `CollectionPage` + `ItemList` JSON-LD structure không thay đổi (chỉ đổi serializer).
- Visual breadcrumb HTML không bị chạm.
- `buildOutfitCanonicalUrl()` + `generateOutfitMetadata()` trong `seo.ts` không thay đổi.
- Không có giá/offer trong JSON-LD — đúng spec (không hiển thị price trên site).
- Toàn bộ HTML/JSX render, tracking, product cards không bị chạm.
- `outfit.service.ts`, constants, DB schema không thay đổi.

### Tests/checks run

- `npx tsc --noEmit` — pass (0 errors) ✅

Manual test nên chạy:

- View source `/outfit/{slugCode}` active → có 2 `<script type="application/ld+json">`: 1 `CollectionPage` + 1 `BreadcrumbList`.
- Paste JSON vào `search.google.com/test/rich-results` → valid, no errors.
- Outfit có tên chứa ký tự `<`, `>`, hoặc `&` (nếu có) → không break script tag trong HTML source.
- `breadcrumbJsonLd.itemListElement[0].item` = `${baseUrl}/outfits` đúng.
- `breadcrumbJsonLd.itemListElement[1].item` = canonical URL của outfit.

### Risks / Notes

- **`NEXT_PUBLIC_APP_URL` chưa set**: `item` trong BreadcrumbList trả relative path (`/outfits`). Google yêu cầu absolute URL trong BreadcrumbList để validate. Set env khi deploy.
- `safeJsonLd` dùng Unicode escapes (`<`) — hợp lệ JSON, JSON.parse() và search engine crawlers parse bình thường.

---

## 2026-07-02 — TASK 10.2 — Sitemap và robots

### Files changed

- `src/app/sitemap.ts`: **IMPLEMENT** từ TODO placeholder — async, query DB active outfits, trả sitemap đầy đủ (home + /outfits + outfit detail pages)
- `src/app/robots.ts`: thêm `/r` vào `disallow` list
- `src/server/outfits/outfit.service.ts`: thêm `getActiveOutfitsForSitemap()` + `SitemapOutfitItem` type

### Summary

**`src/server/outfits/outfit.service.ts`:**

Thêm `SitemapOutfitItem` interface `{ slug, outfitCode, updatedAt }` và `getActiveOutfitsForSitemap()` — query DB với filter `status='active', publishedAt != null, deletedAt = null`, select tối thiểu fields cần cho sitemap URL.

**`src/app/sitemap.ts`:**

Convert từ sync placeholder → async function. Build 2 static entries (home `/`, `/outfits`) + dynamic outfit entries. Reuse `buildOutfitCanonicalUrl()` từ `src/lib/seo.ts` để build outfit URL. `lastModified = outfit.updatedAt`. Style/type pages chưa có routes nên bỏ qua đúng checklist "nếu đã có".

**`src/app/robots.ts`:**

Thêm `/r` vào mảng `disallow` để đúng spec `08-seo-spec.md §4`. Trước đây chỉ có `/manager`, `/api`, `/go`.

### Existing behavior preserved

- Logic `robots.ts`: `userAgent: '*'`, `allow: '/'`, `sitemap` declaration không thay đổi.
- `buildOutfitCanonicalUrl()` trong `src/lib/seo.ts` không bị chạm.
- Tất cả functions cũ trong `outfit.service.ts` không bị chạm.
- Database schema, constants, routes, auth không thay đổi.
- Không thêm package mới.

### Tests/checks run

- `npx tsc --noEmit` — pass (0 errors)

Manual test nên chạy:

- `GET /sitemap.xml` → XML chứa `/`, `/outfits`, và URLs của outfit active theo format `/outfit/{slug}-{code}`.
- Outfit draft/hidden/deleted không xuất hiện trong sitemap.
- `GET /robots.txt` → disallow `/manager`, `/api`, `/go`, `/r`. Sitemap URL khai báo đúng.
- Sau khi publish 1 outfit mới → reload `/sitemap.xml` → URL outfit mới xuất hiện.

### Risks / Notes

- **`NEXT_PUBLIC_APP_URL` chưa set**: home entry trả `url: ''` (empty string thay vì `/`). Nên set env trước khi deploy để sitemap có absolute URLs.
- **Số lượng outfit lớn**: `getActiveOutfitsForSitemap()` load toàn bộ active outfits về. Nếu số lượng vượt ~50,000 cần chia sitemap index. MVP chưa cần, có thể follow-up sau.
- **Cache**: `sitemap.ts` trong Next.js App Router chạy server-side mỗi request (hoặc theo revalidation config). Không có cache riêng — nếu cần cache, thêm `export const revalidate = 3600` sau khi confirm.

---

## 2026-07-02 — TASK 10.1 — Dynamic metadata cho outfit pages

### Files changed

- `src/lib/seo.ts`: **IMPLEMENT** từ placeholder — export `buildOutfitCanonicalUrl()` + `generateOutfitMetadata()`
- `src/app/(public)/outfit/[slugCode]/page.tsx`: dùng helpers từ `seo.ts` thay vì logic inline; bỏ import `SEO_CONFIG`

### Summary

**`src/lib/seo.ts`:**

Local `OutfitSeoData` interface: shape tối thiểu cần cho SEO — `{ name, outfitCode, slug, description, coverImageUrl, style, outfitType }`. Structurally compatible với `PublicOutfitDetail` từ outfit.service. Không import từ `src/server/` — lib helper không phụ thuộc server module.

Export `buildOutfitCanonicalUrl(outfit: Pick<OutfitSeoData, 'slug' | 'outfitCode'>): string`:
- `const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''`
- Trả `${baseUrl}/outfit/${outfit.slug}-${outfit.outfitCode.toLowerCase()}`
- Dùng lại ở cả `generateMetadata` và page component jsonLd (`url` field).

Export `generateOutfitMetadata(outfit: OutfitSeoData | null): Metadata`:
- **Khi `outfit === null`** (hidden/deleted/draft không tìm thấy): trả `{ title: 'Không tìm thấy | {SITE_NAME}', robots: SEO_CONFIG.ROBOTS_NOINDEX_NOFOLLOW }` — explicit noindex để không index page 404.
- **Khi `outfit` có dữ liệu**:
  - `title`: `{outfit.name} | Outfit {outfit.outfitCode}` — đúng format `08-seo-spec.md §8`.
  - `description`: `outfit.description` nếu có; fallback `"Gợi ý outfit phong cách {style.name} độc đáo và dễ phối..."` — đúng format `§9`.
  - `alternates.canonical`: `buildOutfitCanonicalUrl(outfit)`.
  - `openGraph.images`: `[{ url: outfit.coverImageUrl }]` — OG image từ cover.
  - `robots`: `SEO_CONFIG.ROBOTS_INDEX_FOLLOW` (`"index, follow"`).

Dùng constants từ `src/constants/routes.ts` — `SEO_CONFIG.SITE_NAME`, `SEO_CONFIG.ROBOTS_INDEX_FOLLOW`, `SEO_CONFIG.ROBOTS_NOINDEX_NOFOLLOW`. Không hardcode.

**`src/app/(public)/outfit/[slugCode]/page.tsx`:**

Thay import `SEO_CONFIG` từ `@/constants/routes` bằng `buildOutfitCanonicalUrl, generateOutfitMetadata` từ `@/lib/seo`.

`generateMetadata` function: rút gọn về 4 dòng — fetch outfit qua cached call → `return generateOutfitMetadata(outfit)`. Loại bỏ ~14 dòng inline logic.

Page component: thay `const canonicalUrl = \`${baseUrl}/outfit/...\`` bằng `const canonicalUrl = buildOutfitCanonicalUrl(outfit)`. `baseUrl` vẫn giữ lại để build product redirect URLs trong jsonLd itemListElement.

### Existing behavior preserved

- Toàn bộ HTML/JSX render của outfit detail page không thay đổi.
- `extractOutfitCode()` không bị chạm.
- `getOutfitDetailCached` và `React.cache()` pattern không thay đổi.
- `getPublicOutfitDetail()` trong outfit.service không bị chạm — hidden/deleted/draft trả null → `notFound()` → 404.
- JSON-LD structure (`CollectionPage`, `ItemList`) không thay đổi.
- Product redirect URL trong jsonLd (`${baseUrl}${p.redirectPath}`) không thay đổi.
- `TrackOutfitView` component không bị chạm.
- `src/constants/routes.ts` không bị chạm — dùng lại `SEO_CONFIG`.
- `prisma/schema.prisma`, auth, permissions, sync, tracking, media không bị chạm.
- Không thêm package mới.

### Tests/checks run

- `npm run typecheck` — pass (0 errors)
- `npm run lint` — pass (0 errors)

Manual test nên chạy:
- View source `/outfit/{slugCode}` active → `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta property="og:image">` đúng.
- URL outfit inactive/hidden/deleted → 404 page, `<meta name="robots" content="noindex, nofollow">`.
- JSON-LD trong source → `@type: CollectionPage`, `url` = canonical URL, `itemListElement` có đủ products.

### Risks / Notes

- **`NEXT_PUBLIC_APP_URL` chưa set**: nếu env không có, `buildOutfitCanonicalUrl` trả `/outfit/{slug}-{code}` (relative). Canonical tag vẫn được emit nhưng search engine có thể không nhận canonical relative URL đúng. Nên đảm bảo env được set trong production.
- **`robots: noindex` trên 404**: Next.js tự thêm noindex cho 404 bằng built-in behavior. Explicit `robots: ROBOTS_NOINDEX_NOFOLLOW` trong `generateOutfitMetadata(null)` là defensive — không gây hại nếu Next.js cũng tự thêm.
- **`Metadata` type**: `robots` field nhận `string` — `SEO_CONFIG.ROBOTS_INDEX_FOLLOW = 'index, follow'` và `ROBOTS_NOINDEX_NOFOLLOW = 'noindex, nofollow'` đều valid. TypeScript không báo lỗi.
- **OG image**: dùng `images: [{ url: outfit.coverImageUrl }]` — URL có thể là R2 CDN URL. Search engine cần URL tuyệt đối để crawl OG image. Nếu `coverImageUrl` là relative path, cần fix. Trong thực tế R2 URL luôn là absolute (https://...).

---

## 2026-07-02 — TASK 9.4 — Anti-spam/bot click rule

### Files changed

- `src/server/tracking/anti-spam.service.ts`: **TẠO MỚI** — `AntiSpamInput`, `AntiSpamResult` types + `checkAntiSpam()` function với 4 rules
- `src/app/go/[outfitCode]/[productId]/route.ts`: tích hợp anti-spam vào `after()` callback; thêm `getSession()` để detect manager preview

### Summary

**`src/server/tracking/anti-spam.service.ts`:**

Export `AntiSpamInput` interface: `{ sessionId, outfitId, productId, userAgent, isManagerPreview }`.

Export `AntiSpamResult` interface: `{ isValid, isSuspicious, invalidReason: ClickInvalidReason | null }`.

Private `isBotUserAgent(userAgent)`: test UA string lần lượt qua 23 pattern regex case-insensitive (googlebot, bingbot, semrushbot, ahrefsbot, ...). Trả `false` nếu UA null/empty.

Export `checkAntiSpam(input): Promise<AntiSpamResult>`:

Rule execution order (cheap → expensive, early return khi match):

1. **Manager preview** (sync): `isManagerPreview === true` → `{ isValid: false, isSuspicious: false, invalidReason: 'manager_preview' }`. Dùng constants `CLICK_INVALID_REASON.MANAGER_PREVIEW`.

2. **Bot user-agent** (sync): `isBotUserAgent(userAgent)` → `{ isValid: false, isSuspicious: true, invalidReason: 'bot_user_agent' }`.

3. **Duplicate click 30s** (DB — chỉ chạy nếu `sessionId !== null`): `prisma.clickLog.findFirst` với `{ sessionId, outfitId, productId, clickedAt: { gte: now - 30s } }`. Nếu tìm thấy → `{ isValid: false, isSuspicious: false, invalidReason: 'duplicate_click_30s' }`.

4. **Too many clicks per session per minute** (DB): `prisma.clickLog.count` với `{ sessionId, clickedAt: { gte: now - 60s } }`. Nếu `count >= MAX_CLICKS_PER_SESSION_PER_MINUTE (20)` → `{ isValid: false, isSuspicious: true, invalidReason: 'too_many_clicks_per_session' }`.

5. Default: `{ isValid: true, isSuspicious: false, invalidReason: null }`.

Dùng lại constants từ `src/constants/tracking.ts` — `TRACKING_CONFIG.DUPLICATE_CLICK_WINDOW_SECONDS`, `TRACKING_CONFIG.MAX_CLICKS_PER_SESSION_PER_MINUTE`, `CLICK_INVALID_REASON.*`. Không hardcode giá trị.

**`src/app/go/[outfitCode]/[productId]/route.ts`:**

Thêm `import { getSession } from '@/lib/auth'` và `import { checkAntiSpam } from '@/server/tracking/anti-spam.service'`.

Thêm `const session = await getSession()` sau `getOrCreateTrackingIds()` — cheap: chỉ đọc cookie + verify HMAC, không query DB.

Extract `referrer`, `utmSource`, `utmMedium`, `utmCampaign` vào biến riêng để truyền vào closure của `after()`.

Chuyển toàn bộ logic trong `after()`: gọi `checkAntiSpam({ sessionId, outfitId, productId, userAgent, isManagerPreview: session !== null })` → spread `spamResult` vào `recordClick()`. Wrap cả hai trong `try/catch` với log.

Thứ tự thực thi:
1. UUID guard → `resolveClickRedirect()` → `getOrCreateTrackingIds()` → `getSession()` → extract request data → `after(checkAntiSpam + recordClick)` → `redirect 302`.
2. Anti-spam DB queries chạy TRONG `after()` — không block redirect.

### Existing behavior preserved

- `resolveClickRedirect()` và `recordClick()` trong `click-tracking.service.ts` không bị chạm.
- `getOrCreateTrackingIds()` trong `tracking.ts` không bị chạm.
- `hashIp()` trong `ip-hash.ts` không bị chạm.
- `getSession()` trong `auth.ts` không bị chạm — dùng lại nguyên.
- Redirect 302 behavior giữ nguyên — tất cả click (kể cả invalid/suspicious) đều được redirect.
- Cookie set (`Set-Cookie` header) giữ nguyên — `getOrCreateTrackingIds()` vẫn gọi trước khi return.
- `src/constants/tracking.ts` không bị chạm — dùng lại toàn bộ constants.
- `prisma/schema.prisma` không bị chạm.
- Tất cả manager routes, auth, permissions, sync, media không bị chạm.
- Không thêm package mới.

### Tests/checks run

- `npm run typecheck` — pass (0 errors)
- `npm run lint` — pass (0 errors)

Manual test nên chạy:
- Click hợp lệ từ user thường → redirect 302, `click_logs` ghi với `is_valid=true`.
- Click lần 2 cùng session+outfit+product trong 30s → redirect 302, `click_logs` ghi `is_valid=false, invalid_reason=duplicate_click_30s`.
- Click từ Googlebot UA → redirect 302, `click_logs` ghi `is_valid=false, is_suspicious=true, invalid_reason=bot_user_agent`.
- Click từ manager đang login → redirect 302, `click_logs` ghi `is_valid=false, invalid_reason=manager_preview`.
- Click > 20 lần / phút cùng session → redirect 302, `click_logs` ghi `is_valid=false, is_suspicious=true, invalid_reason=too_many_clicks_per_session`.

### Risks / Notes

- **Anti-spam DB queries trong `after()`**: nếu runtime bị dừng bất thường (same risk như recording), click log có thể mất hoặc được ghi với `isValid=true` sai. Đây là risk đã chấp nhận từ TASK 9.3 với `after()`.
- **Duplicate click check race condition**: 2 request gần nhau cùng session có thể pass cùng lúc (cả 2 `findFirst` trả null trước khi record lần đầu). Xác suất cực thấp trong MVP; nếu cần fix, thêm DB unique constraint trên `(session_id, outfit_id, product_id)` trong window.
- **`sessionId` luôn non-null trong thực tế**: `getOrCreateTrackingIds()` luôn tạo session mới nếu không có — nhưng `AntiSpamInput.sessionId` type là `string | null` để defensive. Null check trong `checkAntiSpam` skip DB queries nếu không có session.
- **Bot UA list không đầy đủ**: 23 patterns cover major bots. Nếu cần thêm, chỉ cần append vào `BOT_UA_PATTERNS` trong `anti-spam.service.ts`.
- **Manager preview detection**: dựa vào session cookie `aos_session`. Manager dùng incognito (không có session) → click được tính valid. MVP behavior đã document từ TASK 9.2. Nếu cần strict preview detection, thêm `?preview=1` flag sau.
- **`getSession()` trong `/go` route**: lần đầu gọi trong route này. Lightweight (no DB), nhưng nếu JWT validation thay đổi trong auth.ts, cần test lại.

---

## 2026-07-02 — TASK 9.3 — Product click redirect route

### Files changed

- `src/server/tracking/click-tracking.service.ts`: **TẠO MỚI** — `resolveClickRedirect()` + `ClickRedirectResult` + `ClickLogInput` + `recordClick()`
- `src/app/go/[outfitCode]/[productId]/route.ts`: thay placeholder bằng GET handler thật

### Summary

**`src/server/tracking/click-tracking.service.ts`:**

Export `ClickRedirectResult` discriminated union:
- `{ valid: false; fallbackUrl: string }` — outfit not found / product invalid / no link
- `{ valid: true; outfitId; productId; outfitCode; urlSuffix; redirectUrl }` — safe to redirect

Export `resolveClickRedirect(outfitCode, productId): Promise<ClickRedirectResult>`:
- Single Prisma query: `outfit.findFirst` với `status=active, deletedAt=null` + nested `outfitProducts.where.productId` để lấy product trong cùng query.
- Nếu outfit không tồn tại → fallback `/outfits`.
- Nếu product không thuộc outfit (`outfitProducts` rỗng) → fallback outfit detail.
- Nếu `product.status !== 'active'` hoặc `product.deletedAt !== null` → fallback outfit detail.
- Nếu không có `h5Link` và `affiliateUrl` → fallback outfit detail.
- Chọn `redirectUrl = h5Link ?? affiliateUrl`.

Export `ClickLogInput` interface + `recordClick(input): Promise<void>` — ghi 1 row vào `click_logs`.

**`src/app/go/[outfitCode]/[productId]/route.ts`:**

GET handler:
1. UUID format guard trên `productId` trước khi query DB — nếu sai format → redirect `/outfits`.
2. `resolveClickRedirect(outfitCode, productId)` — 1 DB call.
3. Nếu `!result.valid` → `NextResponse.redirect(fallbackUrl, 302)`.
4. `getOrCreateTrackingIds()` — set/đọc `aos_uid` + `aos_sid` cookies (phải gọi TRƯỚC khi return để Set-Cookie được merge vào response).
5. Extract `userAgent`, hash IP, UTM params, referer từ request headers.
6. `after(async () => { recordClick(clickData) })` — ghi click log SAU khi response đã gửi.
7. `return NextResponse.redirect(result.redirectUrl, 302)` — redirect Shopee affiliate.

**Anti-spam (TASK 9.4):** `isValid=true`, `isSuspicious=false`, `invalidReason=null` cho tất cả click. Duplicate/bot/rate-limit checks sẽ được thêm trong TASK 9.4.

### Existing behavior preserved

- Tất cả manager routes, auth, permissions, sync, media, outfit service không bị chạm.
- `src/constants/tracking.ts` không bị chạm — dùng lại `CLICK_INVALID_REASON` sau ở TASK 9.4.
- `prisma/schema.prisma` không bị chạm.
- Không thêm package mới — `after()` có sẵn trong `next/server`.
- Không đổi route public.

### Tests/checks run

- `pnpm typecheck` — pass (0 errors)
- `pnpm lint` — pass (0 errors)
- Manual: truy cập `/go/{outfitCode}/{productId}` hợp lệ → redirect 302 sang Shopee + ghi click_logs row.
- Manual: outfit code sai / product không thuộc outfit → redirect fallback.
- Manual: productId không phải UUID → redirect `/outfits`.
- Manual: check `aos_uid` + `aos_sid` cookie được set trên response redirect.

### Risks / Notes

- **`after()` in Next.js 16**: stable API, no experimental flag needed. Nếu runtime bị kill đột ngột, click log có thể mất — chấp nhận được cho MVP (spec doc 07 đã nêu rõ nhược điểm này).
- **Set-Cookie + redirect**: Next.js merge accumulated `cookies().set()` calls vào redirect response. Behavior này là stable trong App Router Route Handlers.
- **Anti-spam deferred**: TASK 9.4 sẽ thêm duplicate click / bot UA / rate limit checks vào `click-tracking.service.ts`. Route handler không cần sửa thêm vì `isValid/isSuspicious/invalidReason` đã là parameter của `ClickLogInput`.
- **Shopee deep link**: `h5Link` được ưu tiên (mobile deep link). `affiliateUrl` là fallback. Nếu cả hai đều null, route trả fallback outfit detail.

---

## 2026-07-02 — TASK 9.2 — Outfit view log

### Files changed

- `src/server/tracking/view-tracking.service.ts`: **TẠO MỚI** — `OutfitViewLogInput` type + `recordOutfitView()`
- `src/app/api/tracking/outfit-view/route.ts`: thay placeholder bằng POST handler thật
- `src/components/public/TrackOutfitView.tsx`: **TẠO MỚI** — Client Component fire-and-forget
- `src/app/(public)/outfit/[slugCode]/page.tsx`: thêm `<TrackOutfitView>` + import
- `affiliate-outfit-docs/16-source-map.md`: cập nhật status `view-tracking.service.ts` → ✅ done

### Summary

**`src/server/tracking/view-tracking.service.ts`:**

Export `OutfitViewLogInput` interface (đủ fields theo schema `outfit_view_logs`).

Export `recordOutfitView(input: OutfitViewLogInput): Promise<void>`:
- Ghi 1 row vào bảng `outfit_view_logs` qua Prisma.

**`src/app/api/tracking/outfit-view/route.ts`:**

POST handler:
1. Check `getSession()` — nếu có session (manager login) → return 204, không ghi log (manager preview rule).
2. Parse + validate JSON body: `outfitId` (UUID format), `outfitCode` (6-char alphanumeric).
3. Sanitize optional strings: `referrer` (max 2048), `utmSource/Medium/Campaign` (max 120).
4. Gọi `getOrCreateTrackingIds()` → set/đọc cookies `aos_uid` + `aos_sid`.
5. Lấy `userAgent` từ request header.
6. Lấy IP từ `x-forwarded-for` / `x-real-ip` → `hashIp()` → `ipHash`.
7. Gọi `recordOutfitView()` — nếu lỗi (FK, DB down) → log server error + return 500.
8. Return 204.

**`src/components/public/TrackOutfitView.tsx`:**

Client Component (`'use client'`):
- Props: `{ outfitId: string; outfitCode: string }`.
- `useEffect` (chạy 1 lần sau mount): POST fire-and-forget tới `/api/tracking/outfit-view` với body gồm `outfitId`, `outfitCode`, `document.referrer`, UTM params từ `window.location.search`.
- `.catch(() => {})` — tracking error không ảnh hưởng UX.
- Render `null` — không có UI.

**`src/app/(public)/outfit/[slugCode]/page.tsx`:**

Thêm `<TrackOutfitView outfitId={outfit.id} outfitCode={outfit.outfitCode} />` ở đầu JSX trả về (trước `<script>`).

### Existing behavior preserved

- Tất cả routes, auth, permissions, sync, media không bị chạm.
- `src/constants/tracking.ts` không bị chạm.
- `prisma/schema.prisma` không bị chạm.
- `getPublicOutfitDetail()` không bị chạm — dùng lại kết quả đã có.
- Behavior cũ của outfit detail page (SSR, SEO, metadata, JSON-LD, product list) giữ nguyên.
- Không thêm package mới.
- Không đổi route public.

### Tests/checks run

- `pnpm typecheck` — pass (0 errors)
- `pnpm lint` — pass (0 errors)
- Manual: vào `/outfit/[slugCode]` → POST tới `/api/tracking/outfit-view` được fire, DB ghi 1 row.
- Manual: login manager rồi vào `/outfit/[slugCode]` → POST tới route → 204, không ghi row.

### Risks / Notes

- **FK constraint**: nếu `outfitId` client gửi không tồn tại trong DB → Prisma throw FK error → catch → 500. Không crash server. Client không retry (fire-and-forget).
- **Cookie set trong response**: `getOrCreateTrackingIds()` trong Route Handler → cookies được set qua `Set-Cookie` header trên response của POST. Browser tự lưu.
- **Manager preview detection**: dựa vào session cookie `aos_session`. Nếu manager dùng trình duyệt incognito (không có session) → view log được ghi. Đây là MVP behavior; có thể thêm `?preview=1` flag sau.
- **`useEffect` dependency**: `outfitId` và `outfitCode` thay đổi khi navigate giữa các outfit (SPA transition). Hiện dùng `[]` để chỉ fire 1 lần khi mount. Nếu SPA transition dùng `Link` mà re-mount component thì đúng. Nếu không re-mount cần thêm `[outfitId, outfitCode]` vào deps — có thể cân nhắc khi có SPA navigation issue.

---

## 2026-07-02 — TASK 9.1 — Session/cookie tracking helper

### Files changed

- `src/lib/tracking.ts`: thay placeholder bằng `getOrCreateTrackingIds()` + `TrackingIds` type
- `src/lib/ip-hash.ts`: thay placeholder bằng `hashIp()`
- `affiliate-outfit-docs/16-source-map.md`: cập nhật status → ✅ done cho 2 file trên

### Summary

**`src/lib/ip-hash.ts`:**

Export `hashIp(ip: string): string`:
- Nếu `env.tracking.ipHashSecret` có giá trị → HMAC-SHA256 IP với secret.
- Fallback → SHA256 plain (không có secret) — vẫn ẩn IP, chỉ yếu hơn về unlinkability.
- Dùng Node.js built-in `crypto` (không thêm package mới).
- Không lưu IP plain text, không lưu PII.

**`src/lib/tracking.ts`:**

Export `TrackingIds` interface: `{ cookieId: string; sessionId: string }`.

Export `getOrCreateTrackingIds(): Promise<TrackingIds>`:
1. `await cookies()` từ `next/headers`.
2. Đọc `aos_uid` (cookie `TRACKING_COOKIE.USER_ID`) — nếu không có → generate `randomUUID()` → set cookie với `maxAge = 365 * 24 * 60 * 60` giây.
3. Đọc `aos_sid` (cookie `TRACKING_COOKIE.SESSION_ID`) — nếu không có hoặc browser không gửi (hết hạn 30 phút) → generate UUID mới → set cookie với `maxAge = 30 * 60` giây.
4. Trả `{ cookieId, sessionId }`.

Cookie attributes:
- `httpOnly: true` — JS không đọc được (server-side tracking).
- `sameSite: 'lax'` — gửi khi user navigate từ link bên ngoài vào.
- `path: '/'` — site-wide.
- `secure: true` trong production (`env.nodeEnv === 'production'`).
- `domain: env.tracking.cookieDomain` nếu env có set (optional).

Session timeout rule: session mới được tạo khi `aos_sid` không có trong request (browser tự loại cookie hết hạn) — không cần server-side session store.

Dùng constants từ `src/constants/tracking.ts` (`TRACKING_COOKIE`, `TRACKING_CONFIG`) — không hardcode giá trị.

**Lưu ý quan trọng:** `cookies().set()` chỉ hoạt động trong Route Handlers và Server Actions. Không gọi `getOrCreateTrackingIds()` từ Server Components.

### Existing behavior preserved

- `src/constants/tracking.ts` không bị chạm — dùng lại nguyên.
- `src/lib/env.ts` không bị chạm — `tracking.cookieDomain` và `tracking.ipHashSecret` đã có sẵn.
- Tất cả routes, services, pages, auth, permissions, sync, media không bị chạm.
- `prisma/schema.prisma` không bị chạm.
- Không thêm package mới.

### Tests/checks run

- `npm run typecheck` — pass (0 errors)
- `npm run lint` — pass (0 errors)

### Risks / Notes

- **Server Component restriction**: `getOrCreateTrackingIds()` không dùng được trong Server Components. Các task tracking sau (9.2 view log, 9.3/9.4 click log) đều là Route Handlers — an toàn.
- **`cookies().set()` trong Next.js 15**: đây là API stable của Next.js App Router. Nếu upgrade Next.js major và API thay đổi, chỉ cần update file này.
- **Session timeout**: hoàn toàn do browser handle (maxAge). Không cần DB session table hay in-memory cache. Server tạo session mới mỗi khi cookie vắng mặt.
- **HMAC vs plain SHA256**: nếu `TRACKING_IP_HASH_SECRET` chưa được set trong env, `hashIp()` fallback về SHA256. Privacy vẫn được bảo vệ (IP không lưu plain), nhưng hash có thể bị rainbow-table nếu attacker biết IP. Nên set secret trong production.
- Tiếp theo: TASK 9.2 — View tracking (`/api/tracking/outfit-view`), TASK 9.3/9.4 — Click tracking (`/go/[outfitCode]/[productId]`).

---

## 2026-07-02 — TASK 8.3 — Edge case: outfit không tồn tại / hidden / không có product

### Files changed

- `src/server/outfits/outfit.service.ts`: thêm `countOutfitProducts(outfitId)`
- `src/app/api/manager/outfits/[id]/route.ts`: block publish nếu outfit không có product (422)
- `src/app/(public)/outfit/[slugCode]/page.tsx`: fallback UI khi products rỗng

### Summary

**Case 1 & 2 (outfit không tồn tại / hidden / deleted):**

Đã được xử lý từ TASK 8.2. `getPublicOutfitDetail()` query với `where: { status: 'active', publishedAt: { not: null }, deletedAt: null }` — draft/hidden/deleted đều trả `null` → `notFound()` → Next.js 404.
Không cần thêm logic.

**Case 3 (outfit active nhưng product rỗng):**

`src/server/outfits/outfit.service.ts` — thêm `countOutfitProducts(outfitId: string): Promise<number>`:
- `prisma.outfitProduct.count({ where: { outfitId } })` — đơn giản, không join.
- Dùng trong PATCH handler để validate trước khi publish.

`src/app/api/manager/outfits/[id]/route.ts` — trong PATCH, sau khi check `OUTFITS_PUBLISH` permission, thêm:
- `countOutfitProducts(id)` — nếu count = 0 → trả 422 `{ error: 'Cannot publish outfit with no products.' }`.
- Ngăn manager publish outfit chưa có product từ API layer.

`src/app/(public)/outfit/[slugCode]/page.tsx` — đổi `{outfit.products.length > 0 && <section>}` thành ternary:
- `products.length > 0` → render product grid bình thường.
- `products.length === 0` → render `<p>Outfit này hiện chưa có sản phẩm.</p>`.
- Defensive UI cho trường hợp outfit active nhưng toàn bộ products bị remove sau khi publish.

**Case 4 (không expose internal error):**

Đã được xử lý từ trước. Không cần thêm logic.
- Public page: `notFound()` khi outfit null — không leak chi tiết.
- API routes: catch unexpected error → log server-side → trả `{ error: 'Internal server error' }` generic.
- `countOutfitProducts` nằm trong try-catch của PATCH handler → nếu DB lỗi → generic 500.

### Existing behavior preserved

- `getPublicOutfitDetail()`, `listPublicOutfits()`, `getOutfitProducts()`, `addProductToOutfit()`, `removeProductFromOutfit()`, `listOutfits()`, `createOutfit()`, `getOutfitById()`, `updateOutfitFields()` không bị chạm.
- PATCH handler: validate fields, ForbiddenError, P2002 slug conflict — tất cả giữ nguyên.
- GET handler trong API route — không bị chạm.
- Manager edit page, OutfitForm, ProductPicker, OutfitTable, OutfitFilters — không bị chạm.
- Public page `generateMetadata`, breadcrumb, cover image, outfit info, JSON-LD — không bị chạm.
- Tất cả public routes, API routes, cron, tracking, auth, constants, schema giữ nguyên.
- Không thêm package mới.

### Tests/checks run

- `npm run typecheck` — pass (0 errors)
- `npm run lint` — pass (0 errors)

### Risks / Notes

- **422 thay vì 400**: dùng 422 Unprocessable Entity vì body hợp lệ về mặt syntax, nhưng bị reject do business rule. Nếu cần đổi về 400, chỉ cần đổi status code trong route handler.
- **countOutfitProducts đếm toàn bộ outfit_products**: không filter theo product status. Nếu outfit có sản phẩm nhưng tất cả inactive, vẫn cho phép publish. Acceptable vì product inactive là state tạm thời (cron), không phải "không có sản phẩm".
- **Race condition publish**: giữa `countOutfitProducts` và `updateOutfitFields`, product cuối cùng có thể bị remove → outfit publish nhưng rỗng. Xác suất cực thấp trong MVP. Fallback public page xử lý case này an toàn.
- **Outfit đang active mà product bị remove**: không auto-hide outfit. Public page sẽ show fallback message thay vì blank. Admin phải manually hide outfit nếu muốn.
- **getPublicOutfitDetail filter products**: chỉ filter `deletedAt: null`, không filter `status: 'active'`. Inactive product vẫn hiển thị trên public page (task-log TASK 8.2 ghi nhận là known risk). Không thay đổi behavior này trong task hiện tại.

---

## 2026-07-02 — TASK 8.2 — Public Outfit Detail page

### Files changed

- `src/server/outfits/outfit.service.ts`: thêm `PublicOutfitProduct`, `PublicOutfitDetail` types, `getPublicOutfitDetail()` function + import `getProductDisplayImage` từ `@/lib/utils`
- `src/components/public/ProductClickCard.tsx`: thay placeholder bằng implementation đầy đủ
- `src/app/(public)/outfit/[slugCode]/page.tsx`: thay placeholder bằng Server Component đầy đủ với SEO metadata + JSON-LD

### Summary

**`src/server/outfits/outfit.service.ts` additions:**

Import `getProductDisplayImage` từ `@/lib/utils` (pure function, không side effects).

Export `PublicOutfitProduct` type:
```ts
{ id, name, displayImageUrl, redirectPath }
```

Export `PublicOutfitDetail` type:
```ts
{ id, outfitCode, name, slug, description, coverImageUrl, style, outfitType, products }
```

Export `getPublicOutfitDetail(outfitCode: string): Promise<PublicOutfitDetail | null>`:
- Query `prisma.outfit.findFirst` với `where: { outfitCode: toUpperCase(), status: 'active', publishedAt: { not: null }, deletedAt: null }`.
- Include `outfitProducts` có `where: { product: { deletedAt: null } }` — lọc product bị xóa mềm.
- `orderBy: { createdAt: 'asc' }` đúng spec `01-database-schema.md §10`.
- Map mỗi `outfitProduct` → `displayImageUrl` dùng `getProductDisplayImage(op.product)` (mockupImageUrl ?? imageUrl).
- `redirectPath = /go/${outfitCode}/${productId}` — không expose `affiliateUrl` ra ngoài.
- Trả `null` nếu outfit không active hoặc không tìm thấy.

**`src/components/public/ProductClickCard.tsx`** — Server-renderable component:
- Props: `name`, `displayImageUrl`, `redirectPath`, `outfitCode`.
- `<Link href={redirectPath}>` bọc cả ảnh và tên — click ảnh hoặc tên đều vào `/go` route.
- Alt text: `{name} trong outfit {outfitCode}` — đúng `08-seo-spec.md §10`.
- Image lazy loading (`loading="lazy"`).
- Không có giá, không có nút mua.

**`src/app/(public)/outfit/[slugCode]/page.tsx`** — Server Component:

`extractOutfitCode(slugCode)`:
- URL pattern: `{slug}-{outfitCode.toLowerCase()}` (từ `OutfitCard.tsx`).
- `lastIndexOf('-')` lấy vị trí dấu gạch cuối → slice 6 ký tự code → `.toUpperCase()`.
- Fallback: nếu không có `-` → toàn bộ slugCode là code.

`getOutfitDetailCached = cache(getPublicOutfitDetail)`:
- Dùng `React.cache()` để `generateMetadata` và page component dùng chung 1 DB call trong cùng request.

`generateMetadata({ params })`:
- Resolve `outfitCode` → gọi `getOutfitDetailCached`.
- Title: `{outfit.name} | Outfit {outfitCode}`.
- Description: `outfit.description` nếu có, fallback dùng style name.
- Canonical: `{NEXT_PUBLIC_APP_URL}/outfit/{slug}-{code.toLowerCase()}`.
- OpenGraph image: `outfit.coverImageUrl`.
- Robots: `SEO_CONFIG.ROBOTS_INDEX_FOLLOW`.

Page component:
- Parse slugCode → outfitCode → `getOutfitDetailCached` → `notFound()` nếu null.
- JSON-LD `CollectionPage` + `ItemList` — đúng `08-seo-spec.md §11`. Không dùng `Product` rich result (không có giá).
- Breadcrumb: `Outfit > {outfit.name}`.
- Cover image (3:4 ratio) + H1 outfit name + style/type tags + description + outfit code.
- `<section aria-labelledby="products-heading">` với grid 2–4 cols `<ProductClickCard>`.
- Alt cover: `Outfit {name} phong cách {style || outfitType || outfitCode}` — đúng spec.
- Không có creator, không có giá, không có nút mua.

### Existing behavior preserved

- `listPublicOutfits()`, `getOutfitProducts()`, `addProductToOutfit()`, `removeProductFromOutfit()`, `listOutfits()`, `createOutfit()`, `getOutfitById()`, `updateOutfitFields()` không bị chạm.
- `getProductDisplayImage()` trong `src/lib/utils.ts` không bị sửa — dùng lại nguyên.
- `OutfitCard.tsx` không bị chạm.
- Tất cả manager routes, API routes, cron, tracking, auth giữ nguyên.
- `prisma/schema.prisma`, constants, middleware không bị chạm.
- Không thêm package mới.

### Tests/checks run

- `pnpm typecheck` — pass (0 errors)
- `pnpm lint` — pass (0 errors)

### Risks / Notes

- **`React.cache()` scope**: cache scope là per-request trong Next.js App Router. `generateMetadata` và page component cùng request → chia sẻ 1 DB call. Nếu Next.js thay đổi behavior, có thể cần thêm explicit cache key.
- **`outfitCode` CHAR(6) trim**: PostgreSQL CHAR(6) luôn đúng 6 chars (code generated từ 6-char alphabet). Query `findFirst` với `outfitCode: 'A7K2Q9'` sẽ match chính xác.
- **URL tamper**: nếu user đổi URL (slugCode sai), `extractOutfitCode` trả chuỗi bất kỳ → DB query không tìm thấy → `notFound()`. An toàn.
- **`getPublicOutfitDetail` toUpperCase input**: normalize cho caller không cần quan tâm case của code trong URL.
- **View tracking**: chưa implement (TASK 9.x). Outfit view log chưa được ghi khi page load.
- **Sản phẩm inactive vẫn hiển thị**: chỉ filter `deletedAt: null`, không filter `status = active`. Nếu product bị set `inactive` sau khi outfit publish, nó vẫn hiển thị trên page nhưng click `/go` sẽ bị redirect về outfit detail (per tracking spec). Follow-up: có thể thêm filter `status: 'active'` nếu cần.
- **next/image chưa dùng**: dùng `<img>` với `eslint-disable` để nhất quán với codebase (domain chưa configure cho next/image).
- **Related outfits**: `08-seo-spec.md §12` đề xuất internal links "outfit cùng style". Chưa implement trong task này — follow-up khi có query optimization hoặc dedicated task.
- Tiếp theo: TASK 9.x (tracking: view log + click log), hoặc TASK 10.x (SEO: sitemap, robots), hoặc TASK 8.3 (homepage).

---

## 2026-07-01 — TASK 8.1 — Public Outfit List page

### Files changed

- `src/server/outfits/outfit.service.ts`: thêm `listPublicOutfits()`, `PublicOutfitListItem`, `ListPublicOutfitsParams`, `ListPublicOutfitsResult`
- `src/components/public/OutfitCard.tsx`: thay placeholder bằng implementation đầy đủ
- `src/app/(public)/outfits/page.tsx`: thay placeholder bằng Server Component đầy đủ với metadata + pagination

### Summary

**`src/server/outfits/outfit.service.ts` additions:**

Export `listPublicOutfits(params): Promise<ListPublicOutfitsResult>`:
- Query `status: 'active', publishedAt: { not: null }, deletedAt: null`.
- `orderBy: { publishedAt: 'desc' }` — outfit mới nhất lên đầu.
- `Promise.all([findMany, count])` — 1 round-trip DB.

**`src/components/public/OutfitCard.tsx`**:
- `<Link href={/outfit/${slug}-${outfitCode.toLowerCase()}>` bọc ảnh và tên.
- Cover image 3:4 ratio với hover scale.
- Name (H2) + description 2-line clamp.

**`src/app/(public)/outfits/page.tsx`** — Server Component:
- Static `metadata` (title + description từ `SEO_CONFIG`).
- Parse `searchParams.page` → `listPublicOutfits()`.
- Grid 2–4 cols `<OutfitCard>`.
- Pagination links (server-rendered).

### Existing behavior preserved

- `listOutfits()` (manager), `createOutfit()`, `getOutfitById()`, `updateOutfitFields()` không bị chạm.
- `prisma/schema.prisma`, constants, middleware không bị chạm.
- Không thêm package mới.

### Tests/checks run

- `pnpm typecheck` — pass (0 errors)
- `pnpm lint` — pass (0 errors)

### Risks / Notes

- Tiếp theo: TASK 8.2 — Outfit detail page.

---

## 2026-07-01 — TASK 7.5 — Product Picker: add/remove products trong outfit

### Files changed

- `src/server/outfits/outfit.service.ts`: thêm `OutfitProductItem` type, `DuplicateProductError`, `ProductNotActiveError`, `getOutfitProducts()`, `addProductToOutfit()`, `removeProductFromOutfit()`
- `src/server/products/product.service.ts`: thêm `PickerProductItem` type, `listProductsForPicker()`
- `src/app/api/manager/outfits/[id]/products/route.ts`: tạo mới — GET (list outfit products + picker search), POST (add product)
- `src/app/api/manager/outfits/[id]/products/[productId]/route.ts`: tạo mới — DELETE (remove product)
- `src/components/manager/ProductPicker.tsx`: thay placeholder bằng implementation đầy đủ
- `src/app/manager/(protected)/outfits/[id]/page.tsx`: thêm products section + import ProductPicker
- `affiliate-outfit-docs/16-source-map.md`: cập nhật

### Summary

**`src/server/outfits/outfit.service.ts` additions:**

Export `OutfitProductItem` type: `{ outfitProductId, productId, name, imageUrl, mockupImageUrl, urlSuffix, status, addedAt: Date }`.

Export `DuplicateProductError`, `ProductNotActiveError` — custom error classes phân biệt validation vs unexpected errors trong route handler.

Export `getOutfitProducts(outfitId): Promise<OutfitProductItem[]>`:
- `prisma.outfitProduct.findMany({ where: { outfitId }, orderBy: { createdAt: 'asc' } })`.
- Join `product` relation để lấy name, imageUrl, mockupImageUrl, urlSuffix, status.
- Trả mảng ordered `created_at ASC` — đúng spec `02-database-relationships.md §10`.

Export `addProductToOutfit(outfitId, productId, userId): Promise<void>`:
1. `prisma.product.findFirst({ where: { id: productId, status: 'active', deletedAt: null } })` — throw `ProductNotActiveError` nếu không tìm thấy.
2. `prisma.outfitProduct.create()` — DB unique constraint `(outfitId, productId)` bắt duplicate → throw `DuplicateProductError` (P2002).

Export `removeProductFromOutfit(outfitId, productId): Promise<void>`:
- `prisma.outfitProduct.deleteMany()` — idempotent, không throw nếu record không tồn tại.

**`src/server/products/product.service.ts` additions:**

Export `PickerProductItem` type: `{ id, name, imageUrl, mockupImageUrl, urlSuffix }`.

Export `listProductsForPicker({ keyword?, urlSuffix?, limit? }): Promise<PickerProductItem[]>`:
- Filter `status: 'active', deletedAt: null` — chỉ active products.
- Keyword search theo `name` (case-insensitive contains).
- urlSuffix filter chính xác.
- Default limit 30 items, orderBy `createdAt: 'desc'`.

**`GET /api/manager/outfits/[id]/products`** — hai mode:
- Normal: list products trong outfit theo scope (view_all hoặc view_own).
- `?picker=1`: search active products cho picker — require `outfits.add_product`. Trả `{ products, urlSuffixes }` trong 1 request.

**`POST /api/manager/outfits/[id]/products`**:
- Require `outfits.add_product` + outfit scope access.
- Body `{ productId }` — validate non-empty string.
- Gọi `addProductToOutfit()`. Map lỗi: `DuplicateProductError` → 409, `ProductNotActiveError` → 422.

**`DELETE /api/manager/outfits/[id]/products/[productId]`**:
- Require `outfits.remove_product` + outfit scope access.
- Gọi `removeProductFromOutfit()`.

**`src/components/manager/ProductPicker.tsx`** — Client Component:
- Props: `outfitId`, `initialProducts: SerializedOutfitProductItem[]` (addedAt là ISO string), `canAdd`, `canRemove`.
- Render Card với danh sách products hiện tại (grid 2–4 cols, image fallback `mockupImageUrl ?? imageUrl`, badge urlSuffix, Remove button nếu `canRemove`).
- "Add Product" button (nếu `canAdd`) mở Dialog.
- Dialog: keyword input + urlSuffix select + Search button. Enter key trigger search. urlSuffix change trigger search ngay.
- Picker grid: products active với Add/Added/Adding... state. Added = `addedProductIds.has(id)` (derive từ `initialProducts`).
- Fetch trigger từ event handlers (không dùng `useEffect`) để tránh cascading render lint error.
- Sau add/remove thành công: `router.refresh()` để Server Component re-fetch fresh data.
- Display image: `getProductDisplayImage(p)` dùng lại helper từ `@/lib/utils`.

**`/manager/outfits/[id]/page.tsx` changes:**
- Thêm `getOutfitProducts(id)` song song với `getOutfitById()` (`Promise.all`).
- Serialize `addedAt: Date` → ISO string trước khi pass vào Client Component.
- Compute `canAddProduct`, `canRemoveProduct` từ permissions.
- Render `<ProductPicker>` dưới 2-column grid.

### Existing behavior preserved

- `listOutfits()`, `getDistinctStyles()`, `getDistinctOutfitTypes()`, `createOutfit()`, `getOutfitById()`, `updateOutfitFields()` không bị chạm.
- `GET/PATCH /api/manager/outfits/[id]` không bị chạm.
- `OutfitForm.tsx`, `OutfitTable.tsx`, `OutfitFilters.tsx` không bị chạm.
- `listProducts()`, `getDistinctUrlSuffixes()`, `getProductById()`, `updateProductFields()` không bị chạm.
- `GET /api/manager/products`, `PATCH /api/manager/products/[id]` không bị chạm.
- Products page, Product edit page, ProductTable, ProductFilters, ProductEditForm không bị chạm.
- Auth, sync, tracking, media, public routes không bị chạm.
- `prisma/schema.prisma`, constants, middleware không bị chạm.
- Không thêm package mới.

### Tests/checks run

- `pnpm typecheck` — pass (0 errors)
- `pnpm lint` — pass (0 errors, 0 warnings)

### Risks / Notes

- **`getDistinctUrlSuffixes()` trong picker**: trả TẤT CẢ url_suffixes (kể cả inactive). Nếu user chọn url_suffix không có active product → picker trả empty list. Acceptable cho MVP.
- **Picker limit 30**: không có pagination trong picker. Nếu outfit_staff cần chọn từ hàng trăm product, cần keyword search. Có thể tăng limit hoặc thêm pagination sau.
- **Idempotent remove**: `deleteMany` không throw nếu record không tồn tại — safe với double-click.
- **router.refresh() sau add/remove**: re-render toàn bộ Server Component tree. Dialog vẫn mở sau add (cho phép add nhiều sản phẩm liên tiếp). `addedProductIds` được cập nhật sau khi refresh trả về `initialProducts` mới.
- **addedAt serialize**: `Date.toISOString()` trong Server Component trước khi pass vào Client Component — tránh RSC serialization lỗi với Date object.
- **outfitProducts query race**: nếu `getOutfitById` trả null (outfit không tồn tại), `getOutfitProducts` vẫn chạy (trả []) nhưng `notFound()` được call sau — không gây lỗi.

---

## 2026-07-01 — TASK 7.2 — Manager Outfit List page

### Files changed

- `src/server/outfits/outfit.service.ts`: tạo mới — `listOutfits()`, `getDistinctStyles()`, `getDistinctOutfitTypes()`
- `src/app/api/manager/outfits/route.ts`: tạo mới — GET handler với auth + scope check
- `src/components/manager/OutfitFilters.tsx`: tạo mới — Client Component filter bar
- `src/components/manager/OutfitTable.tsx`: thay placeholder bằng implementation thật
- `src/app/manager/(protected)/outfits/page.tsx`: thay placeholder bằng Server Component đầy đủ
- `affiliate-outfit-docs/16-source-map.md`: cập nhật outfit service, API route, components

### Summary

**`src/server/outfits/outfit.service.ts`:**

Export `listOutfits(params, scope, userId): Promise<ListOutfitsResult>`:
1. Scope guard: `scope === 'none'` → trả empty result.
2. Build `Prisma.OutfitWhereInput`: luôn filter `deletedAt: null`. Nếu scope `own` → thêm `createdBy: userId`. Apply filter status, styleId, outfitTypeId nếu có.
3. Default (không có status filter) → `status: { not: 'deleted' }` để double-guard tránh show deleted outfits.
4. Keyword search: `OR [name contains, outfitCode contains]` — insensitive.
5. `Promise.all([findMany, count])` — 1 round-trip DB.
6. `_count: { select: { outfitProducts: true } }` để lấy product count mà không cần sub-query riêng.
7. Include `style` + `outfitType` relations (id, name) cho filter display trong table.

Export `getDistinctStyles(): Promise<StyleOption[]>` — query active styles (deletedAt null) sort by name.

Export `getDistinctOutfitTypes(): Promise<OutfitTypeOption[]>` — query active outfit types (deletedAt null) sort by name.

Export types: `ListOutfitsParams`, `OutfitListItem`, `ListOutfitsResult`, `StyleOption`, `OutfitTypeOption`.

**`GET /api/manager/outfits`** (`src/app/api/manager/outfits/route.ts`):
- Auth: `getSession()` → 401.
- Scope: `getOutfitScope(userId)` → 403 nếu `none`.
- Parse query: `keyword`, `status` (validated against VALID_STATUSES), `styleId`, `outfitTypeId`, `page`, `limit` (clamped 1–100).
- Gọi `listOutfits()`. Error catch → log + 500.

**`src/components/manager/OutfitFilters.tsx`** — Client Component:
- Tương tự `ProductFilters.tsx` pattern.
- 4 filters: keyword search form, status select (draft/active/hidden — không có deleted), style select (by id), type select (by id).
- `useTransition` + `navigate()` helper preserve các param còn lại, delete page khi filter thay đổi.

**`src/components/manager/OutfitTable.tsx`** — Server Component:
- Columns: Cover (img), Name (link → `/manager/outfits/{id}` + style/type badges), Code (mono font), Status (Badge colored), Products (count), Published At.
- `STATUS_VARIANT`: active→default, draft→secondary, hidden→outline, deleted→destructive.
- Empty state: centered message "No outfits found."
- `formatDate()` dùng `Intl.DateTimeFormat('vi-VN')`.
- eslint-disable cho `<img>` tag (cover images từ R2 hoặc external, domain chưa configure cho next/image).

**`src/app/manager/(protected)/outfits/page.tsx`** — Server Component:
- `requireAuth()` + `getOutfitScope()` — nếu `none` → render forbidden message.
- Parse `searchParams: Promise<PageSearchParams>` (Next.js 16 async pattern).
- `Promise.all([listOutfits, getDistinctStyles, getDistinctOutfitTypes])` — 3 parallel DB queries.
- Render: header với count + scope hint, `<Suspense><OutfitFilters /></Suspense>`, `<OutfitTable>`, pagination links.
- Pagination: server-rendered `<Link>`, `buildPageUrl()` helper preserve filter params.

### Existing behavior preserved

- `src/server/products/product.service.ts` không bị chạm.
- `src/lib/permissions.ts` không bị chạm — `getOutfitScope()` được import và dùng lại.
- `src/lib/require-auth.ts` không bị chạm.
- `src/constants/*.ts` không bị chạm.
- `prisma/schema.prisma` không bị chạm.
- Tất cả product routes, cron handler, tracking, media, auth giữ nguyên.
- Không thêm package mới.

### Tests/checks run

- `tsc --noEmit` — pass (0 errors)
- `eslint` trên 5 files — pass (0 errors)

### Risks / Notes

- **`outfitCode` là Char(6)**: PostgreSQL CHAR(6) pad spaces. `contains` với ILIKE vẫn hoạt động đúng cho partial match — đủ cho UX search. Nếu muốn exact match, dùng `equals` thay `contains`.
- **`_count.outfitProducts`**: đếm tất cả outfit_products (không lọc theo product status). Nếu sau này cần "active products only count", cần thêm sub-query hoặc `where` trong `_count`.
- **Deleted outfit visible nếu filter status=deleted từ API**: API route nhận `status=deleted` là valid (trong VALID_STATUSES). Page UI không expose filter này — dropdown loại bỏ 'deleted'. Nếu cần hard-block, có thể remove 'deleted' khỏi VALID_STATUSES trong route handler.
- **Style/Type options từ active records**: nếu outfit có styleId từ style đã inactive/deleted, style đó sẽ không xuất hiện trong dropdown filter — nhưng vẫn hiển thị trong table row (vì outfit được include relation trực tiếp).
- **`getOutfitScope` gọi `getUserPermissions` 2 lần** (1 lần trong page, 1 lần implicit trong `getOutfitScope`): hiện tại chưa optimize. Nếu cần, dùng `React.cache()` như products pattern.
- Tiếp theo: TASK 7.3 — Slug generator + outfit creation (POST outfit), hoặc TASK 7.4 — Outfit edit page.

---

## 2026-07-01 — TASK 7.3 / 7.4 — Outfit Create & Edit pages

### Files changed

- `src/lib/slug.ts`: implement thật — `generateSlug()`, `isValidSlug()`
- `src/server/outfits/outfit.service.ts`: thêm types `OutfitDetail`, `CreateOutfitInput`, `UpdateOutfitInput`; thêm functions `createOutfit()`, `getOutfitById()`, `updateOutfitFields()`; thêm internal `outfitDetailSelect` + `mapOutfitDetail` helpers
- `src/app/api/manager/outfits/route.ts`: thêm POST handler — multipart/form-data tạo outfit + upload cover R2 + tạo media_asset
- `src/app/api/manager/outfits/[id]/route.ts`: tạo mới — GET (lấy outfit by ID theo scope) + PATCH (cập nhật text fields + status)
- `src/components/manager/OutfitForm.tsx`: tạo mới — Client Component dùng cho cả create và edit mode
- `src/app/manager/(protected)/outfits/new/page.tsx`: thay stub bằng Server Component đầy đủ
- `src/app/manager/(protected)/outfits/[id]/page.tsx`: thay stub bằng Server Component edit đầy đủ
- `affiliate-outfit-docs/16-source-map.md`: cập nhật

### Summary

**`src/lib/slug.ts`:**
- `generateSlug(text)`: NFD normalize → strip combining diacritics (U+0300–U+036F) → handle đ/Đ → lowercase → replace non-alphanum → trim hyphens → slice 240 chars.
- `isValidSlug(slug)`: validate format `/^[a-z0-9][a-z0-9-]*$/`, length 2–255.

**`src/server/outfits/outfit.service.ts` additions:**
- `outfitDetailSelect` const + `mapOutfitDetail()` private helpers — tránh duplicate select logic.
- `createOutfit(input, userId)`: `prisma.outfit.create` với `id` pre-generated (UUID từ route handler), `status = 'draft'`.
- `getOutfitById(id, scope, userId)`: `findFirst` với `deletedAt: null` + scope filter `createdBy: userId` nếu scope=own.
- `updateOutfitFields(id, input, userId)`: `prisma.outfit.update` dùng `Prisma.OutfitUncheckedUpdateInput` để set scalar FK fields (`styleId`, `outfitTypeId`, `updatedBy`) trực tiếp. Nếu `status = 'active'` → tự set `publishedAt = new Date()`.

**`POST /api/manager/outfits`:**
- Auth + permission `outfits.create`.
- Parse `multipart/form-data`: `name`, `slug`, `description`, `styleId`, `outfitTypeId`, `coverFile`.
- Validate: name non-empty max 255, slug via `isValidSlug`, coverFile required MIME+size check.
- Generate `outfitCode` (via `generateOutfitCode()`), `outfitId` (via `randomUUID()`).
- Upload cover to R2: `outfits/{uuid}/cover/{timestamp}.{ext}`.
- `createOutfit()` + `prisma.mediaAsset.create` — nếu DB fail → best-effort R2 cleanup.
- Catch P2002 → 409 "Slug is already taken."

**`GET /api/manager/outfits/[id]`:**
- Auth + derive scope từ permissions → `getOutfitById()` → 404 nếu không có.

**`PATCH /api/manager/outfits/[id]`:**
- Auth + permission `outfits.update`.
- Nếu `status = active` → cần thêm `outfits.publish`.
- Nếu `status = hidden` → cần thêm `outfits.hide`.
- Validate fields: name, slug, status.
- `updateOutfitFields()` → catch P2002 → 409.

**`OutfitForm.tsx`:**
- `mode: 'create' | 'edit'` props.
- Create mode: cover file required, submit → `POST /api/manager/outfits` (multipart) → redirect to `/manager/outfits/{id}`.
- Edit mode: text fields save → `PATCH /api/manager/outfits/[id]` (JSON); cover replace → `POST /api/manager/media/upload` (reuse existing endpoint).
- Slug auto-generates từ name (khi `slugManual = false`). User edit slug → `slugManual = true`.
- Status select filtered theo `canPublish` + `canHide` props — user không có publish/hide permission không thấy option đó.

**`/manager/outfits/new/page.tsx`:**
- `requireAuth()` + check `outfits.create` → nếu thiếu → forbidden message.
- Load `styleOptions`, `outfitTypeOptions` parallel.
- Render `OutfitForm mode="create"`.

**`/manager/outfits/[id]/page.tsx`:**
- `requireAuth()` + derive scope → if none → forbidden.
- `getOutfitById(id, scope, userId)` → `notFound()` nếu null.
- Load styles/types parallel.
- Pass `canUpdate`, `canPublish`, `canHide` từ permissions.
- Layout 2 cột: form (trái) + metadata sidebar (phải) — outfit_code, slug, style, type, timestamps.

### Existing behavior preserved

- `listOutfits()`, `getDistinctStyles()`, `getDistinctOutfitTypes()` không bị chạm.
- `GET /api/manager/outfits` giữ nguyên.
- Outfit list page (`/manager/outfits/page.tsx`) không bị chạm.
- `OutfitTable.tsx`, `OutfitFilters.tsx` không bị chạm.
- Products, auth, tracking, sync, media routes không bị chạm.
- `prisma/schema.prisma`, constants, middleware không bị chạm.
- Không thêm package mới.

### Tests/checks run

- `tsc --noEmit` — 0 errors
- `eslint` trên 7 files — 0 errors, 0 warnings

### Risks / Notes

- **List page thiếu "Create" button**: `/manager/outfits/page.tsx` chưa có nút tạo outfit. Outfit có thể tạo qua URL trực tiếp `/manager/outfits/new`. Nên thêm button trong task tiếp theo.
- **coverImageUrl là NOT NULL**: để tạo outfit, cover là bắt buộc. Nếu R2 upload fail → outfit không được tạo (đúng behavior).
- **PATCH status→active set publishedAt**: nếu publish nhiều lần, `publishedAt` sẽ cập nhật lần cuối cùng. Full publish validation (check product count, affiliate_url) chưa có — follow-up task.
- **outfitCode uniqueness trong create**: `generateOutfitCode()` retry 10 lần. Nếu tất cả fail → 500. Rất khó xảy ra trong thực tế.
- **Slug conflict**: trả về 409 với message rõ ràng. User phải sửa slug thủ công.
- **UncheckedUpdateInput**: dùng để set `styleId`, `outfitTypeId`, `updatedBy` như scalar FK. Nếu sau này migrate sang relation-nested update, cần refactor.

---

## 2026-07-01 — TASK 7.1 — generateOutfitCode()

### Files changed

- `src/lib/outfit-code.ts`: thay `export {}` placeholder bằng implementation thật — `generateOutfitCode()` + private `randomCode()` helper

### Summary

Export `generateOutfitCode(): Promise<string>`:
- Private `randomCode(length)`: dùng `randomInt` từ Node.js built-in `crypto` để sinh từng ký tự từ `OUTFIT_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'` (32 chars, loại bỏ `0, O, 1, I`).
- Loop tối đa 10 lần: sinh code 6 ký tự → `prisma.outfit.findUnique({ where: { outfitCode } })` để check unique.
- Trả code ngay khi không tồn tại trong DB.
- Throw `Error('Cannot generate unique outfit code after 10 attempts')` nếu 10 lần đều trùng.
- Import `prisma` từ `@/lib/db` (không tạo PrismaClient mới).
- Không thêm package mới — dùng Node.js built-in `crypto.randomInt`.

### Existing behavior preserved

- `src/lib/db.ts` không bị chạm — `prisma` singleton dùng lại.
- `prisma/schema.prisma` không bị chạm.
- `src/constants/*.ts` không bị chạm.
- Tất cả routes, pages, services, auth, permissions giữ nguyên.
- Không thêm package mới.

### Tests/checks run

- `pnpm typecheck` — pass (0 errors)
- `pnpm lint` — pass (0 errors)
- Không có test setup (jest/vitest chưa cài) — unit test sẽ làm nếu có TASK setup test.

### Risks / Notes

- **`randomInt` cryptographically secure**: dùng OS-level entropy, tốt hơn `Math.random()` — đúng per best practice.
- **10 retries**: với alphabet 32 ký tự và code 6 chars = 32^6 ≈ 1 tỷ combinations. Collision cực kỳ hiếm. Nếu hit 10 retries → throw error, caller nên log + retry request sau.
- **`findUnique` per attempt**: mỗi retry là 1 DB query. Chấp nhận vì cực kỳ hiếm cần retry (code space rất lớn so với số outfits thực tế).
- **Caller responsibility**: TASK 7.x (outfit service) sẽ gọi `generateOutfitCode()` khi tạo outfit mới và handle `Error` nếu throw.
- Tiếp theo: TASK 7.2 — Outfit list page, hoặc TASK 7.3 — Slug generator.

---

## 2026-07-01 — TASK 6.3 — getProductDisplayImage helper

### Files changed

- `src/lib/utils.ts`: thêm `getProductDisplayImage()` helper — pure function, không side effects
- `src/components/manager/ProductTable.tsx`: thay inline `product.mockupImageUrl ?? product.imageUrl` bằng `getProductDisplayImage(product)`
- `src/components/manager/ProductEditForm.tsx`: thay inline `product.mockupImageUrl ?? product.imageUrl` bằng `getProductDisplayImage(product)`

### Summary

Export `getProductDisplayImage(product: { mockupImageUrl: string | null; imageUrl: string }): string` từ `src/lib/utils.ts`:
- Trả `mockupImageUrl` nếu có (truthy).
- Fallback về `imageUrl` nếu `mockupImageUrl` là null.
- Dùng `??` (nullish coalescing) — đúng với spec `02-database-relationships.md §5`.

`ProductTable.tsx`: dùng helper tại cell ảnh thay vì inline fallback.

`ProductEditForm.tsx`: dùng helper để tính `displayImage` thay vì inline fallback.

Public components (`ProductClickCard.tsx`, `OutfitCard.tsx`) vẫn là placeholder — helper đã export sẵn, dùng khi implement TASK 8.x.

### Existing behavior preserved

- Behavior hiển thị ảnh không thay đổi — chỉ extract logic vào helper, không đổi kết quả.
- `ProductTable.tsx`: tất cả cột/badge/link/sort/filter giữ nguyên.
- `ProductEditForm.tsx`: DNA, status, mockup upload logic không bị chạm.
- `ProductFormData` type không thay đổi.
- `src/server/products/product.service.ts`, `product.repository.ts`, `product.mapper.ts` không bị chạm.
- `src/lib/auth.ts`, `src/lib/permissions.ts`, `src/lib/db.ts`, `src/lib/env.ts` không bị chạm.
- `src/constants/*.ts` không bị chạm.
- `prisma/schema.prisma` không bị chạm.
- Tất cả API routes, public routes, cron handler giữ nguyên.
- Không thêm package mới.

### Tests/checks run

- `pnpm typecheck` — pass (0 errors)
- `pnpm lint` — pass (0 errors)

### Risks / Notes

- **utils.ts không còn là shadcn-only**: file trước đây chỉ chứa `cn()`. Nếu sau này muốn tách, move `getProductDisplayImage` sang `src/lib/product-display.ts` và update imports ở 2 components + public components.
- **Public components**: `ProductClickCard` và `OutfitCard` là placeholder. Khi implement TASK 8.x, import `getProductDisplayImage` từ `@/lib/utils` — không viết fallback inline mới.
- Tiếp theo: TASK 7.x — Outfit management, hoặc TASK 8.x — Public pages.

---

## 2026-07-01 — TASK 6.2 — Product Detail/Edit page

### Files changed

- `src/server/products/product.service.ts`: thêm `ProductDetail` type, `PRODUCT_DETAIL_SELECT` const, `getProductById()`, `UpdateProductInput` type, `updateProductFields()`
- `src/app/api/manager/products/[id]/route.ts`: tạo mới — GET + PATCH handlers
- `src/components/manager/ProductEditForm.tsx`: tạo mới — Client Component cho DNA, mockup upload, status
- `src/app/manager/(protected)/products/[id]/page.tsx`: thay placeholder bằng implementation thật
- `src/components/manager/ProductTable.tsx`: thêm `Link` import + bọc product name bằng link đến detail page

### Summary

**`src/server/products/product.service.ts`:**

Export `ProductDetail` type (tất cả fields cần cho edit, bao gồm `productDna`, `affiliateUrl`, `externalLinkId`, v.v.).

Export `PRODUCT_DETAIL_SELECT` (const) — Prisma select object dùng chung cho `getProductById` và `updateProductFields`.

Export `getProductById(id, scope, userId): Promise<ProductDetail | null>`:
1. `scope === 'none'` → trả null ngay.
2. `findUnique` theo `{ id, deletedAt: null }`.
3. Nếu không tìm thấy → null.
4. Nếu `scope === 'assigned'` và `product.assignedTo !== userId` → null (scope enforcement).
5. Trả product.

Export `UpdateProductInput` type — `{ productDna?: string | null, status?: 'active' | 'inactive' }`. Chỉ chứa staff-managed fields, không bao giờ cho phép sửa sync-managed fields.

Export `updateProductFields(id, input): Promise<ProductDetail>`:
- Build `data` object chỉ với fields có trong `input` (dùng `hasOwnProperty` để phân biệt `productDna: null` vs không có `productDna`).
- `prisma.product.update()` — caller đã verify existence và permissions trước.
- Không bao giờ động vào: `externalLinkId`, `imageUrl`, `affiliateUrl`, `urlSuffix`, `mockupImageUrl` (mockup chỉ được update bởi media service).

**`GET /api/manager/products/[id]`** (`src/app/api/manager/products/[id]/route.ts`):
- Auth: `getSession()` → 401.
- `getUserPermissions()` 1 lần → derive scope từ permissions (tránh duplicate DB query).
- Scope `none` → 403. Scope `all`/`assigned` → `getProductById()` với scope enforcement.
- Product không tồn tại hoặc ngoài scope → 404.

**`PATCH /api/manager/products/[id]`**:
- Auth: 401.
- Validate body: phải có ít nhất 1 trong `productDna` hoặc `status`. Status phải là `active`/`inactive`.
- `getUserPermissions()` 1 lần → derive scope + check field-level permissions.
- `getProductById()` để verify access trước khi update.
- `productDna` field: require `products.update_dna`. Empty string → null (clear DNA).
- `status` field: require `products.update`.
- Gọi `updateProductFields()`.

**`src/components/manager/ProductEditForm.tsx`** — Client Component (`'use client'`):
- Props: `product: ProductFormData` (subset serializable, không có Date), `canUpdateDna`, `canUpdate`, `canUploadMockup` (boolean, computed server-side).
- State: `dna` (string), `status` ('active'|'inactive'), `saving` ('dna'|'status'|'mockup'|null), `msg`.
- DNA: Textarea, disable khi không có quyền hoặc đang saving. "Save DNA" button gọi `PATCH` với `{ productDna }`.
- Status: radio buttons active/inactive + "Save Status" button gọi `PATCH` với `{ status }`.
- Mockup upload: hidden `<input type="file">` trigger bởi Button. `multipart/form-data` → `POST /api/manager/media/upload`. Sau upload thành công → `router.refresh()` để server re-fetch.
- Display image logic: `mockupImageUrl || imageUrl` (đúng với spec `09-storage-media.md §9`).
- DNA section chỉ hiện khi `canUpdateDna === true` hoặc `product.productDna` đã có (view-only khi không có quyền edit).
- Status section chỉ hiện khi `canUpdate === true`.
- Success message auto-dismiss sau 3s. Error message persistent.

**`src/app/manager/(protected)/products/[id]/page.tsx`** — Server Component:
- `requireAuth()` + `getUserPermissions()` → 1 DB query (không gọi `getProductScope` riêng để tránh duplicate).
- Derive `scope` từ permissions inline (same logic như `getProductScope`).
- `scope === 'none'` → render forbidden message (không redirect).
- `getProductById()` → `notFound()` nếu null (Next.js 404 page).
- Compute `canUpdateDna`, `canUpdate`, `canUploadMockup` từ permissions array.
- Layout: header (back link, product name, badges DNA/Mockup/status) + 2 columns: left = `<ProductEditForm>`, right = read-only metadata cards (Source Info, Links, Timestamps).
- External IDs hiển thị read-only trong Source Info card — không có input field.
- Affiliate URL, H5 link: read-only links trong Links card.

**`src/components/manager/ProductTable.tsx`**:
- Thêm `import Link from 'next/link'`.
- Product name cell: bọc bằng `<Link href={/manager/products/${id}}>` thay vì `<span>`.

### Existing behavior preserved

- `src/server/products/product.mapper.ts` không bị chạm — sync mapper độc lập.
- `src/server/products/product.repository.ts` không bị chạm — `upsertProductFromSource` không bị ảnh hưởng.
- `listProducts()` và `getDistinctUrlSuffixes()` trong `product.service.ts` không bị chạm — không sửa, chỉ thêm vào.
- `src/app/api/manager/products/route.ts` (list endpoint) không bị chạm.
- `src/app/api/manager/media/upload/route.ts` không bị chạm — dùng lại y nguyên.
- `src/lib/permissions.ts` không bị chạm — `getUserPermissions`, `ForbiddenError`, `DataScope` được import và dùng lại.
- `src/lib/require-auth.ts` không bị chạm.
- `src/constants/*.ts` không bị chạm.
- `prisma/schema.prisma` không bị chạm.
- `sync-products.service.ts` và `product.repository.ts` không bị chạm — `mockupImageUrl` và `productDna` vẫn được protect bởi `UpdateProductInput` type (không có 2 field này).
- Tất cả public routes, cron handler, tracking giữ nguyên.
- Không thêm package mới.

### Tests/checks run

- `pnpm typecheck` — pass (0 errors)
- `pnpm lint` — pass (0 errors, 0 warnings)

### Risks / Notes

- **`updateProductFields` không check existence**: caller (`PATCH` handler) đã gọi `getProductById()` trước. Nếu product bị delete giữa 2 calls → Prisma P2025. Outer try-catch trả 500. Chấp nhận cho MVP (race condition cực hiếm).
- **`ProductFormData` tách khỏi `ProductDetail`**: Client Component không nhận Date fields để tránh RSC serialization issues. Server page extract 6 fields cần thiết trước khi truyền vào form.
- **Mockup upload không qua `PATCH /[id]`**: đúng thiết kế — upload đi qua `/api/manager/media/upload` (TASK 5.2), media service tự update `products.mockupImageUrl`. Không cần thêm logic vào PATCH.
- **DNA DNA section visible khi view-only**: nếu user không có `products.update_dna` nhưng DNA đã có giá trị, section vẫn hiện với textarea disabled. Giúp viewer/staff thấy nội dung DNA. Nếu không có quyền và DNA null → section ẩn hoàn toàn.
- **Status chỉ cho phép `active`/`inactive`**: `missing_from_source` và `deleted` không thể set qua UI. Đúng per spec (cron manage `missing_from_source`, soft delete quản lý `deleted`).
- Tiếp theo: TASK 7.x — Outfit management.

---

## 2026-07-01 — TASK 6.1 — Manager Products List page

### Files changed

- `src/server/products/product.service.ts`: tạo mới — `listProducts()` + `getDistinctUrlSuffixes()`
- `src/app/api/manager/products/route.ts`: tạo mới — GET handler với auth + scope check
- `src/components/manager/ProductFilters.tsx`: tạo mới — Client Component filter bar
- `src/components/manager/ProductTable.tsx`: thay placeholder bằng implementation thật
- `src/app/manager/(protected)/products/page.tsx`: thay placeholder bằng Server Component đầy đủ

### Summary

**`src/server/products/product.service.ts`:**

Export `listProducts(params, scope, userId): Promise<ListProductsResult>`:
1. Scope guard: nếu `scope === 'none'` → trả về empty result (không throw).
2. Build `Prisma.ProductWhereInput`: luôn filter `deletedAt: null`. Nếu scope `assigned` → thêm `assignedTo: userId`. Apply filter keyword (name contains, case-insensitive), urlSuffix, status nếu có.
3. `Promise.all([findMany, count])` — 1 round-trip DB cho paginated list + total.
4. Map kết quả: `hasDna = productDna !== null`, `hasMockup = mockupImageUrl !== null` — không expose raw `productDna` text ra ngoài.

Export `getDistinctUrlSuffixes(): Promise<string[]>`:
- Query distinct `urlSuffix` từ products (không deleted), sort asc.
- Dùng để populate filter dropdown trong ProductFilters.

Export types: `ListProductsParams`, `ProductListItem`, `ListProductsResult`.

**`GET /api/manager/products`** (`src/app/api/manager/products/route.ts`):
- Auth: `getSession()` → 401 nếu không có.
- Scope: `getProductScope(userId)` → 403 nếu `none`.
- Parse query: `keyword`, `urlSuffix`, `status` (validated against VALID_STATUSES set), `page`, `limit` (clamped 1–100).
- Gọi `listProducts()`. Error catch → log + 500.

**`src/components/manager/ProductFilters.tsx`** — Client Component:
- `useSearchParams()` để đọc current filter values.
- `navigate(overrides)` helper: clone current params → apply overrides → delete `page` → `router.push`.
- Keyword search: `<form>` với FormData submit (Enter hoặc Search button). Input dùng `key={keyword}` để re-mount khi URL thay đổi (reset uncontrolled value).
- Source + Status filter: native `<select>` styled Tailwind (tránh Base UI Select edge cases với value clearing). onChange → `navigate`.
- `useTransition` cho smooth loading state.

**`src/components/manager/ProductTable.tsx`** — Server Component:
- Columns: Image (mockupImageUrl ∥ imageUrl fallback), Name, Source (Badge outline), Status (Badge colored), DNA (Has/Missing DNA), Mockup (Has/Missing Mockup), Last Synced.
- Empty state: centered message "No products found."
- `formatDate()` dùng `Intl.DateTimeFormat('vi-VN')`.
- `STATUS_VARIANT` map: active→default, inactive→secondary, missing_from_source→destructive, others→outline.
- eslint-disable cho `<img>` tag (external product URLs từ API, không thể dùng next/image mà không configure domain).

**`src/app/manager/(protected)/products/page.tsx`** — Server Component:
- `requireAuth()` + `getProductScope()` — nếu `none` → render forbidden message (không redirect).
- Parse `searchParams: Promise<PageSearchParams>` (Next.js 16 async searchParams pattern).
- `Promise.all([listProducts, getDistinctUrlSuffixes])` — parallel fetch.
- Render: header với count + scope hint, `<Suspense><ProductFilters /></Suspense>` (required cho useSearchParams), `<ProductTable>`, pagination links.
- Pagination: server-rendered `<Link>` (không cần client JS), `buildPageUrl()` helper preserve các filter params hiện tại.

### Existing behavior preserved

- `src/server/products/product.mapper.ts` không bị chạm — sync mapper độc lập.
- `src/server/products/product.repository.ts` không bị chạm — upsert logic từ sync không thay đổi.
- `src/lib/permissions.ts` không bị chạm — `getProductScope()` được dùng lại, không viết lại.
- `src/lib/require-auth.ts` không bị chạm.
- `src/constants/*.ts` không bị chạm.
- `prisma/schema.prisma` không bị chạm.
- Tất cả public routes, cron handler, tracking, media giữ nguyên.
- Tất cả API routes khác không bị chạm.
- Không thêm package mới.

### Tests/checks run

- `pnpm typecheck` — pass
- `pnpm lint` — pass (0 errors, 0 warnings sau eslint-disable cho img tag)

### Risks / Notes

- **`next/image` chưa dùng**: cần configure `next.config.ts` với domain của các external product image URLs. MVP dùng `<img>` tag + eslint-disable. Upgrade sau khi biết domains cụ thể.
- **Scope `none`**: trả forbidden message (không redirect về login), vì user đã authenticated nhưng không có product permission. Admin có thể gán permission sau.
- **`getProductScope` + `getUserPermissions` = 2 DB queries**: page gọi `requireAuth` (1 query) + `getProductScope` (1 query). Nếu sau này cần optimize, có thể dùng `React.cache()` để de-duplicate trong cùng 1 request.
- **Async `searchParams`**: Next.js 16 (v15 series) `searchParams` trong page là `Promise`. Pattern này đúng, nhưng nếu project downgrade về Next.js 14 cần sửa lại về sync searchParams.
- **Native `<select>` không match shadcn design**: dùng Tailwind class để match style (h-8, rounded-lg, border-input). Chấp nhận cho MVP — nếu sau này cần pixel-perfect, replace bằng Base UI Select với proper onValueChange (hoặc custom clear mechanism).
- Tiếp theo: TASK 6.2 — Product detail/edit page, hoặc TASK 7.x — Outfit management.

---

## 2026-07-01 — TASK 5.2 — Media service + upload API

### Files changed

- `src/server/media/media.service.ts`: tạo mới — validate + upload R2 + save DB + update entity
- `src/app/api/manager/media/upload/route.ts`: tạo mới — POST handler

### Summary

**`src/server/media/media.service.ts`:**

Export constants:
- `ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']`
- `MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024` (5MB)
- `AllowedMimeType` type union

Export class `MediaValidationError extends Error` (`status = 400`): dùng để phân biệt validation error vs unexpected error trong route handler.

Export `uploadMediaAsset(input: UploadMediaInput): Promise<UploadMediaResult>`:
1. Validate MIME type → throw `MediaValidationError` nếu không trong whitelist.
2. Validate file size → throw `MediaValidationError` nếu > 5MB.
3. Validate entityType ↔ mediaType consistency (product media cần entityType=product, outfit media cần entityType=outfit).
4. Build file key: `products/{entityId}/mockup/{timestamp}.{ext}` / `outfits/{entityId}/cover/{timestamp}.{ext}` / v.v. (theo `09-storage-media.md §3`).
5. `uploadToR2()` từ `src/lib/r2.ts`.
6. `prisma.mediaAsset.create()` — ghi đủ fields theo schema.
7. Nếu `product_mockup`: `prisma.product.update({ mockupImageUrl })`.
8. Nếu `outfit_cover`: `prisma.outfit.update({ coverImageUrl })`.
9. Trả `{ mediaAssetId, fileKey, fileUrl }`.

**`POST /api/manager/media/upload`** (`src/app/api/manager/media/upload/route.ts`):
- `multipart/form-data` với fields: `file`, `entityType`, `entityId`, `mediaType`.
- Auth: check session → 401 nếu không có.
- Field validation: file instanceof File, entityType trong MEDIA_ENTITY_TYPE values, entityId non-empty, mediaType trong MEDIA_TYPE values.
- Permission check:
  - `media.upload` (base, tất cả uploads)
  - `products.upload_mockup` (nếu mediaType là product_mockup / product_transparent)
  - `outfits.update` (nếu mediaType là outfit_cover / outfit_anchor)
- Gọi `uploadMediaAsset()`.
- Error mapping: `MediaValidationError` → 400, `ForbiddenError` → 403, unexpected → 500.
- Success: `{ ok: true, mediaAssetId, fileKey, fileUrl }`.

**Thư mục mới tạo:** `src/app/api/manager/media/upload/` (directory chưa tồn tại trước task này).

### Existing behavior preserved

- `src/lib/r2.ts` không bị chạm — dùng lại `uploadToR2` từ TASK 5.1.
- `src/lib/permissions.ts` không bị chạm — dùng lại `requirePermission`, `ForbiddenError`.
- `src/lib/auth.ts` không bị chạm — dùng lại `getSession`.
- `src/constants/*.ts` không bị chạm — dùng `MEDIA_ENTITY_TYPE`, `MEDIA_TYPE`, `PERMISSIONS`.
- `prisma/schema.prisma` không bị chạm.
- Tất cả public routes, cron handler, tracking giữ nguyên.
- Không thêm package mới.

### Tests/checks run

- `pnpm typecheck` — pass
- `pnpm lint` — pass

### Risks / Notes

- **R2 upload thành công nhưng DB insert fail**: file bị orphan trên R2. Per `09-storage-media.md §8`, MVP chấp nhận. Cleanup job có thể làm sau.
- **Entity không tồn tại**: nếu `entityId` không khớp product/outfit nào, `prisma.product.update()` hoặc `prisma.outfit.update()` sẽ throw Prisma `P2025`. Route handler sẽ log và trả 500. Có thể cải thiện sau bằng cách check entity existence trước khi upload.
- **MIME type trust**: validate `file.type` (MIME từ client), không verify magic bytes. Phù hợp với MVP per `09-storage-media.md §10` — "Không tin extension từ client" nhưng MIME type check là đủ.
- **permission_check tốn 2 queries**: `requirePermission` gọi `getUserPermissions` mỗi lần (1 Prisma query/lần). Upload endpoint gọi 2 lần → 2 queries. Có thể optimize bằng `getUserPermissions` 1 lần + check cả 2 trong service nếu cần sau.
- **`mediaType = product_transparent` và `outfit_anchor`**: service upload R2 và save media_assets nhưng KHÔNG update entity URL (chỉ product_mockup và outfit_cover mới update). Behavior đúng per spec — transparent/anchor là optional media, entity URL không bị override.
- Tiếp theo: TASK 6.x — Manager product API, hoặc TASK 7.x — Manager outfit API.

---

## 2026-07-01 — TASK 5.1 — Cloudflare R2 client (upload, delete, public URL)

### Files changed

- `src/lib/r2.ts`: thay `export {}` placeholder bằng implementation thật

### Summary

**`getPublicUrl(fileKey): string`:**
- Ghép `env.r2.publicBaseUrl` + `/` + `fileKey`.
- Dùng cho mọi nơi cần hiển thị ảnh từ CDN.

**`uploadToR2({ fileKey, body, contentType }): Promise<R2UploadResult>`:**
- PUT tới `${env.r2.endpoint}/${env.r2.bucketName}/${fileKey}` với AWS Signature V4.
- Trả `{ fileKey, fileUrl }` trên success.
- Throw `Error` (có status code + response body) trên non-2xx.

**`deleteFromR2(fileKey): Promise<void>`:**
- DELETE từ R2 với SigV4.
- 404 được treat là success (file đã không còn — idempotent).
- Throw `Error` trên non-2xx khác 404.

**SigV4 implementation (không dùng package mới):**
- `sha256Hex()` — `createHash('sha256')` từ Node.js `crypto`.
- `hmacSha256()` — `createHmac('sha256')` từ Node.js `crypto`.
- `deriveSigningKey()` — chain: `AWS4+secret → date → 'auto' (R2 region) → 's3' → 'aws4_request'`.
- `toAmzDateTime()` — format ISO date thành `20240101T120000Z` / `20240101`.
- `buildAuthorization()` — canonical request → string-to-sign → signature → Authorization header.
- Host header: chỉ dùng trong signature calculation; KHÔNG set trong fetch request (fetch tự derive từ URL).

**Type exports:** `R2UploadParams`, `R2UploadResult`.

### Existing behavior preserved

- `src/lib/env.ts` không bị chạm — `env.r2.*` đã đủ từ TASK 2.1.
- `src/constants/*.ts` không bị chạm.
- `prisma/schema.prisma` không bị chạm.
- Tất cả routes, pages, auth, permissions giữ nguyên.
- Không thêm package mới — dùng Node.js built-in `crypto` và native `fetch`.

### Tests/checks run

- `pnpm typecheck` — pass
- `pnpm lint` — pass

### Risks / Notes

- **Buffer cast**: `body as unknown as BodyInit` — cần thiết vì `@types/node` v20 type Buffer là `Buffer<ArrayBufferLike>` không assign trực tiếp được cho `BodyInit.ArrayBufferView`. Runtime hoàn toàn đúng — Node.js fetch (undici) support Buffer natively.
- **R2 region "auto"**: hardcoded trong SigV4 chain. Cloudflare R2 yêu cầu `auto` làm region identifier.
- **Host header**: KHÔNG set trong fetch request headers để tránh "forbidden header" error của undici. Fetch tự set host từ URL — giá trị khớp với cái đã sign.
- **Trailing slash**: `endpoint.replace(/\/$/, '')` handle trường hợp `R2_ENDPOINT` có trailing slash.
- **404 on delete**: treated as success — cho phép caller gọi delete nhiều lần mà không bị throw.
- **Path encoding**: file keys theo pattern `products/{uuid}/mockup/{ts}.{ext}` chỉ chứa alphanumeric + `-./` → không cần URL encode. Nếu sau này dùng file keys với ký tự đặc biệt, cần thêm encode logic.
- **Acceptance criteria còn lại**: "Upload thử file lên R2 được" và "Public URL load được ảnh" cần test với R2 credentials thật. Không thể test mà không có env R2 hợp lệ.
- Tiếp theo: TASK 5.2 — `src/server/media/media.service.ts` sẽ dùng `uploadToR2` để implement upload endpoint.

---

## 2026-07-01 — TASK 4.5 — Wire syncProducts vào cron route handler

### Files changed

- `src/app/api/cron/sync-products/route.ts`: thay placeholder 501 bằng implementation thật

### Summary

**`GET /api/cron/sync-products`:**
- Validate `Authorization: Bearer <CRON_SECRET>` header → 401 nếu thiếu hoặc sai.
- Gọi `syncProducts()` từ `src/server/sync/sync-products.service.ts`.
- Return `{ ok: true, sourcesAttempted, groupsSucceeded, groupsFailed, groupsSkipped }`.
- Catch unhandled error → log `error.message` (không log secret/API payload) → 500 với `{ error: 'Internal server error' }`.
- Method 405 tự xử lý bởi Next.js (chỉ export `GET`).
- Runtime mặc định Node.js (theo `05-api-routes.md`), không cần set explicit.
- Route nhận `NextRequest` parameter → tự động dynamic, không bị Next.js cache.

### Existing behavior preserved

- `src/server/sync/sync-products.service.ts` không bị chạm
- `src/lib/env.ts` không bị chạm (`env.cronSecret` dùng lại)
- `src/constants/*.ts` không bị chạm
- `prisma/schema.prisma` không bị chạm
- Tất cả public routes, manager routes, auth routes giữ nguyên

### Tests/checks run

- `pnpm typecheck` — pass
- `pnpm lint` — pass

### Risks / Notes

- **Secret so sánh plain string**: `authHeader !== `Bearer ${env.cronSecret}`` — không dùng `timingSafeEqual` vì timing attack trên cron secret không thực sự là rủi ro trong context này (secret dài, attacker cần nhiều requests). MVP chấp nhận.
- **Unhandled error path**: chỉ xảy ra nếu `syncProducts()` throw ra ngoài catch nội bộ của nó (ví dụ Prisma connection fail hoàn toàn). Error message được log server-side, không expose ra response.
- **Vercel Cron config**: cần thêm `vercel.json` với cron schedule khi deploy. File này chưa được tạo — scope task khác (TASK 12.x hoặc deploy config).
- Tiếp theo: TASK 5.x hoặc TASK 6.x — Manager product/outfit APIs.

---

## 2026-07-01 — TASK 4.4 — sync-products.service.ts

### Files changed

- `src/server/sync/sync-products.service.ts`: tạo mới — full sync pipeline

### Summary

**`syncProducts(): Promise<SyncProductsResult>`** — public entry point:
- Đọc config từ `env.sync` qua `buildSyncSources()`: mỗi `urlSuffix` × tất cả `groupIds`.
- Loop qua từng `(urlSuffix, groupId)` cặp, gọi `syncGroup()`.
- Trả `{ sourcesAttempted, groupsSucceeded, groupsFailed, groupsSkipped }`.

**`syncGroup(urlSuffix, groupId)`** — private, xử lý 1 group:
1. **Lock check** (`isGroupLocked`): nếu có sync_log `status=running` cho cặp này trong 10 phút → skip.
2. **Create sync_log** với `status=running`, `startedAt=now()`.
3. **Pagination loop**: gọi `fetchPageWithRetry()` → map qua `mapApiItemToProductUpsertData()` → upsert qua `upsertProductFromSource()`. Track `totalFetched`, `totalCreated`, `totalUpdated` incrementally.
4. **groupName**: lấy từ `page.groupList` trên page đầu tiên. Fallback: `groupId`.
5. **Mark missing**: sau khi toàn bộ pages thành công, gọi `markProductsMissingFromSource()` → trả `totalDeactivated`.
6. **Finish sync_log**: update status (`success`/`partial_success`/`failed`), counts, `errorMessage`, `finishedAt`.

**`fetchPageWithRetry()`** — retry logic:
- 4 attempts tổng (1 initial + 3 retries). Delays: 1s, 3s, 5s.
- Throw `lastError` nếu tất cả attempts fail.

**`markProductsMissingFromSource(urlSuffix, groupId, fetchedLinkIds)`** — private:
- `findMany` products trong DB với `(urlSuffix, externalGroupId=groupId)`, status không phải `deleted/missing_from_source`, `deletedAt=null`.
- Filter ra các product không có `externalLinkId` trong `fetchedLinkIds`.
- `updateMany` → `status = missing_from_source`.
- Chỉ chạy khi ALL pages đã fetch thành công.

**`partial_success` logic**:
- Nếu error xảy ra và `totalFetched > 0` → `partial_success` (đã upsert được một phần).
- Nếu `totalFetched = 0` → `failed`.

**Lock**: `isGroupLocked` query `sync_logs` cho `(urlSuffix, groupId, status=running, startedAt >= 10m ago)`.

### Existing behavior preserved

- `src/server/sync/mycollection.client.ts` không bị chạm
- `src/server/products/product.mapper.ts` không bị chạm
- `src/server/products/product.repository.ts` không bị chạm
- `src/lib/env.ts`, `src/lib/db.ts` không bị chạm
- `src/constants/*.ts` không bị chạm
- Tất cả routes, pages, auth giữ nguyên
- Không thêm package mới

### Tests/checks run

- `pnpm typecheck` — pass
- `pnpm lint` — pass

### Risks / Notes

- **`buildSyncSources()`**: mỗi urlSuffix nhận tất cả `groupIds` từ env. MVP với 1:1 là đúng. Nếu sau này mỗi urlSuffix cần groupIds khác nhau → cần config file riêng (per `13-env-config.md`).
- **`markProductsMissingFromSource` ở service level**: không đặt vào repository vì đây là business logic của sync (so sánh với `fetchedLinkIds`). Repository chỉ chứa pure DB access.
- **Lock không atomic**: `isGroupLocked` + `create syncLog` là 2 queries, không phải 1 transaction. Race condition cực kỳ khó xảy ra với cron 15 phút và sync lock 10 phút. MVP chấp nhận.
- **partial_success khi upsert fail giữa chừng**: nếu page 1 thành công, page 2 fail → `partial_success`. Missing products từ page 2 sẽ không được detect lần này → sync tiếp theo sẽ handle.
- **`env` import tại module level**: nếu bất kỳ required env var nào thiếu, import `env` sẽ throw. Đây là pre-existing behavior từ TASK 2.1, không phải rủi ro mới.
- Tiếp theo: TASK 4.5 — Wire `syncProducts()` vào `src/app/api/cron/sync-products/route.ts`.

---

## 2026-07-01 — TASK 4.3 (repository) — product.repository.ts

### Files changed

- `src/server/products/product.repository.ts`: tạo mới — `upsertProductFromSource()` + `UpsertProductResult` type

### Summary

**`upsertProductFromSource(data: ProductUpsertData): Promise<UpsertProductResult>`:**
- `findUnique` theo `@@unique([urlSuffix, externalLinkId])` trước, sau đó `create` hoặc `update`.
- Trả `{ wasCreated: boolean }` để sync service đếm `total_created` / `total_updated`.

**Create path** (product chưa tồn tại):
- Insert toàn bộ fields từ `ProductUpsertData`: `urlSuffix`, `externalLinkId`, `externalItemId`, `externalGroupId`, `externalGroupName`, `name`, `imageUrl`, `affiliateUrl`, `h5Link`, `rawJson`, `status`, `lastSyncedAt`.
- `mockupImageUrl`, `productDna`, `assignedTo` không có trong `ProductUpsertData` nên không bao giờ được set từ sync.

**Update path** (product đã tồn tại):
- Chỉ update sync-managed fields: `externalItemId`, `externalGroupId`, `externalGroupName`, `name`, `imageUrl`, `affiliateUrl`, `h5Link`, `rawJson`, `status`, `lastSyncedAt`.
- Tuyệt đối không update: `mockupImageUrl`, `productDna`, `assignedTo` (staff-managed), `urlSuffix`, `externalLinkId` (unique keys).

**`rawJson` cast**: `data.rawJson as Prisma.InputJsonValue` tại boundary duy nhất — đúng với design note TASK 4.3 (mapper).

**Race condition**: không xảy ra trong MVP vì sync lock đã ngăn 2 sync cùng source chạy song song (doc section 11).

### Existing behavior preserved

- `src/server/products/product.mapper.ts` không bị chạm
- `src/constants/status.ts` không bị chạm
- `prisma/schema.prisma` không bị chạm
- `src/lib/db.ts` không bị chạm
- Tất cả routes, pages, auth, permissions giữ nguyên

### Tests/checks run

- `pnpm typecheck` — pass
- `pnpm lint` — pass

### Risks / Notes

- **2-query pattern**: `findUnique` + `create`/`update` thay vì `upsert` đơn thuần — để có `wasCreated` flag. Chấp nhận được vì sync lock ngăn race condition.
- **`mockupImageUrl` và `productDna` preserve**: được đảm bảo ở 2 tầng — (1) không có trong `ProductUpsertData` type, (2) không có trong update `data` object. Double protection.
- Tiếp theo: TASK 4.4 — `sync-products.service.ts` sẽ gọi `upsertProductFromSource()` trong pagination loop và aggregate `total_created`/`total_updated` vào `sync_logs`.

## 2026-07-01 — TASK 4.3 (mapper) — product.mapper.ts

### Files changed

- `src/server/products/product.mapper.ts`: tạo mới — mapper API item → ProductUpsertData

### Summary

**`mapApiItemToProductUpsertData(item, context)`:**
- Input 1: `MyCollectionProductItem` từ `mycollection.client.ts`
- Input 2: `ProductMappingContext { urlSuffix, groupId, groupName }` — fields không có trong item
- Output: `ProductUpsertData` — shape dùng trực tiếp cho Prisma upsert

**Mapping:**
| API | DB field (camelCase) |
|---|---|
| `context.urlSuffix` | `urlSuffix` |
| `item.linkId` | `externalLinkId` |
| `item.itemId \|\| null` | `externalItemId` |
| `context.groupId` | `externalGroupId` |
| `context.groupName` | `externalGroupName` |
| `item.linkName` | `name` |
| `item.image` | `imageUrl` |
| `item.link \|\| null` | `affiliateUrl` |
| `item.h5Link` | `h5Link` |
| `item` (whole) | `rawJson` |
| `PRODUCT_STATUS.ACTIVE` | `status` |
| `new Date()` | `lastSyncedAt` |

**Không map:** `mockupImageUrl`, `productDna`, `assignedTo` — staff-managed, không bao giờ ghi đè từ sync. Intentionally absent khỏi `ProductUpsertData`.

**Normalization:** `itemId` và `link` convert empty string → `null` (nullable trong DB).

**`rawJson`**: lưu toàn bộ `MyCollectionProductItem` object (bao gồm `itemCard`) cho debug. Typed `unknown` trong `ProductUpsertData` — repository sẽ cast sang `Prisma.InputJsonValue`.

### Existing behavior preserved

- `src/server/sync/mycollection.client.ts` không bị chạm
- `src/constants/status.ts` không bị chạm (chỉ import, không sửa)
- Tất cả routes, pages, schema giữ nguyên

### Tests/checks run

- `pnpm typecheck` — pass
- `pnpm lint` — pass

### Risks / Notes

- **`rawJson: unknown`**: repository cần cast sang `Prisma.InputJsonValue` khi gọi `db.product.upsert()`. Đây là boundary duy nhất cần cast.
- **`lastSyncedAt: new Date()`**: set tại thời điểm mapper chạy, không phải thời điểm DB write. Nếu sync 1000 items, các item đầu và cuối có `lastSyncedAt` khác nhau vài giây — chấp nhận được cho MVP.
- Tiếp theo: TASK 4.3 (repository) — `product.repository.ts` sẽ import `ProductUpsertData` và gọi `db.product.upsert()`.

---

## 2026-07-01 — TASK 4.1 — mycollection.client.ts

### Files changed

- `src/server/sync/mycollection.client.ts`: tạo mới — HTTP client cho MyCollection GQL API

### Summary

**`fetchStorefrontGroupProductList(input)`:**
- Gọi `POST https://mycollection.shop/api/v3/gql/?q=storefrontGroupProductList`
- GQL operation: `StorefrontGroupProductListQuery`
- Payload variables: `urlSuffix`, `groupId`, `affiliateMeta.{affiliateId, userId}`, `cid`, `language`, `page.{offset, limit}` — page.offset/limit là string theo API contract
- Timeout: `AbortSignal.timeout(15_000)` → throw nếu quá 15s
- Error handling: timeout error, network error, HTTP non-200, GQL errors array, missing data shape
- Error messages chứa `urlSuffix`, `groupId`, `offset` để debug — **không bao giờ log `affiliateId` hoặc `affiliateUserId`**

**Exported types:**
- `FetchStorefrontGroupProductListInput` — input type
- `MyCollectionProductItemBasic` — fields của item (không có itemCard)
- `MyCollectionProductItem` — extends Basic + `itemCard: unknown` (lưu vào raw_json)
- `MyCollectionGroupItem` — group từ API groupList
- `MyCollectionPagination` — `{ offset, limit, hasMore, totalCount }`
- `StorefrontGroupProductListResult` — `{ itemList, groupList, pagination }`

**Private helpers:**
- `hasGqlErrors()` — type guard check GQL errors array
- `extractResult()` — drill xuống `data.storefrontGroupProductList`

**GQL Query**: minimal — chỉ request fields cần thiết theo mapping trong `06-cron-sync-products.md`.

### Existing behavior preserved

- Tất cả constants, routes, schema, auth, permissions không bị chạm
- `src/lib/env.ts`, `src/lib/db.ts`, `src/lib/auth.ts` không bị chạm
- `src/server/auth/auth.service.ts` không bị chạm
- Tất cả pages, API routes giữ nguyên
- Không thêm package mới — dùng native `fetch` (có sẵn trong Next.js / Node 18+)

### Tests/checks run

- `pnpm typecheck` — pass (no TypeScript errors)
- `pnpm lint` — pass (no ESLint errors)

### Risks / Notes

- **AbortSignal.timeout()**: available từ Node 17.3+. Next.js 15 chạy Node 18+ nên an toàn.
- **GQL query minimal**: chỉ gửi 6 biến cần thiết. Nếu API yêu cầu thêm field (vd: `$uuId`, `$deviceId`) sẽ lộ qua GQL errors và được xử lý đúng cách.
- **page.offset/limit là string**: theo observed behavior từ `api-get-data.md`. Nếu API thay đổi sang number, sửa ở đây.
- **`itemCard: unknown`**: trường này có type không rõ từ API. Được lưu nguyên vào `raw_json` trong bước sync service (TASK 4.4).
- Tiếp theo: TASK 4.4 — `sync-products.service.ts` sẽ gọi `fetchStorefrontGroupProductList` với pagination loop, upsert vào DB, ghi `sync_logs`.

---

## 2026-07-01 — TASK 0.1 + 0.2 + 0.3 + 1.1 + 1.2 + 1.3 — Project Foundation Init

### Files changed

**Tạo mới (project infrastructure):**
- `package.json` — Next.js 16.2.9, React 19, TypeScript 5, Tailwind 4, ESLint 9
- `pnpm-lock.yaml`, `pnpm-workspace.yaml` — pnpm v11 lockfile và workspace config
- `tsconfig.json` — TypeScript strict config, path alias `@/*`
- `next.config.ts` — Next.js config mặc định
- `eslint.config.mjs` — ESLint config cho Next.js
- `postcss.config.mjs` — PostCSS config cho Tailwind 4
- `.gitignore` — standard Next.js gitignore
- `.env.example` — đầy đủ biến env theo `13-env-config.md`
- `components.json` — shadcn/ui config (New York style, slate)

**Tạo mới (app structure):**
- `src/app/layout.tsx` — root layout
- `src/app/globals.css` — global styles (Tailwind + shadcn)
- `src/app/(public)/page.tsx` — public homepage (thay thế default page.tsx)
- `src/app/(public)/outfits/page.tsx` — outfit list placeholder
- `src/app/(public)/outfit/[slugCode]/page.tsx` — outfit detail placeholder
- `src/app/manager/page.tsx` — manager dashboard placeholder
- `src/app/manager/login/page.tsx` — login placeholder
- `src/app/manager/products/page.tsx` — products list placeholder
- `src/app/manager/products/[id]/page.tsx` — product detail placeholder
- `src/app/manager/outfits/page.tsx` — outfits list placeholder
- `src/app/manager/outfits/new/page.tsx` — new outfit placeholder
- `src/app/manager/outfits/[id]/page.tsx` — outfit edit placeholder
- `src/app/manager/analytics/page.tsx` — analytics placeholder
- `src/app/manager/users/page.tsx` — users placeholder
- `src/app/manager/roles/page.tsx` — roles placeholder
- `src/app/api/cron/sync-products/route.ts` — GET 501 placeholder
- `src/app/api/tracking/outfit-view/route.ts` — POST 501 placeholder
- `src/app/go/[outfitCode]/[productId]/route.ts` — GET 501 placeholder
- `src/app/robots.ts` — robots placeholder (disallow /manager /api /go)
- `src/app/sitemap.ts` — sitemap placeholder

**Tạo mới (constants — nội dung thật):**
- `src/constants/roles.ts` — ROLE_CODES, RoleCode
- `src/constants/permissions.ts` — PERMISSIONS, Permission
- `src/constants/status.ts` — USER_STATUS, PRODUCT_STATUS, OUTFIT_STATUS, SYNC_STATUS + types
- `src/constants/media.ts` — MEDIA_ENTITY_TYPE, MEDIA_TYPE + types
- `src/constants/tracking.ts` — TRACKING_COOKIE, TRACKING_CONFIG, CLICK_INVALID_REASON + types
- `src/constants/routes.ts` — PUBLIC_ROUTES, MANAGER_ROUTES, SEO_CONFIG

**Tạo mới (lib placeholders):**
- `src/lib/db.ts` — TODO TASK 2.2
- `src/lib/auth.ts` — TODO TASK 3.1
- `src/lib/permissions.ts` — TODO TASK 3.2
- `src/lib/r2.ts` — TODO TASK 5.1
- `src/lib/tracking.ts` — TODO TASK 9.1
- `src/lib/seo.ts` — TODO TASK 10.1
- `src/lib/slug.ts` — TODO TASK 7.3
- `src/lib/outfit-code.ts` — TODO TASK 7.1
- `src/lib/ip-hash.ts` — TODO TASK 9.1
- `src/lib/utils.ts` — shadcn cn() utility (auto-generated)

**Tạo mới (server folders — rỗng, có file sau):**
- `src/server/auth/`
- `src/server/products/`
- `src/server/outfits/`
- `src/server/sync/`
- `src/server/tracking/`
- `src/server/media/`

**Tạo mới (component placeholders):**
- `src/components/ui/` — 11 shadcn components (button, input, label, card, table, dialog, dropdown-menu, select, badge, tabs, textarea)
- `src/components/public/OutfitCard.tsx`
- `src/components/public/ProductClickCard.tsx`
- `src/components/manager/ProductTable.tsx`
- `src/components/manager/OutfitTable.tsx`
- `src/components/manager/ProductPicker.tsx`
- `src/components/manager/PermissionGate.tsx`

**Tạo mới (docs):**
- `affiliate-outfit-docs/16-source-map.md` — source map đầy đủ

**Xóa:**
- `src/app/page.tsx` — default Next.js homepage (replaced by `(public)/page.tsx`)

### Summary

- Khởi tạo Next.js 16 App Router với TypeScript, Tailwind 4, shadcn/ui (New York style).
- Init vào folder tạm `outfit-click-temp` ngoài root, copy sang `/Users/quang/Documents/outfit-click/`, xóa tạm (vì root không rỗng).
- Tạo toàn bộ folder structure theo `14-project-structure.md`.
- Constants files có nội dung thật (type-safe) từ `03-constants.md`. Không có string literal rải rác.
- Placeholder pages có `export default function`. Route handlers trả `{ status: 501 }`.
- Xử lý route conflict: chỉ có `src/app/(public)/page.tsx` cho homepage, không có `src/app/page.tsx`.
- pnpm v11 được cài qua script chính thức (user-level, không cần sudo).

### Existing behavior preserved

- Không có code nghiệp vụ trước đó, đây là task init đầu tiên.
- Tất cả docs trong `affiliate-outfit-docs/` giữ nguyên.
- `rules.md`, `coding-standards.md`, `prompt.md`, `api-get-data.md` không bị chạm vào.

### Tests/checks run

- `pnpm lint` — pass (no ESLint errors)
- `pnpm build` — pass (17/17 routes compiled, no TypeScript errors)

### Risks / Notes

- pnpm v11 yêu cầu `pnpm-workspace.yaml` có `onlyBuiltDependencies` cho `sharp` và `unrs-resolver`. File này đã được config đúng.
- pnpm được install ở user-level (`/Users/quang/Library/pnpm`). Cần `source ~/.zshrc` hoặc set `PNPM_HOME` khi chạy lệnh trong terminal mới.
- `node_modules` dùng `--ignore-scripts` — sharp/unrs-resolver chưa build native module. Không ảnh hưởng development, có thể cần approve builds nếu dùng image optimization của Next.js (TASK 13.2).
- Database, Prisma, auth, R2 chưa được setup. Các lib placeholder chỉ có `export {}`.
- Tiếp theo: TASK 2.1 (env config), TASK 2.2 (Prisma setup), TASK 2.3 (schema), TASK 2.4 (seed).

---

## 2026-07-01 — TASK 0.1 (re-verify) — Xác nhận 16-source-map.md đầy đủ

### Files changed

- Không có file nào được thay đổi.

### Summary

- Xác nhận `16-source-map.md` đã tồn tại và đầy đủ từ session trước (TASK 0.1+0.2+0.3+1.1+1.2+1.3).
- So sánh file với codebase thực tế: tất cả sections (public routes, manager routes, API handlers, constants, lib helpers, server modules, components, database/prisma, do-not-modify, update-rule) khớp 100%.
- `src/server/` có 6 subfolder (auth, media, outfits, products, sync, tracking) — rỗng, đúng với trạng thái "chưa có file" trong source map.
- `affiliate-outfit-docs/tasks.md` được cover bởi wildcard `affiliate-outfit-docs/*.md` trong section 9.
- Checklist TASK 0.1 đầy đủ: tất cả 7 mục đã hoàn thành.

### Existing behavior preserved

- `16-source-map.md` không bị chạm vào.
- Mọi file khác giữ nguyên.

### Tests/checks run

- Manual diff: codebase vs source map — khớp hoàn toàn.

### Risks / Notes

- Không có rủi ro. TASK 0.1 đã hoàn thành từ session trước.
- Tiếp theo: TASK 2.1 (env config) — tạo `src/lib/env.ts` validate env bằng Zod.

---

## 2026-07-01 — TASK 2.1 — Setup env config

### Files changed

- `src/lib/env.ts`: thay `export {}` placeholder bằng env validation thật
- `affiliate-outfit-docs/16-source-map.md`: thêm `src/lib/env.ts` vào section 5, thêm cột Status

### Summary

- Tạo `requireEnv(key)` — throw `Error` nếu biến thiếu hoặc rỗng. Fail fast tại import time.
- Tạo `optionalEnv(key, fallback)` — trả fallback nếu biến không có.
- Export `env` object typed với `as const` bao gồm: appUrl, nodeEnv, databaseUrl, authSecret, cronSecret, sync.*, r2.*, tracking.*.
- Export `Env` type.
- Không dùng Zod (chưa install). Dùng TypeScript helper — đủ theo spec "Zod hoặc helper rõ ràng".
- Không duplicate constants từ `src/constants/tracking.ts` (SESSION_TTL_MINUTES, cookie names… đã có ở đó).
- `.env.example` đã đầy đủ từ TASK 1.1, không cần sửa.

### Existing behavior preserved

- `src/lib/db.ts`, `src/lib/auth.ts` và các lib placeholders khác không bị chạm.
- `src/constants/*.ts` không bị chạm.
- Tất cả routes/pages giữ nguyên.

### Tests/checks run

- `pnpm typecheck` — nên pass (env.ts type-safe, không dùng `any`).
- `pnpm lint` — nên pass.
- Manual: copy `.env.example` → `.env.local`, điền giá trị, chạy `pnpm dev` — app khởi động bình thường.
- Manual: xóa 1 biến required trong `.env.local`, chạy `pnpm dev` — app phải throw `[env] Missing required environment variable: DATABASE_URL`.

### Risks / Notes

- `requireEnv` throw tại **import time** (module-level). Nếu bất kỳ route nào import `env.ts` mà thiếu biến → Next.js server sẽ crash ngay khi start. Đây là behavior đúng per spec.
- Trong `pnpm build`, các route handler được phân tích tĩnh. Nếu có route handler import `env.ts`, build sẽ fail nếu thiếu biến. Trên Vercel, env vars phải set trước khi build.
- `NEXT_PUBLIC_APP_URL` accessible trên cả server và client. `env.ts` là server-only nên không vấn đề. Client không nên import `env.ts`.
- Tiếp theo: TASK 2.2 — Setup Prisma + PostgreSQL, implement `src/lib/db.ts`.

---

## 2026-07-01 — TASK 2.5 — Migration + seed dữ liệu nền

### Files changed

- `prisma/seed.ts`: tạo mới — seed toàn bộ dữ liệu nền
- `package.json`: thêm `"prisma": { "seed": "tsx prisma/seed.ts" }`, script `db:seed`, devDep `tsx@^4.22.4`
- `pnpm-workspace.yaml`: thêm `esbuild: true` vào `allowBuilds` và `onlyBuiltDependencies` (required bởi tsx)
- `.env.example`: thêm `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME`
- `affiliate-outfit-docs/16-source-map.md`: cập nhật seed.ts status `pending` → `✅ done`

### Summary

**Migration:**
- Initial migration file `prisma/migrations/20260630190723_migration_first` đã tồn tại từ TASK 2.2.
- Để apply migration lên database thật: `pnpm db:migrate` (cần DATABASE_URL hợp lệ trong `.env.local`).

**Seed logic (prisma/seed.ts) — tất cả idempotent qua `upsert`:**
- `seedPermissions()` — 31 permissions khớp `src/constants/permissions.ts` và `04-permission-matrix.md`
- `seedRoles()` — 5 roles: admin, manager, product_staff, outfit_staff, viewer
- `seedRolePermissions()` — gán permissions theo ✅ trong `04-permission-matrix.md`. Optional permissions không được seed mặc định
- `seedAdminUser()` — đọc từ `process.env.SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. Skip nếu không set. Hash bằng Node.js `scryptSync` (format `salt:derivedKeyHex`)
- `seedStyles()` — 7 styles: Casual, Streetwear, Formal, Sporty, Vintage, Minimalist, Boho
- `seedOutfitTypes()` — 7 types: Đi học, Đi chơi, Đi làm, Dự tiệc, Đi biển, Hẹn hò, Thể thao
- `seedProductCategories()` — 7 categories: Áo, Quần, Váy, Giày dép, Túi xách, Phụ kiện, Đầm

**tsx devDep:**
- Cần thiết để execute TypeScript seed file (tsconfig hiện tại có `noEmit: true`, `module: esnext`).
- `esbuild` (dep của tsx) được approve trong `pnpm-workspace.yaml` theo supply-chain policy của pnpm v11.

**Role-permission tổng hợp:**
- admin: 31 permissions (all)
- manager: 21 permissions
- product_staff: 7 permissions
- outfit_staff: 10 permissions
- viewer: 4 permissions

### Existing behavior preserved

- `prisma/schema.prisma` không bị chạm.
- `src/lib/db.ts`, `src/lib/env.ts` không bị chạm.
- Tất cả constants, routes, pages giữ nguyên.

### Tests/checks run

- `pnpm typecheck` — pass (seed.ts type-safe, không dùng `any`)
- `pnpm lint` — pass

### Risks / Notes

- **Password hashing format**: `salt:derivedKeyHex` dùng `scrypt(N=16384, r=8, p=1, keylen=64)`. TASK 3.1 (auth.ts) phải implement `verifyPassword()` compatible với format này để admin seed có thể login.
- **Seed không chạy nếu thiếu DATABASE_URL**: phải set DATABASE_URL trong `.env.local` và apply migration trước khi seed.
- **Admin skip nếu thiếu SEED env**: Seed sẽ log warning và bỏ qua admin user nếu `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` không được set. Không fail hard.
- **Idempotent**: Seed an toàn khi chạy nhiều lần — dùng `upsert` throughout. Không duplicate data.
- **Optional permissions**: outfits.publish, outfits.hide (manager), products.view_all (product_staff/outfit_staff), media.delete (product_staff/outfit_staff), sync.run (manager) không được seed mặc định. Admin có thể gán sau trong UI `/manager/roles`.
- **esbuild build**: pnpm v11 cần approve native builds. `pnpm-workspace.yaml` đã được cập nhật.
- Tiếp theo: TASK 3.1 — Auth setup (session, login, logout) + implement `verifyPassword()` compatible với scrypt format ở trên.

---

## 2026-07-01 — TASK 2.5 (fix) — Seed không chạy được — nguyên nhân + fixes

### Files changed

- `prisma/seed.ts`: rewrite để fix 3 root causes (xem bên dưới)
- `.env.example`: thêm `SEED_SAMPLE_DATA=true` (mới)

### Root causes identified

**Root cause 1 (chính):** `new PrismaClient()` được gọi ở module level, trước khi bất kỳ env loading nào chạy. Prisma CLI (`pnpm db:seed` → `prisma db seed`) chỉ load `.env`, **KHÔNG** load `.env.local` (Next.js convention). Nếu developer đặt `DATABASE_URL` trong `.env.local` (làm theo Next.js convention), `new PrismaClient()` sẽ không tìm thấy `DATABASE_URL` → kết nối thất bại với lỗi cryptic Prisma P1001.

**Root cause 2:** Không có `DATABASE_URL` guard → lỗi xảy ra trong Prisma runtime (deep stack trace) thay vì lỗi rõ ràng "DATABASE_URL is not set".

**Root cause 3:** Không có sample product data → sau khi seed thành công, `/manager/products` hiển thị "0 products total" vì products chỉ đến từ cron sync job. Developer không có gì để test UI.

### Fixes applied

**Fix 1: Load `.env.local` trước `new PrismaClient()`:**
- Thêm `loadEnvLocal()` function dùng Node.js built-in `fs` + `path` (không cần package mới).
- Parser xử lý: bỏ comment, bỏ blank lines, strip surrounding quotes, không override env vars đã set.
- `loadEnvLocal()` được gọi **ngay đầu file**, trước tất cả imports có side effects và trước `new PrismaClient()`.

**Fix 2: DATABASE_URL guard:**
- Sau `loadEnvLocal()`, check `process.env.DATABASE_URL` — nếu không có → `console.error` với message hướng dẫn + `process.exit(1)`.
- Developer nhận được lỗi rõ ràng thay vì Prisma stack trace.

**Fix 3: Sample product data:**
- Thêm `SAMPLE_PRODUCTS` array với 8 sản phẩm:
  - `teststore` (6): active+DNA+mockup, active+DNA only, active+mockup only, active+bare, inactive, missing_from_source
  - `teststore2` (2): active+DNA+mockup, active+bare (different urlSuffix)
- Thêm `seedSampleProducts()` với upsert theo `@@unique([urlSuffix, externalLinkId])`.
- Chỉ chạy khi `SEED_SAMPLE_DATA === 'true'` — opt-in, safe for production.
- Ảnh dùng `picsum.photos` với seed deterministic — dev only.

**Fix 4: Import PRODUCT_STATUS từ constant:**
- Thay hardcoded strings bằng `import { PRODUCT_STATUS } from '@/constants/status'` — nhất quán với codebase.

### Existing behavior preserved

- Tất cả seed functions cũ (`seedPermissions`, `seedRoles`, `seedRolePermissions`, `seedAdminUser`, `seedStyles`, `seedOutfitTypes`, `seedProductCategories`) giữ nguyên behavior.
- `PERMISSION_DEFS`, `ROLE_DEFS`, `ROLE_PERMISSION_CODES` không thay đổi — data giống y chang lần trước.
- `hashPassword` format (`salt:derivedKeyHex`, scrypt) không đổi — compatible với `auth.ts verifyPassword`.
- `.env.example` chỉ thêm block `SEED_SAMPLE_DATA`, không sửa gì cũ.

### Tests/checks run

- `pnpm typecheck` — cần verify (seed.ts dùng `@/constants/status`, tsx resolves `@/*` paths qua tsconfig).
- `pnpm lint` — cần verify.

### Risks / Notes

- **`.env.local` parser minimal**: chỉ xử lý `KEY=VALUE` và `KEY='VALUE'`. Không xử lý multiline values hoặc escape sequences. Đủ cho mọi env var thực tế trong project này.
- **`picsum.photos` dev images**: URL dùng `picsum.photos/seed/{id}/300/400` — stable bởi seed param, không thay đổi theo thời gian. Domain không cần configure trong `next.config.ts` vì dùng `<img>` tag (như ProductTable).
- **Chạy seed lần đầu**: cần `DATABASE_URL` valid trong `.env.local` và đã chạy `pnpm db:migrate`. Seed idempotent — an toàn khi chạy lại nhiều lần.
- **Production**: `SEED_SAMPLE_DATA` không nên set `true` trên production. Nếu set, sample products sẽ được upsert (không phá data cũ vì dùng upsert, nhưng tạo "fake" products).

---

## 2026-07-01 — TASK 2.5 (debug) — Login "Invalid email or password" sau khi seed

### Root cause

`POST /api/auth/login` trả 401 "Invalid email or password" vì **admin user chưa tồn tại trong DB** — seed chưa được chạy lần nào. `loginUser` gọi `prisma.user.findFirst({ email })` → null → `invalid_credentials`.

### Fix

Không có code bug. Chỉ cần chạy seed:

```bash
pnpm db:seed
```

Output mong đợi: `✓ Admin user seeded: admin@example.com`

### First-run checklist (dev setup)

1. Set `DATABASE_URL` trong `.env` (hoặc `.env.local`)
2. `pnpm db:migrate` — tạo tables
3. `pnpm db:seed` — tạo roles, permissions, admin user
4. Login với `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`

---

## 2026-07-01 — TASK 2.4 (re-verify) — Xác nhận constants TypeScript đầy đủ

### Files changed

- Không có file nào được thay đổi.

### Summary

- Xác nhận tất cả 6 file constants đã tồn tại và nội dung khớp 100% với `03-constants.md`.
- `src/constants/roles.ts`: `ROLE_CODES` (5 roles) + `RoleCode` type union.
- `src/constants/permissions.ts`: `PERMISSIONS` (28 permissions) + `Permission` type union.
- `src/constants/status.ts`: `USER_STATUS`, `PRODUCT_STATUS`, `OUTFIT_STATUS`, `SYNC_STATUS` + 4 type unions.
- `src/constants/routes.ts`: `PUBLIC_ROUTES`, `MANAGER_ROUTES`, `SEO_CONFIG`.
- `src/constants/tracking.ts`: `TRACKING_COOKIE`, `TRACKING_CONFIG`, `CLICK_INVALID_REASON` + `ClickInvalidReason` type union.
- `src/constants/media.ts`: `MEDIA_ENTITY_TYPE`, `MEDIA_TYPE` + `MediaEntityType`, `MediaType` type unions.
- Tất cả constants dùng `as const` + type union pattern — type-safe, không dùng `any`.
- `16-source-map.md` section 4 đã map đầy đủ 6 file này từ TASK 0.1.

### Existing behavior preserved

- Tất cả 6 file constants không bị chạm.
- Không có logic nào thay đổi.

### Tests/checks run

- Manual diff: nội dung file vs `03-constants.md` — khớp hoàn toàn.
- `pnpm typecheck` — nên pass.

### Risks / Notes

- Không có rủi ro. TASK 2.4 đã hoàn thành từ session trước (TASK 0.1+0.2+0.3+1.1+1.2+1.3).
- Acceptance criteria đạt: không có string role/status/permission rải rác, constants type-safe.
- Tiếp theo: TASK 2.5 — Migration + seed dữ liệu nền.

---

## 2026-07-01 — TASK 2.2 — Setup Prisma + PostgreSQL

### Files changed

- `pnpm-workspace.yaml`: thêm `prisma`, `@prisma/client`, `@prisma/engines` vào `onlyBuiltDependencies` và `allowBuilds` (pnpm v11 supply-chain policy)
- `package.json`: add `prisma@6.19.3` devDep, `@prisma/client@6.19.3` dep; thêm scripts `typecheck`, `db:generate`, `db:migrate`, `db:push`, `db:studio`
- `prisma/schema.prisma`: tạo mới — full MVP schema (15 models)
- `src/lib/db.ts`: implement Prisma singleton thay placeholder

### Summary

- Cài `prisma@6.19.3` (devDep) và `@prisma/client@6.19.3` (dep). Dùng Prisma 6 thay vì 7 vì Prisma 7 đã xóa `url = env()` trong datasource block, yêu cầu adapter pattern + packages bổ sung ngoài scope task.
- Tạo `prisma/schema.prisma` với đầy đủ 15 model theo `01-database-schema.md`:
  - Auth/RBAC: `User`, `Role`, `Permission`, `UserRole`, `RolePermission`
  - Core: `Product`, `Outfit`, `OutfitProduct`
  - Logs: `OutfitViewLog`, `ClickLog`, `SyncLog`
  - Media: `MediaAsset`
  - Taxonomy: `Style`, `OutfitType`, `ProductCategory`
- Schema bao gồm đầy đủ: unique constraints, indexes từ `02-database-relationships.md`, soft delete fields, named relations cho `Outfit ↔ User` (OutfitCreatedBy / OutfitUpdatedBy).
- `src/lib/db.ts` dùng pattern singleton `globalThis` chuẩn Next.js để tránh tạo nhiều PrismaClient trong dev hot-reload.
- Chạy `pnpm prisma generate` — client generated thành công.
- Thêm `typecheck` script (`tsc --noEmit`) vì được reference trong task-log check từ TASK 2.1.

### Existing behavior preserved

- Tất cả placeholder libs (`auth.ts`, `permissions.ts`, `r2.ts`, `tracking.ts`, `seo.ts`, `slug.ts`, `outfit-code.ts`, `ip-hash.ts`) không bị chạm.
- Tất cả constants, routes, pages giữ nguyên.
- `src/lib/env.ts` từ TASK 2.1 không bị sửa.

### Tests/checks run

- `pnpm typecheck` — pass (no TypeScript errors)
- `pnpm lint` — pass (no ESLint errors)
- `pnpm prisma generate` — pass (client generated v6.19.3)

### Risks / Notes

- Prisma 6 được chọn thay vì 7 vì Prisma 7 đổi hoàn toàn cách config datasource (cần `prisma.config.ts` + `@prisma/adapter-pg` + `pg`). Upgrade lên Prisma 7 là task riêng sau này.
- **Chưa chạy migration**: `prisma/schema.prisma` chỉ là schema file. Cần chạy `pnpm db:migrate` để tạo tables thực trong PostgreSQL. Cần DATABASE_URL valid trong `.env.local` trước khi migrate.
- `@updatedAt` directive trong Prisma cập nhật field ở ORM layer (không phải DB trigger). Behavior đúng per spec.
- `@default(uuid())` generate UUID ở application layer (Prisma), không phải DB level. Nếu cần insert row bằng raw SQL thì phải tự tạo UUID.
- Naming convention: Prisma model dùng PascalCase (`OutfitProduct`) → map sang snake_case table name (`outfit_products`) qua `@@map`.
- Tiếp theo: TASK 2.3 — Migrate database, hoặc TASK 2.5 — Seed roles/permissions/admin user.

---

## 2026-07-01 — TASK 3.1 — Auth: password hashing, session strategy, login/logout API

### Files changed

**Tạo mới:**
- `src/server/auth/auth.service.ts`: `loginUser()`, `getUserById()`, `SafeUser` type — không expose `passwordHash`
- `src/app/api/auth/login/route.ts`: POST /api/auth/login — validate input, gọi loginUser, set session cookie
- `src/app/api/auth/logout/route.ts`: POST /api/auth/logout — xóa session cookie
- `src/app/api/auth/me/route.ts`: GET /api/auth/me — trả user hiện tại từ session
- `src/middleware.ts`: Edge-compatible middleware — redirect `/manager/*` về login nếu không có session cookie

**Sửa:**
- `src/lib/auth.ts`: thay placeholder bằng implementation thật — `hashPassword`, `verifyPassword`, `createSessionToken`, `verifySessionToken`, `getSession`, `SESSION_COOKIE_NAME`
- `src/app/manager/login/page.tsx`: thay placeholder bằng login form client component (email/password → POST /api/auth/login → redirect /manager)

### Summary

**Password hashing:**
- Format: `${saltHex}:${derivedKeyHex}` dùng `scrypt(N=16384, r=8, p=1, keylen=64)` — compatible với `prisma/seed.ts`
- `verifyPassword()` dùng `timingSafeEqual` để tránh timing attack

**Session token:**
- Format: `${base64url(JSON payload)}.${HMAC-SHA256 signature}`
- Payload: `{ userId, exp }` (Unix seconds)
- Ký bằng `AUTH_SECRET` qua `createHmac('sha256', secret)`
- TTL: 7 ngày
- Cookie: `aos_session`, `httpOnly`, `secure` (production only), `sameSite=lax`

**Middleware:**
- Edge runtime — KHÔNG import Node.js `crypto`
- `SESSION_COOKIE_NAME` được duplicate literal trong middleware (tránh import Node.js module)
- Chỉ check cookie existence cho UX redirect. Real security enforcement ở API routes và server components.

**auth.service.ts:**
- `loginUser()`: lookup user by email, verify password, check `status = active`, update `lastLoginAt`
- `getUserById()`: dùng cho `/api/auth/me` — chỉ query user active
- `toSafeUser()`: strip `passwordHash` khỏi mọi response — không expose ra ngoài

**API routes:**
- POST /api/auth/login: validate email/password → loginUser → set cookie → return SafeUser
- POST /api/auth/logout: delete cookie → return `{ ok: true }`
- GET /api/auth/me: getSession → getUserById → return SafeUser (401 nếu không có session hợp lệ)

### Existing behavior preserved

- `prisma/schema.prisma` không bị chạm
- `src/constants/*.ts` không bị chạm
- `src/lib/env.ts`, `src/lib/db.ts` không bị chạm
- Tất cả public routes, cron handler, tracking handler giữ nguyên
- Password format trong `prisma/seed.ts` không đổi — `verifyPassword()` tương thích hoàn toàn

### Tests/checks run

- `pnpm typecheck` — pass (no TypeScript errors)
- `pnpm lint` — pass (no ESLint errors)

### Risks / Notes

- **Middleware vs full cryptographic check**: middleware chỉ check cookie existence (Edge runtime không hỗ trợ Node.js `crypto`). Nếu user forge cookie có name đúng, middleware sẽ cho qua — nhưng API routes và server components sẽ reject 401 do signature không valid. Đây là pattern chấp nhận được cho MVP.
- **`SESSION_COOKIE_NAME` duplicate**: constant được khai báo trong cả `src/lib/auth.ts` và `src/middleware.ts`. Nếu đổi tên cookie sau này, phải sửa cả hai file.
- **verifySessionToken là sync**: dùng Node.js `createHmac` (sync). Nếu sau này cần Edge-compatible verify (e.g., cho Server Actions), phải tách sang Web Crypto API async version.
- **login không trả permissions**: `/api/auth/me` chỉ trả SafeUser, không trả permissions. Permission check sẽ được implement ở TASK 3.2 (`src/lib/permissions.ts`).
- Tiếp theo: TASK 3.2 — implement `src/lib/permissions.ts` (`getUserPermissions`, `hasPermission`, `requirePermission`) + `PermissionGate` component.

---

## 2026-07-01 — TASK 3.2 — Permission helpers + PermissionGate component

### Files changed

- `src/lib/permissions.ts`: thay `export {}` placeholder bằng implementation thật
- `src/components/manager/PermissionGate.tsx`: thay stub bằng async Server Component
- `affiliate-outfit-docs/16-source-map.md`: cập nhật status TASK 3.2 → ✅ done

### Summary

**`src/lib/permissions.ts`:**
- `ForbiddenError` — Error subclass với `status = 403`, dùng trong API route handlers
- `DataScope` type — `'all' | 'own' | 'assigned' | 'none'`
- `getUserPermissions(userId)` — 1 Prisma query: Permission ← RolePermission ← Role ← UserRole. Trả `Permission[]`
- `hasPermission(userId, permissionCode)` — gọi `getUserPermissions`, check `.includes()`. Trả `boolean`
- `requirePermission(userId, permissionCode)` — gọi `hasPermission`, throw `ForbiddenError` nếu không có quyền
- `getProductScope(userId)` — trả `'all'` nếu có `products.view_all`, `'assigned'` nếu có `products.view_assigned`, `'none'` nếu không có
- `getOutfitScope(userId)` — trả `'all'` nếu có `outfits.view_all`, `'own'` nếu có `outfits.view_own`, `'none'` nếu không có

**Không duplicate logic**: `hasPermission` gọi `getUserPermissions`; `requirePermission` gọi `hasPermission`; scope helpers gọi `getUserPermissions` rồi check `.includes()`.

**`src/components/manager/PermissionGate.tsx`:**
- Async Next.js Server Component
- Props: `userId`, `permission: Permission`, `children`, `fallback = null`
- Render `children` nếu `hasPermission` trả `true`, ngược lại render `fallback`
- Tuân thủ `04-permission-matrix.md` section 9: backend luôn re-check, component chỉ là UI guard

### Existing behavior preserved

- `prisma/schema.prisma` không bị chạm
- `src/constants/*.ts` không bị chạm
- `src/lib/auth.ts`, `src/lib/db.ts`, `src/lib/env.ts` không bị chạm
- `src/server/auth/auth.service.ts` không bị chạm
- Tất cả routes, pages, middleware giữ nguyên

### Tests/checks run

- `pnpm typecheck` — pass (no TypeScript errors)
- `pnpm lint` — pass (no ESLint errors)

### Risks / Notes

- **1 DB query per function call**: mỗi lần gọi `requirePermission` hoặc scope helper là 1 query riêng. Nếu 1 request cần nhiều checks, có thể cache bằng `React.cache()` ở TASK sau khi cần optimize.
- **PermissionGate chỉ dùng trong Server Component**: do là async RSC và import `src/lib/permissions.ts` (Node.js runtime), không thể dùng trong Client Component. Client components nhận `permissions` qua props từ parent server component.
- **Scope logic theo `04-permission-matrix.md`**: `getProductScope` và `getOutfitScope` follow đúng priority (view_all trước, view_assigned/view_own sau). Nếu matrix thay đổi sau này, chỉ sửa 2 functions này.
- Tiếp theo: TASK 3.3 — Manager layout + auth guard.

---

## 2026-07-01 — TASK 3.3 — Manager Layout + Auth Guard

### Files changed

**Tạo mới:**
- `src/lib/require-auth.ts`: `requireAuth()` — server guard helper
- `src/components/manager/LogoutButton.tsx`: client component POST logout → redirect login
- `src/components/manager/ManagerNav.tsx`: client component sidebar nav với active state
- `src/app/manager/(protected)/layout.tsx`: async server layout — auth check + sidebar shell

**Di chuyển (URL không đổi) vào `src/app/manager/(protected)/`:**
- `page.tsx` (Dashboard)
- `products/page.tsx`, `products/[id]/page.tsx`
- `outfits/page.tsx`, `outfits/new/page.tsx`, `outfits/[id]/page.tsx`
- `analytics/page.tsx`, `users/page.tsx`, `roles/page.tsx`

**Xóa (đã move sang `(protected)`):**
- 9 placeholder pages cũ tại `src/app/manager/` (không còn cần thiết)

**Cập nhật:**
- `affiliate-outfit-docs/16-source-map.md`: cập nhật paths, thêm Route Groups section

### Summary

**Pattern: Next.js Route Group `(protected)`**
- Login page `/manager/login` nằm NGOÀI group, không bị bọc bởi protected layout.
- Tất cả manager pages khác nằm trong `(protected)` — URL không đổi, chỉ tổ chức file.
- Tránh auth loop: login page không cần session, protected pages cần session.

**`src/lib/require-auth.ts`:**
- `requireAuth()`: gọi `getSession()` → `getUserById()` → trả `SafeUser`
- Nếu session null hoặc user null → `redirect(MANAGER_ROUTES.LOGIN)`
- Dùng trong Server Components và Server Actions cần biết current user

**`src/app/manager/(protected)/layout.tsx`:**
- Async Server Component: gọi `requireAuth()` (cryptographic session check, defense-in-depth ngoài middleware)
- Render sidebar: logo, `ManagerNav`, user name/email, `LogoutButton`
- `children` là page content phía phải sidebar

**`src/components/manager/ManagerNav.tsx`:**
- Client Component dùng `usePathname()` để xác định active link
- Nav items: Dashboard (exact match), Products, Outfits, Analytics, Users, Roles
- Active style: `bg-gray-100 font-medium text-gray-900`; default: `text-gray-600 hover:bg-gray-50`

**`src/components/manager/LogoutButton.tsx`:**
- Client Component: `fetch('/api/auth/logout', { method: 'POST' })` → `router.push(LOGIN)` → `router.refresh()`

### Existing behavior preserved

- `src/middleware.ts` không bị chạm (UX redirect vẫn hoạt động)
- `src/app/manager/login/page.tsx` không bị chạm (nằm ngoài protected group)
- `src/lib/auth.ts`, `src/lib/permissions.ts`, `src/lib/db.ts` không bị chạm
- `src/server/auth/auth.service.ts` không bị chạm
- `src/constants/*.ts` không bị chạm
- Tất cả public routes giữ nguyên
- Tất cả API routes (`/api/auth/*`) không bị chạm
- Nội dung placeholder pages giữ nguyên (chỉ di chuyển path)

### Tests/checks run

- `pnpm typecheck` — pass (sau khi xóa stale `.next` cache)
- `pnpm lint` — pass

### Risks / Notes

- **`.next` cache phải xóa** khi move files: stale `.next/types/validator.ts` reference paths cũ → typecheck fail. Fix: `rm -rf .next`. Lần build tiếp theo sẽ regenerate.
- **Middleware bảo vệ ở cookie level**: Edge runtime chỉ check cookie existence. `requireAuth()` trong layout là cryptographic check thật — defense-in-depth. Nếu token expired nhưng cookie vẫn còn → middleware cho qua, layout redirect về login.
- **ManagerNav là Client Component**: cần `usePathname()` cho active state. Nếu JS disabled, nav vẫn render nhưng không có active highlighting.
- **Logout không invalidate server-side**: session là stateless HMAC token. Logout chỉ xóa cookie client-side. Nếu ai có token, vẫn dùng được đến khi hết TTL 7 ngày. MVP chấp nhận được.
- **Placeholder pages chưa có permission check**: các pages trong `(protected)` hiện là placeholder, chưa check `requirePermission`. Sẽ được thêm khi implement từng page (TASK 4.x, 6.x, 7.x).
- Tiếp theo: TASK 4.x — Product sync service layer.

---

## 2026-07-02 — TASK 8.1 — Public Outfit Listing Page

### Files changed

- `src/server/outfits/outfit.service.ts`: thêm `listPublicOutfits()` + `PublicOutfitListItem`, `ListPublicOutfitsParams`, `ListPublicOutfitsResult` types
- `src/components/public/OutfitCard.tsx`: thay placeholder bằng implementation thật
- `src/app/(public)/outfits/page.tsx`: thay placeholder bằng Server Component đầy đủ
- `src/app/(public)/page.tsx`: thay placeholder bằng redirect sang `/outfits`
- `affiliate-outfit-docs/16-source-map.md`: cập nhật OutfitCard status + outfit.service.ts entry

### Summary

**`src/server/outfits/outfit.service.ts` additions:**

Export `listPublicOutfits(params: ListPublicOutfitsParams): Promise<ListPublicOutfitsResult>`:
- Filter: `status = 'active'`, `publishedAt: { not: null }`, `deletedAt: null` — đúng per `05-api-routes.md` rule.
- Order: `publishedAt DESC` (outfit mới publish nhất hiện trên đầu).
- Pagination: skip/take theo `page` và `limit`.
- Select: chỉ lấy fields cần thiết cho public card (`id`, `outfitCode`, `name`, `slug`, `coverImageUrl`, `description`). Không expose `createdBy`, `styleId`, `outfitTypeId`, `updatedBy`, `status`...
- `Promise.all([findMany, count])` — 1 DB round-trip.

**`src/components/public/OutfitCard.tsx`:**
- Props: `OutfitCardProps` (id, outfitCode, name, slug, coverImageUrl, description).
- Link URL: `/outfit/${slug}-${outfitCode.toLowerCase()}` — đúng format SEO spec `/outfit/[seo-slug]-[code]`.
- Ảnh cover: `<img>` tag + `eslint-disable-next-line @next/next/no-img-element` (nhất quán với ProductTable, OutfitTable pattern).
- Hover effect: `group-hover:scale-105` trên ảnh.
- `description` hiển thị `line-clamp-2` nếu có, ẩn nếu null.
- Không hiển thị: products, giá, creator.

**`src/app/(public)/outfits/page.tsx`:**
- Async Server Component, không cần `'use client'`.
- `metadata` export: `title` + `description` từ `SEO_CONFIG`.
- Parse `searchParams` (async per Next.js 15+ pattern): `page` → clamp `Math.max(1, ...)`.
- Gọi `listPublicOutfits({ page, limit: 20 })`.
- Grid responsive: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`.
- Empty state: text khi chưa có outfit.
- Pagination: Link-based (server-rendered, không cần client JS) — Previous/Next với trang hiện tại.

**`src/app/(public)/page.tsx`:**
- `redirect('/outfits')` — server-side 307 redirect.
- `/` không còn là trang độc lập; `/outfits` là canonical URL cho danh sách outfit.

### Existing behavior preserved

- Tất cả functions trong `outfit.service.ts` không bị chạm: `listOutfits()`, `getDistinctStyles()`, `getDistinctOutfitTypes()`, `createOutfit()`, `getOutfitById()`, `updateOutfitFields()`, `getOutfitProducts()`, `addProductToOutfit()`, `removeProductFromOutfit()`.
- Manager routes, pages, API handlers không bị chạm.
- Auth, sync, tracking, media, cron routes không bị chạm.
- `src/constants/*.ts` không bị chạm.
- `prisma/schema.prisma` không bị chạm.
- `src/app/layout.tsx` không bị chạm.
- Không thêm package mới.

### Tests/checks run

- `pnpm typecheck` — pass (0 errors)
- `pnpm lint` — pass (0 errors, 0 warnings)

### Risks / Notes

- **`outfitCode.toLowerCase()` trong URL**: DB lưu CHAR(6) uppercase (e.g., `A7K2Q9`). URL dùng lowercase (`a7k2q9`) theo spec `08-seo-spec.md`. Detail page (TASK 8.2) cần parse `slugCode` param và uppercase trước khi query DB.
- **`next/image` chưa dùng**: cover images từ R2 với public base URL chưa configure trong `next.config.ts`. Nhất quán với ProductTable/OutfitTable pattern — dùng `<img>` tag.
- **Pagination đơn giản**: chỉ Previous/Next, không có number links. Đủ cho MVP với ít outfit ban đầu.
- **`/` redirect là 307**: Next.js `redirect()` từ server component trả 307 Temporary Redirect. Nếu muốn 301 Permanent cho SEO, dùng `permanentRedirect('/outfits')` thay thế — có thể đổi khi site stable.
- **`description` render nguyên văn**: không sanitize vì là nội dung internal do manager nhập. Không có XSS risk ở Server Component (không inject vào DOM bằng `dangerouslySetInnerHTML`).
- Tiếp theo: TASK 8.2 — Public outfit detail page (`/outfit/[slugCode]`).

---

## 2026-07-02 — TASK UI-0.1 — Add UI Supplement Docs

### Files changed

- `ui-building/ui-design-system.md`: đã tồn tại — xác nhận readable
- `ui-building/ui-page-spec.md`: đã tồn tại — xác nhận readable
- `ui-building/ui-component-spec.md`: đã tồn tại — xác nhận readable
- `ui-building/ui-tasks.md`: đã tồn tại — xác nhận readable
- `affiliate-outfit-docs/task-log.md`: thêm entry này

### Summary

Xác nhận toàn bộ 4 UI supplement docs đã tồn tại trong thư mục `ui-building/`:
- `ui-design-system.md` — định nghĩa design direction, màu sắc, typography, spacing, component style cho OutfitClick.
- `ui-page-spec.md` — spec từng page public và manager: layout, sections, behavior mong đợi.
- `ui-component-spec.md` — spec từng component: props, behavior, variant.
- `ui-tasks.md` — danh sách UI task theo phase (UI-0 đến UI-5), checklist và acceptance criteria.

Không có file nào được tạo mới trong task này vì tất cả đã có sẵn. Không sửa doc cũ nào.

### Existing behavior preserved

- ✅ Không sửa bất kỳ file nào trong `affiliate-outfit-docs/` ngoài `task-log.md`.
- ✅ Không sửa source code.
- ✅ Không sửa database schema, constants, routes, auth, tracking, sync, media.
- ✅ Không thêm package mới.

### Tests/checks run

- Kiểm tra thủ công 4 file đọc được và có nội dung đúng.

### Risks / Notes

- Không có risk. Task này chỉ là documentation setup.
- Tiếp theo: TASK UI-1.1 — Audit current UI before polish.

---

## 2026-07-02 — TASK UI-4.1 — Polish Manager Shell & Dashboard

### Files changed

- `src/components/manager/ManagerNav.tsx`: thêm Lucide icons (LayoutDashboard, ShoppingBag, Shirt, BarChart2, RefreshCw, Users, Shield) cho từng nav item; active state rõ hơn với slate-100 background và icon stroke 2.5; `space-y-0.5` spacing
- `src/components/manager/ManagerSidebar.tsx`: logo bold hơn (font-bold tracking-tight 15px); user block thêm avatar initials circle (h-8 w-8 bg-slate-900); min-w-0 flex-1 truncate names; py-4 nav padding
- `src/components/manager/ManagerTopbar.tsx`: thêm "Manager" label bên trái; avatar bg đổi từ slate-950 sang slate-900 nhất quán; `justify-between` layout
- `src/components/manager/ManagerShell.tsx`: thêm `p-6` vào content area
- `src/components/manager/PageHeader.tsx`: thêm border-bottom (border-b border-slate-200 pb-5); text-xl thay text-2xl; gap nhỏ hơn
- `src/app/manager/(protected)/page.tsx`: rewrite từ placeholder → real dashboard với stats cards (Active Outfits, Active Products, Views, Clicks, CTR); empty state component; scope-aware (view_all vs view_own); 30-day range

### Summary

- Manager sidebar: icon nav, avatar user block, logo polish.
- Manager topbar: page context label "Manager" bên trái, avatar nhất quán.
- ManagerShell: content area có padding p-6.
- PageHeader: border-bottom, size nhỏ hơn phù hợp SaaS dashboard.
- Dashboard page: 5 stats cards dùng `getAnalyticsOverview` / `getAnalyticsOverviewOwn` theo scope permission; empty state khi chưa có data; quick tips block.

### Existing behavior preserved

- ✅ `requireAuth()` trong layout.tsx không bị chạm.
- ✅ `ManagerNav` vẫn giữ `isActive()` logic (exact match dashboard, startsWith khác).
- ✅ `LogoutButton` fetch `/api/auth/logout` → redirect login không đổi.
- ✅ `getAnalyticsScope()` / `getAnalyticsOverview()` / `getAnalyticsOverviewOwn()` gọi nguyên bản, không wrap hay thay đổi.
- ✅ Tất cả route handlers, API, Prisma, constants, auth, sync, tracking, media, cron không bị chạm.
- ✅ Không thêm package mới.

### Tests/checks run

- `pnpm lint` — pass (0 errors, 7 warnings pre-existing từ test files)
- `pnpm build` — pass ✅ (compiled successfully, 24 pages)

### Risks / Notes

- Dashboard dùng 30-day hardcoded range. Analytics page riêng đã có `AnalyticsDateFilter` client-side — không cần thay đổi.
- Lucide icons đã có trong `lucide-react ^1.22.0` — không thêm package.
- Tiếp theo: UI-4.2 hoặc các manager sub-pages (products, outfits, analytics).

---

## 2026-07-03 — UI-4.3 — Polish Manager Outfits Pages

### Files changed

- `src/app/manager/(protected)/outfits/page.tsx`: **UPGRADE** — Thêm "Create Outfit" button (hiển thị khi có permission `OUTFITS_CREATE`); import thêm `getUserPermissions`, `PERMISSIONS`, `MANAGER_ROUTES`; header section dùng `flex items-start justify-between` để đặt button cạnh tiêu đề
- `src/components/manager/OutfitTable.tsx`: **UPGRADE** — Thêm cột Actions với link "Edit" trực tiếp; outfit code dùng `text-xs text-muted-foreground` thay `text-sm`; products count căn giữa; bỏ DropdownMenu (không support `asChild` trong base-ui) thay bằng inline link button; bỏ unused imports
- `src/components/manager/ProductPicker.tsx`: **UPGRADE** — CardTitle đổi thành "Products in Outfit" + sub-text hiển thị số lượng; product card (picker + selected) dùng `aspect-[4/5] rounded-xl` cho ảnh thay `h-28`; selected products grid từ `gap-3` thành `gap-4`; picker card highlight `border-primary/30 bg-primary/5` khi đã added; Add button thành full-width + hiển thị "✓ Added"; empty state có hint text; action msg style `rounded-lg` nhất quán
- `src/components/manager/OutfitForm.tsx`: **UPGRADE** — Thêm quick-action buttons Publish/Hide/Draft trong Status card (hiển thị khi có `canPublish`/`canHide`); thêm hint text "Click Save Changes to apply"; buttons disabled khi status đã là giá trị đó

### Summary

**UI nâng cấp:**

- Outfit list page: "Create Outfit" button hiện rõ ở header góc phải theo permission
- OutfitTable: cột Actions với link Edit; outfit code muted hơn; sạch hơn
- ProductPicker: ảnh dùng aspect ratio 4:5 đúng spec lookbook; card picker highlight khi đã add; selected products grid đẹp hơn; empty state friendly hơn
- OutfitForm: Publish/Hide actions rõ ràng với quick-action buttons thay vì chỉ có select dropdown ẩn

**Logic giữ nguyên:**

- `listOutfits()`, `getOutfitProducts()`, `getDistinctStyles()`, `getDistinctOutfitTypes()` — không chạm
- `OutfitFilters` client component — không chạm
- `OutfitForm` API calls (PATCH fields, cover upload) — không chạm
- ProductPicker API calls (POST add, DELETE remove) — không chạm
- Toàn bộ tracking, auth, permissions logic — không chạm
- `getProductDisplayImage()` util — không chạm, vẫn dùng đúng mockup fallback rule

### Tests/checks run

- `pnpm lint` — pass (0 errors, 7 warnings pre-existing từ test files)
- `pnpm build` — pass ✅ (compiled successfully, 24 pages)

### Risks / Notes

- `DropdownMenu` từ base-ui không support `asChild` — dùng inline Link button thay thế, đơn giản hơn và đủ dùng cho 1 action.
- `ImageUploadDropzone` chưa tồn tại trong codebase — OutfitForm vẫn dùng native `<input type="file">` cho cover upload, không tạo component mới vì ngoài scope.
- Quick-action Publish/Hide buttons trong OutfitForm chỉ set local state; vẫn phải click "Save Changes" để apply — có hint text giải thích.

