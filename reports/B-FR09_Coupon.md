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

## 4. Test case Domain Testing (S3)

**Cách làm:**
1. **Baseline:** EP-01 cho cả 5 điều kiện đúng cùng lúc, đồng thời kiểm công thức percent.
2. **Mỗi lần sai một điều kiện:** một TC cho mỗi lớp không hợp lệ của C1–C5 (EP-04, 05, 09, 10, 11, 12, 13, 14). Các điều kiện còn lại giữ hợp lệ, để thông báo từ chối chỉ ra đúng điều kiện bị vi phạm.
3. **Domain theo output:** EP-01 (percent), EP-02 và EP-03 (fixed) kiểm số tiền cụ thể.
4. **Tầng test:**
   - Logic 5 điều kiện test qua API, vì tổng đơn của dữ liệu seed không ghép được các giá trị cần thiết (U1).
   - Hành vi của ô mã (rỗng, hoa/thường, khoảng trắng) và phần hiển thị (FR-21) test trên UI: EP-06, 07, 08, 15.
5. Danh mục: [`testcases/FR09.json`](../testcases/FR09.json).

<!-- TC:S3 -->
| ID | Tầng | Lớp / biên phủ | Căn cứ | Tiền điều kiện | Dữ liệu test | Các bước | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| FR09-EP-01 | API | EC-09-01, 08, 10, 12, 15, 17 | C1–C5, R-percent | Backend vừa khởi động lại; token test@ | SAVE10, total 1.000.000 | POST /api/apply-coupon kèm Bearer token | Thành công; discount = 1.000.000 × 10 / 100 = 100.000; final = 900.000 |
| FR09-EP-02 | API | EC-09-18 | R-fixed | Như EP-01 | BIGBUY, total 600.000 | POST /api/apply-coupon | discount = 50.000; final = 550.000 |
| FR09-EP-03 | API | EC-09-18 | R-fixed | Như EP-01 | VIP100, total 400.000 | POST /api/apply-coupon | discount = 100.000; final = 300.000 |
| FR09-EP-04 | API | EC-09-02 | C1 | Như EP-01 | ABC123, total 400.000 | POST /api/apply-coupon | Từ chối: mã không tồn tại |
| FR09-EP-05 | API | EC-09-03 | C1 | Tạo coupon OFF10 (fixed 10.000, min 0) rồi đặt is_active = 0 trực tiếp trong DB (không có UI/API) | OFF10, total 100.000 | POST /api/apply-coupon | Từ chối: mã không hoạt động |
| FR09-EP-06 | UI | EC-09-04 | C1 | Đã đăng nhập; giỏ 400.000 ₫; ở trang Checkout | Ô mã để trống | Quan sát nút Áp dụng | Không áp dụng được (nút vô hiệu hoặc báo nhập mã) |
| FR09-EP-07 | UI | EC-09-05 | A6 | Như EP-06 | save10 | Nhập mã → Áp dụng | Được xử lý như SAVE10 (giả định A6: mã không phân biệt hoa/thường) |
| FR09-EP-08 | UI | EC-09-06 | A6 | Như EP-06 | "  SAVE10  " | Nhập mã → Áp dụng | Khoảng trắng đầu/cuối bị bỏ, áp dụng như SAVE10 |
| FR09-EP-09 | API | EC-09-07 | C1, SEC-05 | Như EP-01 | x' OR 1=1 -- | POST /api/apply-coupon | Từ chối như mã không tồn tại; không lỗi server, không áp được mã nào |
| FR09-EP-10 | API | EC-09-09 | C2 | Như EP-01 | EXPIRED (hạn 2020-01-01), total 200.000 | POST /api/apply-coupon | Từ chối: mã hết hạn |
| FR09-EP-11 | API | EC-09-11 | C3 | Như EP-01 | SAVE10, total 200.000 | POST /api/apply-coupon | Từ chối: chưa đủ ngưỡng 300.000 |
| FR09-EP-12 | API | EC-09-13 | C4, SEC-02 | Không đăng nhập | SAVE10, total 1.000.000, không header Authorization | POST /api/apply-coupon | Từ chối 401: chưa đăng nhập |
| FR09-EP-13 | API | EC-09-14 | C4 | — | Authorization: Bearer token.khong.hop.le | POST /api/apply-coupon | Từ chối 401: token không hợp lệ |
| FR09-EP-14 | API | EC-09-16 | C5 | test@ đã ghi 1 lượt dùng SAVE10 (POST /api/coupon-usage) | SAVE10, total 400.000 | POST /api/apply-coupon | Từ chối: đã dùng hết lượt (1/1) |
| FR09-EP-15 | UI | EC-09-01, 17; FR-21 | R-percent, FR-21 | Admin tạo SP giá 400.000; đăng nhập test@; thêm 1 SP vào giỏ; vào Checkout | SAVE10 | Nhập mã → Áp dụng | Hiện Tiết kiệm 40.000 ₫, Thành tiền 360.000 ₫ (có ₫ và phân cách hàng nghìn) |
<!-- /TC:S3 -->

## 5. Phân tích giá trị biên và test case BVA (S4)

