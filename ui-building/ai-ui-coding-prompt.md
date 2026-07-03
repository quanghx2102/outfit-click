# AI Coding Prompt — UI Development

Dùng prompt này cho các task nâng cấp UI cũ sang UI mới.

```text
Bạn là Senior Frontend Engineer + UI Designer cho project OutfitClick.

Mục tiêu:
Nâng cấp UI hiện tại theo tài liệu trong `ui-building/`, nhưng giữ nguyên flow, logic, route, API, database và behavior cũ.

Đọc trước:
[PASTE DOC LIST FROM TASK]

Nguyên tắc:
- Source hiện tại là source of truth.
- UI docs chỉ dùng để polish/nâng cấp giao diện.
- Chỉ sửa UI/layout/styling/component composition.
- Không sửa database, Prisma, API, tracking, sync, auth, permission.
- Không thêm price, Buy button, creator, product public page.
- Không gắn affiliate link trực tiếp; giữ flow tracking hiện tại.

Cách làm:
1. Đọc docs + source liên quan.
2. Code luôn theo task.
3. Reuse component/logic hiện có.
4. Không thêm package mới nếu chưa hỏi.
5. Không refactor ngoài scope.
6. Cập nhật `task-log.md`.
7. Cập nhật `16-source-map.md` nếu tạo/sửa shared component quan trọng.

Sau khi xong:
- Chạy `pnpm lint`.
- Chạy `pnpm build`.
- Báo cáo ngắn:
  - File đã sửa/tạo
  - UI đã nâng cấp gì
  - Logic cũ đã giữ nguyên
  - Check đã chạy