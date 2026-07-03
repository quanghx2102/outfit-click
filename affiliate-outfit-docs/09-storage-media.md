# 09. Storage & Media

## 1. Storage đề xuất

Dùng Cloudflare R2 để lưu ảnh:

```txt
product mockup
product transparent PNG
outfit cover
outfit anchor image
```

Không lưu ảnh trong database.

Database chỉ lưu:

```txt
file_url
file_key
mime_type
file_size
width
height
```

## 2. Vì sao Cloudflare R2 phù hợp

- Giá rẻ cho ảnh public.
- Không tính phí egress theo mô hình R2 hiện tại.
- Hợp khi ảnh được load nhiều.
- Có thể đi qua Cloudflare CDN/cache.
- MVP chỉ lưu mockup + cover nên dung lượng chưa lớn.

## 3. Cấu trúc file key

Gợi ý:

```txt
products/{productId}/mockup/{timestamp}.{ext}
products/{productId}/transparent/{timestamp}.{ext}
outfits/{outfitId}/cover/{timestamp}.{ext}
outfits/{outfitId}/anchor/{timestamp}.{ext}
```

Ví dụ:

```txt
products/uuid/mockup/1712345678.png
outfits/uuid/cover/1712345678.webp
```

## 4. File format rule

### Mockup/tách nền

```txt
PNG nếu cần nền trong suốt
WEBP nếu không cần trong suốt
```

### Cover outfit

```txt
WEBP hoặc JPG tối ưu dung lượng
```

## 5. Upload size rule MVP

Gợi ý:

```txt
Max file size: 5MB/file
Cover outfit recommended: 1200px–1800px cạnh dài
Mockup product recommended: 1000px–2000px cạnh dài
```

Nếu ảnh quá nặng:

```txt
compress trước khi upload hoặc xử lý server-side sau
```

## 6. media_assets table

Mỗi lần upload ghi:

```txt
entity_type
entity_id
media_type
file_url
file_key
mime_type
file_size
width
height
uploaded_by
created_at
```

## 7. Update entity sau upload

Nếu upload product mockup:

```txt
update products.mockup_image_url = file_url
```

Nếu upload outfit cover:

```txt
update outfits.cover_image_url = file_url
```

## 8. Delete rule

MVP có thể không xóa file vật lý ngay.

Khi xóa media:

```txt
1. Xóa reference trong entity nếu đang dùng.
2. Xóa record media_assets hoặc đánh dấu deleted nếu thêm deleted_at.
3. Có thể tạo job cleanup file R2 sau.
```

## 9. Image display rule

Product display:

```ts
const displayImageUrl = product.mockupImageUrl || product.imageUrl;
```

Outfit display:

```ts
const cover = outfit.coverImageUrl;
```

## 10. Security

- Upload endpoint chỉ cho manager đã login.
- Check permission `media.upload`.
- Validate MIME type.
- Không cho upload file executable.
- Không tin extension từ client.

Allowed MIME MVP:

```txt
image/jpeg
image/png
image/webp
```

## 11. Acceptance criteria

- Upload mockup thành công lên R2.
- Upload cover thành công lên R2.
- media_assets được ghi.
- product/outfit được update URL.
- Public page load ảnh từ R2/CDN.
- File không vượt quá giới hạn size.