**Cách làm:**
1. Các biến có thứ tự gồm: V3 (tổng đơn), V2 (ngày) và V5 (số lần dùng).
2. Bước nhỏ nhất: V3 là 1 ₫, V2 là 1 ngày, V5 là 1 lần.
3. Dùng **BVA 3 giá trị** cho mỗi ngưỡng. V3 có 3 ngưỡng khác nhau (SAVE10 và VIP100 cùng 300.000 nhưng khác loại, BIGBUY 500.000), nên xét đủ cả 3 mã để thấy lỗi có lặp lại theo loại hay không.
4. **Biên kết hợp:** BVA-10 cho EXPIRED, với tổng đúng bằng ngưỡng 100.000 nhưng đã hết hạn. TC này kiểm rằng C2 vẫn chặn khi C3 vừa đúng biên.
5. **Biên ngày:** tạo 3 coupon có hạn hôm qua / hôm nay / ngày mai qua `POST /api/admin/coupons`. Giá trị "hôm nay" tính theo ngày chạy test.

| Biên | Biến | Bước | Giá trị test | Kết quả mong đợi | TC |
|---|---|---|---|---|---|
| SAVE10 min 300.000 (percent) | V3 | 1 ₫ | 299.999 / 300.000 / 300.001 | Từ chối / 30.000 → 270.000 / 30.000,1 → 270.000,9 | BVA-01…03 |
| BIGBUY min 500.000 (fixed) | V3 | 1 ₫ | 499.999 / 500.000 / 500.001 | Từ chối / 450.000 / 450.001 | BVA-04…06 |
| VIP100 min 300.000 (fixed) | V3 | 1 ₫ | 299.999 / 300.000 / 300.001 | Từ chối / 200.000 / 200.001 | BVA-07…09 |
| EXPIRED min 100.000 + hết hạn | V2 × V3 | — | 100.000 | Từ chối (C2) | BVA-10 |
| `expired_at` | V2 | 1 ngày | hôm qua / hôm nay / ngày mai | Từ chối / Từ chối (A1) / Hợp lệ | BVA-11…13 |
| VIP100 max 2 lượt | V5 | 1 lần | đã dùng 1 / 2 | Hợp lệ / Từ chối | BVA-14, 15 |
| SAVE10 max 1 lượt | V5 | 1 lần | đã dùng 0 / 1 | (đã phủ bởi EP-01 / EP-14) | — |

<!-- TC:S4 -->
| ID | Tầng | Lớp / biên phủ | Căn cứ | Tiền điều kiện | Dữ liệu test | Các bước | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| FR09-BVA-01 | API | EC-09-11 (min − 1) | C3 | Như EP-01 | SAVE10, total 299.999 | POST /api/apply-coupon | Từ chối: chưa đủ ngưỡng |
| FR09-BVA-02 | API | EC-09-10 (= min) | C3 (>=) | Như EP-01 | SAVE10, total 300.000 | POST /api/apply-coupon | Thành công; discount 30.000; final 270.000 |
| FR09-BVA-03 | API | EC-09-10 (min + 1) | C3, R-percent | Như EP-01 | SAVE10, total 300.001 | POST /api/apply-coupon | Thành công; discount 30.000,1; final 270.000,9 (sai số làm tròn ≤ 0,5) |
| FR09-BVA-04 | API | EC-09-11 (min − 1) | C3 | Như EP-01 | BIGBUY, total 499.999 | POST /api/apply-coupon | Từ chối |
| FR09-BVA-05 | API | EC-09-10 (= min) | C3 (>=) | Như EP-01 | BIGBUY, total 500.000 | POST /api/apply-coupon | Thành công; discount 50.000; final 450.000 |
| FR09-BVA-06 | API | EC-09-10 (min + 1) | C3 | Như EP-01 | BIGBUY, total 500.001 | POST /api/apply-coupon | Thành công; final 450.001 |
| FR09-BVA-07 | API | EC-09-11 (min − 1) | C3 | Như EP-01 | VIP100, total 299.999 | POST /api/apply-coupon | Từ chối |
| FR09-BVA-08 | API | EC-09-10 (= min) | C3 (>=) | Như EP-01 | VIP100, total 300.000 | POST /api/apply-coupon | Thành công; discount 100.000; final 200.000 |
| FR09-BVA-09 | API | EC-09-10 (min + 1) | C3 | Như EP-01 | VIP100, total 300.001 | POST /api/apply-coupon | Thành công; final 200.001 |
| FR09-BVA-10 | API | EC-09-09 × EC-09-10 | C2, C3 | Như EP-01 | EXPIRED, total 100.000 (= min nhưng đã hết hạn) | POST /api/apply-coupon | Từ chối (C2 không thỏa dù C3 thỏa ở biên) |
| FR09-BVA-11 | API | EC-09-09 (hôm qua) | C2 | Admin tạo coupon DAYM1 hạn = hôm qua | DAYM1, total 100.000 | POST /api/apply-coupon | Từ chối: hết hạn |
| FR09-BVA-12 | API | EC-09-09 (hôm nay) | C2, A1 | Admin tạo coupon DAY0 hạn = hôm nay | DAY0, total 100.000 | POST /api/apply-coupon | Từ chối (giả định A1: "trước" là so sánh nghiêm ngặt) |
| FR09-BVA-13 | API | EC-09-08 (ngày mai) | C2 | Admin tạo coupon DAYP1 hạn = ngày mai | DAYP1, total 100.000 | POST /api/apply-coupon | Thành công; discount 10.000; final 90.000 |
| FR09-BVA-14 | API | EC-09-15 (max − 1) | C5 | test@ đã dùng VIP100 1 lần | VIP100, total 400.000 | POST /api/apply-coupon | Thành công (1 < 2) |
| FR09-BVA-15 | API | EC-09-16 (= max) | C5 | test@ đã dùng VIP100 2 lần | VIP100, total 400.000 | POST /api/apply-coupon | Từ chối: đã dùng hết lượt (2/2) |
<!-- /TC:S4 -->
