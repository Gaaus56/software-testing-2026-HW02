// Xuất các file Markdown của bài nộp sang PDF (pdf/<tên>.pdf) bằng Edge headless.
// Cách chạy: cd scripts && node export_pdf.mjs
import { readFileSync, mkdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import MarkdownIt from "markdown-it";
import { launch, REPO } from "./lib.mjs";

const FILES = [
  "README.md",
  "reports/A-FR02_Login_Lockout.md",
  "reports/B-FR09_Coupon.md",
  "reports/C-FR16_CSV_Import.md",
  "reports/D-FR06_Mobile_Product_Detail.md",
  "bugs/Bug_Report.md",
  "ai/AI_Audit_Report.md",
  "ai/AI_Critique.md",
  "ai/forms/AI-03_Disclosure_Form.md",
];

const md = new MarkdownIt({ html: true, linkify: true });
const CSS = `body{font:10.5px/1.45 "Segoe UI",Arial,sans-serif;color:#1a1a1a;margin:0}
h1{font-size:20px;border-bottom:2px solid #333;padding-bottom:4px}h2{font-size:16px;margin-top:22px;border-bottom:1px solid #bbb}
h3{font-size:13px}table{border-collapse:collapse;width:100%;margin:6px 0;page-break-inside:auto}tr{page-break-inside:avoid}
th,td{border:1px solid #999;padding:3px 5px;vertical-align:top;text-align:left;word-break:break-word}th{background:#eee}
code{font:9.5px Consolas,monospace;background:#f3f3f3;padding:0 2px}pre{background:#f3f3f3;padding:6px;white-space:pre-wrap}
blockquote{border-left:3px solid #aaa;margin:6px 0;padding:2px 10px;color:#333;background:#fafafa}img{max-width:100%}`;

mkdirSync(join(REPO, "pdf"), { recursive: true });
const browser = await launch();
const page = await browser.newPage();
for (const f of FILES) {
  const src = join(REPO, f);
  const body = md.render(readFileSync(src, "utf8"));
  const base = pathToFileURL(dirname(src) + "/").href;
  await page.goto(pathToFileURL(src).href.replace(/\.md$/, ".md"), { waitUntil: "commit" }).catch(() => {});
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><base href="${base}"><style>${CSS}</style></head><body>${body}</body></html>`, { waitUntil: "load" });
  const out = join(REPO, "pdf", basename(f).replace(/\.md$/, ".pdf"));
  await page.pdf({ path: out, format: "A4", landscape: true, margin: { top: "12mm", bottom: "12mm", left: "10mm", right: "10mm" }, printBackground: true });
  console.log("PDF:", out);
}
await browser.close();
