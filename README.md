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
| 1 | Feature A — FR-02 (Domain + Boundary) | 25 | |
| 2 | Feature B — FR-09 (Domain + Boundary) | 25 | |
| 3 | Feature C — FR-16 (Domain + Boundary) | 25 | |
| 4 | Feature D — FR-06 Mobile (Domain + Boundary) | 15 | |
| 5 | Agent Skills | 10 | |
| | **Total** | **100** | |

## Test summary

| Feature | TC thiết kế | Đã chạy | Pass | Fail | Chưa chạy | Bug |
|---|---|---|---|---|---|---|
| FR-02 | | | | | | |
| FR-09 | | | | | | |
| FR-16 | | | | | | |
| FR-06 Mobile | | | | | | |
| **Tổng (4 feature)** | | | | | | |

## Demo videos

- Agent Skill demo: _(chưa có)_

## Môi trường

| Thành phần | Giá trị |
|---|---|
| SUT | `ttbhanh/eshop-sut`, commit `85af3ba875c88283615e22cb108f13e2fccaf0e9` (2026-05-15) |
| Đặc tả (oracle) | `eshop-sut/README.md`, phiên bản 2.0 (2026-05-14) |
| OS | Windows 11 Home |
| Node.js / npm | v22.23.2 / 10.9.8 |
| Vite (Web, Admin) | 8.0.12 |
| Expo CLI / SDK | 54.0.24 / ~54.0.33 |
| Trình duyệt | _(điền)_ |
| Điện thoại / Expo Go | _(điền)_ |
| Thay đổi trên SUT | Chỉ đổi `API_URL` trong `frontend-mobile/App.js` sang IP LAN |

## Cấu trúc thư mục

| Thư mục | Nội dung |
|---|---|
| `reports/` | Report từng feature: đặc tả, biến, lớp tương đương, test case Domain + BVA, kết quả, bug, phân tích AI bỏ sót |
| `bugs/` | Bug report tổng hợp; `issue-screenshots/` là ảnh chụp các issue trên GitHub |
| `evidence/` | Ảnh/video khi chạy test, đặt tên theo mã test case |
| `test-data/` | Dữ liệu test tự tạo (file CSV và body JSON cho FR-16) |
| `skills/` | Agent Skills |
| `ai/` | AI Audit Report, AI Critique, prompt log, các form AI-0x |
| `pdf/` | Bản PDF của các file Markdown |
| `git_log.txt` | Git commit log (xuất ở bước cuối) |
