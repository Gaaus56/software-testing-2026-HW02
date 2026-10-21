// Sinh bảng test case / kết quả vào report từ danh mục test case (testcases/<FR>.json)
// và kết quả thực thi (scripts/results/<FR>.json).
//
// Cách dùng: node render.mjs <FR> <stage> [--catalog <file>]
//   FR    : FR02 | FR09 | FR16 | FR06
//   stage : S3 | S4 | S5 | S6 — chỉ lấy các test case tạo ở bước <= stage
//   --catalog: danh mục nguồn (mặc định testcases/<FR>.json). Khi chỉ định, danh mục đã lọc
//              theo stage được ghi vào testcases/<FR>.json.
//
// Các vùng được thay trong report (giữ nguyên phần chữ xung quanh):
//   <!-- TC:S3 --> … <!-- /TC:S3 -->   bảng test case tạo ở S3
//   <!-- TC:S4 --> … <!-- /TC:S4 -->   bảng test case tạo ở S4
//   <!-- TC:S5 --> … <!-- /TC:S5 -->   bảng test case bổ sung ở S5
//   <!-- RESULTS --> … <!-- /RESULTS --> bảng kết quả thực thi
//   <!-- SUMMARY --> … <!-- /SUMMARY --> bảng tổng hợp
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REPO } from "./lib.mjs";

const [fr, stage] = process.argv.slice(2);
const ci = process.argv.indexOf("--catalog");
const ORDER = ["S3", "S4", "S5", "S6"];
const upto = ORDER.indexOf(stage);
if (!fr || upto < 0) throw new Error("Cách dùng: node render.mjs <FR> <S3|S4|S5|S6> [--catalog file]");

const REPORTS = {
  FR02: "A-FR02_Login_Lockout.md",
  FR09: "B-FR09_Coupon.md",
  FR16: "C-FR16_CSV_Import.md",
  FR06: "D-FR06_Mobile_Product_Detail.md",
};

const catalogFile = ci > 0 ? process.argv[ci + 1] : join(REPO, "testcases", `${fr}.json`);
const all = JSON.parse(readFileSync(catalogFile, "utf8"));
const tcs = all.filter((t) => ORDER.indexOf(t.step) <= Math.min(upto, 2));
if (ci > 0) writeFileSync(join(REPO, "testcases", `${fr}.json`), JSON.stringify(tcs, null, 2) + "\n", "utf8");

const resFile = join(REPO, "scripts", "results", `${fr}.json`);
const results = upto >= 3 && existsSync(resFile) ? JSON.parse(readFileSync(resFile, "utf8")) : [];
const resOf = (id) => results.find((r) => r.id === id);

// Escape < > để GitHub không hiểu "<token>" là thẻ HTML
const cell = (s) => String(s ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\|/g, "\\|").replace(/\n/g, " ");

function tcTable(list) {
  if (!list.length) return "_(không có)_";
  const rows = list.map((t) =>
    `| ${t.id} | ${t.layer} | ${cell(t.covers)} | ${cell(t.rule)} | ${cell(t.pre)} | ${cell(t.data)} | ${cell(t.steps)} | ${cell(t.expected)} |`);
  return ["| ID | Tầng | Lớp / biên phủ | Căn cứ | Tiền điều kiện | Dữ liệu test | Các bước | Kết quả mong đợi |",
    "|---|---|---|---|---|---|---|---|", ...rows].join("\n");
}

function bugOf(id, bugs) {
  return bugs.filter((b) => b.tcs.includes(id)).map((b) => b.id).join(", ");
}

function resultTable(bugs) {
  const rows = tcs.map((t) => {
    const r = resOf(t.id);
    if (t.steps.startsWith("=")) return `| ${t.id} | ${t.tech} | ${cell(t.steps)} | — | — | |`;
    if (!r) return `| ${t.id} | ${t.tech} | _(chưa chạy)_ | Not run | | |`;
    const ev = r.evidence ? `[ảnh](../${r.evidence})` : "";
    const note = r.note ? ` _(${cell(r.note)})_` : "";
    return `| ${t.id} | ${t.tech} | ${cell(r.actual)}${note} | **${r.status}** | ${ev} | ${bugOf(t.id, bugs)} |`;
  });
  return ["| ID | Kỹ thuật | Kết quả thực tế | Trạng thái | Bằng chứng | Bug |", "|---|---|---|---|---|---|", ...rows].join("\n");
}

function summary() {
  const count = (tech) => {
    const list = tcs.filter((t) => (tech ? t.tech === tech : true) && !t.steps.startsWith("="));
    const st = (s) => list.filter((t) => (resOf(t.id)?.status || "Not run") === s).length;
    return { n: list.length, run: list.filter((t) => resOf(t.id)).length, pass: st("Pass"), fail: st("Fail"), blocked: st("Blocked"), notrun: st("Not run") };
  };
  const line = (name, c) => `| ${name} | ${c.n} | ${c.run} | ${c.pass} | ${c.fail} | ${c.blocked} | ${c.notrun} |`;
  return ["| Loại | Thiết kế | Đã chạy | Pass | Fail | Blocked / Khám phá | Chưa chạy |", "|---|---|---|---|---|---|---|",
    line("Domain (EP)", count("EP")), line("BVA", count("BVA")), line("**Tổng**", count(null))].join("\n");
}

const reportPath = join(REPO, "reports", REPORTS[fr]);
let md = readFileSync(reportPath, "utf8");
const bugsFile = join(REPO, "bugs", "bugs.json");
const bugs = existsSync(bugsFile) ? JSON.parse(readFileSync(bugsFile, "utf8")).filter((b) => b.fr === fr) : [];

function put(tag, content) {
  const re = new RegExp(`<!-- ${tag} -->[\\s\\S]*?<!-- /${tag} -->`);
  if (!re.test(md)) return;
  md = md.replace(re, `<!-- ${tag} -->\n${content}\n<!-- /${tag} -->`);
}
put("TC:S3", tcTable(tcs.filter((t) => t.step === "S3")));
put("TC:S4", tcTable(tcs.filter((t) => t.step === "S4")));
put("TC:S5", tcTable(tcs.filter((t) => t.step === "S5")));
if (upto >= 3) {
  put("RESULTS", resultTable(bugs));
  put("SUMMARY", summary());
}
writeFileSync(reportPath, md, "utf8");
console.log(`${REPORTS[fr]}: ${tcs.length} test case (≤ ${stage}), ${results.length} kết quả`);
