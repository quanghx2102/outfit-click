# UI Component Spec — OutfitClick

## 1. Public Components

### PublicHeader

Purpose: navigation for public outfit pages.

Props suggestion:

```ts
type PublicHeaderProps = {
  activePath?: string;
};
```

UI:

```txt
Logo left
Nav right: Outfits, Styles, About
Mobile responsive
Height 64px approx
White/transparent background
Border bottom optional
```

---

### OutfitCard

Purpose: show one outfit in public list.

Required content:

```txt
cover image
name/title
style/type badge optional
outfit_code small muted optional
```

Forbidden:

```txt
price
buy button
creator
product count if it makes UI too internal
```

Click behavior:

```txt
click card/image -> outfit detail route
```

Style:

```txt
rounded-2xl
image ratio 4:5
border slate-200
hover shadow-md + subtle translate-y
```

---

### ProductClickCard

Purpose: product inside outfit detail.

Required content:

```txt
display image = mockup_image_url || image_url
product name
```

Forbidden:

```txt
price
buy button
cart
stock label
creator/shop badge unless explicitly requested
```

Click behavior:

```txt
image and name href = /go/[outfitCode]/[productId]
```

Style:

```txt
rounded-2xl card
image clear and large
name line-clamp-2
hover border/slate shadow
```

---

### OutfitHero

Purpose: top of outfit detail.

Content:

```txt
breadcrumb
cover image
outfit title
outfit code
style/type badges
description
```

Style:

```txt
large visual
mobile-first
not too much text above products
```

---

## 2. Manager Components

### ManagerShell

Purpose: consistent layout for manager pages.

Composition:

```txt
ManagerSidebar
ManagerTopbar
main content container
```

Rule:

```txt
All /manager pages must use ManagerShell.
```

---

### PageHeader

Purpose: consistent page header.

Props:

```ts
type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};
```

Style:

```txt
flex responsive
margin-bottom 24px
heading text-2xl font-semibold
muted description
```

---

### StatusBadge

Purpose: render statuses consistently.

Inputs:

```txt
active/inactive/deleted
draft/active/hidden/deleted
success/failed/running
valid/suspicious/invalid
```

Rule:

```txt
Do not write status color classes in each page.
Use StatusBadge.
```

---

### SearchFilterBar

Purpose: common search/filter block.

UI:

```txt
search input
select filters
reset button optional
responsive wrap
```

---

### ProductTable

Purpose: manager product list.

Required:

```txt
thumbnail
name
urlSuffix
status
mockup indicator
Product DNA indicator
actions
```

Rule:

```txt
No price column.
No public product link.
```

---

### OutfitTable

Purpose: manager outfit list.

Required:

```txt
cover thumbnail
name
outfit code
style/type
status
published_at
actions
```

---

### ProductPicker

Purpose: select products for outfit.

Display rule:

```txt
image = mockup_image_url || image_url
```

Required UI:

```txt
search
urlSuffix filter
product grid/list
selected state
remove action
```

---

### ImageUploadDropzone

Purpose: upload cover/mockup images.

States:

```txt
idle
hover/dragging
uploading
uploaded with preview
error
```

Validation:

```txt
image only
max size from media spec
folder/type must be controlled by caller
```

---

### EmptyState

Purpose: consistent empty data UI.

Props:

```ts
type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};
```

---

### LoadingState

Purpose: loading table/card/page.

Rule:

```txt
Use skeletons where possible.
Avoid layout shift.
```

---

### ConfirmDialog

Purpose: dangerous actions.

Required actions:

```txt
hide outfit
delete outfit
set product inactive
remove selected product
```

## 3. Shared Component Rules

```txt
- Do not duplicate card/table/status logic.
- Use shadcn/ui primitives.
- Keep presentational components mostly logic-light.
- Business logic belongs in modules/services/actions.
- Use constants for statuses and routes.
- All image components should handle missing image gracefully.
```
