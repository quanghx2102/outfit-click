# 01. Database Schema MVP

Database đề xuất: PostgreSQL.

ORM đề xuất: Prisma cho MVP.

## 1. Bảng cần có trong MVP

```txt
users
roles
permissions
user_roles
role_permissions

products
outfits
outfit_products

outfit_view_logs
click_logs
sync_logs
media_assets

styles
outfit_types
product_categories
```

## 2. Bảng chưa cần trong MVP

```txt
api_sources
source_groups
tasks
creators
product_links
client_events
```

Lý do:

- `api_sources`: chưa cần nếu urlSuffix/source config còn ít và có thể để trong ENV/config.
- `source_groups`: chưa cần nếu chỉ lưu `external_group_id`, `external_group_name` trong products.
- `tasks`: chưa cần nếu chỉ dùng `assigned_to`, status, permission.
- `creators`: không có trang creator và outfit không cần creator.
- `product_links`: chưa cần nếu mỗi product có 1 affiliate link chính.
- `client_events`: chưa cần nếu chỉ tracking view/click.

---

# 3. users

Lưu tài khoản manager/admin/staff.

```sql
users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL
)
```

## Notes

- `status`: `active`, `disabled`, `deleted`.
- Không lưu password plain text.
- Nếu dùng Auth.js, có thể cần thêm bảng account/session tùy strategy.

---

# 4. roles

