# A-FR02 — Đăng nhập & Khóa tài khoản (Web)

> Trần Thanh An — 23120017 — HW02 Domain Testing
> SUT: `ttbhanh/eshop-sut`, commit `85af3ba`. Oracle: `eshop-sut/README.md` (Đặc tả v2.0, 2026-05-14).

## 1. Đặc tả và phạm vi (S0)

### 1.1 Đặc tả chính (trích nguyên văn)

> ### FR-02: Đăng nhập & Khóa tài khoản
>
> - Người dùng nhập Email và Mật khẩu.
> - Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên **đúng 1 đơn vị**.
> - Nếu đăng nhập sai từ **3 lần trở lên** liên tiếp, tài khoản bị tạm khóa **30 giây** (môi trường demo). Hệ thống trả về thông báo lỗi phù hợp; không để lộ chi tiết nguyên nhân.
> - Đăng nhập thành công trả về JWT Token. Token được lưu phía client và gửi kèm tất cả các yêu cầu có xác thực qua header `Authorization: Bearer <token>`.
> - Trường email phải dùng `type="email"` (có validate HTML5 format).

_Nguồn: `eshop-sut/README.md`, dòng 38–44._

### 1.2 Yêu cầu chung liên quan (trích nguyên văn)

**FR-22: Form Requirements**: form đăng nhập phải theo các quy tắc chung về form (dấu `*`, `type="email"`, `type="password"`, vị trí thông báo lỗi).

> ### FR-22: Form Requirements
>
> - Tất cả trường bắt buộc phải có ký hiệu `*` bên cạnh nhãn.
> - Trường Email phải dùng `type="email"`.
> - Trường Mật khẩu phải dùng `type="password"` (không hiển thị rõ).
> - Thông báo lỗi phải xuất hiện **trên** nút submit, không phải bên dưới.
> - Các form có từ 2 bước trở lên phải có **Step Indicator** rõ ràng.

_Nguồn: `eshop-sut/README.md`, dòng 250–256._

**FR-21: Tiêu chuẩn Giao diện Chung**: thông báo lỗi/khóa phải bằng tiếng Việt, nút Đăng nhập màu xanh dương.

> ### FR-21: Tiêu chuẩn Giao diện Chung
>
> - **Nhất quán ngôn ngữ**: Toàn bộ giao diện dùng tiếng Việt (trừ thuật ngữ kỹ thuật chuẩn).
> - **Nhất quán màu sắc**: Các nút hành động tích cực (Submit, Mua hàng) dùng màu xanh dương. Các nút nguy hiểm/hủy bỏ dùng màu đỏ.
> - **Nhất quán đơn vị tiền**: Luôn dùng ký hiệu `₫` với định dạng phân cách hàng nghìn.
> - **Tiêu đề trang**: Mỗi trang có đúng 1 thẻ `<h1>` mô tả nội dung trang.
> - **Tab Order**: Thứ tự focus theo Tab phải đi từ trên xuống dưới, trái sang phải.

_Nguồn: `eshop-sut/README.md`, dòng 242–248._

**Yêu cầu bảo mật SEC-01, SEC-02**: liên quan tới mật khẩu và token trả về sau khi đăng nhập.

> | ID     | Yêu cầu                                                                                                         |
> | ------ | --------------------------------------------------------------------------------------------------------------- |
> | SEC-01 | Mật khẩu **không** được lưu dưới dạng plaintext.                                                                |
> | SEC-02 | Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ.                                                          |

_Nguồn: `eshop-sut/README.md`, mục 9._

**1. Tổng quan Hệ thống**: tài khoản mặc định dùng để test.

> ## 1. Tổng quan Hệ thống
>
> Hệ thống EShop là nền tảng thương mại điện tử bao gồm 4 thành phần:
>
> | Thành phần   | Công nghệ                   | URL mặc định            |
> | ------------ | --------------------------- | ----------------------- |
> | Backend API  | Node.js + Express + SQLite  | `http://localhost:3000` |
> | Frontend Web | React + Vite + Tailwind CSS | `http://localhost:5173` |
> | Web Admin    | React + Vite + Tailwind CSS | `http://localhost:5174` |
> | Mobile App   | React Native + Expo         | IP LAN của máy chủ      |
>
> **Tài khoản mặc định:**
>
> - Admin: `admin@eshop.com` / `Admin123!`
> - User test: `test@eshop.com` / `Test1234!`

_Nguồn: `eshop-sut/README.md`, dòng 10–24._

### 1.3 API liên quan (trích nguyên văn `api_specification.md`)

