# Agent Skills — HW02

Các skill dành cho **Claude Code**, nằm trong [`.claude/skills/`](../.claude/skills/) của repo. Mở Claude Code ở thư mục gốc repo thì các skill được nhận tự động; gọi bằng `/domain-testing`, `/boundary-value-analysis`, `/ai-audit-log`, hoặc mô tả yêu cầu bằng lời.

| Skill | Bước | Làm gì |
|---|---|---|
| [`domain-testing`](../.claude/skills/domain-testing/SKILL.md) | S0–S3 | Tách quy tắc và giả định → biến (gồm trạng thái ẩn, field tầng API, output) → lớp tương đương → test case + ma trận truy vết. Dừng cho người dùng duyệt sau mỗi bước |
| [`boundary-value-analysis`](../.claude/skills/boundary-value-analysis/SKILL.md) | S4–S5 | Liệt kê biên (theo thực thể, kết hợp, output, thời gian, khám phá) → BVA 3 giá trị → review VALID / INCOMPLETE / INVALID |
| [`ai-audit-log`](../.claude/skills/ai-audit-log/SKILL.md) | Phụ lục | Xuất transcript `.jsonl` thành prompt log Markdown giờ VN, cho AI Audit Report |

## Thiết kế

Các quy tắc trong skill lấy từ những lỗ hổng mà phân tích S8 của 4 feature đã chỉ ra:

| Bài học (S8) | Quy tắc trong skill |
|---|---|
| Lớp có trong bảng nhưng không có TC (FR-02 G1, FR-16 G1) | Bắt buộc lập ma trận truy vết trước khi trình bày S3 |
| Bỏ qua `user_id` / `total_amount` client gửi lên → sót 2 bug nghiêm trọng nhất (FR-09 G1) | S1 bắt buộc rà "biến chỉ thấy ở tầng API" |
| Không chia miền output (FR-09 G2) | S2 bắt buộc có lớp output; S4 bắt buộc có biên output |
| Oracle "không thêm dữ liệu" tạo Pass giả (FR-16 G2) | S3: oracle phải có lý do và trạng thái dữ liệu trước/sau |
| Thử liên tục trong lúc khóa làm nhiễu phép đo (FR-02 G2) | S4: mỗi giá trị biên thời gian dùng trạng thái mới, chỉ thử 1 lần |
| Thêm yêu cầu không có trong đặc tả (FR-02 G4) | S0: mọi ý phải có nguồn |

## Thành phần đi kèm (dùng chung với skill)

- [`scripts/render.mjs`](../scripts/render.mjs): sinh bảng test case và kết quả vào report từ danh mục JSON mà skill xuất ra.
- [`scripts/lib.mjs`](../scripts/lib.mjs), `fr02.mjs`, `fr09.mjs`, `fr16.mjs`: khung thực thi test tự động (API + Edge).
- [`scripts/extract_spec.py`](../scripts/extract_spec.py): trích nguyên văn đặc tả theo tiêu đề mục.

## Video demo

Chưa quay video demo.
