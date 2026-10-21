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
