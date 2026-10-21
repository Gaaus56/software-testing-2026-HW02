# C-FR16 — Import sản phẩm từ CSV (Web Admin)

> Trần Thanh An — 23120017 — HW02 Domain Testing
> SUT: `ttbhanh/eshop-sut`, commit `85af3ba`. Oracle: `eshop-sut/README.md` (Đặc tả v2.0, 2026-05-14).

## 1. Đặc tả và phạm vi (S0)

### 1.1 Đặc tả chính (trích nguyên văn)

> ### FR-16: Import Sản phẩm từ CSV
>
> - Admin có thể tải lên file CSV để import nhiều sản phẩm cùng lúc.
> - **Yêu cầu file CSV:**
>   - Đuôi file phải là `.csv`.
>   - Dòng đầu tiên là header: `name,price,description,imageUrl,category_id`.
>   - Hỗ trợ các trường có chứa dấu phẩy nếu được bọc trong dấu nháy kép (RFC 4180).
> - **Validation trước khi import:**
>   - `name` không được rỗng.
>   - `price` phải là số dương.
> - Nếu có lỗi ở bất kỳ dòng nào, toàn bộ import phải được **rollback** (giao dịch nguyên tử — all-or-nothing).
> - Hệ thống hiển thị báo cáo rõ ràng: bao nhiêu dòng thành công, bao nhiêu dòng lỗi và lý do.

_Nguồn: `eshop-sut/README.md`, dòng 200–211._

### 1.2 Yêu cầu chung liên quan (trích nguyên văn)

**FR-15: Quản lý Sản phẩm (Product CRUD)**: ràng buộc dữ liệu sản phẩm (tên ≤ 255 ký tự, giá > 0, danh mục có sẵn). FR-16 không nhắc lại, cần ghi giả định có áp dụng hay không. FR-15 thuộc Hương.

> ### FR-15: Quản lý Sản phẩm (Product CRUD)
>
> - Admin có thể Thêm / Xem / Sửa / Xóa sản phẩm.
> - **Ràng buộc đầu vào:**
>   - Tên sản phẩm: bắt buộc, tối đa 255 ký tự.
>   - Giá: bắt buộc, phải là số **dương** (> 0).
>   - Danh mục: bắt buộc, phải chọn từ danh sách có sẵn.
> - Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay đổi — các sản phẩm khác giữ nguyên.

_Nguồn: `eshop-sut/README.md`, dòng 191–198._

**FR-12: Kiểm soát truy cập (Access Control)**: API import là API Admin, phải yêu cầu token admin.

> ### FR-12: Kiểm soát truy cập (Access Control)
>
> - Phân hệ Admin chỉ dành cho tài khoản có `role = 'admin'`.
> - **Tất cả** các API Admin (`/api/admin/*`) và các API có tính ảnh hưởng dữ liệu (`POST/PUT/DELETE /api/products`, `/api/categories`, `/api/coupons`) đều phải yêu cầu:
>   1. Token JWT hợp lệ.
>   2. `role = 'admin'` trong Token.

_Nguồn: `eshop-sut/README.md`, dòng 174–179._

**Yêu cầu bảo mật SEC-03, SEC-04, SEC-05**: chỉ admin được import; tên/mô tả sản phẩm import sẽ được hiển thị ở Web.

> | ID     | Yêu cầu                                                                                                         |
> | ------ | --------------------------------------------------------------------------------------------------------------- |
> | SEC-03 | API Admin phải kiểm tra `role = 'admin'` trong Token, không chỉ kiểm tra sự tồn tại của Token.                  |
> | SEC-04 | Mọi dữ liệu từ user nhập vào khi hiển thị trên UI phải được escape đúng cách, không dùng `innerHTML` trực tiếp. |
> | SEC-05 | Truy vấn CSDL phải dùng Parameterized Query, không nối chuỗi trực tiếp.                                         |

_Nguồn: `eshop-sut/README.md`, mục 9._

### 1.3 API liên quan (trích nguyên văn `api_specification.md`)

