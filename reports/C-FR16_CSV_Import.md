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
