# 13. Environment & Config

## 1. App

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## 2. Database

```env
DATABASE_URL=postgresql://user:password@host:5432/db
```

## 3. Auth

```env
AUTH_SECRET=your-random-secret
```

Nếu custom session:

```env
SESSION_SECRET=your-session-secret
```

## 4. Cron

```env
CRON_SECRET=your-cron-secret
```

Cron endpoint chỉ chạy khi có secret hợp lệ.

## 5. Product sync source

MVP có thể config bằng ENV hoặc file config.

```env
PRODUCT_SYNC_URL_SUFFIXES=outfitsdepoday
PRODUCT_SYNC_GROUP_IDS=3913274
MYCOLLECTION_AFFILIATE_ID=17395720129
MYCOLLECTION_AFFILIATE_USER_ID=80199572
MYCOLLECTION_UUID=685bb3a5-316f-4455-a8bf-6a8ebfdaa4ae
MYCOLLECTION_DEVICE_ID=F358CB297F8082F2C3F32272A523AB46
MYCOLLECTION_CID=vn
MYCOLLECTION_LANGUAGE=vi
```

> **Lưu ý:** `MYCOLLECTION_UUID` và `MYCOLLECTION_DEVICE_ID` là bắt buộc kể từ khi API `mycollection.shop` yêu cầu `uuId`/`deviceId`. Thiếu 2 giá trị này → sync lỗi `uuid is nil`. Lấy từ network tab trình duyệt khi mở `collshp.com/n/{urlSuffix}`.

Nếu nhiều source, nên dùng config file trong code thay vì nhồi quá nhiều ENV.

## 6. Cloudflare R2

```env
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket
R2_PUBLIC_BASE_URL=https://cdn.yourdomain.com
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

## 7. Tracking

```env
TRACKING_COOKIE_DOMAIN=.yourdomain.com
TRACKING_IP_HASH_SECRET=your-ip-hash-secret
```

## 8. Security recommendations

- Không commit `.env`.
- Tách `.env.local`, `.env.production`.
- Rotate R2 access keys nếu lộ.
- CRON_SECRET phải đủ dài.
- AUTH_SECRET phải đủ mạnh.

## 9. Config file gợi ý

```ts
export const appConfig = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  cronSecret: process.env.CRON_SECRET!,
  tracking: {
    userCookieName: 'aos_uid',
    sessionCookieName: 'aos_sid',
    sessionTtlMinutes: 30,
    userCookieTtlDays: 365,
  },
};
```

## 10. Required production checklist

- [ ] DATABASE_URL set.
- [ ] AUTH_SECRET set.
- [ ] CRON_SECRET set.
- [ ] R2 credentials set.
- [ ] R2 public domain works.
- [ ] NEXT_PUBLIC_APP_URL đúng domain production.
- [ ] robots.txt trả đúng domain sitemap.
- [ ] sitemap production accessible.
