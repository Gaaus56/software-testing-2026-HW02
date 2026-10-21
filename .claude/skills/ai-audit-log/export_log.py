"""Xuất transcript Claude Code (.jsonl) thành prompt log Markdown.

Cách dùng: python -I export_log.py <file.jsonl> <file_ra.md> "<tiêu đề>"
"""
import json
import re
import sys
from datetime import datetime, timedelta, timezone

sys.stdout.reconfigure(encoding="utf-8")
src, dst, title = sys.argv[1], sys.argv[2], sys.argv[3]
VN = timezone(timedelta(hours=7))
TAG = re.compile(r"<(ide_opened_file|ide_selection|system-reminder|command-[a-z]+)>.*?</\1>", re.S)


def text_blocks(content):
    if isinstance(content, str):
        return [content]
    return [b.get("text", "") for b in content if isinstance(b, dict) and b.get("type") == "text"]


entries = []
for line in open(src, encoding="utf-8"):
    try:
        d = json.loads(line)
    except json.JSONDecodeError:
        continue
    t = d.get("type")
    if t not in ("user", "assistant") or d.get("isMeta"):
        continue
    msg = d.get("message", {})
    content = msg.get("content", "")
    # Bỏ bản ghi user chỉ chứa tool_result
    if t == "user" and isinstance(content, list) and all(isinstance(b, dict) and b.get("type") == "tool_result" for b in content):
        continue
    texts = [TAG.sub("", x).strip() for x in text_blocks(content)]
    texts = [x for x in texts if x and not x.startswith("[Request interrupted")]
    if texts:
        entries.append((t, d.get("timestamp"), "\n\n".join(texts)))

out = [f"# {title}", "",
       "Nguyên văn phiên làm việc với Claude Code (giờ VN). Chỉ gồm prompt do sinh viên gõ và phần trả lời dạng chữ của Claude; "
       "đã bỏ message hệ thống, ngữ cảnh IDE và nội dung tool.", ""]
n = 0
for role, ts, text in entries:
    if role == "user":
        n += 1
        when = datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone(VN).strftime("%H:%M %d/%m/%Y") if ts else ""
        out += [f"## Prompt {n} — {when}", "", "```text", text, "```", ""]
    else:
        out += ["**Claude:**", "", text, ""]
open(dst, "w", encoding="utf-8").write("\n".join(out))
print(f"Đã ghi {n} prompt vào {dst}")
