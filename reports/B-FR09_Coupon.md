# B-FR09 — Mã giảm giá / Coupon (Web)

> Trần Thanh An — 23120017 — HW02 Domain Testing
> SUT: `ttbhanh/eshop-sut`, commit `85af3ba`. Oracle: `eshop-sut/README.md` (Đặc tả v2.0, 2026-05-14).

## 1. Đặc tả và phạm vi (S0)

### 1.1 Đặc tả chính (trích nguyên văn)

> ### FR-09: Mã Giảm Giá (Coupon)
>
> Tại bước Checkout, người dùng có thể nhập mã giảm giá. Hệ thống áp dụng giảm giá dựa trên **5 điều kiện** sau, tất cả phải thỏa mãn:
>
> | #   | Điều kiện              | Mô tả                                                       |
> | --- | ---------------------- | ----------------------------------------------------------- |
> | C1  | **Mã tồn tại**         | Mã phải có trong CSDL và đang hoạt động (`is_active = 1`)   |
> | C2  | **Còn hạn sử dụng**    | Ngày hiện tại phải trước `expired_at`                       |
> | C3  | **Đủ ngưỡng đơn hàng** | Tổng đơn hàng **>= (lớn hơn hoặc bằng)** `min_order_amount` |
> | C4  | **Đã đăng nhập**       | Người dùng phải có JWT Token hợp lệ                         |
> | C5  | **Chưa dùng hết lượt** | Số lần đã dùng mã này của user < `max_uses_per_user`        |
>
> **Công thức tính giảm giá:**
>
> - Loại `percent`: `discount_amount = total × discount_value / 100`
> - Loại `fixed`: `discount_amount = discount_value`
> - `final_amount = total - discount_amount`
>
> **Mã giảm giá mẫu trong hệ thống:**
>
> | Mã        | Loại    | Giá trị   | Ngưỡng tối thiểu | Hạn dùng   | Số lần/người |
> | --------- | ------- | --------- | ---------------- | ---------- | ------------ |
> | `SAVE10`  | percent | 10%       | 300,000 ₫        | 2099-12-31 | 1            |
> | `BIGBUY`  | fixed   | 50,000 ₫  | 500,000 ₫        | 2099-12-31 | 1            |
> | `VIP100`  | fixed   | 100,000 ₫ | 300,000 ₫        | 2099-12-31 | 2            |
> | `EXPIRED` | percent | 20%       | 100,000 ₫        | 2020-01-01 | 1            |

_Nguồn: `eshop-sut/README.md`, dòng 110–135._

### 1.2 Yêu cầu chung liên quan (trích nguyên văn)

**FR-08: Thanh toán (Checkout)**: coupon được nhập tại bước Checkout; quy tắc backend tự tính tổng tiền áp dụng cho `total` trong công thức giảm giá. FR-08 thuộc Hương, chỉ dùng làm ngữ cảnh.

> ### FR-08: Thanh toán (Checkout)
>
> - Chỉ người dùng **đã đăng nhập** mới tiến hành thanh toán được.
> - **Tổng tiền thanh toán** được tính tự động từ giỏ hàng và không cho phép người dùng chỉnh sửa trực tiếp.
> - Giao diện hiển thị đầy đủ danh sách sản phẩm đặt mua.
> - Backend phải tự tính lại tổng tiền; không chấp nhận giá trị `total_amount` do client gửi lên.
> - Sau thanh toán thành công, giỏ hàng được xóa.

_Nguồn: `eshop-sut/README.md`, dòng 102–108._

**FR-17: Quản lý Mã Giảm Giá (Coupon CRUD)**: định nghĩa các trường của coupon; dùng giao diện này để tạo coupon test (biên ngày, ngưỡng). FR-17 thuộc Ngọc, chỉ dùng để chuẩn bị dữ liệu.

