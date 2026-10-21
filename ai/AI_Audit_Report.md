# AI Audit Report — HW02 Domain Testing on EShop

> Mẫu AI-02 (FIT@HCMUS – AI Policy Templates 2026 v1.0), chuyển sang Markdown.

## 1. Student Information

| Field | Value |
|---|---|
| Student name | Trần Thanh An |
| Student ID | 23120017 |
| Class / Cohort | CSC13003 – Software Testing 2026 |
| Assignment ID | HW02 (HW02-AI) |
| Assignment date | 19/10/2026 – 21/10/2026 |
| AI tool(s) used | Claude Code (VS Code extension), model Claude Opus 5.5 (`claude-opus-5-5`) |
| AI used? | [x] Yes  [ ] No |

**Khai báo:** *I use AI tools for the following tasks,* liệt kê bên dưới. Nhật ký đầy đủ của từng lần tương tác (tool, ngày giờ, prompt nguyên văn, output) nằm ở [`prompt_logs/23120017_HW02_prompt_log.md`](prompt_logs/23120017_HW02_prompt_log.md).

| # | Thời gian | Prompt (tóm tắt — nguyên văn trong log) | AI làm gì |
|---|---|---|---|
| 1 | 12:04 19/10/2026 | Đọc đề và repo, giải thích những việc cần làm | Tóm tắt đề, quy định nhóm, đề xuất gói feature |
| 2 | 12:18 19/10/2026 | Xuất giải thích ra file, tạo hướng dẫn từng bước, xuất log | Viết bộ hướng dẫn `docs/AIgui` (không nộp), log |
| 3 | 12:30 19/10/2026 | Không đọc thư mục ngoài; kiểm tra lại với bản clone | Đối chiếu hướng dẫn với `eshop-sut` trong HW02 |
| 4 | 14:36 20/10/2026 | Hướng dẫn chạy EShop, khởi tạo repo cá nhân | Cài và chạy thử EShop; tạo khung repo |
| 5 | 15:15 20/10/2026 | S0: trích đặc tả, giải thích chi tiết bước | Trích nguyên văn đặc tả 4 feature bằng script |
| 6 | 08:08 21/10/2026 | "không còn thời gian … hãy hoàn thành toàn bộ bài tập này" | Thực hiện S0–S8 cho FR-02/09/16 (chạy test thật), S0–S6, S8 cho FR-06 (chưa chạy trên máy), viết script, bug, skill, bản nháp các phụ lục |

**Minh bạch về cách dùng AI:**
- Từ prompt 6, AI làm phần lớn bài theo **một yêu cầu tổng quát**, không phải từng prompt cho từng bước kỹ thuật như nguyên tắc "AI-First" của đề.
- AI vẫn đi đúng trình tự S0 → S8, mỗi bước một commit (xem `git_log.txt`).
- Bước review S5 là AI **tự review** bản nháp của chính nó.
- Phần sinh viên tự làm là: đọc lại, xác nhận và chỉnh các cột "Verdict" và "Student Fix" dưới đây. Các mục còn chờ sinh viên được đánh dấu ⬜.

## 2. Instructions (read before filling)

- Mỗi dòng ứng với một artifact do AI tạo.
- Prompt nguyên văn nằm trong prompt log (không diễn giải lại); output là file hoặc commit được dẫn link.
- Verdict gồm 3 mức: VALID / INVALID / INCOMPLETE.
- Cột Reasoning dẫn ISTQB FL v4.0: §4.2.1 Equivalence Partitioning, §4.2.2 Boundary Value Analysis, §1.4 Test oracle / test basis, §5.5 Defect report; hoặc dẫn mục đặc tả.

## 3. Audit Table — one row per artifact

