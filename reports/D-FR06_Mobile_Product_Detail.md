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

## 6. Review và bổ sung (S5)

### 6.1 Bảng review

| # | Đối tượng | Đánh giá | Vấn đề | Xử lý | Căn cứ |
|---|---|---|---|---|---|
| RV1 | Bộ TC S3 | INCOMPLETE | Chưa kiểm giá trị mặc định của ô (lớp hợp lệ hay gặp nhất) | Thêm EP-13 | R2 |
| RV2 | Bộ TC S3 | INCOMPLETE | Chưa kiểm định dạng giá (R4) | Thêm EP-14 | FR-21 |
| RV3 | EC-06-05 | INCOMPLETE | Bàn phím `numeric` có thể không gõ được chữ, nên EP-05 cần cách đưa chữ vào (dán từ clipboard). Phải ghi lại các ký tự gõ được | Thêm EP-15; sửa bước của EP-05 | U2 |
| RV4 | TC nháp "xoay ngang màn hình" | INVALID | Không thuộc Domain/BVA, đặc tả không nói | Loại | — |
| RV5 | Các TC còn lại | VALID | — | Giữ | — |

### 6.2 Test case bổ sung

<!-- TC:S5 -->
| ID | Tầng | Lớp / biên phủ | Căn cứ | Tiền điều kiện | Dữ liệu test | Các bước | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| FR06-EP-13 | Mobile | EC-06-01 (mặc định) | R2 | Mở chi tiết SP | Không sửa ô (giá trị mặc định) | Quan sát giá trị mặc định → Thêm → Giỏ hàng | Mặc định 1; giỏ có số lượng 1 |
| FR06-EP-14 | Mobile | FR-21 | FR-21 | Mở chi tiết SP giá 30.000.000 | — | Quan sát giá | Giá hiển thị có ₫ và phân cách hàng nghìn (30.000.000 ₫ hoặc 30,000,000 ₫) |
| FR06-EP-15 | Mobile | EC-06-05 (bàn phím) | R2 | Như EP-01 | — | Chạm vào ô số lượng, quan sát bàn phím | Bàn phím số; ghi lại các ký tự không phải số gõ được (-, ., ,) |
<!-- /TC:S5 -->

### 6.3 Ma trận truy vết

| Lớp | TC | Lớp | TC |
|---|---|---|---|
| EC-06-01 | EP-01, EP-13, BVA-02, BVA-03 | EC-06-08 | EP-08 |
| EC-06-02 | EP-02 (= BVA-01) | EC-06-09 | EP-09 |
| EC-06-03 | EP-03, BVA-04 | EC-06-10 | BVA-05…07 |
| EC-06-04 | EP-04 | EC-06-11 | EP-01 |
| EC-06-05 | EP-05, EP-15 | EC-06-12 | EP-10 |
| EC-06-06 | EP-06 | EC-06-13 | EP-11 |
| EC-06-07 | EP-07 | EC-06-14 | EP-12 |

**Tổng kết review:** bản nháp có 20 TC (S3: 12, S4: 7, cộng 1 TC bị loại).
- VALID 18.
- INCOMPLETE 1, đã sửa bước: EP-05.
- INVALID 1, đã loại: TC xoay màn hình.
- Bổ sung 3 TC.

Bộ cuối có **22 TC** (EP 15, BVA 7). Trong đó BVA-01 dùng chung với EP-02, nên số TC cần chạy là 21.

## 7. Kết quả thực thi (S6)

**Môi trường:**

| Thành phần | Giá trị |
|---|---|
| Thiết bị | Android Emulator, AVD **Pixel_6** (Android SDK 37, 1080 × 2400), tăng tốc WHPX, GPU `swiftshader_indirect` |
| App | Expo Go (SDK 54) mở `frontend-mobile` qua Metro (`npx expo start --android`) |
| Thay đổi SUT | `frontend-mobile/App.js:16`: `API_URL = "http://10.0.2.2:3000/api"` (địa chỉ của máy host khi nhìn từ emulator) |
| Backend | `eshop-sut/backend`, seed mới trước khi chạy |
| Ngày chạy | 23/10/2026 |

