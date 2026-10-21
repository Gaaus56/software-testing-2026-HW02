---
name: boundary-value-analysis
description: Áp dụng Boundary Value Analysis (BVA) lên bảng lớp tương đương đã duyệt, gồm xác định biên, bước nhỏ nhất, BVA 3 giá trị, biên kết hợp, biên output và biên khám phá; sinh test case BVA rồi review (S4–S5). Dùng sau skill domain-testing hoặc khi được yêu cầu thiết kế test biên.
---

# Boundary Value Analysis theo từng bước

Đầu vào: bảng biến (S1) và bảng lớp tương đương (S2) **đã được người dùng duyệt**, cùng bảng giả định. Nếu chưa có, chạy skill `domain-testing` trước.

## Bước S4.1 — Liệt kê biên
Với mọi biến **có thứ tự** (số, độ dài, số lần, thời gian, ngày, số dòng, số cột, vị trí phần tử), ghi lại từng ranh giới giữa hai lớp. Xuất bảng:
`Biên | Biến | Bước nhỏ nhất | Giá trị test | Lớp | Kết quả mong đợi | TC`.

Bắt buộc xét đủ các loại biên sau:
- **Biên theo từng thực thể**: nếu mỗi đối tượng có ngưỡng riêng (ví dụ mỗi mã giảm giá một ngưỡng), xét từng ngưỡng, ít nhất mỗi *loại* một lần.
- **Biên kết hợp**: một điều kiện đúng ở biên trong khi điều kiện khác sai.
- **Biên output**: chọn input để output chạm biên (kết quả = 0, = −1, …).
- **Biên thời gian / trạng thái**: n − 1 / n / n + 1 lần, t − 1 / t / t + 1 giây. Mỗi giá trị biên dùng **một trạng thái mới**, và **chỉ thử 1 lần**, để lần thử không làm thay đổi biến đang đo.
- **Biên khám phá**: biến không có cận trong đặc tả thì dùng giới hạn kỹ thuật (2^31 − 1, 2^31, chuỗi rất dài) và đánh dấu "(khám phá)".

## Bước S4.2 — Chọn phương pháp
- Mặc định dùng **BVA 3 giá trị** (biên − bước, biên, biên + bước). Nêu rõ bước nhỏ nhất và lý do chọn.
- Giá trị trùng với TC ở S3 thì tham chiếu sang TC đó, không tạo TC mới.
- Ghi rõ sai số đo nếu biến là thời gian.

## Bước S4.3 — Test case BVA
Xuất danh mục JSON (`step:"S4", tech:"BVA"`) và bảng Markdown. Kết quả mong đợi phải là **giá trị số cụ thể** (ví dụ "discount 30.000,1; final 270.000,9"), không viết chung chung kiểu "tính đúng".

**Dừng lại cho người dùng duyệt.**

## Bước S5 — Review (sau khi người dùng duyệt S4)
Đọc lại toàn bộ TC S3 + S4, xuất bảng review `# | Đối tượng | VALID/INCOMPLETE/INVALID | Vấn đề | Xử lý | Căn cứ`:
- Lớp chưa có TC → INCOMPLETE, đề xuất TC bổ sung (`step:"S5"`).
- Oracle quá yếu (chỉ "không có dữ liệu mới", không kiểm lý do) → INCOMPLETE.
- TC không có oracle trong đặc tả, hoặc ngoài kỹ thuật (hiệu năng, giao diện xoay màn hình…) → INVALID.
- Cập nhật ma trận truy vết. Tổng kết số VALID / INCOMPLETE / INVALID / bổ sung. Các số liệu này dùng lại cho AI Audit Report.

Cuối cùng nhắc người dùng tự đọc lại bảng review, vì đây là bước **human review** mà đề yêu cầu.