> ### 1.2 Đăng nhập
> - **Endpoint:** `POST /api/login`
> - **Body (JSON):**
>   ```json
>   {
>     "email": "test@domain.com",
>     "password": "Password123!"
>   }
>   ```
> - **Phản hồi thành công (200 OK):** Trả về chuỗi JWT `token` và thông tin `user`.

_Nguồn: `eshop-sut/api_specification.md`, dòng 23–32._

### 1.4 Quy tắc nguyên tử

Tách đặc tả 1.1–1.2 thành các quy tắc kiểm tra được, mỗi quy tắc một ý, để truy vết lớp và test case.

| Mã | Quy tắc | Nguồn |
|---|---|---|
| R1 | Người dùng nhập Email và Mật khẩu | FR-02 gạch 1 |
| R2 | Mỗi lần đăng nhập sai, bộ đếm tăng đúng 1 | FR-02 gạch 2 |
| R3 | Sai ≥ 3 lần **liên tiếp** → tài khoản tạm khóa 30 giây | FR-02 gạch 3 |
| R4 | Thông báo lỗi phù hợp, không lộ nguyên nhân | FR-02 gạch 3 |
| R5 | Đăng nhập thành công → trả về JWT | FR-02 gạch 4 |
| R6 | Token lưu phía client, gửi qua `Authorization: Bearer <token>` | FR-02 gạch 4 |
| R7 | Ô email `type="email"` (validate HTML5) | FR-02 gạch 5, FR-22 |
| R8 | Trường bắt buộc có `*`; mật khẩu `type="password"`; thông báo lỗi nằm **trên** nút submit | FR-22 |
| R9 | Giao diện tiếng Việt; nút hành động tích cực màu xanh dương | FR-21 |

### 1.5 Khám phá giao diện và API

Cách làm: mở `http://localhost:5173/login` bằng Edge (DevTools: Elements, Network, Local Storage) và gọi thử `POST /api/login` bằng curl. Đọc mã nguồn frontend **chỉ** để viết selector cho script tự động hóa; kết quả mong đợi luôn lấy từ đặc tả.

| # | Thành phần | Quan sát | Ảnh |
|---|---|---|---|
| U1 | Trang `/login` | Tiêu đề form "Đăng Ký"; nhãn "Username", "Mật khẩu" (không có `*`); nút "Sign In" màu xanh | [S0_U1](../evidence/FR02/S0_U1_login.png) |
| U2 | Elements | Cả hai ô đều `type="text"` (mật khẩu hiện rõ khi gõ) | [S0_U1](../evidence/FR02/S0_U1_login.png) |
| U3 | Đăng nhập sai trên UI | Hiện "Đăng nhập thất bại. Vui lòng kiểm tra lại." ở **dưới** nút | [S0_U3](../evidence/FR02/S0_U3_login_error.png) |
| U4 | `POST /api/login` sai mật khẩu / email không tồn tại | Cả hai trả `401 {"error":"Invalid email or password"}` (tiếng Anh) | — |
| U5 | Lần sai thứ 3 | Trả `403 {"error":"Tài khoản đã bị khóa. Vui lòng thử lại sau."}` ngay ở lần thứ 3 | — |
| U6 | Đăng nhập đúng | `200` có `token`; Local Storage key `token`; các request sau có `Authorization: Bearer …` | — |
| U7 | Nghi vấn | Thử thăm dò: đăng nhập đúng liên tục sau khi khóa, mở khóa sau ~180 s (không phải 30 s) → đưa vào BVA | — |
| U8 | Backend | Mỗi lần khởi động lại, backend seed lại DB (dùng để reset trạng thái khóa giữa các test case) | — |

### 1.6 Điểm mơ hồ và giả định

| # | Câu đặc tả | Câu hỏi | Cách hiểu chọn | Lý do | Ảnh hưởng |
|---|---|---|---|---|---|
| A1 | "sai từ 3 lần trở lên liên tiếp … bị tạm khóa" | Lần sai thứ 3 đã khóa, hay lần thứ 4 mới bị chặn? | Ngay sau lần sai thứ 3, mọi lần đăng nhập (kể cả đúng) đều bị chặn | "từ 3 lần trở lên" gồm cả lần 3 | BVA n = 2 / 3 / 4 |
| A2 | "liên tiếp" | Đăng nhập thành công có reset bộ đếm? | Có | Thành công làm đứt chuỗi "liên tiếp" | EP-11 |
| A3 | "tài khoản bị tạm khóa" | Khóa theo tài khoản hay theo máy/IP? | Theo tài khoản (email) | Đặc tả nói "tài khoản" | EP-12 |
| A4 | "khóa 30 giây" | Tính từ lúc nào; ở đúng 30 s đã mở chưa? | Tính từ lần sai thứ 3; t ≥ 30 s là mở | Khóa *trong* 30 giây | BVA 29 / 30 / 31 s; sai số đo ±0,5 s |
| A5 | (không nói) | Thử đăng nhập trong lúc khóa có kéo dài thời gian khóa? | Không kéo dài; mỗi BVA thời gian chỉ thử 1 lần để không phụ thuộc | Tránh nhiễu kết quả | BVA-05…07 |
| A6 | "không để lộ chi tiết nguyên nhân" | Email sai và mật khẩu sai phải giống nhau? | Giống hệt (status + nội dung) | Không lộ email có tồn tại | EP-03 |
| A7 | (không nói) | Hết khóa thì bộ đếm bắt đầu lại? | Bắt đầu lại từ 0 | Hợp lý với "liên tiếp" | EP-14 |
| A8 | "Trường email phải dùng `type="email"`" | API có phải validate định dạng? | Chỉ bắt buộc ở UI; API chỉ cần từ chối an toàn | Đặc tả nói về "trường" giao diện | EP-04 (UI), EP-13 (API) |