**Cách thực thi:**
- Các TC được chạy tự động bằng [`scripts/fr06.mjs`](../scripts/fr06.mjs), điều khiển emulator qua `adb`:
  - Đọc cây giao diện bằng `uiautomator dump`.
  - Chạm bằng `input tap`.
  - Nhập liệu bằng `input text`. Cách này tương đương dán từ clipboard, nên đưa được cả ký tự không phải số vào ô `numeric`.
  - Chụp màn hình bằng `screencap`.
- Header của app nằm dưới thanh trạng thái Android nên không chạm được. Script điều hướng header bằng bàn phím (TAB / DPAD + ENTER).
- Mỗi TC nhập số lượng đều bắt đầu từ giỏ trống. Script ghi lại hộp thoại phản hồi, rồi mở Giỏ hàng để đọc số lượng và thành tiền.
- Ảnh minh chứng: `evidence/FR06/<ID>.png` là màn chi tiết sau khi bấm Thêm; `<ID>_cart.png` là màn Giỏ hàng.
- Kết quả gốc: [`scripts/results/FR06.json`](../scripts/results/FR06.json).

<!-- SUMMARY -->
| Loại | Thiết kế | Đã chạy | Pass | Fail | Blocked / Khám phá | Chưa chạy |
|---|---|---|---|---|---|---|
| Domain (EP) | 15 | 15 | 6 | 8 | 1 | 0 |
| BVA | 6 | 6 | 4 | 2 | 0 | 0 |
| **Tổng** | 21 | 21 | 10 | 10 | 1 | 0 |
<!-- /SUMMARY -->