```sql
roles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(80) UNIQUE NOT NULL,
  description TEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

Ví dụ `code`:

```txt
admin
manager
product_staff
outfit_staff
viewer
```

---

# 5. permissions

```sql
permissions (
  id UUID PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(120) UNIQUE NOT NULL,
  module VARCHAR(80) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

Ví dụ `code`:

```txt
products.view
products.update_dna
products.upload_mockup
outfits.create
outfits.publish
analytics.view_all
```

---

# 6. user_roles

```sql
user_roles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role_id)
)
```

---

# 7. role_permissions

```sql
role_permissions (
  id UUID PRIMARY KEY,
  role_id UUID NOT NULL REFERENCES roles(id),
  permission_id UUID NOT NULL REFERENCES permissions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(role_id, permission_id)
)
```

---

# 8. products

Bảng sản phẩm nội bộ được sync từ API theo `urlSuffix`.

```sql
products (
  id UUID PRIMARY KEY,
  url_suffix VARCHAR(120) NOT NULL,
  external_link_id VARCHAR(120) NOT NULL,
  external_item_id VARCHAR(120) NULL,
  external_group_id VARCHAR(120) NULL,
  external_group_name VARCHAR(255) NULL,
  name VARCHAR(500) NOT NULL,
  image_url TEXT NOT NULL,
  mockup_image_url TEXT NULL,
  product_dna TEXT NULL,
  affiliate_url TEXT NULL,
  h5_link TEXT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  assigned_to UUID NULL REFERENCES users(id),
  raw_json JSONB NULL,
  last_synced_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL,
  UNIQUE(url_suffix, external_link_id)
)
```

## Giải thích field

### `id`

ID nội bộ, dùng để liên kết với `outfit_products`, `click_logs`, `media_assets`.

### `url_suffix`

Nguồn/creator/source từ API, ví dụ `outfitsdepoday`.

Dùng để:

- Lọc product theo nguồn.
- Sync product theo nguồn.
- Dashboard theo nguồn.
- Debug product đến từ đâu.

### `external_link_id`

Mapping từ API field `linkId`.

Dùng để upsert product, tránh tạo trùng khi cron chạy 15 phút/lần.

Unique theo cặp:

```txt
(url_suffix, external_link_id)
```

### `external_item_id`

Mapping từ API field `itemId`.

Có thể dùng để nhận diện item gốc trên sàn. Không dùng làm unique chính nếu `external_link_id` ổn định hơn.

### `external_group_id`

Mapping từ API `groupId`.

Dùng để lọc/debug sản phẩm theo group từ source API.

### `external_group_name`

Tên group từ API. Giúp admin dễ lọc/xem mà chưa cần bảng `source_groups`.

### `name`

Tên sản phẩm, thường lấy từ `linkName`.

Dùng cho manager search, alt text, và có thể hiển thị ở outfit detail.

### `image_url`

Ảnh preview/gốc từ API.

Bắt buộc vì khi chưa có mockup thì dùng field này để hiển thị.

### `mockup_image_url`

Ảnh mockup/ảnh tách nền do Staff/Admin xử lý.

Logic hiển thị:

```txt
display_image_url = mockup_image_url || image_url
```

### `product_dna`

Text mô tả sản phẩm dùng cho workflow AI fashion affiliate.

Không bắt buộc khi sync, được thêm sau trong manager.

### `affiliate_url`

Link affiliate chính. Dùng làm fallback redirect nếu `h5_link` không có.

### `h5_link`

Link H5/deep link nếu API có trả. Có thể ưu tiên khi redirect mobile/app.

### `status`

Trạng thái sản phẩm.

Giá trị MVP:

```txt
active
inactive
missing_from_source
deleted
```

### `assigned_to`

Staff đang xử lý product. Có thể null nếu chưa giao.

### `raw_json`

Lưu response gốc từ API để debug hoặc lấy thêm field sau này.

### `last_synced_at`

Thời điểm cron sync product gần nhất.

### `created_at`, `updated_at`, `deleted_at`

Audit cơ bản và soft delete.

---

# 9. outfits

```sql
outfits (
  id UUID PRIMARY KEY,
  outfit_code CHAR(6) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NULL,
  cover_image_url TEXT NOT NULL,
  style_id UUID NULL REFERENCES styles(id),
  outfit_type_id UUID NULL REFERENCES outfit_types(id),
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES users(id),
  updated_by UUID NULL REFERENCES users(id),
  published_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL
)
```

Không có:

```txt
creator_id
price
total_price
```

---

# 10. outfit_products

Nhiều product thuộc nhiều outfit.

```sql
outfit_products (
  id UUID PRIMARY KEY,
  outfit_id UUID NOT NULL REFERENCES outfits(id),
  product_id UUID NOT NULL REFERENCES products(id),
  added_by UUID NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(outfit_id, product_id)
)
```

Không cần `sort_order` trong MVP.

Public hiển thị:

```sql
ORDER BY outfit_products.created_at ASC
```

---

# 11. outfit_view_logs

```sql
outfit_view_logs (
  id UUID PRIMARY KEY,
  outfit_id UUID NOT NULL REFERENCES outfits(id),
  outfit_code CHAR(6) NOT NULL,
  session_id VARCHAR(120) NULL,
  cookie_id VARCHAR(120) NULL,
  referrer TEXT NULL,
  utm_source VARCHAR(120) NULL,
  utm_medium VARCHAR(120) NULL,
  utm_campaign VARCHAR(120) NULL,
  user_agent TEXT NULL,
  ip_hash VARCHAR(255) NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

---

# 12. click_logs

```sql
click_logs (
  id UUID PRIMARY KEY,
  outfit_id UUID NOT NULL REFERENCES outfits(id),
  product_id UUID NOT NULL REFERENCES products(id),
  outfit_code CHAR(6) NOT NULL,
  url_suffix VARCHAR(120) NOT NULL,
  session_id VARCHAR(120) NULL,
  cookie_id VARCHAR(120) NULL,
  redirect_url TEXT NOT NULL,
  referrer TEXT NULL,
  utm_source VARCHAR(120) NULL,
  utm_medium VARCHAR(120) NULL,
  utm_campaign VARCHAR(120) NULL,
  user_agent TEXT NULL,
  ip_hash VARCHAR(255) NULL,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  is_suspicious BOOLEAN NOT NULL DEFAULT false,
  invalid_reason VARCHAR(120) NULL,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

---

# 13. sync_logs

```sql
sync_logs (
  id UUID PRIMARY KEY,
  url_suffix VARCHAR(120) NOT NULL,
  group_id VARCHAR(120) NULL,
  status VARCHAR(30) NOT NULL,
  total_fetched INT NOT NULL DEFAULT 0,
  total_created INT NOT NULL DEFAULT 0,
  total_updated INT NOT NULL DEFAULT 0,
  total_deactivated INT NOT NULL DEFAULT 0,
  error_message TEXT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

---

# 14. media_assets

```sql
media_assets (
  id UUID PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  media_type VARCHAR(80) NOT NULL,
  file_url TEXT NOT NULL,
  file_key TEXT NOT NULL,
  mime_type VARCHAR(100) NULL,
  file_size BIGINT NULL,
  width INT NULL,
  height INT NULL,
  uploaded_by UUID NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

---

# 15. styles

```sql
styles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL
)
```

---

# 16. outfit_types

```sql
outfit_types (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL
)
```

---

# 17. product_categories

```sql
product_categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ NULL
)
```

MVP có thể chưa dùng `product_categories` nếu sản phẩm chỉ lọc bằng `url_suffix`, `external_group_name`.
