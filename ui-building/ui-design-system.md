# UI Design System — OutfitClick

## 1. Product UI Direction

OutfitClick là website affiliate dạng **outfit-first**. UI không được giống một trang ecommerce truyền thống. Public user chỉ xem outfit và click sản phẩm trong outfit để đi Shopee affiliate/app.

### Public Site Vibe

```txt
Clean fashion lookbook
Modern outfit inspiration
Image-first
Mobile-first
Lightweight SEO site
Premium but simple
No ecommerce pressure
```

### Manager Vibe

```txt
Modern SaaS dashboard
shadcn/ui style
Clean tables
Clear status badges
Fast internal workflow
Minimal but professional
```

## 2. Hard Rules

Public UI không được có:

```txt
- Product public page
- Creator page
- Price display
- Buy Now button
- Add to cart
- Checkout
- Ecommerce promo banner quá nặng
```

Public UI bắt buộc:

```txt
- Outfit list page
- Outfit detail page
- Product image/name click target inside outfit detail
- Click target must route through internal tracking URL `/go/[outfitCode]/[productId]`
```

## 3. Visual Tokens

### Colors

Use Tailwind/shadcn CSS variables as base.

```txt
Base background: white / slate-50
Card background: white
Manager background: slate-50
Text primary: slate-950
Text secondary: slate-600
Text muted: slate-500
Border: slate-200
Soft border: slate-100
Primary action: slate-950 / black
Primary action text: white
Fashion accent: rose-100, rose-200, rose-500, muted pink only as accent
Success: emerald
Warning: amber
Danger: red
Info: sky / blue
```

Do not overuse pink/rose. Fashion accent is for small badges, highlights, empty illustrations, or active filter chips only.

### Typography

```txt
Font: Inter or system sans-serif
Public H1 desktop: text-4xl to text-5xl, font-semibold/semibold
Public H1 mobile: text-3xl, font-semibold
Manager page title: text-2xl, font-semibold
Section title: text-xl or text-2xl, font-semibold
Card title: text-sm to text-base, font-medium/semibold
Body: text-sm or text-base
Muted text: text-sm text-slate-500/600
```

### Radius

```txt
Main card radius: rounded-2xl
Small card/table row image: rounded-xl
Buttons: rounded-xl
Badges: rounded-full
Dialogs: rounded-2xl
Inputs: rounded-xl
```

### Shadow

Use subtle shadows only:

```txt
Default card: border + shadow-sm optional
Hover card: shadow-md
No heavy drop shadows
No glassmorphism unless explicitly needed
```

### Spacing

```txt
Page horizontal padding mobile: px-4
Page horizontal padding tablet: px-6
Page max width public: max-w-7xl
Page max width article/detail: max-w-5xl or max-w-6xl
Manager content padding: p-6 to p-8
Card padding: p-4 to p-6
Section gap: py-10 to py-16 public
Manager block gap: gap-4 to gap-6
```

## 4. Public Layout Rule

### Header

```txt
Height: compact, 64px approx
Logo left: OutfitClick
Nav right: Outfits, Styles, About
Mobile: simple menu or compact nav
Sticky optional, but avoid heavy effects
```

### Outfit Feed

```txt
Hero: short and SEO-friendly
Search/filter: clean chips, no ecommerce filter overload
Grid:
- Mobile: 2 columns if cards are compact, 1 column if image large
- Tablet: 3 columns
- Desktop: 4 columns
Card image ratio: 4:5 preferred
```

### Outfit Detail

```txt
Breadcrumb
Large outfit cover
Title + code + description
Product grid under outfit
Related outfits
SEO content block
```

## 5. Manager Layout Rule

Manager must use consistent shell:

```txt
Sidebar left
Topbar
Main content area
PageHeader on every page
Stat cards on dashboard
DataTable style for list pages
StatusBadge for statuses
Action dropdown for row actions
EmptyState for empty list
```

### Sidebar

```txt
Width desktop: 240px to 280px
Background: white
Border-right: slate-200
Active nav: slate-950 text + slate-100 background or rose accent line
Icons optional but consistent
```

### Topbar

```txt
Height: 56-64px
Right side: user menu, quick status, sync indicator optional
No clutter
```

## 6. Interaction Rule

Public:

```txt
Outfit card hover: subtle translate-y, shadow-md
Product card hover: image zoom very subtle or border accent
Click target: image and product name
No button needed
```

Manager:

```txt
Tables: row hover background slate-50
Actions: dropdown menu
Danger actions: confirm dialog
Forms: clear labels, helper text, validation message
Uploads: drag/drop zone with preview
```

## 7. Accessibility

```txt
Use semantic headings
Images require alt text
Clickable cards must be keyboard accessible where practical
Color contrast must be readable
Do not rely on color only for status
```

## 8. Implementation Rules

```txt
Use Tailwind + shadcn/ui.
Avoid hard-coded random colors.
Avoid duplicated UI patterns.
Use reusable components.
Do not place business logic inside presentational components.
Public pages should remain SEO-friendly and server-rendered where possible.
Manager pages can use client components where necessary.
```