> ### FR-17: Quản lý Mã Giảm Giá (Coupon CRUD)
>
> - Admin có thể Thêm / Xem / Xóa mã giảm giá.
> - Các trường bắt buộc: `code` (duy nhất), `type` (percent/fixed), `discount_value` (dương), `expired_at`, `min_order_amount` (>= 0), `max_uses_per_user` (>= 1).

_Nguồn: `eshop-sut/README.md`, dòng 213–216._

**FR-21: Tiêu chuẩn Giao diện Chung**: số tiền giảm và thành tiền phải hiển thị `₫` có phân cách hàng nghìn.

> ### FR-21: Tiêu chuẩn Giao diện Chung
>
> - **Nhất quán ngôn ngữ**: Toàn bộ giao diện dùng tiếng Việt (trừ thuật ngữ kỹ thuật chuẩn).
> - **Nhất quán màu sắc**: Các nút hành động tích cực (Submit, Mua hàng) dùng màu xanh dương. Các nút nguy hiểm/hủy bỏ dùng màu đỏ.
> - **Nhất quán đơn vị tiền**: Luôn dùng ký hiệu `₫` với định dạng phân cách hàng nghìn.
> - **Tiêu đề trang**: Mỗi trang có đúng 1 thẻ `<h1>` mô tả nội dung trang.
> - **Tab Order**: Thứ tự focus theo Tab phải đi từ trên xuống dưới, trái sang phải.

_Nguồn: `eshop-sut/README.md`, dòng 242–248._

**Yêu cầu bảo mật SEC-02, SEC-05**: C4 yêu cầu JWT hợp lệ; ô nhập mã đi vào truy vấn CSDL.

> | ID     | Yêu cầu                                                                                                         |
> | ------ | --------------------------------------------------------------------------------------------------------------- |
> | SEC-02 | Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ.                                                          |
> | SEC-05 | Truy vấn CSDL phải dùng Parameterized Query, không nối chuỗi trực tiếp.                                         |

_Nguồn: `eshop-sut/README.md`, mục 9._

### 1.3 API liên quan (trích nguyên văn `api_specification.md`)

> ### 5.1 Áp dụng mã giảm giá
> - **Endpoint:** `POST /api/apply-coupon`
> - **Mô tả:** Tính toán tổng tiền sau khi giảm. Trả về cấu trúc JSON chứa `discount_amount` và `final_amount`.
> - **Body (JSON):**
>   ```json
>   {
>     "code": "SAVE10",
>     "total_amount": 500000,
>     "user_id": 1
>   }
>   ```

_Nguồn: `eshop-sut/api_specification.md`, dòng 153–163._

> ### 4.3 Đặt hàng (Checkout)
> - **Endpoint:** `POST /api/checkout`
> - **Body (JSON):**
>   ```json
>   {
>     "total_amount": 200000,
>     "shipping_address": "123 Le Loi, TP.HCM"
>   }
>   ```

_Nguồn: `eshop-sut/api_specification.md`, dòng 129–137._

> ### 6.4 Quản lý Mã Giảm Giá
> - **Thêm mới mã:** `POST /api/admin/coupons`
>   - **Body (JSON):**
>     ```json
>     {
>       "code": "TET2025",
>       "type": "percent", 
>       "discount_value": 15,
>       "min_order_amount": 200000,
>       "expired_at": "2025-01-31",
>       "max_uses_per_user": 1
>     }
>     ```
> - **Xóa mã:** `DELETE /api/admin/coupons/:id`

_Nguồn: `eshop-sut/api_specification.md`, dòng 201–214._

### 1.4 Quy tắc nguyên tử

