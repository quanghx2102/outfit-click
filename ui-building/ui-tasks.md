# UI Tasks — OutfitClick

> Mục tiêu: cải thiện UI bằng Tailwind + shadcn/ui mà **không sửa database, không sửa logic cũ, không sửa tracking/sync/auth nếu task không liên quan**.

## Prompt mở đầu áp dụng cho mọi UI task

```text
Bạn là Senior Frontend Engineer + UI Designer phụ trách project OutfitClick.

Task hiện tại:
[PASTE TASK ID + TITLE + CHECKLIST]

Tài liệu bắt buộc phải đọc trước:
[PASTE LIST TRONG TASK]

Quy tắc bắt buộc:
1. Chưa code ngay.
2. Trước tiên hãy đọc tài liệu và source liên quan.
3. Tóm tắt task này cần làm gì.
4. Audit UI hiện tại của page/component liên quan.
5. Liệt kê chính xác file sẽ sửa hoặc tạo mới.
6. Không sửa database/schema.
7. Không sửa product sync, tracking redirect, auth, permission nếu task không liên quan.
8. Không refactor unrelated code.
9. Không đổi route public/manager nếu chưa được yêu cầu.
10. Không thêm package mới nếu chưa hỏi trước.
11. Reuse shadcn/ui và component hiện có.
12. Sau khi code xong phải chạy lint/build nếu project hỗ trợ.
13. Sau khi code xong phải cập nhật task-log.md.
14. Cập nhật 16-source-map.md nếu tạo component/module/shared route quan trọng.

Bây giờ hãy phân tích và đưa kế hoạch sửa trước, chưa code.
```

---

# PHASE UI-0 — UI Documentation Setup

## TASK UI-0.1 — Add UI Supplement Docs

**Mục tiêu:** đưa tài liệu UI vào project mà không sửa tài liệu cũ.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/tasks.md
- affiliate-outfit-docs/task-log.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
- prompt.md
```

**Checklist:**

```text
- [ ] Add ui-design-system.md.
- [ ] Add ui-page-spec.md.
- [ ] Add ui-component-spec.md.
- [ ] Add ui-tasks.md.
- [ ] Do not edit old docs.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- UI docs exist and are readable.
- Old docs are not modified.
```

---

# PHASE UI-1 — Design Foundation

## TASK UI-1.1 — Audit Current UI Before Polish

**Mục tiêu:** đánh giá UI hiện tại, xác định màn hình/component xấu nhất, không code.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/08-seo-spec.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/14-project-structure.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- ui-design-system.md
- ui-page-spec.md
- ui-component-spec.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
```

**Checklist:**

```text
- [ ] Review public pages.
- [ ] Review manager pages.
- [ ] Review reusable components.
- [ ] Score public UI /10.
- [ ] Score manager UI /10.
- [ ] List pages/components needing polish.
- [ ] Propose UI polish order.
- [ ] Do not code.
```

**Acceptance Criteria:**

```text
- Có danh sách cụ thể page/component cần sửa.
- Có priority UI task order.
- Không có code changes.
```

---

## TASK UI-1.2 — Tailwind Theme & Global Polish

**Mục tiêu:** chuẩn hóa global background, typography, container, CSS variables nếu cần.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/14-project-structure.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- ui-design-system.md
- ui-component-spec.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
```

**Scope được phép:**

```text
- src/app/globals.css
- src/app/layout.tsx if needed
- tailwind config if project has it
- src/components/ui only if shadcn theme requires minimal adjustment
```

**Không được sửa:**

```text
- database/schema
- API route logic
- tracking redirect
- product sync
- auth/permission logic
```

**Checklist:**

```text
- [ ] Set clean base background.
- [ ] Set font smoothing.
- [ ] Ensure body text color consistent.
- [ ] Add reusable container utility if appropriate.
- [ ] Do not break shadcn theme variables.
- [ ] Lint/build.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Global UI feels cleaner.
- No feature behavior changed.
```

---

# PHASE UI-2 — Shared Components

## TASK UI-2.1 — Build Shared Public Components

**Mục tiêu:** tạo component public đẹp và tái sử dụng được.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/07-tracking-redirect.md
- affiliate-outfit-docs/08-seo-spec.md
- affiliate-outfit-docs/14-project-structure.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- ui-design-system.md
- ui-page-spec.md
- ui-component-spec.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
```

**Scope gợi ý:**

```text
- src/components/public/PublicHeader.tsx
- src/components/public/PublicFooter.tsx
- src/components/public/OutfitCard.tsx
- src/components/public/OutfitGrid.tsx
- src/components/public/OutfitHero.tsx
- src/components/public/ProductClickCard.tsx
- src/components/public/SeoContentBlock.tsx
- src/components/public/RelatedOutfits.tsx
```

**Checklist:**

