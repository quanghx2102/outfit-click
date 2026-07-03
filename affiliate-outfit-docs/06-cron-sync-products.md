# 06. Cron Sync Products

## 1. Mục tiêu

Cronjob lấy product từ API mycollection theo `urlSuffix` và `groupId`, sau đó upsert vào bảng `products`.

Tần suất MVP:

```txt
15 phút/lần
```

## 2. API source

Endpoint:

```txt
POST https://mycollection.shop/api/v3/gql/?q=storefrontGroupProductList
```

Payload cần truyền:

```txt
urlSuffix
groupId
affiliateMeta.affiliateId
affiliateMeta.userId
cid
language
page.offset
page.limit
```

## 3. Config source MVP

Vì MVP chưa cần bảng `api_sources`, source config có thể để trong file config hoặc ENV.

Ví dụ:

```ts
export const PRODUCT_SYNC_SOURCES = [
  {
    urlSuffix: 'outfitsdepoday',
    groupIds: ['3913274'],
    affiliateId: '17395720129',
    affiliateUserId: '80199572',
    cid: 'vn',
    language: 'vi',
  },
];
```

Sau này nếu cần admin thêm source trong UI, mới tách bảng `api_sources`.

## 4. Mapping API → products

| API field | products field |
|---|---|
| variables.urlSuffix | url_suffix |
| groupId | external_group_id |
| groupName | external_group_name |
| linkId | external_link_id |
| itemId | external_item_id |
| linkName | name |
| image | image_url |
| link | affiliate_url |
| h5Link | h5_link |
| item object | raw_json |

## 5. Upsert rule

Unique key:

```txt
(url_suffix, external_link_id)
```

Nếu chưa có product:

```txt
CREATE product
status = active
last_synced_at = now()
raw_json = item
```

Nếu đã có product:

```txt
UPDATE các field từ API:
- name
- image_url
- affiliate_url
- h5_link
- external_item_id
- external_group_id
- external_group_name
- raw_json
- status = active
- last_synced_at = now()
```

Tuyệt đối không ghi đè các field do Staff/Admin xử lý:

```txt
mockup_image_url
product_dna
assigned_to
```

## 6. Missing product rule

Nếu sản phẩm trước đó có trong database nhưng lần sync hiện tại không còn trong API:

```txt
status = missing_from_source
```

Không xóa cứng.

Nếu lần sau sản phẩm xuất hiện lại:

```txt
status = active
```

## 7. Pagination rule

API có pagination:

```txt
offset
limit
hasMore
totalCount
```

Pseudo:

```ts
let offset = 0;
const limit = 20;
let hasMore = true;

while (hasMore) {
  const response = await fetchProducts({ offset, limit });
  await upsertProducts(response.itemList);
  hasMore = response.pagination.hasMore;
  offset += limit;
}
```

## 8. Retry/error handling

Rule MVP:

```txt
Mỗi request lỗi → retry tối đa 3 lần.
Delay giữa retries: 1s, 3s, 5s.
Nếu vẫn lỗi → ghi sync_logs status = failed.
Nếu một group lỗi nhưng group khác thành công → status = partial_success.
```

## 9. sync_logs

Mỗi lần cron chạy tạo log:

```txt
status = running
started_at = now()
```

Khi xong:

```txt
status = success / partial_success / failed
finished_at = now()
total_fetched
total_created
total_updated
total_deactivated
error_message nếu có
```

## 10. Cron endpoint security

Route:

```txt
GET /api/cron/sync-products
```

Yêu cầu:

```txt
Authorization: Bearer CRON_SECRET
```

Nếu secret sai:

```txt
401 Unauthorized
```

## 11. Không chạy song song cùng source

Cần tránh 2 cron cùng sync một source.

MVP có thể làm đơn giản:

```txt
Nếu sync_logs có status = running cho urlSuffix đó trong 10 phút gần nhất
→ skip source đó.
```

## 12. Acceptance criteria

- Cron chạy được theo interval 15 phút.
- Product mới được tạo.
- Product cũ được update.
- `mockup_image_url` không bị ghi đè.
- `product_dna` không bị ghi đè.
- Product mất khỏi API chuyển `missing_from_source`.
- Lỗi API được retry và ghi log.
- Không duplicate product theo `url_suffix + external_link_id`.
