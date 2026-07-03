# 12. Test Plan

Chỉ test kỹ các phần phức tạp. CRUD đơn giản chỉ cần acceptance criteria.

---

# 1. Product Sync Tests

## Test: tạo product mới

Given API trả item mới  
When cron sync chạy  
Then product được tạo với `url_suffix`, `external_link_id`, `name`, `image_url`, `affiliate_url`, `h5_link`.

## Test: không tạo trùng product

Given product đã tồn tại với `(url_suffix, external_link_id)`  
When cron sync chạy lại  
Then update record cũ, không tạo record mới.

## Test: không ghi đè DNA/mockup

Given product đã có `product_dna` và `mockup_image_url`  
When cron sync chạy  
Then 2 field này giữ nguyên.

## Test: missing product

Given product tồn tại trong DB  
When API không trả product đó trong lần sync  
Then status chuyển `missing_from_source`, không xóa cứng.

## Test: retry khi API lỗi

Given API lỗi 500  
When cron sync chạy  
Then retry tối đa 3 lần và ghi `sync_logs.status = failed` nếu vẫn lỗi.

---

# 2. Outfit Code Tests

## Test: sinh code 6 ký tự

Then `outfit_code` luôn có 6 ký tự chữ/số hợp lệ.

## Test: code unique

Given code sinh ra bị trùng  
When tạo outfit  
Then backend sinh code mới.

---

# 3. Outfit Publish Tests

## Test: không publish outfit thiếu cover

Given outfit không có cover_image_url  
When publish  
Then trả validation error.

## Test: không publish outfit không có product

Given outfit chưa gắn product  
When publish  
Then trả validation error.

## Test: publish thành công

Given outfit có cover và ít nhất 1 product active có link  
When publish  
Then status = active và published_at được set.

---

# 4. Outfit Product Tests

## Test: add product active

Given product active  
When add vào outfit  
Then tạo record outfit_products.

## Test: không add trùng

Given product đã nằm trong outfit  
When add lại  
Then trả lỗi duplicate hoặc ignore an toàn.

## Test: không add product deleted

Given product status deleted  
When add vào outfit  
Then bị từ chối.

---

# 5. Tracking + Redirect Tests

## Test: click product hợp lệ

Given outfit active và product thuộc outfit  
When user truy cập `/go/{code}/{productId}`  
Then redirect 302 sang `h5_link || affiliate_url` và ghi click log.

## Test: product không thuộc outfit

Given product không thuộc outfit  
When truy cập `/go/{code}/{productId}`  
Then không redirect affiliate, ghi invalid nếu cần.

## Test: duplicate click 30s

Given user click cùng product trong 30s  
When click lần 2  
Then vẫn redirect nhưng `is_valid = false`, `invalid_reason = duplicate_click_30s`.

## Test: bot user-agent

Given request user-agent bot  
When click product  
Then vẫn xử lý an toàn nhưng không tính valid click.

---

# 6. Permission Tests

## Test: product_staff upload mockup

Given user có permission `products.upload_mockup`  
When upload mockup  
Then thành công.

## Test: outfit_staff không publish

Given user không có `outfits.publish`  
When gọi publish API  
Then 403 Forbidden.

## Test: viewer không edit product

Given viewer  
When PATCH product  
Then 403 Forbidden.

---

# 7. SEO Tests

## Test: active outfit trong sitemap

Given outfit active  
When request sitemap  
Then URL outfit xuất hiện.

## Test: hidden outfit không trong sitemap

Given outfit hidden  
When request sitemap  
Then URL outfit không xuất hiện.

## Test: robots chặn route nội bộ

Then robots chứa:

```txt
Disallow: /manager/
Disallow: /api/
Disallow: /go/
```

## Test: canonical outfit

Given outfit detail  
Then page có canonical đúng URL chính.

---

# 8. Storage Tests

## Test: upload file hợp lệ

Given file PNG/JPG/WEBP dưới limit  
When upload  
Then file lên R2 và media_assets được ghi.

## Test: reject file sai MIME

Given file không phải ảnh  
When upload  
Then trả validation error.

---

# 9. Performance smoke tests

- Public outfit list load nhanh.
- Outfit detail không load JS manager.
- Redirect route phản hồi nhanh.
- Ảnh sử dụng CDN/R2 URL.
