// Sinh bản nháp GitHub issue (theo template Bug report của repo nhóm) và Bug_Report.md
// từ bugs/bugs.json.  Cách dùng: node issues.mjs [FR02 FR09 ...]
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { REPO } from "./lib.mjs";

const MSSV = "23120017";
const ENV = "Windows 11 Home; Microsoft Edge 155.0.4283.62 (điều khiển bằng Playwright 1.48.2) và curl/fetch (Node v22.23.2); EShop commit 85af3ba";
const only = process.argv.slice(2);
const all = JSON.parse(readFileSync(join(REPO, "bugs", "bugs.json"), "utf8"));
const bugs = only.length ? all.filter((b) => only.includes(b.fr)) : all;
const sev = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };
const plat = { web: "Web", admin: "Admin", mobile: "Mobile" };
const issueMap = existsSync(join(REPO, "bugs", "issue-links.json"))
  ? JSON.parse(readFileSync(join(REPO, "bugs", "issue-links.json"), "utf8")) : {};

mkdirSync(join(REPO, "bugs", "issues"), { recursive: true });
// Escape < > để GitHub không hiểu "<token>" là thẻ HTML
const esc = (t) => String(t).replace(/</g, "&lt;").replace(/>/g, "&gt;");
for (const b0 of bugs) {
  const b = { ...b0, pre: esc(b0.pre), data: esc(b0.data), expected: esc(b0.expected), actual: esc(b0.actual), steps: b0.steps.map(esc) };
  const fr = b.fr.replace("FR", "FR-");
  const title = `[${MSSV}][${fr}][${plat[b.platform]}] ${b.title}`;
  const labels = ["bug", `severity: ${b.severity}`, `platform: ${b.platform}`, ...b.technique.map((t) => `technique: ${t}`), `pool: ${b.pool}`];
  const md = `# ${b.id}

> Bản nháp để tạo issue trên repo nhóm (template **Bug report**). Copy từng ô bên dưới vào ô tương ứng của form.

**Tiêu đề issue:** \`${title}\`

**Labels:** ${labels.map((l) => `\`${l}\``).join(", ")} · **Assignee:** chính mình

| Ô trong form | Nội dung |
|---|---|
| MSSV người báo | ${MSSV} |
| Feature (mã FR) | ${b.frLabel} |
| Nền tảng | ${b.platformLabel} |
| Test case phát hiện lỗi | ${b.tcs.join(", ")} |
| Mức độ (Severity) | ${sev[b.severity]} |

### Điều kiện tiên quyết
${b.pre}

### Các bước tái hiện
${b.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

### Dữ liệu test
${b.data}

### Kết quả mong đợi (theo đặc tả)
${b.expected}

### Kết quả thực tế
${b.actual}

### Ảnh chụp
Kéo thả các file sau vào ô "Ảnh chụp":
${b.evidence.map((e) => `- \`${e}\`\n\n  ![](../../${e})`).join("\n")}

### Môi trường
${ENV}

### Ghi chú
- Lý do chọn severity: ${b.severityReason}
- Tái hiện: 100 % (chạy lại bằng \`scripts/${b.fr.toLowerCase()}.mjs\`).${b.related ? `\n- ${b.related}` : ""}
`;
  writeFileSync(join(REPO, "bugs", "issues", `${b.id}.md`), md, "utf8");
}

// Bug_Report.md tổng hợp (luôn gồm toàn bộ bug trong bugs.json)
const rows = all.map((b) => {
  const link = issueMap[b.id] ? `[#${issueMap[b.id].split("/").pop()}](${issueMap[b.id]})` : "_(chưa tạo)_";
  return `| [${b.id}](issues/${b.id}.md) | ${b.fr.replace("FR", "FR-")} | ${b.title} | ${b.tcs.join(", ")} | ${sev[b.severity]} | ${b.technique.join(", ")} | ${link} |`;
});
const count = (k, v) => all.filter((b) => b[k] === v).length;
const report = `# Bug Report — Trần Thanh An (${MSSV}) — HW02

Tổng số bug: **${all.length}** (Critical ${count("severity", "critical")}, High ${count("severity", "high")}, Medium ${count("severity", "medium")}, Low ${count("severity", "low")}).
Mỗi bug có một file chi tiết trong [\`issues/\`](issues/), đúng các ô của template Bug report trên repo nhóm. Ảnh chụp trang GitHub Issues lưu ở [\`issue-screenshots/\`](issue-screenshots/).

| Bug ID | FR | Tiêu đề | Test case | Severity | Kỹ thuật | Issue |
|---|---|---|---|---|---|---|
${rows.join("\n")}
`;
writeFileSync(join(REPO, "bugs", "Bug_Report.md"), report, "utf8");
console.log(`Đã sinh ${bugs.length} bản nháp issue; Bug_Report.md có ${all.length} bug`);
