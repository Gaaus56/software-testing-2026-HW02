// Thực thi test case FR-09 (Mã giảm giá).
// Cách chạy: cd scripts && node fr09.mjs
// Yêu cầu: frontend-web đang chạy ở :5173. Script tự khởi động lại backend trước mỗi nhóm test.
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { api, launch, login, resetBackend, Runner, sleep, USER, ADMIN_ACC, WEB, REPO, fmt } from "./lib.mjs";

const R = new Runner("FR09");
const browser = await launch();
const page = await browser.newPage();
const shot = await browser.newPage();
const USER_ID = 2; // id của test@eshop.com trong dữ liệu seed

const apply = (code, total, token, userId = USER_ID) =>
  api("POST", "/apply-coupon", { code, total_amount: total, user_id: userId }, token);

async function setup() {
  resetBackend();
  return { ut: await login(USER), at: await login(ADMIN_ACC) };
}

async function createCoupon(at, c) {
  const r = await api("POST", "/admin/coupons", c, at);
  if (r.status !== 200) throw new Error("Tạo coupon lỗi " + fmt(r));
}

async function createProduct(at, name, price) {
  await api("POST", "/products", { name, price, description: "SP test FR-09", imageUrl: "https://placehold.co/300", category_id: 3 }, at);
  const all = (await api("GET", "/products")).body;
  return all.find((p) => p.name === name).id;
}

// Đặt is_active = 0 trực tiếp trong DB (không có UI/API nào làm được việc này)
function deactivate(code) {
  execFileSync("node", ["-e", `const s=require('sqlite3');const db=new s.Database('database.sqlite');db.run("UPDATE coupons SET is_active=0 WHERE code=?",['${code}'],()=>db.close())`], {
    cwd: join(REPO, "..", "eshop-sut", "backend"),
  });
}

async function useOnce(ut, couponId) {
  return api("POST", "/coupon-usage", { coupon_id: couponId }, ut);
}

function money(r) {
  return r.body && r.body.success ? `giảm ${r.body.discount_amount}, thành tiền ${r.body.final_amount}` : (r.body.error || JSON.stringify(r.body));
}

async function check(id, r, expectOk, expDiscount, expFinal, title, req) {
  let pass;
  if (!expectOk) pass = r.status >= 400;
  else pass = r.status === 200 && Math.abs(r.body.discount_amount - expDiscount) < 0.5 && Math.abs(r.body.final_amount - expFinal) < 0.5;
  R.record({
    id,
    pass,
    actual: `${r.status} — ${money(r)}`,
    evidence: pass ? "" : await R.apiShot(shot, `${id}.png`, `${id} — ${title}`, req, fmt(r)),
  });
}

// ---------- Nhóm API cơ bản ----------
let { ut, at } = await setup();
const q = (code, total, extra = "") => `POST /api/apply-coupon  ${extra}\n{"code":"${code}","total_amount":${total},"user_id":${USER_ID}}`;

await check("FR09-EP-01", await apply("SAVE10", 1000000, ut), true, 100000, 900000, "SAVE10, tổng 1.000.000", q("SAVE10", 1000000, "Authorization: Bearer <user>"));
await check("FR09-EP-02", await apply("BIGBUY", 600000, ut), true, 50000, 550000, "BIGBUY, tổng 600.000", q("BIGBUY", 600000));
await check("FR09-EP-03", await apply("VIP100", 400000, ut), true, 100000, 300000, "VIP100, tổng 400.000", q("VIP100", 400000));
await check("FR09-EP-04", await apply("ABC123", 400000, ut), false, 0, 0, "mã không tồn tại", q("ABC123", 400000));
await check("FR09-EP-09", await apply("x' OR 1=1 --", 400000, ut), false, 0, 0, "ký tự đặc biệt/SQL", q("x' OR 1=1 --", 400000));
await check("FR09-EP-10", await apply("EXPIRED", 200000, ut), false, 0, 0, "mã hết hạn", q("EXPIRED", 200000));
await check("FR09-EP-11", await apply("SAVE10", 200000, ut), false, 0, 0, "tổng dưới ngưỡng", q("SAVE10", 200000));

// C4: không token / token sai
let r = await api("POST", "/apply-coupon", { code: "SAVE10", total_amount: 1000000, user_id: USER_ID });
await check("FR09-EP-12", r, false, 0, 0, "không gửi token (C4)", q("SAVE10", 1000000, "(KHÔNG có header Authorization)"));
r = await api("POST", "/apply-coupon", { code: "SAVE10", total_amount: 1000000, user_id: USER_ID }, "token.khong.hop.le");
await check("FR09-EP-13", r, false, 0, 0, "token không hợp lệ (C4)", q("SAVE10", 1000000, "Authorization: Bearer token.khong.hop.le"));