<!-- RESULTS -->
| ID | Kỹ thuật | Kết quả thực tế | Trạng thái | Bằng chứng | Bug |
|---|---|---|---|---|---|
| FR06-EP-01 | EP | Nhập "3" (ô hiển thị "3") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 3, Thành tiền: 18,000,000 ₫ | **Pass** | [ảnh](../evidence/FR06/FR06-EP-01.png) |  |
| FR06-EP-02 | EP | Nhập "0" (ô hiển thị "0") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 1, Thành tiền: 6,000,000 ₫ | **Fail** | [ảnh](../evidence/FR06/FR06-EP-02.png) | BUG-FR06-01 |
| FR06-EP-03 | EP | Nhập "-2" (ô hiển thị "-2") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 1, Thành tiền: 6,000,000 ₫ | **Fail** | [ảnh](../evidence/FR06/FR06-EP-03.png) | BUG-FR06-01 |
| FR06-EP-04 | EP | Nhập "1.5" (ô hiển thị "1.5") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 1, Thành tiền: 6,000,000 ₫ | **Fail** | [ảnh](../evidence/FR06/FR06-EP-04.png) | BUG-FR06-01 |
| FR06-EP-05 | EP | Nhập "abc" (ô hiển thị "abc") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 1, Thành tiền: 6,000,000 ₫ | **Fail** | [ảnh](../evidence/FR06/FR06-EP-05.png) | BUG-FR06-01 |
| FR06-EP-06 | EP | Nhập "" (ô hiển thị "") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 1, Thành tiền: 6,000,000 ₫ | **Fail** | [ảnh](../evidence/FR06/FR06-EP-06.png) | BUG-FR06-01 |
| FR06-EP-07 | EP | Nhập " " (ô hiển thị " ") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 1, Thành tiền: 6,000,000 ₫ | **Fail** | [ảnh](../evidence/FR06/FR06-EP-07.png) | BUG-FR06-01 |
| FR06-EP-08 | EP | Nhập "2abc" (ô hiển thị "2abc") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 2, Thành tiền: 12,000,000 ₫ | **Fail** | [ảnh](../evidence/FR06/FR06-EP-08.png) | BUG-FR06-02 |
| FR06-EP-09 | EP | Nhập "05" (ô hiển thị "05") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 5, Thành tiền: 30,000,000 ₫ | **Pass** | [ảnh](../evidence/FR06/FR06-EP-09.png) |  |
| FR06-EP-10 | EP | Nhập "3" (ô hiển thị "3") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 5, Thành tiền: 30,000,000 ₫ | **Pass** | [ảnh](../evidence/FR06/FR06-EP-10.png) |  |
| FR06-EP-11 | EP | Ảnh: có; tên: có; giá: "6,000,000 ₫"; mô tả: có; danh mục: KHÔNG có. Các chữ trên màn: EShop Mobile \| Đăng nhập \| Giỏ (0) \| Tai nghe AirPods Pro 2 \| 6,000,000 ₫ \| Chống ồn chủ động xuất sắc \| Số lượng: \| Thêm vào giỏ hàng \| © 2026 EShop SUT. Dành cho mục đích kiểm thử. | **Fail** | [ảnh](../evidence/FR06/FR06-EP-11.png) | BUG-FR06-03 |
| FR06-EP-12 | EP | Hiện hộp thoại "Thành công — Đã thêm vào giỏ hàng" | **Pass** | [ảnh](../evidence/FR06/FR06-EP-13.png) |  |
| FR06-BVA-01 | BVA | = FR06-EP-02 (dùng chung) | — | — | |
| FR06-BVA-02 | BVA | Nhập "1" (ô hiển thị "1") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 1, Thành tiền: 6,000,000 ₫ | **Pass** | [ảnh](../evidence/FR06/FR06-BVA-02.png) |  |
| FR06-BVA-03 | BVA | Nhập "2" (ô hiển thị "2") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 2, Thành tiền: 12,000,000 ₫ | **Pass** | [ảnh](../evidence/FR06/FR06-BVA-03.png) |  |
| FR06-BVA-04 | BVA | Nhập "-1" (ô hiển thị "-1") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 1, Thành tiền: 6,000,000 ₫ | **Fail** | [ảnh](../evidence/FR06/FR06-BVA-04.png) | BUG-FR06-01 |
| FR06-BVA-05 | BVA | Nhập "2147483647" (ô hiển thị "2147483647") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 2147483647, Thành tiền: 12,884,901,882,000,000 ₫ | **Pass** | [ảnh](../evidence/FR06/FR06-BVA-05.png) | BUG-FR06-04 |
| FR06-BVA-06 | BVA | Nhập "2147483648" (ô hiển thị "2147483648") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 2147483648, Thành tiền: 12,884,901,888,000,000 ₫ | **Pass** | [ảnh](../evidence/FR06/FR06-BVA-06.png) | BUG-FR06-04 |
| FR06-BVA-07 | BVA | Nhập "99999999999999999999" (ô hiển thị "99999999999999999999") → thông báo: "Thành công — Đã thêm vào giỏ hàng"; giỏ: 1 dòng, số lượng 100000000000000020000, Thành tiền: 600,000,000,000,000,100,000,000,000 ₫ | **Fail** | [ảnh](../evidence/FR06/FR06-BVA-07.png) | BUG-FR06-04 |
| FR06-EP-13 | EP | Mặc định "1"; thông báo "Thành công — Đã thêm vào giỏ hàng"; giỏ 1 dòng, SL 1 | **Pass** | [ảnh](../evidence/FR06/FR06-EP-13.png) |  |
| FR06-EP-14 | EP | Giá hiển thị "6,000,000 ₫" | **Pass** | [ảnh](../evidence/FR06/FR06-EP-11.png) |  |
| FR06-EP-15 | EP | Ô số lượng là EditText với bàn phím số (keyboardType=numeric). Script nhập bằng `adb input text` (tương đương dán), nên mọi ký tự đều đưa vào được; ký tự lọt vào ô được ghi ở các TC EP-03…08 _(Khám phá)_ | **Blocked** |  |  |
<!-- /RESULTS -->

## 8. Bug (S7)

<!-- BUGS:FR06 -->
Tìm được **4 bug**. Mỗi bug có bản nháp issue trong `bugs/issues/`, kèm link tạo issue đã điền sẵn trong [`bugs/issue-urls.md`](../bugs/issue-urls.md). Tổng hợp ở [`bugs/Bug_Report.md`](../bugs/Bug_Report.md).