| Mã | Quy tắc | Nguồn |
|---|---|---|
| C1 | Mã phải có trong CSDL và `is_active = 1` | FR-09 bảng điều kiện |
| C2 | Ngày hiện tại **trước** `expired_at` | FR-09 |
| C3 | Tổng đơn hàng **>=** `min_order_amount` | FR-09 |
| C4 | Người dùng có JWT hợp lệ | FR-09, SEC-02 |
| C5 | Số lần user đã dùng mã < `max_uses_per_user` | FR-09 |
| R-all | Chỉ áp dụng khi **cả 5** điều kiện thỏa | FR-09 câu dẫn |
| R-percent | `percent`: discount = total × discount_value / 100 | FR-09 công thức |
| R-fixed | `fixed`: discount = discount_value | FR-09 công thức |
| R-final | final = total − discount | FR-09 công thức |
| R-total | `total` là tổng tiền do backend tính từ giỏ, không tin giá trị client gửi | FR-08 gạch 4 |
| R-money | Số tiền hiển thị có `₫`, phân cách hàng nghìn | FR-21 |

### 1.5 Khám phá giao diện và API

Cách làm: đăng nhập `test@eshop.com`, thêm sản phẩm vào giỏ, vào Checkout và áp thử mã (DevTools Network). Gọi `GET /api/products`, `GET /api/coupons`, `POST /api/apply-coupon` bằng curl. Mã nguồn frontend chỉ được đọc để viết selector cho script.

| # | Thành phần | Quan sát | Ảnh |
|---|---|---|---|
| U1 | Bảng giá SP seed | 30.000.000 / 28.000.000 / 45.000.000 / 6.000.000 / 4.000.000 ₫ → **không ghép được** tổng 299.999 hay 300.000; phải tạo SP/coupon test qua Admin API, hoặc dùng `total_amount` ở tầng API | — |
| U2 | Checkout | Ô "Mã Giảm Giá" + nút "Áp dụng" màu cam; ô "Tổng tiền thanh toán (VND)" **sửa tay được** (thuộc FR-08, đã báo Hương) | [S0_U2](../evidence/FR09/S0_U2_checkout.png) |
| U3 | Network khi bấm Áp dụng | Body gửi `{code, total_amount, user_id}`: tổng tiền và user id **do client gửi**; mã được viết hoa và cắt khoảng trắng phía client | — |
| U4 | Response thành công | `{success, coupon_id, discount_amount, final_amount, message}` | — |
| U5 | Ghi lượt dùng | Sau khi đặt hàng, client gọi riêng `POST /api/coupon-usage {coupon_id}` (có token) | — |
| U6 | Admin → Mã Giảm Giá | Form có code, type, discount_value, min_order_amount, expired_at (ô ngày), max_uses_per_user. **Không có** trường/nút bật tắt `is_active` | — |
| U7 | Nghi vấn | Thử SAVE10 với tổng 400.000 → `discount_amount = -3.600.000`, `final_amount = 4.000.000` | — |

### 1.6 Điểm mơ hồ và giả định

| # | Câu đặc tả | Câu hỏi | Cách hiểu chọn | Lý do | Ảnh hưởng |
|---|---|---|---|---|---|
| A1 | C2 "Ngày hiện tại phải trước `expired_at`" | `expired_at` = hôm nay còn hạn không? | **Hết hạn** (so sánh nghiêm ngặt `<`) | Sát chữ "trước" | BVA hôm qua / hôm nay / ngày mai |
| A2 | C3 ">= `min_order_amount`" | — (rõ ràng) | Tổng = ngưỡng là hợp lệ | Đặc tả in đậm ">=" | BVA min − 1 / min / min + 1 |
| A3 | C1 `is_active = 1` | Tạo dữ liệu `is_active = 0` thế nào khi UI/API không hỗ trợ? | Sửa trực tiếp DB SQLite để chuẩn bị dữ liệu (chỉ ở bước tiền điều kiện) | Không còn cách hộp đen nào khác | EP-05 |
| A4 | C5 "Số lần đã dùng" | Lượt tính lúc áp mã hay lúc đặt hàng? | Lúc **đặt hàng thành công** | Áp thử mà chưa mua thì chưa "dùng" | EP-19, EP-20 |
| A5 | C4, C5 + FR-08 | Server có được tin `user_id` và `total_amount` client gửi? | **Không**: user lấy từ JWT, tổng lấy từ giỏ phía server | C4 yêu cầu JWT; FR-08 cấm tin `total_amount` của client | EP-16, EP-17 |
| A6 | (không nói) | Mã có phân biệt hoa/thường, khoảng trắng? | Không phân biệt; bỏ khoảng trắng đầu/cuối | UI hiển thị ô mã dạng chữ hoa | EP-07, EP-08 |
| A7 | R-final | `fixed` lớn hơn tổng đơn thì final âm? | final ≥ 0 (giảm tối đa bằng tổng đơn) | Số tiền phải trả không thể âm | BVA-16…18 |
| A8 | R-percent | Làm tròn khi tổng lẻ? | Cho phép sai số ≤ 0,5 ₫ | Đặc tả không nêu cách làm tròn | BVA-03 |