// C1: mã bị vô hiệu hóa
await createCoupon(at, { code: "OFF10", type: "fixed", discount_value: 10000, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 5 });
deactivate("OFF10");
await check("FR09-EP-05", await apply("OFF10", 100000, ut), false, 0, 0, "mã is_active = 0 (C1)", q("OFF10", 100000) + "\n(OFF10 đã đặt is_active = 0 trong DB)");

// ---------- BVA ngưỡng C3 ----------
for (const [id, code, total, ok, d, f] of [
  ["FR09-BVA-01", "SAVE10", 299999, false],
  ["FR09-BVA-02", "SAVE10", 300000, true, 30000, 270000],
  ["FR09-BVA-03", "SAVE10", 300001, true, 30000.1, 270000.9],
  ["FR09-BVA-04", "BIGBUY", 499999, false],
  ["FR09-BVA-05", "BIGBUY", 500000, true, 50000, 450000],
  ["FR09-BVA-06", "BIGBUY", 500001, true, 50000, 450001],
  ["FR09-BVA-07", "VIP100", 299999, false],
  ["FR09-BVA-08", "VIP100", 300000, true, 100000, 200000],
  ["FR09-BVA-09", "VIP100", 300001, true, 100000, 200001],
  ["FR09-BVA-10", "EXPIRED", 100000, false],
]) {
  await check(id, await apply(code, total, ut), ok, d, f, `${code}, tổng ${total.toLocaleString("vi-VN")}`, q(code, total));
}

// ---------- BVA ngày hết hạn ----------
const day = (off) => { const d = new Date(); d.setDate(d.getDate() + off); return d.toLocaleDateString("sv-SE"); };
for (const [id, code, off, ok] of [["FR09-BVA-11", "DAYM1", -1, false], ["FR09-BVA-12", "DAY0", 0, false], ["FR09-BVA-13", "DAYP1", 1, true]]) {
  await createCoupon(at, { code, type: "fixed", discount_value: 10000, min_order_amount: 0, expired_at: day(off), max_uses_per_user: 5 });
  await check(id, await apply(code, 100000, ut), ok, 10000, 90000, `expired_at = ${day(off)} (hôm nay ${day(0)})`, q(code, 100000));
}

// ---------- S5: biên output final_amount (fixed 100.000, min 0) ----------
await createCoupon(at, { code: "FIX100K", type: "fixed", discount_value: 100000, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 9 });
for (const [id, total, d, f] of [["FR09-BVA-16", 99999, 99999, 0], ["FR09-BVA-17", 100000, 100000, 0], ["FR09-BVA-18", 100001, 100000, 1]]) {
  await check(id, await apply("FIX100K", total, ut), true, d, f, `FIX100K (fixed 100.000), tổng ${total}`, q("FIX100K", total));
}

// ---------- S5: C5 tính lượt khi đặt hàng thành công, không tính khi chỉ áp mã ----------
({ ut, at } = await setup());
await apply("SAVE10", 400000, ut);
r = await apply("SAVE10", 400000, ut);
R.record({ id: "FR09-EP-19", pass: r.status === 200, actual: `Áp SAVE10 lần 2 (chưa đặt hàng): ${r.status} ${r.body.message || r.body.error}` });

// ---------- C5 số lần dùng ----------
await useOnce(ut, 1); // SAVE10 đã dùng 1 lần
await check("FR09-EP-14", await apply("SAVE10", 400000, ut), false, 0, 0, "SAVE10 đã dùng 1/1 lần", q("SAVE10", 400000) + "\n(đã ghi 1 lượt dùng SAVE10 cho user 2)");

// S5: user_id giả (token của user đã dùng hết lượt, body user_id khác)
r = await api("POST", "/apply-coupon", { code: "SAVE10", total_amount: 400000, user_id: 99 }, ut);
await check("FR09-EP-16", r, false, 0, 0, "token user 2 (đã dùng hết lượt) + body user_id=99 (C5)", `POST /api/apply-coupon  Authorization: Bearer <token user 2>\n{"code":"SAVE10","total_amount":400000,"user_id":99}\n(user 2 đã dùng SAVE10 1/1 lần)`);

await useOnce(ut, 3); // VIP100 dùng 1 lần
await check("FR09-BVA-14", await apply("VIP100", 400000, ut), true, 100000, 300000, "VIP100 đã dùng 1/2 lần", q("VIP100", 400000));
await useOnce(ut, 3); // VIP100 dùng 2 lần
await check("FR09-BVA-15", await apply("VIP100", 400000, ut), false, 0, 0, "VIP100 đã dùng 2/2 lần", q("VIP100", 400000));