### 1.7 Phạm vi

- **Trong phạm vi:** form đăng nhập Web, `POST /api/login`, bộ đếm và khóa tài khoản, lưu/gửi token, yêu cầu form FR-22 và FR-21 trên trang đăng nhập.
- **Ngoài phạm vi:** đăng ký (FR-01, Ngọc), quên mật khẩu (FR-03, Hương), đăng nhập trên Mobile, Web Admin login (chỉ dùng tài khoản admin ở EP-12), lưu mật khẩu plaintext (SEC-01, không kiểm chứng được qua hộp đen).

## 2. Biến input / output (S1)

**Cách làm:** đi qua từng quy tắc R1–R9 và từng quan sát U1–U8, hỏi "giá trị nào thay đổi thì kết quả thay đổi?". Ngoài 2 ô nhập, kết quả còn phụ thuộc vào **trạng thái ẩn**: số lần sai trước đó và thời gian kể từ khi bị khóa. Đây là 2 biến quan trọng nhất cho BVA. Biến output gồm cả thông tin hiển thị (thông báo) lẫn trạng thái (token, khóa).

| ID | Biến | Loại | Kiểu | Miền theo đặc tả | Chiều biến đổi | Nguồn |
|---|---|---|---|---|---|---|
| V1 | Email | Input trực tiếp | Chuỗi | Định dạng `user@domain.com`, đã đăng ký | định dạng, tồn tại, rỗng | R1, R7 |
| V2 | Mật khẩu | Input trực tiếp | Chuỗi | Khớp mật khẩu tài khoản | đúng/sai, hoa/thường, rỗng | R1 |
| V3 | Số lần sai liên tiếp trước lần thử | Gián tiếp (trạng thái) | Số nguyên ≥ 0 | 0–2: chưa khóa; ≥ 3: khóa | giá trị | R2, R3 |
| V4 | Thời gian t kể từ lần sai thứ 3 | Gián tiếp (thời gian) | Giây | t < 30: khóa; t ≥ 30: mở | giá trị | R3 |
| V5 | Lịch sử ngay trước (thành công / hết khóa) | Gián tiếp | Sự kiện | Reset bộ đếm (A2, A7) | có/không | R3 |
| V6 | Tài khoản khác | Gián tiếp | — | Không bị ảnh hưởng (A3) | — | R3 |
| O1 | Kết quả đăng nhập | Output | status + token | 200 + JWT / 4xx | — | R5 |
| O2 | Thông báo lỗi | Output | Chuỗi | Phù hợp, tiếng Việt, không lộ nguyên nhân | nội dung, vị trí | R4, R8, R9 |
| O3 | Trạng thái khóa / bộ đếm | Output (trạng thái) | — | Tăng đúng 1 mỗi lần sai | — | R2 |
| O4 | Token phía client | Output | Chuỗi | Lưu và gửi qua `Authorization: Bearer` | — | R6 |
| O5 | Thuộc tính form | Output (tĩnh) | DOM | `type`, `*`, nhãn | — | R7–R9 |

Biến bị loại: "Ghi nhớ đăng nhập", captcha (không có trong đặc tả lẫn giao diện).

## 3. Lớp tương đương (S2)

**Cách làm:**
- Với mỗi biến ở mục 2, chia miền thành lớp hợp lệ (V) và không hợp lệ (I). Mỗi lớp là tập giá trị mà hệ thống phải xử lý giống nhau.
- V3 và V4 là miền số có một ngưỡng, nên mỗi biến có 2 lớp; ranh giới giữa hai lớp sẽ được BVA xét ở mục 5.
- Các lớp output (thông báo, token, form) lấy từ R4, R6, R8, để kiểm cả phía "kết quả", không chỉ phía input.

