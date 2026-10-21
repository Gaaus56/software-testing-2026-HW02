# D-FR06 — Chi tiết sản phẩm (Mobile)

> Trần Thanh An — 23120017 — HW02 Domain Testing
> SUT: `ttbhanh/eshop-sut`, commit `85af3ba`. Oracle: `eshop-sut/README.md` (Đặc tả v2.0, 2026-05-14).

## 1. Đặc tả và phạm vi (S0)

### 1.1 Đặc tả chính (trích nguyên văn)

> ### FR-06: Xem chi tiết sản phẩm
>
> - Hiển thị đầy đủ: Ảnh lớn, Tên, Giá, Mô tả, Danh mục.
> - Có ô nhập **Số lượng** (chỉ nhận số nguyên dương, tối thiểu là 1).
> - Nút **Thêm vào giỏ hàng** — sau khi bấm hiển thị phản hồi trực quan (toast notification hoặc badge cập nhật).

_Nguồn: `eshop-sut/README.md`, dòng 83–87._

### 1.2 Yêu cầu chung liên quan (trích nguyên văn)

**FR-20: Tính năng Mobile**: căn cứ để áp dụng FR-06 trên Mobile ("Xem sản phẩm", "Giỏ hàng").

> ### FR-20: Tính năng Mobile
>
> - Đầy đủ các chức năng: Xem sản phẩm, Đăng nhập, Đăng xuất, Đăng ký, Giỏ hàng, Thanh toán, Hồ sơ, Lịch sử đơn hàng.
> - Chức năng Hủy đơn hàng tuân theo đúng State Machine ở FR-10 (chỉ được hủy khi `pending` hoặc `confirmed`).

_Nguồn: `eshop-sut/README.md`, dòng 233–236._

**FR-24: Feedback & State Requirements**: phản hồi sau khi bấm "Thêm vào giỏ".

> ### FR-24: Feedback & State Requirements
>
> - Sau khi bấm "Thêm vào giỏ", phải có phản hồi trực quan (toast/badge).
> - Khi xóa item khỏi giỏ phải có dialog xác nhận.
> - Trang trống (Empty State) phải có icon/hình minh họa và message thân thiện.
> - Tất cả ảnh sản phẩm phải có thuộc tính `alt` mô tả nội dung ảnh (không để rỗng).

_Nguồn: `eshop-sut/README.md`, dòng 265–270._

**FR-21: Tiêu chuẩn Giao diện Chung**: giá hiển thị `₫` có phân cách hàng nghìn, giao diện tiếng Việt.

> ### FR-21: Tiêu chuẩn Giao diện Chung
>
> - **Nhất quán ngôn ngữ**: Toàn bộ giao diện dùng tiếng Việt (trừ thuật ngữ kỹ thuật chuẩn).
> - **Nhất quán màu sắc**: Các nút hành động tích cực (Submit, Mua hàng) dùng màu xanh dương. Các nút nguy hiểm/hủy bỏ dùng màu đỏ.
> - **Nhất quán đơn vị tiền**: Luôn dùng ký hiệu `₫` với định dạng phân cách hàng nghìn.
> - **Tiêu đề trang**: Mỗi trang có đúng 1 thẻ `<h1>` mô tả nội dung trang.
> - **Tab Order**: Thứ tự focus theo Tab phải đi từ trên xuống dưới, trái sang phải.

_Nguồn: `eshop-sut/README.md`, dòng 242–248._

### 1.3 API liên quan (trích nguyên văn `api_specification.md`)

> ### 3.2 Xem chi tiết một sản phẩm
> - **Endpoint:** `GET /api/products/:id`

_Nguồn: `eshop-sut/api_specification.md`, dòng 84–85._

> ### 4.2 Thêm vào giỏ hàng
> - **Endpoint:** `POST /api/cart`
> - **Body (JSON):** 
>   ```json
>   {
>     "id": 1,
>     "name": "Sản phẩm A",
>     "price": 100000,
>     "quantity": 2
>   }
>   ```

_Nguồn: `eshop-sut/api_specification.md`, dòng 117–127._

