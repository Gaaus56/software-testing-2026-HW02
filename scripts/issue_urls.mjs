// Sinh link "New issue" đã điền sẵn (template bug_report.yml của repo nhóm) cho từng bug.
// Cách dùng: cd scripts && node issue_urls.mjs   → bugs/issue-urls.md
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO } from "./lib.mjs";

const GROUP = "https://github.com/angquoc/software-testing-2026-HW02-group";
const MSSV = "23120017";
const ENV = "Windows 11 Home; Microsoft Edge 155.0.4283.62 (Playwright 1.48.2) và curl/fetch (Node v22.23.2); EShop commit 85af3ba";
const plat = { web: "Web", admin: "Admin", mobile: "Mobile" };
const bugs = JSON.parse(readFileSync(join(REPO, "bugs", "bugs.json"), "utf8"));

const rows = bugs.map((b) => {
  const title = `[${MSSV}][${b.fr.replace("FR", "FR-")}][${plat[b.platform]}] ${b.title}`;
  const labels = [`severity: ${b.severity}`, `platform: ${b.platform}`, ...b.technique.map((t) => `technique: ${t}`), `pool: ${b.pool}`];
  const q = new URLSearchParams({
    template: "bug_report.yml",
    title,
    labels: ["bug", ...labels].join(","),
    student: MSSV,
    feature: b.frLabel,
    testcase: b.tcs.join(", "),
    precondition: b.pre,
    steps: b.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
    testdata: b.data,
    expected: b.expected,
    actual: b.actual,
    env: ENV,
    notes: [`Lý do severity: ${b.severityReason}`, b.related || ""].filter(Boolean).join("\n"),
  });
  const sev = b.severity[0].toUpperCase() + b.severity.slice(1);
  return `| ${b.id} | [Mở form](${GROUP}/issues/new?${q.toString()}) | ${b.platformLabel} | ${sev} | ${labels.map((l) => `\`${l}\``).join(" ")} | ${b.evidence.map((e) => `\`${e}\``).join("<br>")} |`;
});

writeFileSync(join(REPO, "bugs", "issue-urls.md"), `# Link tạo issue (đã điền sẵn)

Bấm "Mở form" → kiểm tra nội dung → chọn 2 dropdown (Nền tảng, Severity) → kéo thả ảnh vào ô "Ảnh chụp" → gắn label nếu chưa tự gắn → Assignees: chính mình → Submit.

| Bug | Link | Dropdown "Nền tảng" | Dropdown "Severity" | Label cần có | Ảnh kéo vào ô "Ảnh chụp" |
|---|---|---|---|---|---|
${rows.join("\n")}
`, "utf8");
console.log(`Đã sinh ${rows.length} link → bugs/issue-urls.md`);
