# 07. Tracking & Redirect

## 1. Flow đúng

```txt
User ở public outfit list
→ bấm ảnh outfit
→ vào outfit detail
→ thấy danh sách sản phẩm
→ bấm ảnh hoặc tên sản phẩm
→ route /go/[outfitCode]/[productId]
→ ghi tracking click/session/behavior
→ redirect Shopee affiliate/app link
```

Lưu ý:

- Click ảnh outfit chỉ vào detail outfit.
- Chỉ click ảnh/tên sản phẩm trong outfit detail mới redirect affiliate.

## 2. Redirect route

```txt
GET /go/[outfitCode]/[productId]
```

## 3. Redirect logic

```txt
1. Parse outfitCode + productId.
2. Tìm outfit status = active.
3. Tìm product status = active.
4. Check product thuộc outfit thông qua outfit_products.
5. redirect_url = product.h5_link || product.affiliate_url.
6. Nếu redirect_url không có → redirect về outfit detail hoặc 404.
7. Ghi click log/session behavior theo cơ chế không làm chậm redirect.
8. Redirect 302 sang redirect_url.
```

## 4. Không dùng await Promise.all trước redirect

Không nên:

```ts
await Promise.all([
  saveClickLog(),
  saveBehavior(),
  updateCounter(),
]);
return redirect(redirectUrl);
```

Vì vẫn phải chờ toàn bộ promise hoàn thành.

## 5. Cách khuyến nghị MVP

### Option A: Next.js `after()` hoặc post-response task

```ts
export async function GET(request, params) {
  const redirectUrl = await resolveRedirectUrl(params);

  after(async () => {
    await Promise.allSettled([
      saveClickLog(request, params, redirectUrl),
      saveSessionBehavior(request, params),
    ]);
  });

  return NextResponse.redirect(redirectUrl, 302);
}
```

Ưu điểm:

- User được redirect nhanh.
- Tracking chạy sau response.
- Code gọn.

Nhược điểm:

- Có rủi ro nhỏ mất log nếu runtime bị dừng bất thường.

### Option B: Queue event

```txt
/go route
→ push event vào queue
→ redirect ngay
→ worker ghi log sau
```

Dùng khi traffic lớn hơn.

MVP có thể chưa cần queue.

## 6. Cookie/session rule

Tạo 2 cookie anonymous:

```txt
aos_uid: anonymous user id, sống 365 ngày
aos_sid: session id, sống 30 phút
```

Nếu không có cookie:

```txt
Tạo UUID mới.
```

Nếu session hết hạn:

```txt
Tạo session mới.
```

Không lưu PII trực tiếp.

## 7. View tracking

Ghi khi outfit detail được load.

Bảng:

```txt
outfit_view_logs
```

Thông tin ghi:

```txt
outfit_id
outfit_code
session_id
cookie_id
referrer
utm_source
utm_medium
utm_campaign
user_agent
ip_hash
viewed_at
```

Có thể ghi server-side khi render detail page hoặc client-side bằng `/api/tracking/outfit-view`.

## 8. Click tracking

Bảng:

```txt
click_logs
```

Thông tin ghi:

```txt
outfit_id
product_id
outfit_code
url_suffix
session_id
cookie_id
redirect_url
referrer
utm_source
utm_medium
utm_campaign
user_agent
ip_hash
is_valid
is_suspicious
invalid_reason
clicked_at
```

## 9. Anti-spam/bot click rule MVP

### Duplicate click rule

Nếu cùng:

```txt
session_id + outfit_id + product_id
```

click trong vòng 30 giây:

```txt
is_valid = false
invalid_reason = duplicate_click_30s
```

Vẫn redirect bình thường.

### Bot user-agent rule

Nếu user-agent thuộc bot list:

```txt
is_valid = false
is_suspicious = true
invalid_reason = bot_user_agent
```

### Too many clicks rule

Nếu một session click quá nhiều trong 1 phút:

```txt
is_valid = false
is_suspicious = true
invalid_reason = too_many_clicks_per_session
```

### Manager preview rule

Nếu click từ manager preview:

```txt
is_valid = false
invalid_reason = manager_preview
```

## 10. CTR calculation

```txt
CTR = valid_product_clicks / outfit_views
```

Nên tính theo:

```txt
valid clicks only
```

## 11. Privacy note

- Không lưu IP plain text nếu không cần.
- Dùng `ip_hash`.
- Không lưu email/số điện thoại/user identity của public user.
- Nên có Privacy Policy ngắn cho việc sử dụng cookie/tracking analytics.

## 12. Acceptance criteria

- Click ảnh/tên sản phẩm redirect được Shopee affiliate.
- Redirect không bị chậm do tracking.
- Click log được ghi.
- View log được ghi.
- Duplicate click trong 30s vẫn redirect nhưng không tính valid.
- Bot click không tính valid.
- Manager preview không làm bẩn analytics public.