// S5: total_amount do client gửi lớn hơn giỏ hàng thật trên server
({ ut, at } = await setup());
await api("POST", "/cart", { id: 4, name: "Tai nghe AirPods Pro 2", price: 200000, quantity: 1 }, ut);
const cart = (await api("GET", "/cart", undefined, ut)).body;
r = await apply("SAVE10", 400000, ut);
await check("FR09-EP-17", r, false, 0, 0, "giỏ trên server = 200.000 nhưng client gửi total_amount = 400.000", `GET /api/cart → ${JSON.stringify(cart)}\n` + q("SAVE10", 400000));

// ---------- Nhóm UI ----------
({ ut, at } = await setup());
const pid = await createProduct(at, "SP Test 400K", 400000);

async function uiLogin() {
  await page.goto(`${WEB}/login`);
  await page.locator("form input").nth(0).fill(USER.email);
  await page.locator("form input").nth(1).fill(USER.password);
  await page.locator("form button[type=submit]").click();
  await page.waitForURL(`${WEB}/`);
}

async function toCheckout() {
  await page.goto(`${WEB}/product/${pid}`);
  const btn = page.getByRole("button", { name: /Thêm vào giỏ/ });
  await btn.click(); await btn.click(); // web cần bấm 2 lần mới thêm (lỗi FR-06/07 web, ngoài phạm vi)
  await page.locator("header a[href='/cart']").click();
  await page.getByRole("button", { name: /Tiến hành thanh toán/ }).click();
  await page.waitForURL(`${WEB}/checkout`);
}

async function uiApply(code) {
  await page.getByPlaceholder("Nhập mã giảm giá...").fill(code);
  const btn = page.getByRole("button", { name: "Áp dụng" });
  if (await btn.isDisabled()) return { disabled: true, text: "" };
  await btn.click();
  await sleep(1000);
  const box = await page.locator("div.mb-6.p-4.bg-gray-50").innerText();
  return { disabled: false, text: box.replace(/\s+/g, " ").trim() };
}

await uiLogin();
await toCheckout();
let u = await uiApply("SAVE10");
await page.screenshot({ path: R.shotPath("FR09-EP-15.png"), fullPage: true });
R.record({
  id: "FR09-EP-15",
  pass: /40[.,]000 ₫/.test(u.text) && /360[.,]000 ₫/.test(u.text),
  actual: `Giỏ 400.000 ₫, áp SAVE10 → "${u.text}"`,
  evidence: "evidence/FR09/FR09-EP-15.png",
});

await toCheckout();
u = await uiApply("");
await page.screenshot({ path: R.shotPath("FR09-EP-06.png") });
R.record({ id: "FR09-EP-06", pass: u.disabled, actual: u.disabled ? "Nút Áp dụng bị vô hiệu khi ô mã trống" : `Vẫn gửi được: ${u.text}`, evidence: "evidence/FR09/FR09-EP-06.png" });

u = await uiApply("save10");
await page.screenshot({ path: R.shotPath("FR09-EP-07.png") });
R.record({ id: "FR09-EP-07", pass: /thành công/i.test(u.text), actual: `Nhập "save10" → "${u.text}"`, evidence: "evidence/FR09/FR09-EP-07.png" });

u = await uiApply("  SAVE10  ");
await page.screenshot({ path: R.shotPath("FR09-EP-08.png") });
R.record({ id: "FR09-EP-08", pass: /thành công/i.test(u.text), actual: `Nhập "  SAVE10  " → "${u.text}"`, evidence: "evidence/FR09/FR09-EP-08.png" });

// FR09-EP-20 (S5): đặt hàng với SAVE10 qua UI rồi áp lại SAVE10 → phải bị từ chối (C5)
u = await uiApply("SAVE10");
page.once("dialog", (d) => d.dismiss());
await page.getByRole("button", { name: /Xác Nhận Thanh Toán/ }).click();
await sleep(1500);
const placed = await page.getByText("Thanh toán thành công").isVisible().catch(() => false);
await toCheckout();
u = await uiApply("SAVE10");
await page.screenshot({ path: R.shotPath("FR09-EP-20.png"), fullPage: true });
R.record({
  id: "FR09-EP-20",
  pass: placed && /đã sử dụng|giới hạn/i.test(u.text),
  actual: `Đặt hàng với SAVE10: ${placed ? "thành công" : "không thành công"}; áp lại SAVE10 → "${u.text}"`,
  evidence: "evidence/FR09/FR09-EP-20.png",
});

R.save();
await browser.close();
resetBackend();
console.log("Xong FR09:", R.results.length, "test case");