### 1.7 Phạm vi

- **Trong phạm vi:**
  - Ô mã ở Checkout.
  - `POST /api/apply-coupon`.
  - 5 điều kiện C1–C5.
  - Công thức percent / fixed / final.
  - Hiển thị số tiền (FR-21).
  - Ghi lượt dùng sau khi đặt hàng (phần liên quan C5).
- **Ngoài phạm vi:**
  - Tạo, xóa coupon (FR-17, Ngọc): chỉ dùng `POST /api/admin/coupons` để chuẩn bị dữ liệu.
  - Tính tổng giỏ và đặt hàng (FR-07, FR-08). Lỗi ô tổng tiền sửa tay được là của FR-08; mình ghi nhận và báo cho Hương.
  - SQL Injection chuyên sâu: chỉ giữ 1 ca nhập ký tự đặc biệt, xem như lớp không hợp lệ.

## 2. Biến input / output (S1)

**Cách làm:**
- Mỗi điều kiện C1–C5 gắn với ít nhất một biến.
- Chỉ có 1 ô nhập (mã), nhưng kết quả phụ thuộc vào **7 biến gián tiếp**: thuộc tính coupon trong DB, ngày hiện tại, tổng đơn, token, số lần đã dùng.
- Quan sát U3 cho thấy client gửi thêm `total_amount` và `user_id`. Vì vậy hai biến này cũng là input ở tầng API và phải được kiểm.
- Biến output (`discount_amount`, `final_amount`) có miền riêng theo công thức. Domain testing theo output đòi hỏi chọn input sao cho output rơi vào từng miền: percent, fixed, final ≥ 0.

| ID | Biến | Loại | Kiểu | Miền theo đặc tả | Nguồn |
|---|---|---|---|---|---|
| V1 | Mã coupon | Input trực tiếp | Chuỗi | Có trong DB và `is_active = 1` | C1 |
| V2 | Ngày hiện tại so với `expired_at` | Gián tiếp (thời gian) | Ngày | Trước `expired_at` | C2 |
| V3 | Tổng đơn hàng | Gián tiếp (từ giỏ) | Số tiền ₫ | ≥ `min_order_amount` (300.000 / 500.000 / 300.000 / 100.000) | C3 |
| V4 | Token | Gián tiếp (trạng thái) | JWT | Hợp lệ | C4 |
| V5 | Số lần user đã dùng mã | Gián tiếp (DB) | Số nguyên ≥ 0 | < `max_uses_per_user` (1 / 1 / 2 / 1) | C5 |
| V6 | Loại coupon | Gián tiếp (DB) | {percent, fixed} | Một trong hai | Công thức |
| V7 | `user_id` trong body | Input tầng API | Số nguyên | Phải trùng user trong JWT (A5) | U3, A5 |
| V8 | `total_amount` trong body | Input tầng API | Số tiền | Phải bằng tổng giỏ thật (A5) | U3, R-total |
| O1 | Chấp nhận / từ chối + thông báo | Output | status, chuỗi | Từ chối nêu đúng điều kiện vi phạm | R-all |
| O2 | `discount_amount` | Output | Số tiền | percent: total × v / 100; fixed: v | R-percent, R-fixed |
| O3 | `final_amount` | Output | Số tiền | total − discount, ≥ 0 (A7) | R-final |
| O4 | Hiển thị trên UI | Output | Chuỗi | `₫`, phân cách hàng nghìn | R-money |
| O5 | Lượt dùng sau đặt hàng | Output (DB) | Số nguyên | +1 khi đặt hàng thành công (A4) | C5 |

