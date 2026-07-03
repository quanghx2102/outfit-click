# UI Page Spec — OutfitClick

## 1. Public Homepage / Outfit List

### Purpose

Public user xem danh sách outfit. Khi bấm ảnh/card outfit sẽ vào trang chi tiết outfit. Không hiển thị sản phẩm riêng ở trang này.

### Layout

```txt
PublicHeader
Hero section
Search/filter style chips
OutfitGrid
SEO content block
PublicFooter
```

### Hero Content

```txt
Headline: Find outfit ideas that fit your style
Subtitle: Discover curated outfit ideas and tap into items you like.
CTA optional: Explore outfits
```

Không dùng CTA kiểu `Buy now`.

### Outfit Card

```txt
Image: large, 4:5 ratio, object-cover
Title: clear, line-clamp-2
Badges: style/type subtle
Outfit code: small, muted
No price
No buy button
No creator
Click: image/card -> outfit detail
```

### Responsive

```txt
Mobile: 2-column grid if cards compact; otherwise 1-column for premium editorial layout.
Tablet: 3 columns.
Desktop: 4 columns.
```

### Acceptance Criteria

```txt
- Page looks like fashion lookbook, not ecommerce listing.
- No price, no buy button, no creator.
- Outfit images are dominant.
- Page has SEO text area.
- Mobile layout is clean and not cramped.
```

---

## 2. Public Outfit Detail Page

### Purpose

User xem outfit detail và danh sách sản phẩm thuộc outfit. Click ảnh/tên sản phẩm sẽ tracking + redirect Shopee affiliate/app.

### Layout

```txt
PublicHeader
Breadcrumb
OutfitHero
Outfit title + outfit code
Description
Style/type badges
Products section
Related outfits
SEO content block
PublicFooter
```

### Product Section

Title:

```txt
Items in this outfit
```

Product card:

```txt
Image: use mockup_image_url if available; fallback image_url
Name: clickable
No price
No buy button
No stock badge
No creator
Click image/name -> /go/[outfitCode]/[productId]
```

### Product Click Rule

Frontend must not use raw Shopee affiliate URL directly.

Correct:

```txt
<a href="/go/A7K2Q9/productId">Product image/name</a>
```

Wrong:

```txt
<a href="https://shopee.vn/...affiliate...">Product image/name</a>
```

### Acceptance Criteria

```txt
- Outfit cover is visually strong.
- Product cards are clear click targets.
- No price, no buy button, no creator.
- Product click goes through internal tracking route.
- Page has enough text for SEO.
- Related outfits present if data available.
```

---

## 3. Manager Dashboard

### Purpose

Admin/Manager/Staff xem overview theo permission/scope.

### Layout

```txt
ManagerShell
PageHeader
Stats grid
Product processing summary
Outfit status summary
Recent sync logs
Top outfits table
Top products table
```

### Stat Cards

```txt
Total outfits
Active outfits
Draft outfits
Total products
Products without mockup
Products without Product DNA
Total views
Total clicks
CTR
```

### Acceptance Criteria

```txt
- Looks like clean SaaS dashboard.
- Cards use consistent style.
- Tables are readable.
- Scope/permission is not visually misleading.
- Empty states are present if no data.
```

---

## 4. Manager Products Page

### Purpose

Admin/Staff quản lý sản phẩm sync từ API theo urlSuffix. Product là internal data, không phải public product page.

### Layout

```txt
ManagerShell
PageHeader: Products
Description
SearchFilterBar
ProductTable
Pagination
EmptyState
```

### Filters

```txt
Search by name
Filter by urlSuffix
Filter by status
Filter by has mockup / missing mockup
Filter by has Product DNA / missing Product DNA
```

### Table Columns

```txt
Thumbnail
Product name
urlSuffix
External link ID
Mockup indicator
Product DNA indicator
StatusBadge
Last synced at
Actions dropdown
```

### Actions

```txt
Edit Product DNA
Upload mockup
Set active/inactive
View raw source data optional
```

### Acceptance Criteria

```txt
- No price column.
- Thumbnail is clear.
- Status is badge-based.
- Table not cramped.
- Actions are in dropdown.
- Empty/loading states exist.
```

---

## 5. Manager Product Detail/Edit Page

### Purpose

Cập nhật Product DNA, mockup, status, assigned user nếu có.

### Layout

```txt
PageHeader
2-column layout
Left: image preview/mockup upload
Right: product fields form
Bottom: save actions
```

### Fields

```txt
Name: read/update depending scope
urlSuffix: read-only
external_link_id: read-only
external_item_id: read-only
Product DNA textarea
mockup image upload/preview
status select
raw_json view optional in collapsible panel
```

### Acceptance Criteria

```txt
- Mockup preview is clear.
- Product DNA textarea comfortable for long text.
- External source fields are visually read-only.
- Save action is obvious.
```

---

## 6. Manager Outfit List Page

### Purpose

Quản lý danh sách outfit, status, publish/hide, edit.

### Layout

```txt
ManagerShell
PageHeader: Outfits
Create outfit button
SearchFilterBar
OutfitTable or visual list
Pagination
EmptyState
```

### Table Columns

```txt
Cover thumbnail
Outfit name
Outfit code
Style/type
Products count
StatusBadge
Published at
Actions dropdown
```

### Acceptance Criteria

```txt
- Outfit cover thumbnail visible.
- Outfit code easy to copy/search.
- Status clear.
- Create button visible.
```

---

## 7. Manager Create/Edit Outfit Page

### Purpose

Admin/Staff tạo outfit từ các product đã sync.

### Layout

Two-column layout.

Left column:

```txt
Outfit title
Outfit code read-only or auto-generate
Description textarea
Style select
Outfit type select
Status select
Cover image upload
```

Right column:

```txt
Product search
urlSuffix filter
Product picker grid/list
Selected products section
Product card with image/name/mockup indicator
Remove product action
```

Bottom/sticky actions:

```txt
Save draft
Preview
Publish
```

### Product Picker Rule

Display image priority:

```txt
mockup_image_url -> image_url fallback
```

No product sort order required.

### Acceptance Criteria

```txt
- Product picker is visual, not only table text.
- Selected products are easy to review.
- Save/Preview/Publish actions are clear.
- No price anywhere.
- Does not change tracking or sync logic.
```

---

## 8. Manager Users/Roles Pages

### Purpose

Admin quản lý user/role/permission nếu feature đã build.

### UI Rule

```txt
Clean SaaS table
Status badges
Permission grouping by module
Role detail page or dialog
```

### Acceptance Criteria

```txt
- Permissions are grouped by module.
- Dangerous actions require confirmation.
- No accidental role edits.
```
