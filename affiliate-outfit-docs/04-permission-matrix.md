# 04. Permission Matrix

## 1. Mục tiêu

Dùng roles/permissions thay vì hard-code Admin/Staff.

Lợi ích:

- Staff có thể chia nhỏ theo nhiệm vụ.
- Admin dễ cấp quyền cho từng người.
- Sau này thêm role mới không cần sửa logic lớn.

## 2. Roles MVP

```txt
admin
manager
product_staff
outfit_staff
viewer
```

---

# 3. Matrix tổng quan

| Module | Permission | Admin | Manager | Product Staff | Outfit Staff | Viewer |
|---|---:|---:|---:|---:|---:|---:|
| Dashboard | dashboard.view_all | ✅ | ✅ | ❌ | ❌ | ❌ |
| Dashboard | dashboard.view_own | ✅ | ✅ | ✅ | ✅ | ✅ |
| Users | users.view | ✅ | ❌ | ❌ | ❌ | ❌ |
| Users | users.create | ✅ | ❌ | ❌ | ❌ | ❌ |
| Users | users.update | ✅ | ❌ | ❌ | ❌ | ❌ |
| Users | users.delete | ✅ | ❌ | ❌ | ❌ | ❌ |
| Roles | roles.view | ✅ | ❌ | ❌ | ❌ | ❌ |
| Roles | roles.manage | ✅ | ❌ | ❌ | ❌ | ❌ |
| Products | products.view_all | ✅ | ✅ | Optional | Optional | ❌ |
| Products | products.view_assigned | ✅ | ✅ | ✅ | ✅ | ✅ |
| Products | products.update | ✅ | ✅ | Optional | Optional | ❌ |
| Products | products.update_dna | ✅ | ✅ | ✅ | ❌ | ❌ |
| Products | products.upload_mockup | ✅ | ✅ | ✅ | ❌ | ❌ |
| Products | products.assign | ✅ | ✅ | ❌ | ❌ | ❌ |
| Products | products.delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| Outfits | outfits.view_all | ✅ | ✅ | Optional | ✅ | ❌ |
| Outfits | outfits.view_own | ✅ | ✅ | ✅ | ✅ | ✅ |
| Outfits | outfits.create | ✅ | ✅ | ❌ | ✅ | ❌ |
| Outfits | outfits.update | ✅ | ✅ | ❌ | ✅ | ❌ |
| Outfits | outfits.add_product | ✅ | ✅ | ❌ | ✅ | ❌ |
| Outfits | outfits.remove_product | ✅ | ✅ | ❌ | ✅ | ❌ |
| Outfits | outfits.publish | ✅ | Optional | ❌ | ❌ | ❌ |
| Outfits | outfits.hide | ✅ | Optional | ❌ | ❌ | ❌ |
| Outfits | outfits.delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| Analytics | analytics.view_all | ✅ | ✅ | ❌ | ❌ | ❌ |
| Analytics | analytics.view_own | ✅ | ✅ | ✅ | ✅ | ✅ |
| Media | media.upload | ✅ | ✅ | ✅ | ✅ | ❌ |
| Media | media.delete | ✅ | ✅ | Optional | Optional | ❌ |
| Sync | sync.view | ✅ | ✅ | ❌ | ❌ | ❌ |
| Sync | sync.run | ✅ | Optional | ❌ | ❌ | ❌ |
| Settings | settings.manage | ✅ | ❌ | ❌ | ❌ | ❌ |

## 4. Data scope rule

### `view_all`

User được xem tất cả dữ liệu trong module.

### `view_assigned`

User chỉ xem dữ liệu có:

```txt
assigned_to = current_user.id
```

### `view_own`

User chỉ xem dữ liệu do mình tạo:

```txt
created_by = current_user.id
```

## 5. Rule cho manager API

Mọi manager API phải check:

```txt
1. User đã login chưa?
2. User có permission action đó không?
3. Nếu không có view_all, có được xem entity được assign/own không?
```

## 6. Rule cho public API/page

Public không cần login, nhưng chỉ đọc được:

```txt
outfits.status = active
outfits.deleted_at IS NULL
products.status = active
products.deleted_at IS NULL
```

## 7. Seed permissions

Khi migrate database lần đầu, chạy seed:

```txt
1. Tạo permissions.
2. Tạo roles.
3. Gán permissions cho roles.
4. Tạo admin đầu tiên.
```

## 8. Middleware gợi ý

```ts
async function requirePermission(userId: string, permission: string) {
  const permissions = await getUserPermissions(userId);
  if (!permissions.includes(permission)) {
    throw new ForbiddenError();
  }
}
```

## 9. UI rule

Frontend ẩn button theo permission:

- Không có `outfits.publish` → ẩn nút Publish.
- Không có `products.upload_mockup` → ẩn upload mockup.
- Không có `users.create` → ẩn nút Add User.

Backend vẫn phải check lại, không tin frontend.