> ### 6.3 Import Sản phẩm từ CSV (JSON Array)
> - **Endpoint:** `POST /api/admin/import-products`
> - **Body (JSON):**
>   ```json
>   {
>     "products": [
>       {
>         "name": "SP 1",
>         "price": 10000,
>         "description": "Mô tả 1",
>         "imageUrl": "",
>         "category_id": 1
>       }
>     ]
>   }
>   ```

_Nguồn: `eshop-sut/api_specification.md`, dòng 184–199._

### 1.4 Quy tắc nguyên tử

| Mã | Quy tắc | Nguồn |
|---|---|---|
| R1 | Đuôi file phải là `.csv` | FR-16 |
| R2 | Dòng đầu là header `name,price,description,imageUrl,category_id` | FR-16 |
| R3 | Trường chứa dấu phẩy được bọc nháy kép (RFC 4180) phải được hỗ trợ | FR-16 |
| R4 | `name` không rỗng | FR-16 validation |
| R5 | `price` là số dương (> 0) | FR-16 validation |
| R6 | Có lỗi ở **bất kỳ** dòng nào → rollback toàn bộ (all-or-nothing) | FR-16 |
| R7 | Báo cáo rõ số dòng thành công, số dòng lỗi và lý do | FR-16 |
| R8 | Chỉ admin (JWT hợp lệ + `role = 'admin'`) được gọi API import | FR-12, SEC-03 |
| R9 | Dữ liệu import hiển thị an toàn (không render HTML) | SEC-04 |

### 1.5 Khám phá giao diện và API

Cách làm: đăng nhập Web Admin, vào tab "Sản phẩm", phần "📂 Import sản phẩm từ CSV". Import thử file mẫu (DevTools Network), rồi gọi `POST /api/admin/import-products` bằng curl.

| # | Thành phần | Quan sát | Ảnh |
|---|---|---|---|
| U1 | Khu vực import | Ô chọn file (không có thuộc tính `accept`), link "Tải file mẫu", nút "Import N sản phẩm"; có bảng xem trước | [S0_U1](../evidence/FR16/S0_U1_import.png) |
| U2 | Network | Request là **JSON** `{"products":[…]}`, không phải file → việc đọc CSV xảy ra ở trình duyệt | — |
| U3 | Báo cáo kết quả | "✅ Import hoàn tất: x/y sản phẩm được thêm" + danh sách "Hàng n: lý do" | — |
| U4 | Thử API (3 dòng, dòng 2 thiếu tên) | `200 "Import hoàn tất: 2/3"`: 2 dòng vẫn được thêm → nghi vấn không rollback | — |
| U5 | Thử API với token user thường | `200`, sản phẩm được thêm → nghi vấn phân quyền | — |
| U6 | Danh mục | `GET /api/categories` → 1 Điện thoại, 2 Laptop, 3 Phụ kiện | — |

### 1.6 Điểm mơ hồ và giả định

| # | Câu đặc tả | Câu hỏi | Cách hiểu chọn | Lý do | Ảnh hưởng |
|---|---|---|---|---|---|
| A1 | "Hệ thống hiển thị báo cáo … bao nhiêu dòng thành công" | Khi rollback, báo cáo nên ghi thế nào? | 0 dòng được thêm + liệt kê dòng lỗi và lý do | All-or-nothing | EP-07…10 |
| A2 | "Đuôi file phải là `.csv`" | `.CSV` viết hoa? | Chấp nhận (không phân biệt hoa/thường) | Windows không phân biệt | EP-22 |
| A3 | "Dòng đầu tiên là header" | File UTF-8 có BOM (Excel) thì sao? | Bỏ qua BOM, header vẫn hợp lệ | BOM không phải dữ liệu | EP-17 |
| A4 | Header cụ thể | Đổi thứ tự / thiếu / thừa cột? | **Từ chối** — header phải đúng như đặc tả | Đặc tả ghi một header cố định | EP-19, BVA-15, BVA-16 |
| A5 | (không nói) | Giới hạn độ dài `name`? | Áp dụng 255 ký tự như FR-15 | Cùng thực thể sản phẩm | BVA-07…09 |
| A6 | (không nói) | `category_id` không tồn tại? | Từ chối (như FR-15: "phải chọn từ danh sách có sẵn") | Cùng thực thể sản phẩm | EP-18 |
| A7 | Kiến trúc 2 tầng (U2) | Validation/rollback do tầng nào? | Backend phải tự validate và rollback (không tin client) | Có thể gọi API trực tiếp | EP-14 |

