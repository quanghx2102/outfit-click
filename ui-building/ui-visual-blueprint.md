# OutfitClick UI Visual Blueprint

## UI Direction

OutfitClick public site must look like a modern fashion commerce/lookbook website, similar to a curated fashion discovery platform.

It should feel:
- editorial
- visual-first
- fashion commerce
- premium but not over-decorated
- image-driven
- mobile-first

Do not create a plain centered landing page.
Do not create a SaaS/admin-looking public homepage.
Do not create a basic white empty page.

---

# Public Site Visual System

## Color Palette

Use this palette:

- Page background: `#FAF7F2` / warm ivory
- Main surface: `#FFFFFF`
- Main text: `#111111`
- Secondary text: `#6B645D`
- Muted text: `#9A9289`
- Border: `#E8DED2`
- Soft card: `#F3EEE7`
- Accent: `#9A7654` champagne brown
- Accent dark: `#5C4432`

Avoid:
- pure cold gray background
- too much slate blue
- bright colors
- heavy black blocks

---

## Typography

Use:
- Headings: elegant serif feel, use `font-serif`
- Body/UI: clean sans-serif, use `font-sans`

Public heading style:
- Hero H1 desktop: `text-6xl` to `text-7xl`, `tracking-tight`, `leading-[0.95]`
- Hero H1 mobile: `text-4xl`, `leading-tight`
- Section heading: `text-3xl` to `text-5xl`
- Body: `text-base`, `leading-7`
- Small label: uppercase, tracking-[0.24em], text-xs

Do not make all text tiny.

---

## Public Header

Height: 72px desktop, 64px mobile.

Layout:
- Left: logo `OUTFITCLICK`
- Center: navigation
  - Outfits
  - Styles
  - New Looks
- Right:
  - Search icon/button
  - subtle CTA: `Explore`

Style:
- sticky top
- background `rgba(250,247,242,0.85)`
- backdrop blur
- bottom border `#E8DED2`
- logo letter-spaced uppercase

---

## Public Homepage Layout

The homepage must have 5 sections:

### 1. Hero Section

Use split layout, not centered text only.

Desktop:
- Left 50%: big editorial headline
- Right 50%: image collage / featured outfit preview

Mobile:
- stacked layout
- hero image first or after headline

Hero content:
- eyebrow: `CURATED LOOKBOOK`
- H1: `Find outfit ideas that fit your style`
- subtitle: `Browse curated outfits and tap items you love.`
- primary CTA: `Explore outfits`
- secondary link: `View latest looks`

Hero visual:
- Large portrait card 4:5
- 2 smaller overlapping cards
- warm ivory background
- rounded-[2rem]
- soft shadow
- if no real data, use elegant placeholder gradient blocks, not blank empty circle

---

### 2. Featured Outfit Grid

Section title:
`Latest outfit ideas`

Grid:
- mobile: 2 columns
- tablet: 3 columns
- desktop: 4 columns

Outfit card:
- image ratio 4:5
- rounded-[1.5rem]
- image object-cover
- hover: image scale 1.03, card translate-y-[-4px]
- card background transparent
- title below image
- badge small: style/type
- outfit code subtle

No price.
No Buy button.
No creator.

---

### 3. Style Chips

Horizontal chips:
- Casual
- Streetwear
- Minimal
- Date Night
- Travel
- Summer
- Office

Style:
- rounded-full
- border champagne
- hover filled champagne dark text white

---

### 4. SEO Editorial Block

A warm ivory/white section with:
- small label: `STYLE GUIDE`
- heading: `Curated outfits for everyday inspiration`
- 2-column text on desktop
- short paragraph, not too much text

---

### 5. Footer

Minimal fashion footer:
- logo
- short description
- links
- subtle border top

---

# Public Outfit Detail Page

Layout must feel like a premium fashion product/editorial page.

## Top Section

Desktop:
- 2-column layout
- Left: large outfit cover image, ratio 4:5 or 3:4
- Right: outfit info sticky-ish

Right column:
- eyebrow: `OUTFIT CODE`
- code badge
- H1 large serif
- description
- style/type badges
- note: `Tap an item below to view it in Shopee`

No price.
No Buy button.

## Product Section

Title:
`Items in this outfit`

Product grid:
- mobile: 2 columns
- desktop: 3 or 4 columns
- card image ratio 1:1 or 4:5
- card rounded-2xl
- product name below image
- entire image and name link to `/go/[outfitCode]/[productId]`

Product card hover:
- subtle border accent
- image scale 1.03
- cursor pointer

No direct affiliate links.

---

# Empty State Public

If no outfits:
Do not show tiny centered dot.

Use a beautiful empty state:
- large soft rounded card
- title: `No outfits published yet`
- text: `New curated looks will appear here soon.`
- button/link: `Check manager`
- optional 3 placeholder fashion cards behind

---

# Manager UI Visual System

Manager should look like a modern SaaS dashboard, not fashion editorial.

## Manager Colors

- Background: `#F6F7F9`
- Sidebar: `#FFFFFF`
- Surface: `#FFFFFF`
- Text: `#111827`
- Muted: `#6B7280`
- Border: `#E5E7EB`
- Active nav: `#111827`
- Active nav text: `#FFFFFF`

## Manager Layout

Sidebar:
- width: 260px
- logo top
- nav items with icon + label
- active item dark background
- rounded-xl
- user card bottom

Main:
- topbar height 64px
- content max width full
- padding: 32px desktop, 16px mobile
- page header has title, subtitle, primary action

---

# Manager Products Page

Must include:

1. PageHeader
- title: `Products`
- subtitle: `Sync, enrich and manage affiliate products.`
- right action: `Sync products`

2. SyncProductsPanel
Card at top:
- title: `Sync products from source`
- input `urlSuffix`
- optional advanced fields collapsed:
  - affiliateId
  - affiliateUserId
  - cid
  - language
  - limit
- primary button: `Sync products`
- result summary after sync

3. Filter Bar
- search
- urlSuffix select
- group select
- status select
- missing mockup toggle
- missing DNA toggle

4. Product Table
Columns:
- image thumbnail
- product name
- urlSuffix
- group
- mockup badge
- DNA badge
- status badge
- last synced
- actions

Table style:
- white card
- rounded-2xl
- border
- row height 72px
- thumbnail 56x56 rounded-xl

5. Empty State
If no products:
- title: `No products yet`
- text: `Sync products by entering a urlSuffix.`
- button: `Sync products`

---

# Manager Users Page

Must include:
- title: `Users & Staff`
- primary button: `Add staff`
- table:
  - avatar
  - name/email
  - roles
  - status
  - last login
  - created
  - actions
- create staff dialog:
  - name
  - email
  - password
  - roles
  - status

---

# Manager Roles Page

Roles are DB-driven, not only hardcoded display.

Must include:
- list roles
- create role button
- edit role dialog
- permission matrix grouped by module
- user count per role
- system roles protected from dangerous delete

Permission group UI:
- module title
- permission chips/toggles
- selected permission count

---

# General Component Rules

Create/reuse:
- PublicHeader
- PublicFooter
- OutfitCard
- ProductClickCard
- ManagerShell
- PageHeader
- StatCard
- StatusBadge
- EmptyState
- SyncProductsPanel
- ProductTable
- UserTable
- RolePermissionMatrix

Do not duplicate card/table patterns.
Do not hardcode random colors in every component.
Use shared classes/components.