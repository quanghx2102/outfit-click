# 03. Constants

File này định nghĩa constants dùng chung cho backend/frontend.

Gợi ý đặt ở:

```txt
src/constants/roles.ts
src/constants/permissions.ts
src/constants/status.ts
src/constants/media.ts
src/constants/tracking.ts
src/constants/routes.ts
```

---

# 1. Role codes

```ts
export const ROLE_CODES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  PRODUCT_STAFF: 'product_staff',
  OUTFIT_STAFF: 'outfit_staff',
  VIEWER: 'viewer',
} as const;
```

## Ý nghĩa

- `admin`: toàn quyền hệ thống.
- `manager`: quản lý product/outfit/analytics nhưng không quản lý role nếu không cấp quyền.
- `product_staff`: xử lý product DNA, mockup, product status.
- `outfit_staff`: tạo/sửa outfit, gắn product, upload cover.
- `viewer`: chỉ xem dữ liệu được cấp quyền.

---

# 2. Permission codes

```ts
export const PERMISSIONS = {
  DASHBOARD_VIEW_ALL: 'dashboard.view_all',
  DASHBOARD_VIEW_OWN: 'dashboard.view_own',

  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',

  ROLES_VIEW: 'roles.view',
  ROLES_MANAGE: 'roles.manage',

  PRODUCTS_VIEW_ALL: 'products.view_all',
  PRODUCTS_VIEW_ASSIGNED: 'products.view_assigned',
  PRODUCTS_UPDATE: 'products.update',
  PRODUCTS_UPDATE_DNA: 'products.update_dna',
  PRODUCTS_UPLOAD_MOCKUP: 'products.upload_mockup',
  PRODUCTS_ASSIGN: 'products.assign',
  PRODUCTS_DELETE: 'products.delete',

  OUTFITS_VIEW_ALL: 'outfits.view_all',
  OUTFITS_VIEW_OWN: 'outfits.view_own',
  OUTFITS_CREATE: 'outfits.create',
  OUTFITS_UPDATE: 'outfits.update',
  OUTFITS_DELETE: 'outfits.delete',
  OUTFITS_PUBLISH: 'outfits.publish',
  OUTFITS_HIDE: 'outfits.hide',
  OUTFITS_ADD_PRODUCT: 'outfits.add_product',
  OUTFITS_REMOVE_PRODUCT: 'outfits.remove_product',

  ANALYTICS_VIEW_ALL: 'analytics.view_all',
  ANALYTICS_VIEW_OWN: 'analytics.view_own',

  MEDIA_UPLOAD: 'media.upload',
  MEDIA_DELETE: 'media.delete',

  SYNC_VIEW: 'sync.view',
  SYNC_RUN: 'sync.run',

  SETTINGS_MANAGE: 'settings.manage',
} as const;
```

---

# 3. User status

```ts
export const USER_STATUS = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  DELETED: 'deleted',
} as const;
```

---

# 4. Product status

```ts
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MISSING_FROM_SOURCE: 'missing_from_source',
  DELETED: 'deleted',
} as const;
```

## Ý nghĩa

- `active`: sản phẩm có thể dùng trong outfit.
- `inactive`: ẩn khỏi manager/public selection.
- `missing_from_source`: cron không còn thấy sản phẩm trong API, không xóa cứng ngay.
- `deleted`: soft delete.

---

# 5. Outfit status

```ts
export const OUTFIT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  HIDDEN: 'hidden',
  DELETED: 'deleted',
} as const;
```

## Ý nghĩa

- `draft`: chưa public.
- `active`: public và index được.
- `hidden`: không public, không đưa sitemap.
- `deleted`: soft delete.

---

# 6. Sync status

```ts
export const SYNC_STATUS = {
  RUNNING: 'running',
  SUCCESS: 'success',
  PARTIAL_SUCCESS: 'partial_success',
  FAILED: 'failed',
} as const;
```

---

# 7. Media entity type

```ts
export const MEDIA_ENTITY_TYPE = {
  PRODUCT: 'product',
  OUTFIT: 'outfit',
} as const;
```

---

# 8. Media type

```ts
export const MEDIA_TYPE = {
  PRODUCT_MOCKUP: 'product_mockup',
  PRODUCT_TRANSPARENT: 'product_transparent',
  OUTFIT_COVER: 'outfit_cover',
  OUTFIT_ANCHOR: 'outfit_anchor',
} as const;
```

---

# 9. Tracking constants

```ts
export const TRACKING_COOKIE = {
  USER_ID: 'aos_uid',
  SESSION_ID: 'aos_sid',
} as const;

export const TRACKING_CONFIG = {
  SESSION_TTL_MINUTES: 30,
  USER_COOKIE_TTL_DAYS: 365,
  DUPLICATE_CLICK_WINDOW_SECONDS: 30,
  MAX_CLICKS_PER_SESSION_PER_MINUTE: 20,
} as const;
```

---

# 10. Click invalid reasons

```ts
export const CLICK_INVALID_REASON = {
  DUPLICATE_CLICK_30S: 'duplicate_click_30s',
  BOT_USER_AGENT: 'bot_user_agent',
  TOO_MANY_CLICKS_PER_SESSION: 'too_many_clicks_per_session',
  MANAGER_PREVIEW: 'manager_preview',
  PRODUCT_NOT_IN_OUTFIT: 'product_not_in_outfit',
  PRODUCT_INACTIVE: 'product_inactive',
  OUTFIT_INACTIVE: 'outfit_inactive',
} as const;
```

---

# 11. Redirect route constants

```ts
export const PUBLIC_ROUTES = {
  HOME: '/',
  OUTFITS: '/outfits',
  OUTFIT_DETAIL_PREFIX: '/outfit',
  REDIRECT_PREFIX: '/go',
} as const;

export const MANAGER_ROUTES = {
  LOGIN: '/manager/login',
  DASHBOARD: '/manager',
  PRODUCTS: '/manager/products',
  OUTFITS: '/manager/outfits',
  USERS: '/manager/users',
  ROLES: '/manager/roles',
  ANALYTICS: '/manager/analytics',
  SYNC_LOGS: '/manager/sync-logs',
} as const;
```

---

# 12. SEO constants

```ts
export const SEO_CONFIG = {
  SITE_NAME: 'Affiliate Outfit Site',
  DEFAULT_TITLE: 'Gợi ý phối đồ đẹp mỗi ngày',
  DEFAULT_DESCRIPTION: 'Khám phá các outfit đẹp, dễ phối và các item gợi ý theo từng phong cách.',
  ROBOTS_INDEX_FOLLOW: 'index, follow',
  ROBOTS_NOINDEX_NOFOLLOW: 'noindex, nofollow',
} as const;
```