## 3. Lớp tương đương (S2)

**Cách làm:**
- Mỗi điều kiện C1–C5 có ít nhất 1 lớp V và 1 lớp I.
- V3 chia theo **từng mã**, vì mỗi mã có ngưỡng khác nhau, nhưng về bản chất chỉ có 2 lớp: ≥ ngưỡng và < ngưỡng.
- V6 chia theo loại, vì hai loại dùng công thức khác nhau (domain theo output).
- V7, V8 là các lớp ở tầng API, rút ra từ quan sát U3.

| Mã | Biến | Lớp | V/I | Đại diện | Kết quả mong đợi | Căn cứ |
|---|---|---|---|---|---|---|
| EC-09-01 | V1 | Tồn tại, active | V | SAVE10 | Xét tiếp C2–C5 | C1 |
| EC-09-02 | V1 | Không tồn tại | I | ABC123 | Từ chối | C1 |
| EC-09-03 | V1 | Tồn tại nhưng `is_active = 0` | I | OFF10 | Từ chối | C1 |
| EC-09-04 | V1 | Rỗng | I | "" | Không áp dụng | C1 |
| EC-09-05 | V1 | Chữ thường | V | save10 | Như SAVE10 | A6 |
| EC-09-06 | V1 | Có khoảng trắng đầu/cuối | V | "  SAVE10  " | Như SAVE10 | A6 |
| EC-09-07 | V1 | Ký tự đặc biệt / SQL | I | `x' OR 1=1 --` | Từ chối an toàn | C1, SEC-05 |
| EC-09-08 | V2 | Trước `expired_at` | V | SAVE10 (2099-12-31) | Hợp lệ | C2 |
| EC-09-09 | V2 | Bằng hoặc sau `expired_at` | I | EXPIRED (2020-01-01) | Từ chối | C2, A1 |
| EC-09-10 | V3 | total ≥ min | V | SAVE10 & 1.000.000 | Hợp lệ | C3 |
| EC-09-11 | V3 | total < min | I | SAVE10 & 200.000 | Từ chối | C3 |
| EC-09-12 | V4 | Token hợp lệ | V | JWT test@ | Hợp lệ | C4 |
| EC-09-13 | V4 | Không có token | I | — | Từ chối 401 | C4 |
| EC-09-14 | V4 | Token sai | I | token.khong.hop.le | Từ chối 401 | C4 |
| EC-09-15 | V5 | Đã dùng < max | V | SAVE10 dùng 0/1 | Hợp lệ | C5 |
| EC-09-16 | V5 | Đã dùng = max | I | SAVE10 dùng 1/1 | Từ chối | C5 |
| EC-09-17 | V6 | percent | V | SAVE10 | discount = total × 10 % | R-percent |
| EC-09-18 | V6 | fixed | V | BIGBUY, VIP100 | discount = giá trị cố định | R-fixed |
| EC-09-19 | V7 | `user_id` = user trong JWT | V | 2 | Hợp lệ | A5 |
| EC-09-20 | V7 | `user_id` ≠ user trong JWT | I | 99 | Lượt dùng tính theo JWT | A5 |
| EC-09-21 | V8 | `total_amount` = tổng giỏ thật | V | — | Hợp lệ | R-total |
| EC-09-22 | V8 | `total_amount` > tổng giỏ thật | I | gửi 400.000, giỏ 200.000 | Xét theo tổng thật | R-total, A5 |
| EC-09-23 | O3 | final ≥ 0 | V | FIX100K & 100.000 | final = 0 | R-final |
| EC-09-24 | O3 | discount > total | I | FIX100K & 99.999 | final không âm | A7 |
