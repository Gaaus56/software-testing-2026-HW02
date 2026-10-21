// Thực thi test case FR-16 (Import sản phẩm từ CSV).
// Cách chạy: cd scripts && node fr16.mjs
// Yêu cầu: frontend-admin đang chạy ở :5174. Dữ liệu test ở test-data/FR16/.
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { api, launch, login, resetBackend, Runner, sleep, USER, ADMIN_ACC, ADMIN, WEB, REPO, fmt } from "./lib.mjs";

const R = new Runner("FR16");
const DATA = join(REPO, "test-data", "FR16");
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 900 } });
const shot = await browser.newPage();

const products = async () => (await api("GET", "/products")).body;

async function openImport() {
  await page.goto(ADMIN);
  if (await page.getByPlaceholder("Email").isVisible().catch(() => false)) {
    await page.getByPlaceholder("Email").fill(ADMIN_ACC.email);
    await page.getByPlaceholder("Password").fill(ADMIN_ACC.password);
    await page.getByRole("button", { name: "Login" }).click();
  }
  await page.getByText("Sản phẩm", { exact: true }).click();
  await page.waitForSelector("input[type=file]");
}

// Import một file qua giao diện Admin; trả về thông tin hiển thị và số sản phẩm thêm vào DB
async function uiImport(file) {
  await openImport();
  const before = await products();
  await page.setInputFiles("input[type=file]", join(DATA, file));
  await sleep(700);
  const btn = page.getByRole("button", { name: /^Import \d+ sản phẩm$/ });
  const label = await btn.innerText();
  const accept = await page.locator("input[type=file]").getAttribute("accept");
  let report = "";
  if (await btn.isDisabled()) {
    report = `(nút "${label}" bị vô hiệu, không gửi được)`;
  } else {
    await btn.click();
    await page.waitForSelector("div.bg-green-100, div.bg-red-100", { timeout: 5000 }).catch(() => {});
    report = (await page.locator("div.bg-green-100, div.bg-red-100").first().innerText().catch(() => "")).replace(/\s+/g, " ").trim();
  }
  const after = await products();
  const added = after.filter((p) => !before.some((b) => b.id === p.id));
  return { label, report, added, accept };
}

const show = (u) => `${u.label}; báo cáo: "${u.report}"; DB thêm ${u.added.length} SP` + (u.added.length ? ` [${u.added.map((p) => `${JSON.stringify(p.name).slice(0, 40)} / giá ${p.price} / dm ${p.category_id}`).join("; ")}]` : "");

// Mỗi ca: [id, file, mong đợi]. Mong đợi: số sản phẩm được thêm (0 = từ chối toàn bộ / rollback), kèm điều kiện phụ.
const cases = [
  ["FR16-EP-01", "FR16-EP-01_valid_2rows.csv", { n: 2 }],
  ["FR16-EP-02", "FR16-EP-02_valid_content.txt", { n: 0 }],
  ["FR16-EP-03", "FR16-EP-03_fake_excel.xlsx", { n: 0, reason: /định dạng|csv|file|tệp/i }],
  ["FR16-EP-04", "FR16-EP-04_wrong_header.csv", { n: 0 }],
  ["FR16-EP-05", "FR16-EP-05_no_header.csv", { n: 0, reason: /header|tiêu đề|cột/i }],
  ["FR16-EP-06", "FR16-EP-06_quoted_comma.csv", { n: 1, name: "CSV-EP06 Laptop, Pro", price: 25000000 }],
  ["FR16-EP-07", "FR16-EP-07_empty_name_middle.csv", { n: 0, reason: /tên|name/i }],
  ["FR16-EP-08", "FR16-EP-08_price_zero.csv", { n: 0 }],
  ["FR16-EP-09", "FR16-EP-09_price_negative.csv", { n: 0 }],
  ["FR16-EP-10", "FR16-EP-10_price_text.csv", { n: 0 }],
  ["FR16-EP-11", "FR16-EP-11_header_only.csv", { n: 0 }],
  ["FR16-EP-15", "FR16-EP-15_name_spaces.csv", { n: 0 }],
  ["FR16-EP-16", "FR16-EP-16_escaped_quote.csv", { n: 1, name: 'CSV-EP16 Tai nghe "Pro"' }],
  ["FR16-EP-17", "FR16-EP-17_utf8_bom.csv", { n: 1, name: "CSV-EP17 Co BOM" }],
  ["FR16-EP-18", "FR16-EP-18_category_not_exist.csv", { n: 0 }],
  ["FR16-EP-19", "FR16-EP-19_header_reordered.csv", { n: 0 }],
  ["FR16-EP-20", "FR16-EP-20_crlf.csv", { n: 2, name: "CSV-EP20 CRLF 1" }],
  ["FR16-EP-22", "FR16-EP-22_upper_ext.CSV", { n: 1 }],
  ["FR16-BVA-01", "FR16-BVA-01_price_-0.01.csv", { n: 0 }],
  ["FR16-BVA-02", "FR16-BVA-02_price_0.csv", { n: 0 }],
  ["FR16-BVA-03", "FR16-BVA-03_price_0.01.csv", { n: 1 }],
  ["FR16-BVA-04", "FR16-BVA-04_name_len0.csv", { n: 0 }],
  ["FR16-BVA-05", "FR16-BVA-05_name_len1.csv", { n: 1, name: "A" }],
  ["FR16-BVA-06", "FR16-BVA-06_name_len2.csv", { n: 1, name: "AB" }],
  ["FR16-BVA-07", "FR16-BVA-07_name_len254.csv", { n: 1 }],
  ["FR16-BVA-08", "FR16-BVA-08_name_len255.csv", { n: 1 }],
  ["FR16-BVA-09", "FR16-BVA-09_name_len256.csv", { n: 0 }],
  ["FR16-BVA-11", "FR16-BVA-11_rows_1.csv", { n: 1 }],
  ["FR16-BVA-12", "FR16-BVA-12_rows_2.csv", { n: 2 }],
  ["FR16-BVA-13", "FR16-BVA-13_error_first_row.csv", { n: 0 }],
  ["FR16-BVA-14", "FR16-BVA-14_error_last_row.csv", { n: 0 }],
  ["FR16-BVA-15", "FR16-BVA-15_4_columns.csv", { n: 0 }],
  ["FR16-BVA-16", "FR16-BVA-16_6_columns.csv", { n: 0 }],
];