| Mã | Biến | Lớp | V/I | Đại diện | Kết quả mong đợi | Căn cứ |
|---|---|---|---|---|---|---|
| EC-02-01 | V1 | Định dạng đúng, đã đăng ký | V | test@eshop.com | Xét tiếp mật khẩu | R1 |
| EC-02-02 | V1 | Định dạng đúng, chưa đăng ký | I | khongtontai@eshop.com | Từ chối, thông báo chung | R4 |
| EC-02-03 | V1 | Sai định dạng | I | abc | UI chặn (type=email); API từ chối | R7, A8 |
| EC-02-04 | V1 | Rỗng | I | "" | UI chặn (bắt buộc) | R1 |
| EC-02-05 | V2 | Đúng | V | Test1234! | Đăng nhập (nếu không khóa) | R5 |
| EC-02-06 | V2 | Sai | I | Wrong123! | Từ chối, bộ đếm +1 | R2 |
| EC-02-07 | V2 | Rỗng | I | "" | UI chặn | R1 |
| EC-02-08 | V2 | Khác hoa/thường | I | test1234! | Từ chối | R2 |
| EC-02-09 | V3 | 0 ≤ n ≤ 2 | V | 0, 2 | Chưa khóa | R3 |
| EC-02-10 | V3 | n ≥ 3 | I | 3, 4 | Khóa, kể cả mật khẩu đúng | R3, A1 |
| EC-02-11 | V4 | 0 ≤ t < 30 s | I | 0 s, 29 s | Vẫn khóa | R3, A4 |
| EC-02-12 | V4 | t ≥ 30 s | V | 30 s, 31 s | Mở khóa | R3, A4 |
| EC-02-13 | V5 | Có lần thành công xen giữa | V | 2 sai → đúng → 2 sai | Không khóa | A2 |
| EC-02-14 | V6 | Tài khoản khác khi A bị khóa | V | admin@eshop.com | Đăng nhập bình thường | A3 |
| EC-02-15 | O2 | Thông báo cho EC-02-02 so với EC-02-06 | — | — | Giống hệt nhau | R4, A6 |
| EC-02-16 | O4 | Request cần xác thực sau đăng nhập | — | GET /api/orders/my-orders | Có `Authorization: Bearer` | R6 |
| EC-02-17 | O5 | Thuộc tính form | — | DOM trang /login | type=email, type=password, `*`, nhãn tiếng Việt, lỗi trên nút | R7–R9 |

## 4. Test case Domain Testing (S3)

**Cách làm:**
1. Mỗi lớp hợp lệ được phủ ít nhất 1 lần. Các lớp hợp lệ của nhiều biến được gộp vào cùng một TC (EP-01 phủ EC-02-01, 05, 09).
2. Mỗi lớp không hợp lệ có **một TC riêng**, các biến khác để hợp lệ. Như vậy, nếu bị từ chối thì biết chắc là do lớp đó (tránh che lấp lỗi).
3. Mỗi lớp output (O2, O4, O5) có TC kiểm tra trực tiếp.
4. Chọn tầng test: các thuộc tính giao diện (R7–R9) test trên UI. Logic đếm và khóa test qua API cho chính xác, vì không phụ thuộc thao tác tay.
5. Danh mục máy đọc được: [`testcases/FR02.json`](../testcases/FR02.json). Bảng dưới được sinh từ danh mục bằng `scripts/render.mjs`.

