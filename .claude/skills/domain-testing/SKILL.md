---
name: domain-testing
description: Áp dụng kỹ thuật Domain Testing (phân lớp tương đương) cho một feature từ đặc tả SRS, đi đúng từng bước S0 (phân tích đặc tả) → S1 (biến) → S2 (lớp tương đương) → S3 (test case) và dừng cho người dùng duyệt sau mỗi bước. Dùng khi được yêu cầu thiết kế test case domain/EP cho một FR.
---

# Domain Testing theo từng bước

Bạn là trợ lý kiểm thử. Bạn **không** sinh test case ngay. Bạn đi đúng 4 bước dưới đây. Sau mỗi bước, bạn trình bày kết quả và **dừng lại hỏi người dùng duyệt** ("Đồng ý / sửa gì?"). Chỉ sang bước sau khi người dùng đã duyệt.

## Đầu vào cần có (hỏi nếu thiếu)
1. Đoạn đặc tả của FR, nguyên văn, kèm nguồn (file, dòng).
2. Các yêu cầu chung liên quan (GUI, Security…).
3. Mô tả giao diện / API **đã quan sát thực tế**: trường nhập, request/response. Nếu người dùng chưa khám phá, yêu cầu họ làm trước, hoặc tự gọi API / mở trang nếu có công cụ.
4. Mã FR và tiền tố ID, ví dụ `FR09`.

## Bước S0 — Phân tích đặc tả
- Tách đặc tả thành **quy tắc nguyên tử** `R1…Rn`: mỗi quy tắc một ý, kèm nguồn.
- Với mỗi quy tắc, hỏi 6 câu: (Q1) biên có tính dấu bằng không; (Q2) đơn vị/kiểu; (Q3) trạng thái trước/sau; (Q4) tầng nào kiểm tra (UI/API); (Q5) khi sai thì làm gì; (Q6) đặc tả không nói gì.
- Xuất bảng **giả định** `A1…An`: câu đặc tả | câu hỏi | cách hiểu chọn | lý do | ảnh hưởng tới test. Chọn cách hiểu **sát chữ** nhất; nếu ngang nhau thì chọn cách chặt hơn hoặc an toàn hơn.
- KHÔNG thêm yêu cầu không có trong đặc tả. Mọi ý phải có nguồn.

## Bước S1 — Biến input / output
Bảng: `ID | Biến | Loại (trực tiếp / gián tiếp-trạng thái / gián tiếp-thời gian / output) | Kiểu | Miền theo đặc tả | Chiều biến đổi | Nguồn`.
Bắt buộc rà các loại biến dưới đây (đây là những chỗ hay bị bỏ sót):
- **Trạng thái ẩn và thời gian**: số lần đã làm, thời gian chờ, dữ liệu trong DB.
- **Biến chỉ thấy ở tầng API**: các field client tự gửi lên (ví dụ `user_id`, `total_amount`). Mỗi field client gửi được là một biến phải kiểm.
- **Biến output**: số tiền, số dòng, thông báo, trạng thái DB sau thao tác.

## Bước S2 — Lớp tương đương
Bảng: `Mã EC-<FR>-nn | Biến | Lớp | V/I | Đại diện | Kết quả mong đợi | Căn cứ`.
- Mỗi biến có ≥ 1 lớp V, và các lớp I theo: khoảng, tập giá trị, bắt buộc/rỗng, định dạng, kiểu dữ liệu sai.
- Có lớp cho **miền output** (ví dụ kết quả âm / bằng 0).
- Có lớp cho mỗi biến tầng API, ví dụ "client gửi giá trị khác giá trị thật".

## Bước S3 — Test case
Quy tắc ghép:
1. Gộp nhiều lớp **hợp lệ** vào cùng 1 TC (baseline).
2. Mỗi lớp **không hợp lệ** một TC riêng, các biến còn lại để hợp lệ.
3. Nhiều điều kiện cùng phải thỏa: 1 TC cho tất cả đúng, và 1 TC cho mỗi lần sai một điều kiện.
4. **Oracle phải đầy đủ**: không chỉ "bị từ chối" hay "không có dữ liệu mới", mà phải nêu **lý do / thông báo đúng** và **trạng thái dữ liệu sau thao tác** (đếm trước và sau).
5. Dữ liệu test phải cụ thể và tạo được trong hệ thống thật. Ghi tiền điều kiện, kể cả cách reset.

Xuất danh mục JSON (mỗi phần tử: `id, step:"S3", tech:"EP", layer, covers, rule, pre, data, steps, expected`) để dùng với `scripts/render.mjs`, kèm bảng Markdown.

**Tự kiểm trước khi trình bày** (bắt buộc):
- Lập **ma trận truy vết lớp → TC**. Lớp nào chưa có TC thì thêm TC hoặc giải thích vì sao bỏ.
- Không có TC nào chứa 2 lớp không hợp lệ (trừ TC bổ sung có lý do).
- Mọi kết quả mong đợi đều dẫn về R/A.

## Sau S3
Nhắc người dùng:
- Chạy skill `boundary-value-analysis` cho bước S4.
- Ghi log phiên AI bằng skill `ai-audit-log`.
