# HW02 – Domain Testing on EShop — Trần Thanh An (23120017)

Bài cá nhân HW02 (Domain Testing + Boundary Value Analysis) trên EShop (https://github.com/ttbhanh/eshop-sut).

## Feature phụ trách

| Pool | FR | Feature | Nền tảng |
|---|---|---|---|
| A | FR-02 | Đăng nhập & khóa tài khoản | Web |
| B | FR-09 | Mã giảm giá (Coupon) | Web |
| C | FR-16 | Import sản phẩm từ CSV | Web Admin |
| D | FR-06 | Chi tiết sản phẩm | Mobile |

## Self-assessment

| No. | Criteria | Grade | Self-Assessed Grade |
|---|---|---|---|
| 1 | Feature A — FR-02 (Domain + Boundary) | 25 | 20|
| 2 | Feature B — FR-09 (Domain + Boundary) | 25 | 20|
| 3 | Feature C — FR-16 (Domain + Boundary) | 25 | 20|
| 4 | Feature D — FR-06 Mobile (Domain + Boundary) | 15 | 5 |
| 5 | Agent Skills | 10 | 5 |
| | **Total** | **100** | 70|

## Test summary

| Feature | TC thiết kế | Đã chạy | Pass | Fail | Chưa chạy | Bug |
|---|---|---|---|---|---|---|
| [FR-02](reports/A-FR02_Login_Lockout.md) | 23 (EP 14, BVA 9) | 23 | 14 | 7 | 0 (+2 ca khám phá) | 6 |
| [FR-09](reports/B-FR09_Coupon.md) | 37 (EP 19, BVA 18) | 37 | 26 | 11 | 0 | 6 |
| [FR-16](reports/C-FR16_CSV_Import.md) | 37 (EP 22, BVA 15) ¹ | 37 | 15 | 22 | 0 | 8 |
| [FR-06 Mobile](reports/D-FR06_Mobile_Product_Detail.md) | 21 (EP 15, BVA 6) ¹ | 0 | 0 | 0 | 21 | 0 |
| **Tổng (4 feature)** | **118** | **97** | **55** | **40** | **21** | **20** |

¹ Không tính các TC biên dùng chung với một TC EP (FR16-BVA-10 = EP-11, FR06-BVA-01 = EP-02).

- Bug theo mức độ: **Critical 3, High 6, Medium 8, Low 3**. Danh sách: [`bugs/Bug_Report.md`](bugs/Bug_Report.md).
- Ca khám phá FR02-BVA-08a/b đo thời gian khóa thực tế (≈ 180 s), không có kết quả mong đợi riêng.
- Test Web/Admin được thực thi tự động bằng [`scripts/`](scripts/) (Node + Edge). Kết quả gốc: `scripts/results/*.json`; ảnh: `evidence/`.

## Demo videos

- **Chưa quay video demo.** Đã có 3 Agent Skill trong `.claude/skills/` (xem `skills/README.md`), nhưng chưa có video YouTube chạy end-to-end.

## Môi trường

| Thành phần | Giá trị |
|---|---|
| SUT | `ttbhanh/eshop-sut`, commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` (2026-05-15) |
| Đặc tả (oracle) | `eshop-sut/README.md`, phiên bản 2.0 (2026-05-14) |
| OS | Windows 11 Home |
| Node.js / npm | v22.23.2 / 10.9.8 |
| Vite (Web, Admin) | 8.0.12 |
| Expo CLI / SDK | 54.0.24 / ~54.0.33 |
| Trình duyệt | Microsoft Edge 155.0.4283.62 (điều khiển bằng Playwright-core 1.48.2) |
| Điện thoại / Expo Go | Không thực hiện (FR-06 chưa chạy trên thiết bị) |
| Thay đổi trên SUT | Chỉ đổi `API_URL` trong `frontend-mobile/App.js` sang IP LAN |

## Cấu trúc thư mục

| Thư mục | Nội dung |
|---|---|
| `reports/` | Report từng feature: đặc tả, biến, lớp tương đương, test case Domain + BVA, kết quả, bug, phân tích AI bỏ sót |
| `bugs/` | Bug report tổng hợp; `issue-screenshots/` là ảnh chụp các issue trên GitHub |
| `evidence/` | Ảnh/video khi chạy test, đặt tên theo mã test case |
| `test-data/` | Dữ liệu test tự tạo (file CSV và body JSON cho FR-16) |
| `.claude/skills/`, `skills/` | Agent Skills (Claude Code) và tài liệu thiết kế skill |
| `testcases/` | Danh mục test case dạng JSON (nguồn để sinh bảng trong report) |
| `scripts/` | Script thực thi test, sinh report, sinh bản nháp issue, xuất PDF |
| `ai/` | AI Audit Report, AI Critique, prompt log, các form AI-0x |
| `pdf/` | Bản PDF của các file Markdown |
| `git_log.txt` | Git commit log (xuất ở bước cuối) |

## Cách đọc bài

1. Mỗi report trong `reports/` đi theo đúng các bước:
   - S0 đặc tả và khám phá
   - S1 biến
   - S2 lớp tương đương
   - S3 test case Domain
   - S4 BVA
   - S5 review
   - S6 kết quả
   - S7 bug
   - S8 phân tích AI bỏ sót

   Mỗi bước là một commit (`git_log.txt`).
2. AI Audit Report: [`ai/AI_Audit_Report.md`](ai/AI_Audit_Report.md). AI Critique: [`ai/AI_Critique.md`](ai/AI_Critique.md). Prompt log: [`ai/prompt_logs/`](ai/prompt_logs/).
