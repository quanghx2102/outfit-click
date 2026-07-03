# 14. Project Structure

Gợi ý cấu trúc thư mục Next.js App Router.

```txt
src/
  app/
    (public)/
      page.tsx
      outfits/
        page.tsx
      outfit/
        [slugCode]/
          page.tsx
    manager/
      login/
        page.tsx
      page.tsx
      products/
        page.tsx
        [id]/
          page.tsx
      outfits/
        page.tsx
        new/
          page.tsx
        [id]/
          page.tsx
      analytics/
        page.tsx
      users/
        page.tsx
      roles/
        page.tsx
    api/
      auth/
      manager/
        products/
        outfits/
        media/
        analytics/
      cron/
        sync-products/
          route.ts
      tracking/
        outfit-view/
          route.ts
    go/
      [outfitCode]/
        [productId]/
          route.ts
    robots.ts
    sitemap.ts

  components/
    ui/
    public/
      OutfitCard.tsx
      ProductClickCard.tsx
    manager/
      ProductTable.tsx
      OutfitTable.tsx
      ProductPicker.tsx
      PermissionGate.tsx

  constants/
    roles.ts
    permissions.ts
    status.ts
    media.ts
    tracking.ts
    routes.ts

  lib/
    db.ts
    auth.ts
    permissions.ts
    r2.ts
    tracking.ts
    seo.ts
    slug.ts
    outfit-code.ts
    ip-hash.ts

  modules/
    products/
      product.service.ts
      product.repository.ts
      product.mapper.ts
      product.validation.ts
    outfits/
      outfit.service.ts
      outfit.repository.ts
      outfit.validation.ts
    sync/
      mycollection.client.ts
      sync-products.service.ts
      sync-products.mapper.ts
    tracking/
      click-tracking.service.ts
      view-tracking.service.ts
      anti-spam.service.ts
    media/
      media.service.ts
      media.validation.ts

  prisma/
    schema.prisma
    seed.ts
```

## 1. Public vs Manager

Public pages nên nhẹ, SEO tốt, ít client JS.

Manager pages có thể dùng nhiều client components hơn:

```txt
TanStack Table
Form dialogs
Upload UI
Filters
```

## 2. Service layer rule

Không viết toàn bộ logic trong route handler.

Route handler nên:

```txt
validate request
check auth/permission
call service
return response
```

Business logic để trong:

```txt
src/modules/*/*.service.ts
```

Database query để trong repository nếu project lớn hơn.

## 3. Zod validation

Dùng Zod cho input:

```txt
create outfit
update outfit
update product
upload media
cron config nếu có
```

## 4. Naming convention

Database snake_case:

```txt
outfit_code
created_at
```

TypeScript camelCase:

```txt
outfitCode
createdAt
```

ORM mapper xử lý chuyển đổi nếu cần.

## 5. Manager route protection

Tất cả route `/manager/*` check login.

Tất cả API `/api/manager/*` check:

```txt
authenticated
permission
scope
```

## 6. Public route rule

Public chỉ query:

```txt
status = active
deleted_at IS NULL
```

## 7. Redirect route rule

`/go` dùng route handler server-side.

Không dùng client-side redirect thẳng affiliate link vì sẽ mất tracking.