<!-- TC:S3 -->
| ID | Tầng | Lớp / biên phủ | Căn cứ | Tiền điều kiện | Dữ liệu test | Các bước | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| FR02-EP-01 | UI | EC-02-01, EC-02-05, EC-02-09 | R1, R5, R6 | Backend vừa khởi động lại; chưa đăng nhập | test@eshop.com / Test1234! | Mở /login → nhập email, mật khẩu → bấm nút đăng nhập | Đăng nhập thành công, chuyển về trang chủ; JWT được lưu phía client |
| FR02-EP-02 | API | EC-02-01, EC-02-06 | R2, R4 | Backend vừa khởi động lại | test@eshop.com / Wrong123! | POST /api/login | Từ chối (4xx), thông báo chung không nêu trường nào sai, không có token |
| FR02-EP-03 | API | EC-02-02, EC-02-15 | R4 | Như EP-02 | khongtontai@eshop.com / Test1234! | POST /api/login, so với phản hồi của EP-02 | Từ chối; status và thông báo giống hệt EP-02 (không lộ email có tồn tại hay không) |
| FR02-EP-04 | UI | EC-02-03 | R7 | Mở /login | Email: abc; Mật khẩu: Test1234! | Nhập dữ liệu → bấm đăng nhập; theo dõi Network | Trình duyệt chặn submit do ô email type="email" (không gửi POST /api/login) |
| FR02-EP-05 | UI | EC-02-04, EC-02-07 | R1, FR-22 | Mở /login | Để trống cả hai ô | Bấm đăng nhập | Không gửi request; hiển thị yêu cầu nhập trường bắt buộc |
| FR02-EP-06 | API | EC-02-08 | R2 | Backend vừa khởi động lại | test@eshop.com / test1234! (sai hoa/thường) | POST /api/login | Từ chối (mật khẩu phân biệt hoa/thường) |
| FR02-EP-07 | API | EC-02-10, EC-02-11 | R3 | Backend vừa khởi động lại | 3 lần mật khẩu sai, rồi mật khẩu đúng ngay lập tức | 3 × POST /api/login sai → POST /api/login đúng | Lần đăng nhập đúng bị từ chối vì tài khoản đang bị khóa |
| FR02-EP-08 | UI | EC-02-16 | R6 | Đã đăng nhập ở EP-01 | — | Bấm vào tên người dùng (trang Profile) → bắt request GET /api/orders/my-orders | Request mang header Authorization: Bearer <JWT> |
| FR02-EP-09 | UI | EC-02-17 | R7, R8, R9 | Mở /login | — | Kiểm tra DOM: type của 2 ô nhập, nhãn, tiêu đề form, nhãn nút | Ô email type="email", ô mật khẩu type="password", nhãn trường bắt buộc có *, nhãn/tiêu đề tiếng Việt đúng ngữ cảnh đăng nhập |
| FR02-EP-10 | UI | EC-02-10, EC-02-17 | R3, R8, R9 | Backend vừa khởi động lại; test@ đã sai 3 lần | test@eshop.com / Test1234! | Đăng nhập qua UI khi tài khoản đang khóa | UI hiện thông báo phù hợp cho biết tài khoản tạm khóa (tiếng Việt); thông báo lỗi nằm trên nút submit |
<!-- /TC:S3 -->

## 5. Phân tích giá trị biên và test case BVA (S4)

**Cách làm:**
1. Lấy các ranh giới giữa các lớp có thứ tự ở mục 3: V3 (số lần sai, giữa EC-02-09 và EC-02-10) và V4 (thời gian khóa, giữa EC-02-11 và EC-02-12).
2. Xác định bước nhỏ nhất: V3 là 1 lần. V4 là 1 giây; script đo thời gian thực tế bằng đồng hồ máy, sai số khoảng ±0,5 s.
3. Dùng **BVA 3 giá trị** (biên − 1, biên, biên + 1), giống quy ước trong sheet của nhóm (7/8/9).
4. Thêm một biên ở output: bộ đếm phải tăng đúng 1 (R2), kiểm bằng chuỗi status của từng lần sai.

| Biên | Biến | Bước | Giá trị test | Lớp | Kết quả mong đợi | TC |
|---|---|---|---|---|---|---|
| n = 3 (khóa) | V3 | 1 lần | 2 | EC-02-09 | Chưa khóa | FR02-BVA-01 |
| | | | 3 | EC-02-10 | Khóa | FR02-BVA-02 |
| | | | 4 | EC-02-10 | Khóa | FR02-BVA-03 |
| Bộ đếm +1 | O3 | 1 lần | lần 1, 2, 3 | — | 401, 401, khóa | FR02-BVA-04 |
| t = 30 s | V4 | 1 s | 29 s | EC-02-11 | Khóa | FR02-BVA-05 |
| | | | 30 s | EC-02-12 | Mở | FR02-BVA-06 |
| | | | 31 s | EC-02-12 | Mở | FR02-BVA-07 |