resetBackend();
for (const [id, file, exp] of cases) {
  const u = await uiImport(file);
  let pass = u.added.length === exp.n;
  if (pass && exp.name) pass = u.added.some((p) => p.name === exp.name && (exp.price === undefined || Number(p.price) === exp.price));
  if (pass && exp.reason) pass = exp.reason.test(u.report);
  await page.screenshot({ path: R.shotPath(`${id}.png`) });
  const note = id === "FR16-EP-01" ? `Thuộc tính accept của ô chọn file: ${u.accept === null ? "không có" : u.accept}` : "";
  R.record({ id, pass, actual: show(u), evidence: `evidence/FR16/${id}.png`, note });
}

// FR16-EP-21 (S5): tên có HTML phải hiển thị dạng chữ ở Web (SEC-04)
{
  const u = await uiImport("FR16-EP-21_html_name.csv");
  const p2 = await browser.newPage();
  await p2.goto(WEB);
  await sleep(1500);
  const literal = await p2.getByText("<b>CSV-EP21 Bold</b>").count();
  const boldEl = await p2.locator("b", { hasText: "CSV-EP21 Bold" }).count();
  await p2.screenshot({ path: R.shotPath("FR16-EP-21.png"), fullPage: true });
  await p2.close();
  R.record({
    id: "FR16-EP-21",
    pass: u.added.length === 1 && literal > 0 && boldEl === 0,
    actual: `${show(u)}; trang chủ Web: ${literal > 0 ? "hiện nguyên văn <b>…</b>" : boldEl > 0 ? "render thành chữ đậm (HTML được thực thi)" : "không tìm thấy sản phẩm"}`,
    evidence: "evidence/FR16/FR16-EP-21.png",
  });
}

// ---------- Tầng API ----------
resetBackend();
const at = await login(ADMIN_ACC);
const ut = await login(USER);
const body = (rows) => ({ products: rows });
const ok = (n) => ({ name: n, price: 100000, description: "API", imageUrl: "", category_id: 3 });

let before = (await products()).length;
let r = await api("POST", "/admin/import-products", body([ok("API-EP12")]));
let n = (await products()).length - before;
R.record({
  id: "FR16-EP-12",
  pass: r.status === 401 && n === 0,
  actual: `${fmt(r)}; DB thêm ${n}`,
});

before = (await products()).length;
r = await api("POST", "/admin/import-products", body([ok("API-EP13 user")]), ut);
n = (await products()).length - before;
R.record({
  id: "FR16-EP-13",
  pass: r.status === 403 && n === 0,
  actual: `${fmt(r)}; DB thêm ${n}`,
  evidence: await R.apiShot(shot, "FR16-EP-13.png", "FR16-EP-13 — token USER (không phải admin) gọi API import", `POST /api/admin/import-products\nAuthorization: Bearer <token của test@eshop.com, role=user>\n${JSON.stringify(body([ok("API-EP13 user")]))}`, `${fmt(r)}\nSố sản phẩm thêm vào DB: ${n}`),
});

const apiRows = [ok("API-EP14 Dong 1"), { ...ok("API-EP14 Gia am"), price: -1 }, ok("API-EP14 Dong 3")];
writeFileSync(join(DATA, "api", "FR16-EP-14_body.json"), JSON.stringify(body(apiRows), null, 2));
before = (await products()).length;
r = await api("POST", "/admin/import-products", body(apiRows), at);
n = (await products()).length - before;
R.record({
  id: "FR16-EP-14",
  pass: n === 0 && r.status >= 400,
  actual: `${fmt(r)}; DB thêm ${n}`,
  evidence: await R.apiShot(shot, "FR16-EP-14.png", "FR16-EP-14 — gọi thẳng API, 1 dòng giá âm giữa 2 dòng hợp lệ", `POST /api/admin/import-products  Authorization: Bearer <admin>\n${JSON.stringify(body(apiRows))}`, `${fmt(r)}\nSố sản phẩm thêm vào DB: ${n}`),
});

R.save();
await browser.close();
resetBackend();
console.log("Xong FR16:", R.results.length, "test case");