### 1.7 Phạm vi

- **Trong phạm vi:**
  - Phần Import CSV ở Web Admin.
  - `POST /api/admin/import-products`.
  - Đọc file, header, RFC 4180.
  - Validate `name` và `price`, rollback, báo cáo kết quả.
  - Phân quyền của riêng API này (R8).
  - Hiển thị an toàn sản phẩm vừa import (R9).
- **Ngoài phạm vi:**
  - CRUD sản phẩm thủ công (FR-15, Hương). Chỉ mượn ràng buộc của FR-15 làm giả định A5, A6.
  - Phân quyền các API Admin khác (FR-12, không ai trong nhóm nhận).

## 2. Biến input / output (S1)

**Cách làm:**
- Input của FR-16 là một **file có cấu trúc**, nên các biến được chia theo 3 cấp: cấp file (đuôi, header, cách xuống dòng), cấp trường (cách bọc nháy), và cấp dòng (`name`, `price`, `category_id`).
- Thêm các biến tập hợp: số dòng, số dòng lỗi và vị trí dòng lỗi. Rollback (R6) phụ thuộc vào các biến này.
- Quan sát U2 cho thấy hệ thống có 2 tầng, nên token khi gọi API cũng là một biến.

| ID | Biến | Loại | Miền theo đặc tả | Nguồn |
|---|---|---|---|---|
| V1 | Đuôi / loại file | Input (file) | `.csv` | R1 |
| V2 | Header | Input (file) | Đúng `name,price,description,imageUrl,category_id` | R2 |
| V3 | Cách bọc trường | Input (trường) | Trường có `,` bọc `"…"`; `""` là dấu nháy | R3 |
| V4 | `name` | Input (dòng) | Không rỗng (≤ 255, A5) | R4 |
| V5 | `price` | Input (dòng) | Số > 0 | R5 |
| V6 | `category_id` | Input (dòng) | Danh mục tồn tại (A6) | A6 |
| V7 | Số dòng lỗi và vị trí | Gián tiếp (tập hợp) | 0 lỗi → import hết; ≥ 1 → rollback | R6 |
| V8 | Số dòng dữ liệu | Gián tiếp (tập hợp) | ≥ 1 | R7 |
| V9 | Token khi gọi API | Gián tiếp | Admin | R8 |
| V10 | Encoding / xuống dòng | Input (file) | UTF-8 (± BOM), LF/CRLF | A3 |
| O1 | Số SP thêm vào DB | Output (DB) | Đúng bằng số dòng nếu không lỗi, 0 nếu có lỗi | R6 |
| O2 | Báo cáo | Output (UI) | Số thành công, số lỗi, lý do | R7 |
| O3 | Dữ liệu SP sau import | Output (DB) | Đúng giá trị từng trường (kể cả có dấu phẩy) | R3 |
| O4 | Hiển thị SP ở Web | Output (UI) | Không render HTML | R9 |

## 3. Lớp tương đương (S2)

**Cách làm:**
- Mỗi biến được chia thành lớp V/I. Với các biến cấp dòng (V4, V5), lớp không hợp lệ được đặt **cạnh một dòng hợp lệ** trong cùng file. Như vậy cùng một TC kiểm được cả validation (R4, R5) lẫn rollback (R6).
- Lớp V7 ("có ≥ 1 dòng lỗi") là lớp quyết định rollback.