| Bug | Tiêu đề | Test case | Severity | Kỹ thuật | Issue |
|---|---|---|---|---|---|
| [BUG-FR06-01](../bugs/issues/BUG-FR06-01.md) | Ô Số lượng chấp nhận 0, số âm, số thập phân, chữ, ô trống: tự đổi thành 1 và báo "Thành công" | FR06-EP-02, FR06-EP-03, FR06-EP-04, FR06-EP-05, FR06-EP-06, FR06-EP-07, FR06-BVA-04 | Medium | EP, BVA | _(chưa tạo)_ |
| [BUG-FR06-02](../bugs/issues/BUG-FR06-02.md) | Ô Số lượng nhận "2abc" thành 2 (chỉ đọc phần số ở đầu chuỗi) | FR06-EP-08 | Medium | EP | _(chưa tạo)_ |
| [BUG-FR06-03](../bugs/issues/BUG-FR06-03.md) | Màn chi tiết sản phẩm trên Mobile không hiển thị Danh mục | FR06-EP-11 | Low | EP | _(chưa tạo)_ |
| [BUG-FR06-04](../bugs/issues/BUG-FR06-04.md) | Số lượng rất lớn bị làm tròn sai (99999999999999999999 thành 100000000000000020000), không có giới hạn trên | FR06-BVA-07, FR06-BVA-05, FR06-BVA-06 | Low | BVA | _(chưa tạo)_ |

Severity chọn theo cây quyết định của nhóm (README repo nhóm, mục 4.3); lý do ghi trong từng bản nháp.
<!-- /BUGS:FR06 -->
## 9. Phân tích phần AI bỏ sót (S8)

Ban đầu (21/10), phân tích này chỉ ở mức thiết kế vì chưa chạy được trên thiết bị. Ngày 23/10, các TC đã được thực thi trên Android Emulator, và bảng dưới được cập nhật theo kết quả thật.

| # | AI bỏ sót / làm sai | Phát hiện ở | Dẫn tới bug? | Nguyên nhân | Giải thích |
|---|---|---|---|---|---|
| G1 | Không kiểm giá trị mặc định và định dạng giá | S5 (RV1, RV2) | Không (EP-13, EP-14 Pass) | Prompt | Prompt chỉ nhấn vào "ô số lượng"; AI bỏ qua output hiển thị (R1, R4) |
| G2 | EP-05 (nhập chữ) chưa có cách thực hiện với bàn phím số | S5 (RV3) | BUG-FR06-01 | Giới hạn tool | Khi thiết kế, AI chưa chạy app. Lúc thực thi phải dùng `adb input text` (tương đương dán) để đưa chữ vào ô |
| G3 | Khám phá (mục 1.5) chỉ dựa trên cấu trúc màn hình | S0 → S6 | **BUG-FR06-03** (thiếu danh mục) | Giới hạn tool | Lần chạy thật mới xác nhận màn chi tiết không có danh mục (R1) |
| G4 | Biên trên không có trong đặc tả | S4 → S6 | **BUG-FR06-04** | Độ phức tạp | Chuỗi 20 chữ số bị làm tròn thành 100000000000000020000 (mất chính xác số học). Với 2^31 thì không tràn số, nhưng thành tiền lên tới hàng triệu tỷ mà không có cảnh báo |
| G5 | Không lường trước việc hệ thống **tự sửa** giá trị sai (giả định A2: phải chặn) | S6 | **BUG-FR06-01, BUG-FR06-02** | Độ phức tạp | Kết quả thực tế: 0, số âm, 1.5, abc, rỗng, khoảng trắng đều bị âm thầm đổi thành 1 và vẫn báo "Thành công"; còn "2abc" được hiểu là 2. Oracle "giỏ không đổi" (S3) bắt được ngay. Đây là lý do oracle phải kiểm trạng thái dữ liệu, không chỉ kiểm thông báo |
| G6 | Thiết kế ban đầu giả định chạm được mọi nút | S6 | — | Giới hạn tool | Header nằm dưới thanh trạng thái. Phải điều hướng bằng bàn phím. Trên máy thật người dùng vẫn chạm được, nên chưa coi là bug |

**Số liệu:**
- Bản nháp có 20 TC: VALID 18, INCOMPLETE 1, INVALID 1. Bổ sung 3 TC.
- Khi thực thi: 21 TC chạy, 10 Pass, 10 Fail, 1 khám phá. Phát hiện 4 bug.
