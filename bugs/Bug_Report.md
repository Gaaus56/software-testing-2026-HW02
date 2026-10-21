# Bug Report — Trần Thanh An (23120017) — HW02

Tổng số bug: **12** (Critical 2, High 4, Medium 4, Low 2).
Mỗi bug có một file chi tiết trong [`issues/`](issues/), đúng các ô của template Bug report trên repo nhóm. Ảnh chụp trang GitHub Issues lưu ở [`issue-screenshots/`](issue-screenshots/).

| Bug ID | FR | Tiêu đề | Test case | Severity | Kỹ thuật | Issue |
|---|---|---|---|---|---|---|
| [BUG-FR02-01](issues/BUG-FR02-01.md) | FR-02 | Sai 2 lần thì lần thứ 3 nhập đúng mật khẩu vẫn bị khóa (ngưỡng khóa lệch 1) | FR02-BVA-01, FR02-EP-11 | High | BVA | _(chưa tạo)_ |
| [BUG-FR02-02](issues/BUG-FR02-02.md) | FR-02 | Tài khoản bị khóa khoảng 180 giây thay vì 30 giây | FR02-BVA-06, FR02-BVA-07, FR02-BVA-08a, FR02-BVA-08b | Medium | BVA | _(chưa tạo)_ |
| [BUG-FR02-03](issues/BUG-FR02-03.md) | FR-02 | Ô Mật khẩu ở trang Đăng nhập là type="text", mật khẩu hiện rõ khi gõ | FR02-EP-09 | High | EP | _(chưa tạo)_ |
| [BUG-FR02-04](issues/BUG-FR02-04.md) | FR-02 | Ô Email ở trang Đăng nhập là type="text", không validate định dạng email (HTML5) | FR02-EP-04, FR02-EP-09 | Medium | EP | _(chưa tạo)_ |
| [BUG-FR02-05](issues/BUG-FR02-05.md) | FR-02 | Khi tài khoản bị khóa, trang Đăng nhập chỉ báo chung "Đăng nhập thất bại" và thông báo nằm dưới nút | FR02-EP-10 | Low | EP | _(chưa tạo)_ |
| [BUG-FR02-06](issues/BUG-FR02-06.md) | FR-02 | Trang Đăng nhập có tiêu đề "Đăng Ký", nhãn "Username", nút "Sign In", thiếu dấu * ở trường bắt buộc | FR02-EP-09 | Low | EP | _(chưa tạo)_ |
| [BUG-FR09-01](issues/BUG-FR09-01.md) | FR-09 | Mã percent (SAVE10) tính sai: tiền giảm âm, thành tiền gấp 10 lần tổng đơn | FR09-EP-01, FR09-EP-15, FR09-BVA-03 | High | EP, BVA | _(chưa tạo)_ |
| [BUG-FR09-02](issues/BUG-FR09-02.md) | FR-09 | Mã bị từ chối khi tổng đơn đúng bằng ngưỡng tối thiểu (dùng > thay cho >=) | FR09-BVA-02, FR09-BVA-05, FR09-BVA-08 | Medium | BVA | _(chưa tạo)_ |
| [BUG-FR09-03](issues/BUG-FR09-03.md) | FR-09 | API áp mã giảm giá không yêu cầu đăng nhập (không token / token sai vẫn áp dụng được) | FR09-EP-12, FR09-EP-13 | Critical | EP | _(chưa tạo)_ |
| [BUG-FR09-04](issues/BUG-FR09-04.md) | FR-09 | Giới hạn số lần dùng mã bị vượt qua bằng cách đổi user_id trong request | FR09-EP-16 | Critical | EP | _(chưa tạo)_ |
| [BUG-FR09-05](issues/BUG-FR09-05.md) | FR-09 | Điều kiện ngưỡng đơn hàng dựa trên total_amount do client gửi, không theo giỏ hàng thật | FR09-EP-17 | High | EP | _(chưa tạo)_ |
| [BUG-FR09-06](issues/BUG-FR09-06.md) | FR-09 | Thành tiền bị âm khi mã fixed lớn hơn tổng đơn | FR09-BVA-16 | Medium | BVA | _(chưa tạo)_ |