| Mã | Biến | Lớp | V/I | Đại diện | Kết quả mong đợi | Căn cứ |
|---|---|---|---|---|---|---|
| EC-16-01 | V1 | `.csv` | V | valid_2rows.csv | Đọc file | R1 |
| EC-16-02 | V1 | Đuôi khác, nội dung là CSV | I | .txt | Từ chối file | R1 |
| EC-16-03 | V1 | File nhị phân | I | .xlsx giả | Từ chối, sai định dạng | R1 |
| EC-16-04 | V2 | Đúng header | V | name,price,… | Đọc dữ liệu | R2 |
| EC-16-05 | V2 | Sai tên cột | I | ten,gia,… | Từ chối, header sai | R2 |
| EC-16-06 | V2 | Không có header | I | dòng 1 là dữ liệu | Từ chối, header sai | R2 |
| EC-16-07 | V2 | Đúng tên nhưng sai thứ tự | I | price,name,… | Từ chối | A4 |
| EC-16-08 | V2/V10 | Header có BOM UTF-8 | V | ﻿name,… | Đọc bình thường | A3 |
| EC-16-09 | V3 | Trường có `,` bọc nháy | V | "Laptop, Pro" | Giữ nguyên dấu phẩy | R3 |
| EC-16-10 | V3 | Nháy kép escape `""` | V | "Tai nghe ""Pro""" | Tai nghe "Pro" | R3 |
| EC-16-11 | V4 | Có giá trị | V | CSV-EP01 Ban phim | Hợp lệ | R4 |
| EC-16-12 | V4 | Rỗng | I | "" | Lỗi dòng | R4 |
| EC-16-13 | V4 | Chỉ khoảng trắng | I | "   " | Lỗi dòng | R4 |
| EC-16-14 | V5 | Số > 0 | V | 350000 | Hợp lệ | R5 |
| EC-16-15 | V5 | = 0 | I | 0 | Lỗi dòng | R5 |
| EC-16-16 | V5 | Âm | I | -5000 | Lỗi dòng | R5 |
| EC-16-17 | V5 | Không phải số | I | abc | Lỗi dòng | R5 |
| EC-16-18 | V6 | Danh mục tồn tại | V | 3 | Hợp lệ | A6 |
| EC-16-19 | V6 | Danh mục không tồn tại | I | 99 | Lỗi dòng | A6 |
| EC-16-20 | V7 | 0 dòng lỗi | V | — | Thêm tất cả | R6 |
| EC-16-21 | V7 | ≥ 1 dòng lỗi | I | — | Rollback, thêm 0 | R6 |
| EC-16-22 | V8 | ≥ 1 dòng dữ liệu | V | 1, 2 | Import | R7 |
| EC-16-23 | V8 | 0 dòng dữ liệu | I | chỉ header | Báo không có dữ liệu | R7 |
| EC-16-24 | V9 | Token admin | V | — | Import | R8 |
| EC-16-25 | V9 | Không token | I | — | 401 | R8 |
| EC-16-26 | V9 | Token user thường | I | — | 403 | R8 |
| EC-16-27 | V10 | Xuống dòng CRLF | V | file Windows | Đọc đúng, không dính `\r` | A3 |
| EC-16-28 | O4 | Tên chứa thẻ HTML | V | `<b>…</b>` | Hiện nguyên văn | R9 |

## 4. Test case Domain Testing (S3)

**Cách làm:**
1. Mỗi TC tương ứng với **một file test riêng**, đặt trong `test-data/FR16/` và đặt tên theo mã TC. Tất cả file được tạo bằng script để kiểm soát từng byte (BOM, CRLF, nhị phân).
2. **EP-01** phủ cùng lúc mọi lớp hợp lệ chính. Mỗi lớp không hợp lệ có một file riêng: lớp cấp dòng đặt cạnh dòng hợp lệ để đồng thời kiểm rollback (EP-07…10).
3. **Oracle** gồm 2 phần: (a) báo cáo trên UI, và (b) **số sản phẩm thật sự được thêm vào DB**, đếm bằng `GET /api/products` trước và sau. Chỉ nhìn báo cáo trên UI thì không phát hiện được lỗi rollback.
4. **Tầng API** (EP-12…14): kiểm phân quyền, và kiểm backend có tự validate khi gọi thẳng API, không qua giao diện (A7).
5. Danh mục: [`testcases/FR16.json`](../testcases/FR16.json).

