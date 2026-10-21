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

## 2. Biến input / output (S1)

**Cách làm:** chỉ có 1 ô nhập, nhưng giá trị gõ vào là **chuỗi ký tự**. Vì vậy biến được tách theo các chiều của chuỗi: giá trị số, dấu, phần thập phân, ký tự không phải số, độ dài. Bên cạnh đó có trạng thái giỏ hàng và các output hiển thị.

| ID | Biến | Loại | Miền theo đặc tả | Chiều biến đổi | Nguồn |
|---|---|---|---|---|---|
| V1 | Chuỗi trong ô Số lượng | Input trực tiếp | Số nguyên ≥ 1 | giá trị, dấu, thập phân, chữ, rỗng, khoảng trắng, số 0 đầu, độ dài | R2 |
| V2 | Giỏ đã có SP này chưa | Gián tiếp (trạng thái) | — | chưa có / đã có | A5 |
| O1 | Số lượng trong giỏ sau khi thêm | Output | Bằng số đã nhập (hoặc cộng dồn) | — | R2 |
| O2 | Phản hồi sau khi bấm | Output | Có toast / badge | — | R3 |
| O3 | Thông tin hiển thị | Output | Ảnh, tên, giá, mô tả, danh mục | — | R1 |
| O4 | Định dạng giá | Output | `₫`, phân cách hàng nghìn | — | R4 |

## 3. Lớp tương đương (S2)

**Cách làm:** chia V1 theo từng **kiểu sai** của chuỗi, vì mỗi kiểu có thể được xử lý theo cách khác nhau: parse ra số âm, cắt phần thập phân, dừng ở ký tự chữ… Chia theo kiểu sai như vậy là cách bắt được lỗi "nhận một phần" (ví dụ "2abc" bị hiểu thành 2).

| Mã | Biến | Lớp | V/I | Đại diện | Kết quả mong đợi | Căn cứ |
|---|---|---|---|---|---|---|
| EC-06-01 | V1 | Số nguyên ≥ 1 | V | 1, 2, 3 | Thêm đúng số lượng | R2 |
| EC-06-02 | V1 | 0 | I | 0 | Không nhận | R2, A2 |
| EC-06-03 | V1 | Số âm | I | -2, -1 | Không nhận | R2 |
| EC-06-04 | V1 | Số thập phân | I | 1.5 | Không nhận | R2 |
| EC-06-05 | V1 | Chữ | I | abc | Không nhận | R2 |
| EC-06-06 | V1 | Rỗng | I | "" | Không nhận | R2 |
| EC-06-07 | V1 | Khoảng trắng | I | " " | Không nhận | R2 |
| EC-06-08 | V1 | Số lẫn chữ | I | 2abc | Không nhận | R2 |
| EC-06-09 | V1 | Có số 0 đầu | V | 05 | = 5 | A3 |
| EC-06-10 | V1 | Rất lớn (không có cận trên) | — | 2147483647, 2147483648, 20 chữ số | Không crash, không tràn số | A4 |
| EC-06-11 | V2 | SP chưa có trong giỏ | V | — | Tạo dòng mới | R2 |
| EC-06-12 | V2 | SP đã có trong giỏ | V | đã có 2 | Cộng dồn | A5 |
| EC-06-13 | O3 | Thông tin hiển thị | — | — | Đủ 5 trường | R1 |
| EC-06-14 | O2 | Phản hồi | — | — | Có toast / badge | R3 |

## 4. Test case Domain Testing (S3)

**Cách làm:**
- Mỗi lớp không hợp lệ của V1 có một TC riêng, đều bắt đầu từ trạng thái giỏ trống.
- Oracle của các TC không hợp lệ là **giỏ hàng không thay đổi**, kèm theo có thông báo. Không chỉ dựa vào việc có thông báo hay không.
- Các TC hiển thị (EP-11, EP-12) kiểm output O2 và O3.
- Danh mục: [`testcases/FR06.json`](../testcases/FR06.json).

