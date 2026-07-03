# UI Review Checklist — OutfitClick

Dùng checklist này sau mỗi UI task. Không approve task nếu UI chưa đạt mức tối thiểu.

## 1. Global UI Review

```txt
- [ ] Spacing đều và không bị chật.
- [ ] Typography rõ cấp bậc.
- [ ] Card style đồng bộ.
- [ ] Button style đồng bộ.
- [ ] Badge/status style đồng bộ.
- [ ] Không hard-code màu linh tinh.
- [ ] Không duplicate layout/component quá nhiều.
- [ ] Empty state có thiết kế.
- [ ] Loading state không làm layout giật.
- [ ] Mobile 375px usable.
- [ ] Desktop 1440px đẹp và không quá rộng.
```

## 2. Public Site Review

```txt
- [ ] Nhìn giống fashion lookbook, không giống ecommerce rẻ tiền.
- [ ] Outfit image là yếu tố chính.
- [ ] Không hiển thị giá.
- [ ] Không có Buy Now/Add to Cart.
- [ ] Không có creator.
- [ ] Không có product public page link.
- [ ] Outfit card click vào outfit detail.
- [ ] Product image/name trong detail click qua /go.
- [ ] Không dùng Shopee affiliate URL trực tiếp trong frontend.
- [ ] Có SEO content block hoặc text mô tả đủ tốt.
- [ ] Image alt text hợp lý.
```

## 3. Manager Review

```txt
- [ ] Sidebar/topbar sạch.
- [ ] PageHeader xuất hiện trên page chính.
- [ ] Table không rối.
- [ ] Filters dễ dùng.
- [ ] StatusBadge rõ.
- [ ] Actions nằm trong dropdown hoặc vị trí nhất quán.
- [ ] Danger action có confirm dialog.
- [ ] Upload UI có preview/error/loading state.
- [ ] Form labels rõ.
- [ ] Validation errors dễ hiểu.
```

## 4. Product UI Review

```txt
- [ ] Product thumbnail rõ.
- [ ] urlSuffix dễ thấy trong manager.
- [ ] Product DNA/missing DNA dễ nhận biết.
- [ ] Mockup/missing mockup dễ nhận biết.
- [ ] Không có price column.
- [ ] Không có public product link.
```

## 5. Outfit UI Review

```txt
- [ ] Outfit code rõ, dễ copy/search.
- [ ] Cover image hiển thị đẹp.
- [ ] Product picker dùng mockup_image_url fallback image_url.
- [ ] Selected products dễ review.
- [ ] Không có sort order UI.
- [ ] Publish/hide/save actions rõ.
```

## 6. Score Guide

```txt
0-4/10: chạy được nhưng xấu, giống wireframe.
5-6/10: sạch cơ bản nhưng nhạt, thiếu hierarchy.
7/10: layout ổn, spacing tốt, usable.
8/10: production-ready MVP, đẹp, responsive, consistent.
9/10: polished, có brand identity, micro-interaction tốt.
10/10: designer-level, ready for scale.
```

Mục tiêu MVP:

```txt
Public UI: >= 8/10
Manager UI: >= 7.5/10
```

## 7. Screenshot Review Prompt

```text
Bạn là Senior Product Designer. Hãy review screenshot UI hiện tại của OutfitClick.

Kiểm tra:
- visual hierarchy
- spacing
- typography
- card design
- responsive
- consistency
- có đúng outfit-first affiliate không
- có lỡ biến thành ecommerce không
- có lỡ thêm price/buy button/creator không

Trả lời:
1. Điểm UI /10
2. Vấn đề lớn nhất
3. Page/component cần sửa nhất
4. Cần sửa file nào
5. Đề xuất cải thiện cụ thể bằng Tailwind/shadcn
```