<!-- TC:S4 -->
| ID | Tầng | Lớp / biên phủ | Căn cứ | Tiền điều kiện | Dữ liệu test | Các bước | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| FR02-BVA-01 | API | EC-02-09 (biên trên: 2) | R3 | Backend vừa khởi động lại | n = 2 lần sai | 2 × đăng nhập sai → đăng nhập đúng | Đăng nhập thành công (chưa khóa) |
| FR02-BVA-02 | API | EC-02-10 (biên dưới: 3) | R3 | Backend vừa khởi động lại | n = 3 lần sai | 3 × đăng nhập sai → đăng nhập đúng | Bị từ chối vì khóa |
| FR02-BVA-03 | API | EC-02-10 (3 + 1) | R3 | Backend vừa khởi động lại | n = 4 lần sai | 4 × đăng nhập sai → đăng nhập đúng | Bị từ chối vì khóa |
| FR02-BVA-04 | API | O3 bộ đếm | R2 | Backend vừa khởi động lại | 3 lần sai liên tiếp | Ghi status từng lần | Lần 1, 2: từ chối thường (401); lần 3: chuyển sang khóa — bộ đếm tăng đúng 1 mỗi lần |
| FR02-BVA-05 | API | EC-02-11 (biên: 29 s) | R3 | Backend vừa khởi động lại; 3 lần sai | t = 29 s kể từ lần sai thứ 3 | Chờ 29 s → đăng nhập đúng (chỉ 1 lần) | Vẫn bị khóa |
| FR02-BVA-06 | API | EC-02-12 (biên: 30 s) | R3, A4 | Như BVA-05 | t = 30 s | Chờ 30 s → đăng nhập đúng | Đăng nhập thành công (hết 30 giây khóa) |
| FR02-BVA-07 | API | EC-02-12 (30 + 1) | R3 | Như BVA-05 | t = 31 s | Chờ 31 s → đăng nhập đúng | Đăng nhập thành công |
<!-- /TC:S4 -->

## 6. Review và bổ sung (S5)

**Cách làm:** đọc lại từng TC ở mục 4–5, đối chiếu với đặc tả, quy tắc R1–R9 và giả định A1–A8, rồi kiểm tra 3 điều:
- Mọi lớp ở mục 3 đều có TC phủ.
- Mỗi TC chỉ chứa tối đa 1 lớp không hợp lệ.
- Kết quả mong đợi chỉ lấy từ đặc tả hoặc giả định.

Mỗi phát hiện được đánh giá theo mẫu AI-02: VALID (giữ nguyên) / INCOMPLETE (sửa) / INVALID (loại).

### 6.1 Bảng review

| # | Đối tượng | Đánh giá | Vấn đề | Xử lý | Căn cứ |
|---|---|---|---|---|---|
| RV1 | Bộ TC S3 | INCOMPLETE | EC-02-13 (reset bộ đếm sau khi thành công) và EC-02-14 (tài khoản khác) có trong bảng lớp nhưng **không có TC** | Thêm FR02-EP-11, FR02-EP-12 | Ma trận truy vết 6.3 |
| RV2 | EC-02-03 | INCOMPLETE | Chỉ test ở UI. Nếu UI chặn được thì tầng API vẫn chưa được kiểm | Thêm FR02-EP-13 (tầng API) | A8 |
| RV3 | Giả định A7 | INCOMPLETE | Có giả định nhưng không có TC | Thêm FR02-EP-14 | A7 |
| RV4 | FR02-BVA-05…07 (bản nháp) | INCOMPLETE | Bản nháp thử đăng nhập mỗi giây cho tới khi mở khóa. Cách này phụ thuộc A5 (thử lúc khóa có kéo dài khóa không) | Sửa: mỗi giá trị biên dùng một lần khóa mới và **chỉ thử 1 lần** | A5 |
| RV5 | FR02-EP-10 (bản nháp) | INCOMPLETE | Kết quả mong đợi chỉ ghi "có thông báo", thiếu R8 (vị trí) và R9 (ngôn ngữ) | Bổ sung vào kết quả mong đợi | R8, R9 |
| RV6 | TC nháp "email viết hoa TEST@ESHOP.COM phải đăng nhập được" | INVALID | Đặc tả không nói email không phân biệt hoa/thường, nên không có oracle | Loại | — |
| RV7 | U7 (nghi vấn khóa ~180 s) | — | BVA 29/30/31 s chỉ nói được là sai, chưa đo được thời gian thực tế | Thêm TC khám phá FR02-BVA-08a/b (175 s, 185 s) | R3 |
| RV8 | FR02-EP-01…09, BVA-01…04 | VALID | Đúng quy tắc chia lớp, dữ liệu cụ thể, kết quả mong đợi có căn cứ | Giữ | — |

### 6.2 Test case bổ sung

