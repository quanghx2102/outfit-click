# 08. SEO Specification

## 1. Mục tiêu SEO

- Google index nhiều trang outfit active.
- Outfit page có đủ nội dung text để không bị thin content.
- Tăng khả năng rank cho keyword phối đồ/outfit.
- Không index route nội bộ, API, redirect affiliate.

## 2. Public URLs

```txt
/                            Home
/outfits                     Danh sách outfit
/outfit/[seo-slug]-[code]     Chi tiết outfit
/style/[slug]                Landing style, optional
/type/[slug]                 Landing outfit type, optional
```

Ví dụ outfit URL:

```txt
/outfit/phoi-do-di-choi-nu-nang-dong-a7k2q9
```

## 3. Không index

Không cho index/crawl:

```txt
/manager/
/api/
/go/
/r/
```

## 4. robots.txt

```txt
User-agent: *
Allow: /
Disallow: /manager/
Disallow: /api/
Disallow: /go/
Disallow: /r/

Sitemap: https://yourdomain.com/sitemap.xml
```

## 5. Sitemap

Tạo sitemap động:

```txt
/sitemap.xml
/sitemap-outfits.xml
/sitemap-styles.xml
/sitemap-types.xml
```

Chỉ đưa vào sitemap:

```txt
outfits.status = active
published_at IS NOT NULL
deleted_at IS NULL
```

Không đưa:

```txt
draft outfit
hidden outfit
manager route
api route
redirect route
product internal route
```

## 6. Canonical

Mỗi outfit page có canonical duy nhất:

```txt
https://yourdomain.com/outfit/[seo-slug]-[code]
```

Không để một outfit có nhiều URL public khác nhau.

## 7. Outfit page SEO template

Mỗi outfit detail nên có:

```txt
H1 rõ keyword
Cover image outfit
Mô tả outfit 100–200 từ
Danh sách sản phẩm bằng ảnh + tên
Alt text ảnh outfit
Alt text ảnh sản phẩm
Breadcrumb
Internal links tới outfit liên quan
JSON-LD
```

## 8. Outfit title format

```txt
[Keyword phối đồ] | Outfit [CODE]
```

Ví dụ:

```txt
Phối đồ đi chơi nữ năng động | Outfit A7K2Q9
```

## 9. Meta description format

```txt
Gợi ý outfit [style/type] phù hợp [context]. Xem chi tiết set đồ và các item gợi ý trong outfit.
```

Ví dụ:

```txt
Gợi ý outfit đi chơi nữ năng động, trẻ trung, phù hợp đi cafe, dạo phố hoặc cuối tuần. Xem chi tiết set đồ và các item gợi ý trong outfit.
```

## 10. Image alt text

### Cover outfit

```txt
Outfit [name] phong cách [style/type]
```

### Product image

```txt
[name] trong outfit [outfit_code]
```

## 11. JSON-LD gợi ý

Không dùng Product rich result nếu không hiển thị giá/offer.

Nên dùng:

```txt
WebPage
CollectionPage
ItemList
BreadcrumbList
ImageObject
```

Ví dụ ItemList:

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Danh sách sản phẩm trong outfit A7K2Q9",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Tên sản phẩm",
      "url": "https://yourdomain.com/go/A7K2Q9/product-id"
    }
  ]
}
```

## 12. Internal link strategy

Ở cuối outfit detail nên có:

```txt
Outfit cùng style
Outfit cùng type
Outfit mới nhất
Outfit được click nhiều
```

Mục tiêu:

- Tăng crawl depth.
- Tăng page/session.
- Giúp Google hiểu website có cấu trúc.

## 13. Content uniqueness rule

Không tạo hàng loạt outfit page chỉ có ảnh.

Mỗi outfit cần description riêng ít nhất 100–200 từ.

Gợi ý nội dung:

```txt
Outfit này phù hợp dịp nào?
Phong cách chính là gì?
Vì sao các item phối hợp với nhau?
Nên mặc khi nào?
Màu sắc/vibe tổng thể ra sao?
```

## 14. Performance rule

- Ảnh cover dùng Next/Image.
- Lazy load product images.
- R2 + CDN cache.
- Hạn chế animation nặng.
- Public pages render server-side/static-like.
- Không load script manager trên public.

## 15. Acceptance criteria

- Trang outfit active xuất hiện trong sitemap.
- Trang draft/hidden không có trong sitemap.
- `/go` không có trong sitemap.
- `robots.txt` disallow manager/api/go.
- Mỗi outfit có title/description/canonical riêng.
- Outfit detail có H1, text content, image alt, internal links.