```text
- [ ] OutfitCard follows lookbook style.
- [ ] ProductClickCard has no price/no buy button.
- [ ] ProductClickCard routes to /go, not Shopee direct.
- [ ] PublicHeader/Footer clean and lightweight.
- [ ] Components accept typed props.
- [ ] Components handle missing images gracefully.
- [ ] Lint/build.
- [ ] Update task-log.md.
- [ ] Update 16-source-map.md if these components are new major shared components.
```

**Acceptance Criteria:**

```text
- Public components can be reused on list/detail pages.
- No ecommerce UI pattern appears.
```

---

## TASK UI-2.2 — Build Shared Manager Components

**Mục tiêu:** tạo component manager dùng chung để UI đồng bộ.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/04-permission-matrix.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/14-project-structure.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- ui-design-system.md
- ui-page-spec.md
- ui-component-spec.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
```

**Scope gợi ý:**

```text
- src/components/manager/ManagerShell.tsx
- src/components/manager/ManagerSidebar.tsx
- src/components/manager/ManagerTopbar.tsx
- src/components/manager/PageHeader.tsx
- src/components/manager/StatusBadge.tsx
- src/components/manager/SearchFilterBar.tsx
- src/components/manager/EmptyState.tsx
- src/components/manager/LoadingState.tsx
- src/components/manager/ConfirmDialog.tsx
```

**Checklist:**

```text
- [ ] ManagerShell creates consistent layout.
- [ ] PageHeader reusable.
- [ ] StatusBadge uses constants/status mapping.
- [ ] SearchFilterBar supports common filters.
- [ ] Empty/loading states exist.
- [ ] No business logic added.
- [ ] Lint/build.
- [ ] Update task-log.md.
- [ ] Update 16-source-map.md if major shared components are added.
```

**Acceptance Criteria:**

```text
- Manager pages can reuse a consistent shell and components.
- No old logic broken.
```

---

# PHASE UI-3 — Public Pages

## TASK UI-3.1 — Polish Public Outfit List Page

**Mục tiêu:** làm public outfit list thành lookbook page đẹp, mobile-first.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/08-seo-spec.md
- affiliate-outfit-docs/14-project-structure.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- ui-design-system.md
- ui-page-spec.md
- ui-component-spec.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
```

**Scope gợi ý:**

```text
- src/app/(public)/page.tsx
- src/app/(public)/outfits/page.tsx
- src/components/public/OutfitCard.tsx
- src/components/public/OutfitGrid.tsx
- src/components/public/PublicHeader.tsx
- src/components/public/PublicFooter.tsx
- src/components/public/SeoContentBlock.tsx
```

**Checklist:**

```text
- [ ] Header clean.
- [ ] Hero short and fashion-focused.
- [ ] Outfit grid responsive.
- [ ] Outfit cards image-first.
- [ ] No price, no buy button, no creator.
- [ ] SEO content block exists.
- [ ] Mobile 375px looks good.
- [ ] Desktop 1440px looks good.
- [ ] Lint/build.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Public outfit list looks like fashion lookbook.
- User can click outfit to detail.
- Existing data fetching behavior is preserved.
```

---

## TASK UI-3.2 — Polish Public Outfit Detail Page

**Mục tiêu:** làm outfit detail đẹp và tối ưu click ảnh/tên sản phẩm qua tracking route.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/07-tracking-redirect.md
- affiliate-outfit-docs/08-seo-spec.md
- affiliate-outfit-docs/14-project-structure.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- ui-design-system.md
- ui-page-spec.md
- ui-component-spec.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
```

**Scope gợi ý:**

```text
- src/app/(public)/outfit/[slugCode]/page.tsx
- src/components/public/OutfitHero.tsx
- src/components/public/ProductClickCard.tsx
- src/components/public/RelatedOutfits.tsx
- src/components/public/SeoContentBlock.tsx
```

**Checklist:**

```text
- [ ] Breadcrumb and outfit hero polished.
- [ ] Product cards are clear click targets.
- [ ] Product image/name href goes to /go/[outfitCode]/[productId].
- [ ] No raw affiliate link in frontend.
- [ ] No price, no buy button, no creator.
- [ ] Related outfits section if data available.
- [ ] SEO text is readable.
- [ ] Mobile and desktop checked.
- [ ] Lint/build.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Outfit detail is visually strong.
- Product click flow is preserved.
- No tracking/redirect logic changed unless task explicitly requires it.
```

---

# PHASE UI-4 — Manager Pages

## TASK UI-4.1 — Polish Manager Shell & Dashboard

**Mục tiêu:** làm manager dashboard giống clean SaaS dashboard.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/04-permission-matrix.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/14-project-structure.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- ui-design-system.md
- ui-page-spec.md
- ui-component-spec.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
```

**Scope gợi ý:**

```text
- src/app/manager/layout.tsx
- src/app/manager/page.tsx
- src/components/manager/ManagerShell.tsx
- src/components/manager/ManagerSidebar.tsx
- src/components/manager/ManagerTopbar.tsx
- src/components/manager/PageHeader.tsx
```

**Checklist:**