<!-- TC:S5 -->
| ID | Tầng | Lớp / biên phủ | Căn cứ | Tiền điều kiện | Dữ liệu test | Các bước | Kết quả mong đợi |
|---|---|---|---|---|---|---|---|
| FR02-EP-11 | API | EC-02-13 | R3 ("liên tiếp"), A2 | Backend vừa khởi động lại | 2 sai → đúng → 2 sai → đúng | Gọi tuần tự 6 request | Cả 2 lần đăng nhập đúng đều thành công (bộ đếm về 0 sau khi thành công) |
| FR02-EP-12 | API | EC-02-14 | A3 | test@ đang bị khóa | admin@eshop.com / Admin123! | Đăng nhập tài khoản khác | Tài khoản khác đăng nhập bình thường (khóa theo tài khoản) |
| FR02-EP-13 | API | EC-02-03 (tầng API) | R4, A8 | — | email: abc | POST /api/login | Từ chối (4xx), không lỗi server |
| FR02-EP-14 | API | A7 | A7 | Tài khoản vừa hết khóa | 1 lần sai rồi đăng nhập đúng | Đợi mở khóa → 1 sai → đúng | Không bị khóa lại ngay (bộ đếm bắt đầu lại từ 0) |
| FR02-BVA-08a | API | Khám phá thời gian khóa thực tế | R3 | 3 lần sai | t = 175 s | Chờ 175 s → đăng nhập đúng | (Khám phá) — theo đặc tả phải mở khóa từ 30 s |
| FR02-BVA-08b | API | Khám phá thời gian khóa thực tế | R3 | 3 lần sai | t = 185 s | Chờ 185 s → đăng nhập đúng | (Khám phá) — theo đặc tả phải mở khóa từ 30 s |
<!-- /TC:S5 -->

### 6.3 Ma trận truy vết lớp → test case

| Lớp | TC | Lớp | TC |
|---|---|---|---|
| EC-02-01 | EP-01, EP-02 | EC-02-10 | EP-07, EP-10, BVA-02, BVA-03 |
| EC-02-02 | EP-03 | EC-02-11 | EP-07, BVA-05 |
| EC-02-03 | EP-04, EP-13 | EC-02-12 | BVA-06, BVA-07, BVA-08b |
| EC-02-04 | EP-05 | EC-02-13 | EP-11 |
| EC-02-05 | EP-01 | EC-02-14 | EP-12 |
| EC-02-06 | EP-02 | EC-02-15 | EP-03 |
| EC-02-07 | EP-05 | EC-02-16 | EP-08 |
| EC-02-08 | EP-06 | EC-02-17 | EP-09, EP-10 |
| EC-02-09 | EP-01, BVA-01 | O3 | BVA-04 |

**Tổng kết review:** bản nháp có 18 TC.
- VALID 13: EP-01…09, BVA-01…04.
- INCOMPLETE 4, đã sửa: EP-10, BVA-05…07.
- INVALID 1, đã loại: TC email viết hoa.
- Có 3 lỗ hổng độ phủ (RV1–RV3) và 1 nghi vấn (RV7), nên bổ sung 6 TC: 4 EP và 2 TC khám phá.

Bộ cuối có **23 TC** (EP 14, BVA 9).

## 7. Kết quả thực thi (S6)

**Môi trường:**

| Thành phần | Giá trị |
|---|---|
| SUT | `ttbhanh/eshop-sut` commit `85af3ba` — backend `:3000`, Web `:5173`, Admin `:5174` |
| OS / trình duyệt | Windows 11 Home; Microsoft Edge 155.0.4283.62 |
| Công cụ | Node v22.23.2 (`fetch`), Playwright-core 1.48.2 điều khiển Edge (headless) |
| Ngày chạy | 21/10/2026 |

**Cách thực thi:**
- Test case được chạy tự động bằng [`scripts/fr02.mjs`](../scripts/fr02.mjs). Ở mỗi TC, script làm đúng các bước trong bảng, so kết quả với "Kết quả mong đợi", rồi ghi vào [`scripts/results/FR02.json`](../scripts/results/FR02.json).
- Trước mỗi nhóm TC, script khởi động lại backend để DB được seed lại từ đầu.
- Ảnh minh chứng nằm trong `evidence/FR02/`:
  - TC trên UI: ảnh chụp màn hình Edge.
  - TC trên API: ảnh chụp request/response.
- Chạy lại: `cd scripts && npm install && node fr02.mjs`. Web/Admin phải đang chạy.

<!-- SUMMARY -->
| Loại | Thiết kế | Đã chạy | Pass | Fail | Blocked / Khám phá | Chưa chạy |
|---|---|---|---|---|---|---|
| Domain (EP) | 14 | 14 | 10 | 4 | 0 | 0 |
| BVA | 9 | 9 | 4 | 3 | 2 | 0 |
| **Tổng** | 23 | 23 | 14 | 7 | 2 | 0 |
<!-- /SUMMARY -->

