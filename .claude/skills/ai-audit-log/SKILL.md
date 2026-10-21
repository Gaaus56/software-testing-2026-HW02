---
name: ai-audit-log
description: Xuất log phiên Claude Code (file .jsonl) thành prompt log Markdown (tool, ngày giờ VN, prompt nguyên văn, phần trả lời bằng chữ) để làm phụ lục AI Audit Report. Dùng cuối mỗi phiên làm bài, hoặc khi được yêu cầu "xuất log", "audit log", "prompt log".
---

# Xuất log AI cho AI Audit Report

1. Tìm transcript của phiên: thư mục `~/.claude/projects/<tên-thư-mục-làm-việc>/`. Mỗi phiên là một file `*.jsonl`; chọn file mới nhất, hoặc file người dùng chỉ định.
2. Chạy script đi kèm:
   ```
   python -I .claude/skills/ai-audit-log/export_log.py <file.jsonl> ai/prompt_logs/<YYYY-MM-DD>_<chủ-đề>.md "Prompt Log — <Tên> (<MSSV>) — HW02"
   ```
   Script làm những việc sau:
   - Chỉ giữ prompt do người dùng gõ, nguyên văn, cùng phần trả lời bằng chữ của Claude.
   - Bỏ message hệ thống, ngữ cảnh IDE, lời gọi tool và kết quả tool.
   - Đổi giờ sang múi giờ Việt Nam (UTC+7).
3. Mở file vừa tạo, kiểm tra không còn dữ liệu nhạy cảm (mật khẩu thật, token thật). Không sửa nội dung prompt.
4. Thêm vào bảng mục 3 của `ai/AI_Audit_Report.md` một dòng cho mỗi artifact AI tạo trong phiên: prompt + tool, output, verdict, căn cứ (ISTQB / đặc tả), phần sinh viên sửa.
5. Nhắc người dùng: **không** chia sẻ log hay prompt cho thành viên khác.
