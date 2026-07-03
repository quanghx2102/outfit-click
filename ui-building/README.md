# OutfitClick — UI & Backend Supplement Docs

Bộ tài liệu này **không thay thế** các tài liệu cũ. Đây là phần bổ sung để AI coding tiếp tục phát triển UI đẹp hơn và hoàn thiện backend còn thiếu mà không sửa database/schema/logic cũ nếu chưa được duyệt.

## Nguyên tắc sử dụng

- Không sửa tài liệu cũ nếu task không yêu cầu.
- Không sửa database/schema cũ nếu task là UI.
- Không sửa tracking/redirect/product sync/auth nếu task không liên quan.
- Mỗi task phải đọc đúng phần **Tài liệu bắt buộc phải đọc trước**.
- AI phải phân tích trước, liệt kê file sẽ sửa, chờ duyệt rồi mới code.
- Sau mỗi task phải cập nhật `affiliate-outfit-docs/task-log.md`.
- Chỉ cập nhật `affiliate-outfit-docs/16-source-map.md` khi thêm/sửa/di chuyển route, module, service, shared component quan trọng.

## Các file trong bộ bổ sung

1. `ui-design-system.md` — chuyển prompt Figma thành design system có thể code bằng Tailwind + shadcn/ui.
2. `ui-page-spec.md` — spec layout từng page public/manager.
3. `ui-component-spec.md` — component contract, states, style rule.
4. `ui-tasks.md` — task UI theo module, có sẵn tài liệu bắt buộc phải đọc trước.
5. `backend-missing-tasks.md` — task backend còn thiếu, chia module, không đập logic cũ.
6. `ai-ui-coding-prompt.md` — prompt mẫu dùng cho AI coding UI.
7. `ui-review-checklist.md` — checklist review UI/screenshot trước khi approve.

## Cách dùng khuyến nghị

1. Copy folder này vào project, ví dụ:

```txt
affiliate-outfit-docs/
  ui-design-system.md
  ui-page-spec.md
  ui-component-spec.md
  ui-tasks.md
  backend-missing-tasks.md
  ai-ui-coding-prompt.md
  ui-review-checklist.md
```

2. Không cần sửa docs cũ.
3. Bắt đầu từ `ui-tasks.md` nếu UI đang xấu.
4. Bắt đầu từ `backend-missing-tasks.md` nếu backend còn thiếu chức năng.

## Mục tiêu UI

- Public site: clean fashion lookbook, mobile-first, nhiều ảnh, nhẹ, không giống ecommerce truyền thống.
- Manager: modern SaaS dashboard, giống tinh thần shadcn dashboard, rõ trạng thái, table/form sạch.
- Không hiển thị giá.
- Không có nút mua.
- Không có creator.
- Click ảnh/tên sản phẩm trong outfit detail phải đi qua route tracking `/go/...`.