<!-- RESULTS -->
| ID | Kỹ thuật | Kết quả thực tế | Trạng thái | Bằng chứng | Bug |
|---|---|---|---|---|---|
| FR02-EP-01 | EP | Chuyển về http://localhost:5173/; localStorage.token có JWT | **Pass** | [ảnh](../evidence/FR02/FR02-EP-01.png) |  |
| FR02-EP-02 | EP | 401 {"error":"Invalid email or password"} | **Pass** | [ảnh](../evidence/FR02/FR02-EP-02.png) |  |
| FR02-EP-03 | EP | 401 {"error":"Invalid email or password"} (so với mật khẩu sai: 401 {"error":"Invalid email or password"}) | **Pass** | [ảnh](../evidence/FR02/FR02-EP-03.png) |  |
| FR02-EP-04 | EP | Form vẫn gửi POST /api/login với email "abc" (không có validate HTML5) | **Fail** | [ảnh](../evidence/FR02/FR02-EP-04.png) |  |
| FR02-EP-05 | EP | Không gửi request; validationMessage: "Please fill out this field." | **Pass** | [ảnh](../evidence/FR02/FR02-EP-05.png) |  |
| FR02-EP-06 | EP | 401 {"error":"Invalid email or password"} | **Pass** |  |  |
| FR02-EP-07 | EP | 403 {"error":"Tài khoản đã bị khóa. Vui lòng thử lại sau."} | **Pass** |  |  |
| FR02-EP-08 | EP | GET /api/orders/my-orders có header Authorization: Bearer eyJhbGciOiJIU… | **Pass** | [ảnh](../evidence/FR02/FR02-EP-08.png) |  |
| FR02-EP-09 | EP | type ô 1="text", ô 2="text"; nhãn: Username \| Mật khẩu; tiêu đề form "Đăng Ký"; nút "Sign In" | **Fail** | [ảnh](../evidence/FR02/FR02-EP-09.png) |  |
| FR02-EP-10 | EP | UI hiện "Đăng nhập thất bại. Vui lòng kiểm tra lại." (API trả 403 "Tài khoản đã bị khóa…"); thông báo nằm dưới nút submit | **Fail** | [ảnh](../evidence/FR02/FR02-EP-10.png) |  |
| FR02-BVA-01 | BVA | 2 lần sai → đăng nhập đúng: 403 Tài khoản đã bị khóa. Vui lòng thử lại sau. | **Fail** | [ảnh](../evidence/FR02/FR02-BVA-01.png) |  |
| FR02-BVA-02 | BVA | 3 lần sai → đăng nhập đúng: 403 Tài khoản đã bị khóa. Vui lòng thử lại sau. | **Pass** | [ảnh](../evidence/FR02/FR02-BVA-02.png) |  |
| FR02-BVA-03 | BVA | 4 lần sai → đăng nhập đúng: 403 Tài khoản đã bị khóa. Vui lòng thử lại sau. | **Pass** | [ảnh](../evidence/FR02/FR02-BVA-03.png) |  |
| FR02-BVA-04 | BVA | 401, 401, 403 — lần 3: {"error":"Tài khoản đã bị khóa. Vui lòng thử lại sau."} | **Pass** |  |  |
| FR02-BVA-05 | BVA | Sau 29.0s kể từ lần sai thứ 3: 403 Tài khoản đã bị khóa. Vui lòng thử lại sau. | **Pass** | [ảnh](../evidence/FR02/FR02-BVA-05.png) |  |
| FR02-BVA-06 | BVA | Sau 30.0s kể từ lần sai thứ 3: 403 Tài khoản đã bị khóa. Vui lòng thử lại sau. | **Fail** | [ảnh](../evidence/FR02/FR02-BVA-06.png) |  |
| FR02-BVA-07 | BVA | Sau 31.0s kể từ lần sai thứ 3: 403 Tài khoản đã bị khóa. Vui lòng thử lại sau. | **Fail** | [ảnh](../evidence/FR02/FR02-BVA-07.png) |  |
| FR02-EP-11 | EP | 2 sai → đúng (403) → 2 sai → đúng (403 Tài khoản đã bị khóa. Vui lòng thử lại sau.) | **Fail** |  |  |
| FR02-EP-12 | EP | test@ bị khóa; admin@ đăng nhập: 200 Login successful | **Pass** |  |  |
| FR02-EP-13 | EP | 401 {"error":"Invalid email or password"} | **Pass** |  |  |
| FR02-EP-14 | EP | Sau khi mở khóa: 1 lần sai → 401; đăng nhập đúng → 200 | **Pass** |  |  |
| FR02-BVA-08a | BVA | Khám phá: sau 175.0s → 403 Tài khoản đã bị khóa. Vui lòng thử lại sau. _(Đo thời gian khóa thực tế, không có kết quả mong đợi riêng)_ | **Blocked** |  |  |
| FR02-BVA-08b | BVA | Khám phá: sau 185.0s → 200 Login successful _(Đo thời gian khóa thực tế, không có kết quả mong đợi riêng)_ | **Blocked** |  |  |
<!-- /RESULTS -->
