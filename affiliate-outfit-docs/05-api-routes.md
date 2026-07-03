# 05. API Routes

Framework: Next.js App Router.

Backend dùng Route Handlers với Node.js runtime.

---

# 1. Public pages

```txt
GET /                         Home hoặc outfit feed
GET /outfits                  Danh sách outfit active
GET /outfit/[slugCode]        Chi tiết outfit active
GET /go/[outfitCode]/[productId] Tracking + redirect Shopee affiliate
GET /sitemap.xml              Sitemap index
GET /sitemap-outfits.xml      Sitemap outfit pages
GET /robots.txt               Robots rules
```

## Public outfit list

```txt
GET /outfits?page=1&style=casual&type=di-choi
```

Data trả về:

```ts
{
  items: Array<{
    id: string;
    outfitCode: string;
    name: string;
    slug: string;
    coverImageUrl: string;
    description?: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

Rule:

```txt
status = active
published_at IS NOT NULL
deleted_at IS NULL
```

## Public outfit detail

```txt
GET /outfit/phoi-do-di-choi-nu-a7k2q9
```

Data cần render:

```ts
{
  outfit: {
    id: string;
    outfitCode: string;
    name: string;
    slug: string;
    description: string | null;
    coverImageUrl: string;
    style?: { name: string; slug: string };
    outfitType?: { name: string; slug: string };
  };
  products: Array<{
    id: string;
    name: string;
    displayImageUrl: string;
    redirectPath: string;
  }>;
}
```

Không trả thẳng affiliate link ra frontend nếu muốn kiểm soát tracking tốt. Frontend chỉ dùng:

```txt
/go/{outfitCode}/{productId}
```

---

# 2. Redirect route

```txt
GET /go/[outfitCode]/[productId]
```

Flow:

```txt
1. Tìm outfit active theo outfit_code.
2. Check product active và thuộc outfit đó.
3. Lấy redirect_url = h5_link || affiliate_url.
4. Nếu invalid, redirect về outfit detail hoặc 404.
5. Ghi click tracking không làm chậm redirect.
6. Redirect 302 sang Shopee affiliate/app link.
```

Không index route này.

---

# 3. Manager auth

```txt
GET  /manager/login
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Nếu dùng Auth.js thì route có thể theo convention riêng.

---

# 4. Manager products

```txt
GET    /api/manager/products
GET    /api/manager/products/[id]
PATCH  /api/manager/products/[id]
POST   /api/manager/products/[id]/mockup
DELETE /api/manager/products/[id]
```

## GET products query

```txt
/api/manager/products?urlSuffix=outfitsdepoday&status=active&keyword=ao&page=1&limit=50
```

Filter nên có:

```txt
urlSuffix
status
external_group_id
external_group_name
assigned_to
keyword
hasMockup=true/false
hasProductDna=true/false
```

## PATCH product body

```ts
{
  name?: string;
  productDna?: string | null;
  mockupImageUrl?: string | null;
  status?: 'active' | 'inactive' | 'missing_from_source' | 'deleted';
  assignedTo?: string | null;
}
```

Không cho update `external_link_id`, `url_suffix` tùy tiện sau khi sync.

---

# 5. Manager outfits

```txt
GET    /api/manager/outfits
POST   /api/manager/outfits
GET    /api/manager/outfits/[id]
PATCH  /api/manager/outfits/[id]
DELETE /api/manager/outfits/[id]
POST   /api/manager/outfits/[id]/products
DELETE /api/manager/outfits/[id]/products/[productId]
POST   /api/manager/outfits/[id]/publish
POST   /api/manager/outfits/[id]/hide
POST   /api/manager/outfits/[id]/cover
```

## POST outfit body

```ts
{
  name: string;
  description?: string;
  coverImageUrl: string;
  styleId?: string;
  outfitTypeId?: string;
}
```

Backend tự sinh:

```txt
outfit_code
slug
created_by
status = draft
```

## Add product to outfit

```ts
{
  productId: string;
}
```

Rule:

```txt
product must be active
unique(outfit_id, product_id)
```

---

# 6. Manager analytics

```txt
GET /api/manager/analytics/overview
GET /api/manager/analytics/outfits
GET /api/manager/analytics/products
GET /api/manager/analytics/sessions
```

Metrics MVP:

```txt
outfit_views
product_clicks
CTR = valid_clicks / views
top outfits by click
top products by click
clicks by url_suffix
```

---

# 7. Media upload

```txt
POST /api/manager/media/upload
DELETE /api/manager/media/[id]
```

Upload target:

```ts
{
  entityType: 'product' | 'outfit';
  entityId: string;
  mediaType: 'product_mockup' | 'outfit_cover' | 'product_transparent' | 'outfit_anchor';
}
```

Sau upload:

- Lưu file lên Cloudflare R2.
- Ghi `media_assets`.
- Nếu `mediaType = product_mockup`, update `products.mockup_image_url`.
- Nếu `mediaType = outfit_cover`, update `outfits.cover_image_url`.

---

# 8. Cron/sync

```txt
GET /api/cron/sync-products
```

Security:

```txt
Header: Authorization: Bearer CRON_SECRET
```

Hoặc:

```txt
GET /api/cron/sync-products?secret=...
```

Khuyến nghị dùng header secret.

---

# 9. Tracking API optional

Nếu outfit view không ghi server-side được, dùng API:

```txt
POST /api/tracking/outfit-view
```

Body:

```ts
{
  outfitCode: string;
  sessionId?: string;
  cookieId?: string;
}
```

Click tracking nên xử lý trong `/go` để tránh mất tracking.