```text
- [ ] Sidebar clean and consistent.
- [ ] Topbar not cluttered.
- [ ] Dashboard stats cards polished.
- [ ] Tables/summary blocks readable.
- [ ] Empty state if no analytics data.
- [ ] Existing permission/auth behavior preserved.
- [ ] Lint/build.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Manager shell looks professional.
- Pages under manager share same layout.
```

---

## TASK UI-4.2 — Polish Manager Products Page

**Mục tiêu:** cải thiện UI product list/table/filter mà không sửa sync logic.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/06-cron-sync-products.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/14-project-structure.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- ui-design-system.md
- ui-page-spec.md
- ui-component-spec.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
```

**Scope gợi ý:**

```text
- src/app/manager/products/page.tsx
- src/app/manager/products/[id]/page.tsx
- src/components/manager/ProductTable.tsx
- src/components/manager/SearchFilterBar.tsx
- src/components/manager/StatusBadge.tsx
- src/components/manager/ImageUploadDropzone.tsx if needed
```

**Checklist:**

```text
- [ ] Product table polished.
- [ ] Thumbnail clear.
- [ ] urlSuffix visible.
- [ ] Product DNA/mockup indicators clear.
- [ ] No price column.
- [ ] Actions dropdown clean.
- [ ] Empty/loading states.
- [ ] Does not change product sync service.
- [ ] Lint/build.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Manager products page is clean and usable.
- Existing product logic preserved.
```

---

## TASK UI-4.3 — Polish Manager Outfits Pages

**Mục tiêu:** cải thiện outfit list/create/edit UI, đặc biệt ProductPicker.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/01-database-schema.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/05-api-routes.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/14-project-structure.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- ui-design-system.md
- ui-page-spec.md
- ui-component-spec.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
```

**Scope gợi ý:**

```text
- src/app/manager/outfits/page.tsx
- src/app/manager/outfits/new/page.tsx
- src/app/manager/outfits/[id]/page.tsx
- src/components/manager/OutfitTable.tsx
- src/components/manager/ProductPicker.tsx
- src/components/manager/ImageUploadDropzone.tsx
```

**Checklist:**

```text
- [ ] Outfit list polished.
- [ ] Outfit code visible.
- [ ] Create/edit form uses clean two-column layout.
- [ ] ProductPicker uses mockup image fallback rule.
- [ ] Selected products are easy to review.
- [ ] No sort order UI.
- [ ] No price.
- [ ] Publish/hide actions are clear.
- [ ] Does not change outfit business logic unless needed.
- [ ] Lint/build.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Outfit workflow UI is easier to use.
- Existing create/edit/publish behavior preserved.
```

---

## TASK UI-4.4 — Polish Manager Analytics, Users, Roles Pages

**Mục tiêu:** cải thiện các màn hình quản trị phụ nếu đã có.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/03-constants.md
- affiliate-outfit-docs/04-permission-matrix.md
- affiliate-outfit-docs/07-tracking-redirect.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/14-project-structure.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- ui-design-system.md
- ui-page-spec.md
- ui-component-spec.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
```

**Scope gợi ý:**

```text
- src/app/manager/analytics/page.tsx
- src/app/manager/users/page.tsx
- src/app/manager/roles/page.tsx
- relevant manager components
```

**Checklist:**

```text
- [ ] Analytics cards/tables clean.
- [ ] Users table clean.
- [ ] Roles/permissions grouped by module.
- [ ] Dangerous actions use confirm dialog.
- [ ] Existing RBAC behavior preserved.
- [ ] Lint/build.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Admin screens look consistent with manager shell.
```

---

# PHASE UI-5 — Final UI Review

## TASK UI-5.1 — Screenshot Review & Polish Pass

**Mục tiêu:** review toàn bộ UI sau khi polish, fix vấn đề còn xấu.

**Tài liệu bắt buộc phải đọc trước:**

```text
- affiliate-outfit-docs/README.md
- affiliate-outfit-docs/00-system-overview.md
- affiliate-outfit-docs/08-seo-spec.md
- affiliate-outfit-docs/10-manager-workflows.md
- affiliate-outfit-docs/16-source-map.md
- affiliate-outfit-docs/task-log.md
- ui-design-system.md
- ui-page-spec.md
- ui-component-spec.md
- ui-review-checklist.md
- affiliate-outfit-docs/coding-standards.md
- affiliate-outfit-docs/rules.md
```

**Checklist:**

```text
- [ ] Review public home/outfit list.
- [ ] Review outfit detail.
- [ ] Review manager dashboard.
- [ ] Review products pages.
- [ ] Review outfit pages.
- [ ] Review analytics/users/roles if present.
- [ ] Test mobile 375px.
- [ ] Test desktop 1440px.
- [ ] Fix only visual/layout issues.
- [ ] Do not change business logic.
- [ ] Lint/build.
- [ ] Update task-log.md.
```

**Acceptance Criteria:**

```text
- Public UI đạt tối thiểu 8/10.
- Manager UI đạt tối thiểu 7.5/10.
- No price/buy button/creator accidentally added.
```