<!-- TC:S3 -->
| ID | Tầng | Lớp / biên phủ | Căn cứ | Tiền điều kiện | Dữ liệu test | Các bước | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| FR16-EP-01 | UI | EC-16-01, 04, 11, 14, 18, 20, 22 | R1–R6 | Backend vừa khởi động lại; đăng nhập Admin → Sản phẩm | FR16-EP-01_valid_2rows.csv (2 dòng hợp lệ) | Chọn file → Import | Thêm đúng 2 SP; báo cáo 2 thành công, 0 lỗi |
| FR16-EP-02 | UI | EC-16-02 | R1 | Như EP-01 | FR16-EP-02_valid_content.txt (nội dung CSV hợp lệ, đuôi .txt) | Chọn file → Import | Từ chối file vì đuôi không phải .csv; không thêm SP |
| FR16-EP-03 | UI | EC-16-03 | R1 | Như EP-01 | FR16-EP-03_fake_excel.xlsx (nhị phân) | Chọn file → Import | Từ chối, báo sai định dạng file; không thêm SP |
| FR16-EP-04 | UI | EC-16-05 | R2 | Như EP-01 | Header ten,gia,mo_ta,image,danh_muc | Chọn file → Import | Từ chối, báo header sai; không thêm SP |
| FR16-EP-05 | UI | EC-16-06 | R2 | Như EP-01 | File không có header (2 dòng dữ liệu) | Chọn file → Import | Từ chối, báo thiếu/sai header; không thêm SP |
| FR16-EP-06 | UI | EC-16-09 | R3 (RFC 4180) | Như EP-01 | "CSV-EP06 Laptop, Pro",25000000,"Mo ta, co dau phay",…,2 | Chọn file → Import | Thêm 1 SP tên "CSV-EP06 Laptop, Pro", giá 25.000.000 |
| FR16-EP-07 | UI | EC-16-12, 21 | R4, R6, R7 | Như EP-01 | 3 dòng, dòng 2 name rỗng | Chọn file → Import | Rollback: không thêm SP nào; báo cáo nêu dòng lỗi và lý do (thiếu tên) |
| FR16-EP-08 | UI | EC-16-15, 21 | R5, R6 | Như EP-01 | 1 dòng hợp lệ + 1 dòng price = 0 | Chọn file → Import | Rollback: không thêm SP nào; báo lỗi giá |
| FR16-EP-09 | UI | EC-16-16, 21 | R5, R6 | Như EP-01 | 1 dòng hợp lệ + 1 dòng price = -5000 | Chọn file → Import | Rollback; báo lỗi giá |
| FR16-EP-10 | UI | EC-16-17, 21 | R5, R6 | Như EP-01 | 1 dòng hợp lệ + 1 dòng price = abc | Chọn file → Import | Rollback; báo lỗi giá |
| FR16-EP-11 | UI | EC-16-23 | R7 | Như EP-01 | Chỉ có header | Chọn file → Import | Không import; báo không có dữ liệu (hoặc không cho bấm Import) |
| FR16-EP-12 | API | EC-16-25 | FR-12 | — | 1 SP hợp lệ, không header Authorization | POST /api/admin/import-products | 401; không thêm SP |
| FR16-EP-13 | API | EC-16-26 | FR-12, SEC-03 | Token của test@ (role user) | 1 SP hợp lệ | POST /api/admin/import-products | 403; không thêm SP |
| FR16-EP-14 | API | EC-16-16, 21 (tầng API) | R5, R6 | Token admin | test-data/FR16/api/FR16-EP-14_body.json: dòng giữa price = -1 | POST /api/admin/import-products (bỏ qua giao diện) | Backend tự validate: từ chối, rollback, không thêm SP |
<!-- /TC:S3 -->

## 5. Phân tích giá trị biên và test case BVA (S4)

**Cách làm:**
1. Biến có thứ tự:
   - `price` (V5): biên 0.
   - Độ dài `name` (V4): biên 1, và biên 255 theo A5.
   - Số dòng dữ liệu (V8): biên 1.
   - Số cột của header: biên 5.
   - Vị trí dòng lỗi trong file: đầu / cuối, là biên của tập hợp.
2. Bước nhỏ nhất: `price` là 0,01 (giá có thể lẻ, xem FR-15 "số dương"); độ dài là 1 ký tự; số dòng là 1; số cột là 1.
3. Dùng BVA 3 giá trị. BVA-10 (0 dòng) trùng với EP-11 nên dùng chung, không chạy lại.

