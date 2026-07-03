# 10. Manager Workflows

## 1. Product sync workflow

```txt
Cronjob chạy 15 phút/lần
→ lấy product theo urlSuffix/groupId
→ upsert products
→ admin/staff thấy product mới trong manager
```

Staff/Admin không cần import/export product thủ công trong MVP.

## 2. Product processing workflow

```txt
Admin/Manager mở Product List
→ lọc theo urlSuffix/status/hasMockup/hasProductDna
→ assign product cho Product Staff nếu cần
→ Product Staff cập nhật PRODUCT DNA
→ Product Staff upload mockup/tách nền
→ product sẵn sàng đưa vào outfit
```

## 3. Product display rule trong manager

Khi list product:

```txt
Nếu có mockup_image_url → hiển thị mockup
Nếu không có → hiển thị image_url từ API
```

Nên có badge:

```txt
Has DNA / Missing DNA
Has Mockup / Missing Mockup
Active / Missing from source / Inactive
urlSuffix
external_group_name
```

## 4. Outfit creation workflow

```txt
Outfit Staff/Admin bấm Create Outfit
→ nhập name, description
→ upload cover outfit
→ chọn style/type nếu có
→ backend sinh outfit_code 6 ký tự
→ lưu status = draft
```

## 5. Add product to outfit workflow

```txt
Trong màn hình outfit edit
→ mở product picker
→ filter product theo urlSuffix/status/keyword
→ chọn product
→ add vào outfit_products
```

Rule:

```txt
Chỉ add product active.
Không add trùng product trong cùng outfit.
Nếu product chưa có mockup, vẫn có thể add và hiển thị image_url fallback.
```

## 6. Publish outfit workflow

```txt
Admin/Manager có quyền publish
→ bấm Publish
→ backend validate
→ status = active
→ published_at = now()
→ outfit xuất hiện public + sitemap
```

Validation:

```txt
cover_image_url có tồn tại
name có tồn tại
slug có tồn tại
outfit_code unique
có ít nhất 1 product active
product có h5_link hoặc affiliate_url
```

## 7. Hide outfit workflow

```txt
Admin/Manager bấm Hide
→ status = hidden
→ outfit không còn public
→ outfit bị loại khỏi sitemap
```

## 8. Delete outfit workflow

```txt
Delete = soft delete
status = deleted
deleted_at = now()
```

Không xóa cứng để giữ logs.

## 9. Analytics workflow

Admin/Manager xem:

```txt
Tổng views
Tổng valid clicks
CTR
Top outfits
Top products
Click theo urlSuffix
Click theo ngày
```

Staff xem theo permission:

```txt
Dữ liệu của outfit/product được assign hoặc do mình tạo
```

## 10. Manager UX gợi ý

### Product list columns

```txt
Image
Name
urlSuffix
Group
Status
DNA
Mockup
Assigned To
Last Synced
Actions
```

### Outfit list columns

```txt
Cover
Name
Code
Status
Style
Type
Products count
Views
Clicks
CTR
Published At
Actions
```

### Product picker trong outfit edit

Nên có:

```txt
Search keyword
Filter urlSuffix
Filter group
Filter hasMockup
Filter hasDNA
Grid product cards
```

## 11. Không làm ở MVP

```txt
Kanban tasks
Advanced workflow approval
Bulk import/export
Product price management
Creator management
Sort order sản phẩm trong outfit
```