<!-- TC:S3 -->
| ID | Tầng | Lớp / biên phủ | Căn cứ | Tiền điều kiện | Dữ liệu test | Các bước | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| FR06-EP-01 | Mobile | EC-06-01, EC-06-11 | R2, R3 | Mở app, đăng nhập (tuỳ chọn), giỏ trống; mở chi tiết SP "Tai nghe AirPods Pro 2" | Số lượng = 3 | Xóa ô số lượng → nhập 3 → Thêm vào giỏ hàng → mở Giỏ hàng | Có phản hồi (thông báo/badge); giỏ có 1 dòng SP với số lượng 3 |
| FR06-EP-02 | Mobile | EC-06-02 | R2 | Như EP-01 | 0 | Nhập 0 → Thêm vào giỏ hàng → mở Giỏ hàng | Không nhận: báo lỗi số lượng, giỏ không thay đổi (giả định A2: "chỉ nhận" = chặn, không tự sửa) |
| FR06-EP-03 | Mobile | EC-06-03 | R2 | Như EP-01 | -2 | Như EP-02 | Không nhận; giỏ không thay đổi |
| FR06-EP-04 | Mobile | EC-06-04 | R2 | Như EP-01 | 1.5 (hoặc 1,5 tùy bàn phím) | Như EP-02 | Không nhận số thập phân; giỏ không thay đổi |
| FR06-EP-05 | Mobile | EC-06-05 | R2 | Như EP-01 | abc (dán từ clipboard nếu bàn phím số không gõ được chữ) | Như EP-02 | Không nhận; giỏ không thay đổi |
| FR06-EP-06 | Mobile | EC-06-06 | R2 | Như EP-01 | Ô trống | Xóa hết ô → Thêm vào giỏ hàng | Không nhận; báo phải nhập số lượng |
| FR06-EP-07 | Mobile | EC-06-07 | R2 | Như EP-01 | " " (khoảng trắng) | Như EP-02 | Không nhận |
| FR06-EP-08 | Mobile | EC-06-08 | R2 | Như EP-01 | 2abc | Như EP-02 | Không nhận (không phải số nguyên) |
| FR06-EP-09 | Mobile | EC-06-09 | R2, A3 | Như EP-01 | 05 | Nhập 05 → Thêm → Giỏ hàng | Nhận là 5 (giả định A3) |
| FR06-EP-10 | Mobile | EC-06-12 | R3 | Giỏ đã có SP đó với số lượng 2 | Thêm 3 | Ở chi tiết cùng SP nhập 3 → Thêm → Giỏ hàng | Một dòng, số lượng 5 (không tạo dòng mới) |
| FR06-EP-11 | Mobile | EC-06-13 | R1 | Mở chi tiết SP bất kỳ | — | Quan sát màn hình | Có đủ: ảnh lớn, tên, giá, mô tả, danh mục |
| FR06-EP-12 | Mobile | EC-06-14 | R3, FR-24 | Như EP-01 | Số lượng mặc định | Bấm Thêm vào giỏ hàng | Có phản hồi trực quan ngay (toast/thông báo/badge) |
<!-- /TC:S3 -->

## 5. Phân tích giá trị biên và test case BVA (S4)

**Cách làm:**
- **Biên dưới** là 1 (bước 1) → test 0 / 1 / 2, thêm −1.
- Đặc tả **không có biên trên** (A4). Vì vậy chọn các biên kỹ thuật làm biên khám phá:
  - 2^31 − 1 = 2147483647 (giới hạn số nguyên 32-bit).
  - 2^31 = 2147483648.
  - Chuỗi 20 chữ số, vượt `Number.MAX_SAFE_INTEGER`.

  Ở các biên khám phá, kết quả mong đợi là "không crash, không tràn số". Kết quả thực tế sẽ được ghi lại để đề xuất bổ sung đặc tả.

| Biên | Giá trị | Kết quả mong đợi | TC |
|---|---|---|---|
| min = 1 | 0 / 1 / 2 | Không nhận / 1 / 2 | BVA-01 (= EP-02), BVA-02, BVA-03 |
| Số âm sát 0 | −1 | Không nhận | BVA-04 |
| Biên khám phá | 2147483647 / 2147483648 / 20 chữ số | Không crash, không tràn số | BVA-05…07 |

<!-- TC:S4 -->
| ID | Tầng | Lớp / biên phủ | Căn cứ | Tiền điều kiện | Dữ liệu test | Các bước | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| FR06-BVA-01 | Mobile | EC-06-02 (min − 1) | R2 | Như EP-01 | 0 | = FR06-EP-02 (dùng chung) | Như FR06-EP-02 |
| FR06-BVA-02 | Mobile | EC-06-01 (= min) | R2 | Như EP-01 | 1 | Nhập 1 → Thêm → Giỏ hàng | Giỏ có số lượng 1 |
| FR06-BVA-03 | Mobile | EC-06-01 (min + 1) | R2 | Như EP-01 | 2 | Nhập 2 → Thêm → Giỏ hàng | Giỏ có số lượng 2 |
| FR06-BVA-04 | Mobile | EC-06-03 (−1) | R2 | Như EP-01 | -1 | Như EP-02 | Không nhận |
| FR06-BVA-05 | Mobile | EC-06-10 (biên khám phá 2^31 − 1) | A4 | Như EP-01 | 2147483647 | Nhập → Thêm → Giỏ hàng (xem số lượng, thành tiền) | (Khám phá) Không crash; số lượng và thành tiền hiển thị đúng hoặc bị chặn có thông báo |
| FR06-BVA-06 | Mobile | EC-06-10 (2^31) | A4 | Như EP-01 | 2147483648 | Như BVA-05 | (Khám phá) Không crash, không tràn số |
| FR06-BVA-07 | Mobile | EC-06-10 (rất dài) | A4 | Như EP-01 | 99999999999999999999 (20 chữ số) | Như BVA-05 | (Khám phá) Không crash; không hiển thị số mũ/NaN |
<!-- /TC:S4 -->