| Biên | Biến | Bước | Giá trị test | Kết quả mong đợi | TC |
|---|---|---|---|---|---|
| price > 0 | V5 | 0,01 | -0,01 / 0 / 0,01 | Từ chối / Từ chối / Thêm | BVA-01…03 |
| Độ dài name ≥ 1 | V4 | 1 ký tự | 0 / 1 / 2 | Từ chối / Thêm / Thêm | BVA-04…06 |
| Độ dài name ≤ 255 (A5) | V4 | 1 ký tự | 254 / 255 / 256 | Thêm / Thêm / Từ chối | BVA-07…09 |
| Số dòng ≥ 1 | V8 | 1 dòng | 0 / 1 / 2 | Không import / 1 / 2 | BVA-10…12 |
| Vị trí dòng lỗi | V7 | — | dòng đầu / dòng cuối (trong 3 dòng) | Rollback | BVA-13, 14 |
| Số cột = 5 | V2 | 1 cột | 4 / 6 (5 = EP-01) | Từ chối | BVA-15, 16 |

<!-- TC:S4 -->
| ID | Tầng | Lớp / biên phủ | Căn cứ | Tiền điều kiện | Dữ liệu test | Các bước | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| FR16-BVA-01 | UI | EC-16-16 (0 − 0,01) | R5 | Như EP-01 | price = -0.01 | Import file 1 dòng | Từ chối; không thêm SP |
| FR16-BVA-02 | UI | EC-16-15 (= 0) | R5 | Như EP-01 | price = 0 | Import file 1 dòng | Từ chối; không thêm SP |
| FR16-BVA-03 | UI | EC-16-14 (0 + 0,01) | R5 | Như EP-01 | price = 0.01 | Import file 1 dòng | Thêm 1 SP |
| FR16-BVA-04 | UI | EC-16-12 (độ dài 0) | R4 | Như EP-01 | name = "" | Import file 1 dòng | Từ chối; báo thiếu tên |
| FR16-BVA-05 | UI | EC-16-11 (độ dài 1) | R4 | Như EP-01 | name = "A" | Import file 1 dòng | Thêm 1 SP tên "A" |
| FR16-BVA-06 | UI | EC-16-11 (độ dài 2) | R4 | Như EP-01 | name = "AB" | Import file 1 dòng | Thêm 1 SP |
| FR16-BVA-07 | UI | A5 (255 − 1) | FR-15, A5 | Như EP-01 | name 254 ký tự | Import file 1 dòng | Thêm 1 SP |
| FR16-BVA-08 | UI | A5 (= 255) | FR-15, A5 | Như EP-01 | name 255 ký tự | Import file 1 dòng | Thêm 1 SP |
| FR16-BVA-09 | UI | A5 (255 + 1) | FR-15, A5 | Như EP-01 | name 256 ký tự | Import file 1 dòng | Từ chối (giả định A5: áp dụng giới hạn 255 của FR-15) |
| FR16-BVA-10 | UI | EC-16-23 (0 dòng) | R7 | — | 0 dòng dữ liệu | = FR16-EP-11 (dùng chung, không chạy lại) | Như FR16-EP-11 |
| FR16-BVA-11 | UI | EC-16-22 (1 dòng) | R7 | Như EP-01 | 1 dòng hợp lệ | Import | Thêm 1 SP |
| FR16-BVA-12 | UI | EC-16-22 (2 dòng) | R7 | Như EP-01 | 2 dòng hợp lệ | Import | Thêm 2 SP |
| FR16-BVA-13 | UI | EC-16-21 (lỗi ở dòng đầu) | R6 | Như EP-01 | 3 dòng, dòng 1 name rỗng | Import | Rollback: 0 SP |
| FR16-BVA-14 | UI | EC-16-21 (lỗi ở dòng cuối) | R6 | Như EP-01 | 3 dòng, dòng 3 price = 0 | Import | Rollback: 0 SP |
| FR16-BVA-15 | UI | Số cột 5 − 1 | R2, A4 | Như EP-01 | Header 4 cột (thiếu category_id) | Import | Từ chối, báo header sai |
| FR16-BVA-16 | UI | Số cột 5 + 1 | R2, A4 | Như EP-01 | Header 6 cột (thêm stock) | Import | Từ chối, báo header sai |
<!-- /TC:S4 -->
