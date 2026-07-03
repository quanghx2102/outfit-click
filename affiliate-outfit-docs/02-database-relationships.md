# 02. Database Relationships, Indexes, Constraints

## 1. Quan hệ chính

```txt
users 1-n outfits.created_by
users 1-n outfits.updated_by
users 1-n products.assigned_to
users 1-n outfit_products.added_by
users n-n roles qua user_roles
roles n-n permissions qua role_permissions

outfits n-n products qua outfit_products
outfits 1-n outfit_view_logs
outfits 1-n click_logs
products 1-n click_logs
```

## 2. Unique constraints bắt buộc

### products

```sql
UNIQUE(url_suffix, external_link_id)
```

Mục tiêu: cron chạy nhiều lần không tạo duplicate product.

### outfits

```sql
UNIQUE(outfit_code)
UNIQUE(slug)
```

### outfit_products

```sql
UNIQUE(outfit_id, product_id)
```

Mục tiêu: một product không bị gắn trùng trong cùng outfit.

### roles

```sql
UNIQUE(code)
```

### permissions

```sql
UNIQUE(code)
```

### user_roles

```sql
UNIQUE(user_id, role_id)
```

### role_permissions

```sql
UNIQUE(role_id, permission_id)
```

## 3. Index đề xuất

### products

```sql
CREATE INDEX idx_products_url_suffix ON products(url_suffix);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_external_group_id ON products(external_group_id);
CREATE INDEX idx_products_assigned_to ON products(assigned_to);
CREATE INDEX idx_products_last_synced_at ON products(last_synced_at);
```

### outfits

```sql
CREATE INDEX idx_outfits_status ON outfits(status);
CREATE INDEX idx_outfits_style_id ON outfits(style_id);
CREATE INDEX idx_outfits_outfit_type_id ON outfits(outfit_type_id);
CREATE INDEX idx_outfits_published_at ON outfits(published_at);
```

### outfit_products

```sql
CREATE INDEX idx_outfit_products_outfit_id ON outfit_products(outfit_id);
CREATE INDEX idx_outfit_products_product_id ON outfit_products(product_id);
```

### logs

```sql
CREATE INDEX idx_view_logs_outfit_time ON outfit_view_logs(outfit_id, viewed_at);
CREATE INDEX idx_click_logs_outfit_time ON click_logs(outfit_id, clicked_at);
CREATE INDEX idx_click_logs_product_time ON click_logs(product_id, clicked_at);
CREATE INDEX idx_click_logs_session ON click_logs(session_id);
CREATE INDEX idx_click_logs_cookie ON click_logs(cookie_id);
CREATE INDEX idx_click_logs_valid ON click_logs(is_valid);
```

## 4. Soft delete rule

Các bảng sau dùng soft delete:

```txt
users
products
outfits
styles
outfit_types
product_categories
```

Không xóa cứng product/outfit nếu đã có logs.

## 5. Display image rule

Ở frontend/backend DTO:

```ts
const displayImageUrl = product.mockupImageUrl || product.imageUrl;
```

Không cần lưu thêm field `display_image_url` trong database.

## 6. Product active rule

Product được xem là usable trong outfit nếu:

```txt
status = active
AND deleted_at IS NULL
AND (affiliate_url IS NOT NULL OR h5_link IS NOT NULL)
```

## 7. Outfit publish rule

Outfit chỉ được publish nếu:

```txt
status hiện tại không phải deleted
outfit_code tồn tại và unique
slug tồn tại và unique
cover_image_url tồn tại
có ít nhất 1 product active trong outfit_products
product trong outfit có affiliate_url hoặc h5_link
```

Khi publish:

```txt
status = active
published_at = now()
```

## 8. Slug rule

Outfit public URL nên có code trong slug để tránh trùng và dễ tìm:

```txt
/outfit/[seo-slug]-[outfit_code]
```

Ví dụ:

```txt
/outfit/phoi-do-di-choi-nu-nang-dong-a7k2q9
```

## 9. Outfit code rule

Sinh random 6 ký tự từ alphabet:

```txt
ABCDEFGHJKLMNPQRSTUVWXYZ23456789
```

Tránh ký tự dễ nhầm:

```txt
0, O, 1, I
```

Pseudo:

```ts
async function generateUniqueOutfitCode() {
  for (let i = 0; i < 10; i++) {
    const code = randomCode(6);
    const exists = await db.outfit.findUnique({ where: { outfitCode: code } });
    if (!exists) return code;
  }
  throw new Error('Cannot generate unique outfit code');
}
```