### 1.4 Quy tắc nguyên tử

| Mã | Quy tắc | Nguồn |
|---|---|---|
| R1 | Màn chi tiết hiển thị đủ: ảnh lớn, tên, giá, mô tả, danh mục | FR-06 gạch 1 |
| R2 | Ô Số lượng chỉ nhận **số nguyên dương**, tối thiểu 1 | FR-06 gạch 2 |
| R3 | Bấm "Thêm vào giỏ hàng" → phản hồi trực quan (toast / badge) | FR-06 gạch 3, FR-24 |
| R4 | Giá hiển thị `₫` có phân cách hàng nghìn; giao diện tiếng Việt | FR-21 |
| R5 | Mobile có đủ chức năng Xem sản phẩm, Giỏ hàng | FR-20 |

### 1.5 Khám phá giao diện

**Môi trường:** Expo Go trên điện thoại thật, cùng Wi-Fi với máy chạy backend. Phải sửa `API_URL` (`frontend-mobile/App.js:16`) thành IP LAN; đây là thay đổi duy nhất trên SUT. Không chạy được bản web của app, vì dự án không có `react-native-web` và cài thêm thì sẽ phải sửa SUT.

| # | Thành phần | Quan sát | Nguồn | Ảnh |
|---|---|---|---|---|
| U1 | Luồng | Danh sách SP → chạm SP → màn chi tiết có nhãn "Số lượng:", ô nhập và nút "Thêm vào giỏ hàng" | Cấu trúc màn hình của app (`productDetail`) | _(chụp trên máy)_ |
| U2 | Ô số lượng | Bàn phím kiểu `numeric`; giá trị khởi tạo "1" | Cấu trúc app | _(chụp trên máy)_ |
| U3 | Giỏ hàng | Màn "Giỏ Hàng" có ô số lượng sửa được, "Thành tiền" | Cấu trúc app | _(chụp trên máy)_ |
| U4–U6 | _(cần xác nhận trên thiết bị)_ | Các trường hiển thị thực tế; phản hồi sau khi bấm thêm; các ký tự gõ được trên bàn phím số | — | — |

### 1.6 Điểm mơ hồ và giả định

| # | Câu đặc tả | Câu hỏi | Cách hiểu chọn | Lý do | Ảnh hưởng |
|---|---|---|---|---|---|
| A1 | FR-20 "Xem sản phẩm" | FR-06 có áp dụng cho Mobile không? | Có, cho màn chi tiết của app | App có màn chi tiết với ô số lượng (U1) | Toàn bộ feature |
| A2 | "chỉ nhận số nguyên dương" | Nhập sai thì phải chặn hay tự sửa (về 1)? | **Chặn**, có thông báo; không âm thầm đổi giá trị | "Chỉ nhận" nghĩa là giá trị sai không được chấp nhận; tự sửa dễ làm người dùng mua sai số lượng | EP-02…08 |
| A3 | (không nói) | "05" có hợp lệ? | Hợp lệ = 5 | Vẫn là số nguyên dương | EP-09 |
| A4 | (không nói) | Số lượng tối đa? | Không có cận trên trong đặc tả → biên khám phá ở giới hạn số nguyên 32-bit và chuỗi rất dài; mong đợi: không crash, không tràn số | Rủi ro kỹ thuật | BVA-05…07 |
| A5 | FR-07 (Ngọc) "thêm trùng tăng số lượng" | Có test cộng dồn ở FR-06? | Chỉ 1 TC (EP-10) để kiểm số lượng nhập ở FR-06 được cộng đúng | Ranh giới với FR-07 | EP-10 |

### 1.7 Phạm vi

- **Trong phạm vi:** màn chi tiết SP trên Mobile, ô Số lượng, nút Thêm vào giỏ và phản hồi, cách hiển thị thông tin SP.
- **Ngoài phạm vi:** sửa số lượng trong Giỏ hàng Mobile (FR-07, Ngọc), thanh toán (FR-08), bản Web của trang chi tiết (FR-06 Web không ai nhận; chỉ ghi chú nếu tình cờ thấy lỗi).