| # | (1) Prompt + Tool | (2) AI Output | (3) Verdict | (4) Reasoning (ISTQB / đặc tả) | (5) Student Fix |
|---|---|---|---|---|---|
| 1 | Claude Code, 15:15 20/10/2026, Prompt 5 | Mục 1.1–1.3 của 4 report (trích nguyên văn bằng `scripts/extract_spec.py`) | VALID | Test basis phải trích đúng nguyên văn (§1.4). Đã so khớp tự động: 0 dòng lệch | — |
| 2 | Claude Code, 08:08 21/10/2026, Prompt 6 | FR-02 S0–S2: quy tắc R1–R9, giả định A1–A8, biến, 17 lớp | VALID | Lớp theo §4.2.1; mọi giả định có nguồn | ⬜ SV xác nhận A1, A4 |
| 3 | Như trên | FR-02 kết luận khám phá U5: "lần sai thứ 3 thì khóa, đúng đặc tả" | INVALID | Chỉ thử toàn mật khẩu sai; BVA-01 (n = 2 + đúng) cho thấy khóa sớm 1 lần | Thành BUG-FR02-01 |
| 4 | Như trên | FR-02 bản nháp 18 TC (S3–S4) | INCOMPLETE | Thiếu TC cho EC-02-13, 14; BVA thời gian dùng polling, làm nhiễu phép đo (§4.2.2) | Thêm 6 TC, sửa 4 TC (RV1–RV7) |
| 5 | Như trên | TC nháp "email viết hoa phải đăng nhập được" | INVALID | Không có trong đặc tả, không có oracle (§1.4) | Loại |
| 6 | Như trên | FR-09 S0–S2: C1–C5, A1–A8, 24 lớp (có lớp tầng API) | VALID | §4.2.1, mỗi điều kiện có lớp V/I | ⬜ |
| 7 | Như trên | FR-09 bản nháp 31 TC | INCOMPLETE | Không phủ EC-09-20/22 (`user_id`, `total_amount` client gửi) và miền output; 2 bug Critical/High chỉ lộ ra nhờ TC bổ sung | Thêm 7 TC (RV1–RV3) |
| 8 | Như trên | TC nháp FR09-EP-18 (khách áp mã trên UI) | INVALID | Giỏ hàng chặn khách; không kiểm được C4 | Loại |
| 9 | Như trên | FR09-BVA-03 kết quả mong đợi "30.000" | INCOMPLETE | Sai số học ở biên (min + 1 ₫ → 30.000,1) (§4.2.2) | Sửa |
| 10 | Như trên | FR-16 S0–S2: R1–R9, A1–A7, 28 lớp | VALID | §4.2.1 | ⬜ |
| 11 | Như trên | FR-16 bản nháp 31 TC | INCOMPLETE | 7 lớp không có TC; TC "file 10 MB" ngoài kỹ thuật | Thêm 8 TC, loại 1 |
| 12 | Như trên | Oracle FR16-EP-03, EP-05 ("0 SP được thêm" là Pass) | INVALID | Oracle không đủ: lý do từ chối sai vẫn ra Pass (§1.4 test oracle) | Siết oracle; chạy lại → Fail |
| 13 | Như trên | 35 file CSV test (`test-data/FR16/`) | INCOMPLETE | Chỉ dùng tên ASCII, chưa kiểm tiếng Việt có dấu, xuống dòng trong trường bọc nháy | ⬜ SV bổ sung 2 file (FR-16 G4, G5) |
| 14 | Như trên | FR-06 S0–S5: 22 TC Mobile | INCOMPLETE | AI không chạy được app trên thiết bị; khám phá U4–U6 còn trống | Chưa thực thi trên thiết bị (21 TC Not run) |
| 15 | Như trên | Script thực thi `scripts/*.mjs` | INCOMPLETE | Lần đầu treo khi reset backend, lỗi ECONNRESET, selector trùng | AI tự sửa 3 lỗi rồi chạy lại |
| 16 | Như trên | Kết quả thực thi 97 TC (`scripts/results/*.json`) | VALID | Kết quả máy ghi lại, có ảnh minh chứng | ⬜ SV xem lại ảnh của các TC Fail |
| 17 | Như trên | 20 bug + bản nháp issue (`bugs/`) | VALID | Đủ trường theo §5.5 và template nhóm; severity theo cây quyết định | ⬜ SV xác nhận severity BUG-FR02-03 (High hay Critical) |
| 18 | Như trên | Agent Skills (`.claude/skills/`) | VALID | Quy tắc lấy từ bài học S8 | Chưa quay video demo |
| 19 | Như trên | Bản nháp AI Critique, form AI-03 | INCOMPLETE | Văn phong của AI; phản tư phải là của sinh viên | ⬜ SV viết lại bằng lời của mình |

## 4. Summary of AI Accuracy

| Metric | Count | Percentage |
|---|---|---|
| Total AI-generated artifacts audited | 19 | 100 % |
| VALID (correct, accepted as-is) | 7 | 37 % |
| INVALID (wrong; rejected) | 4 | 21 % |
| INCOMPLETE (acceptable after edits) | 8 | 42 % |

Ở mức test case:
- FR-02, FR-09, FR-16 có 80 TC nháp. VALID 69 (86 %), INCOMPLETE 8 (10 %), INVALID 3 (4 %). Bổ sung 21 TC.
- FR-06 có 20 TC nháp. VALID 18, INCOMPLETE 1, INVALID 1. Bổ sung 3 TC.

## 5. Conclusion — When should AI be used (or not)?

AI làm rất tốt các việc cơ học và dễ kiểm chứng:
- Trích nguyên văn đặc tả.
- Sinh hàng loạt giá trị biên và file dữ liệu test.
- Viết script tự động hóa và ghi minh chứng.

AI làm kém ở **độ phủ theo rủi ro**:
- Bám sát danh sách điều kiện trong đặc tả, bỏ qua các biến chỉ thấy ở tầng API. Vì vậy sót 2 bug nặng nhất của FR-09.
- Đặt oracle quá lỏng (Pass giả ở FR-16).
- Kết luận vội từ một lần khám phá (FR-02).

Tỷ lệ TC "VALID" cao không có nghĩa là bộ TC đủ.

Khuyến nghị:
- Dùng AI theo từng bước, mỗi bước có tiêu chí kiểm (ma trận truy vết, oracle gồm cả lý do).
- Con người phải là người review cuối. Bài này AI tự review, nên cần sinh viên xác nhận lại các mục ⬜.
