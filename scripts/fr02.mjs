// Thực thi test case FR-02 (Đăng nhập & khóa tài khoản).
// Cách chạy: cd scripts && node fr02.mjs [--skip-long]
// Yêu cầu: frontend-web đang chạy ở :5173. Script tự khởi động lại backend trước mỗi nhóm test.
import { api, launch, login, resetBackend, Runner, sleep, USER, ADMIN_ACC, WEB, fmt } from "./lib.mjs";

const R = new Runner("FR02");
const skipLong = process.argv.includes("--skip-long");
const WRONG = { email: USER.email, password: "Wrong123!" };

const browser = await launch();
const page = await browser.newPage();
const shotPage = await browser.newPage();

async function fails(n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(await api("POST", "/login", WRONG));
  return out;
}

async function openLogin() {
  await page.goto(`${WEB}/login`);
  await page.waitForSelector("form input");
}

// ---------- Nhóm UI ----------
resetBackend();

// FR02-EP-01: đăng nhập đúng qua UI
await openLogin();
const inputs = page.locator("form input");
await inputs.nth(0).fill(USER.email);
await inputs.nth(1).fill(USER.password);
await page.locator("form button[type=submit]").click();
await page.waitForURL(`${WEB}/`, { timeout: 5000 }).catch(() => {});
await sleep(800);
const tokenStored = await page.evaluate(() => localStorage.getItem("token"));
await page.screenshot({ path: R.shotPath("FR02-EP-01.png") });
R.record({
  id: "FR02-EP-01",
  pass: page.url() === `${WEB}/` && !!tokenStored,
  actual: `Chuyển về ${page.url()}; localStorage.token ${tokenStored ? "có JWT" : "không có"}`,
  evidence: "evidence/FR02/FR02-EP-01.png",
});

// FR02-EP-08: request có xác thực gửi kèm Authorization: Bearer
const reqP = page.waitForRequest((r) => r.url().includes("/api/orders/my-orders"), { timeout: 5000 }).catch(() => null);
await page.locator("a[href='/profile']").first().click().catch(() => {});
const req = await reqP;
const authHeader = req ? req.headers()["authorization"] || "" : "";
await sleep(500);
await page.screenshot({ path: R.shotPath("FR02-EP-08.png") });
R.record({
  id: "FR02-EP-08",
  pass: authHeader.startsWith("Bearer ey"),
  actual: req ? `GET /api/orders/my-orders có header Authorization: ${authHeader.slice(0, 20)}…` : "Không bắt được request",
  evidence: "evidence/FR02/FR02-EP-08.png",
});

// Đăng xuất (xóa token) để test form
await page.evaluate(() => localStorage.clear());

// FR02-EP-09: thuộc tính form theo FR-22
await openLogin();
const attrs = await page.evaluate(() => {
  const ins = [...document.querySelectorAll("form input")];
  const labels = [...document.querySelectorAll("form label")].map((l) => l.textContent.trim());
  return {
    types: ins.map((i) => i.getAttribute("type")),
    labels,
    title: document.querySelector("h1,h2")?.textContent.trim(),
    button: document.querySelector("form button[type=submit]")?.textContent.trim(),
  };
});
await page.screenshot({ path: R.shotPath("FR02-EP-09.png") });
R.record({
  id: "FR02-EP-09",
  pass: attrs.types[0] === "email" && attrs.types[1] === "password" && attrs.labels.every((l) => l.includes("*")),
  actual: `type ô 1="${attrs.types[0]}", ô 2="${attrs.types[1]}"; nhãn: ${attrs.labels.join(" | ")}; tiêu đề form "${attrs.title}"; nút "${attrs.button}"`,
  evidence: "evidence/FR02/FR02-EP-09.png",
});

// FR02-EP-04: email sai định dạng "abc" phải bị HTML5 chặn (không gửi request)
await openLogin();
let sent = false;
const onReq = (r) => { if (r.url().includes("/api/login")) sent = true; };
page.on("request", onReq);
await page.locator("form input").nth(0).fill("abc");
await page.locator("form input").nth(1).fill("Test1234!");
await page.locator("form button[type=submit]").click();
await sleep(1000);
page.off("request", onReq);
await page.screenshot({ path: R.shotPath("FR02-EP-04.png") });
R.record({
  id: "FR02-EP-04",
  pass: !sent,
  actual: sent ? "Form vẫn gửi POST /api/login với email \"abc\" (không có validate HTML5)" : "Trình duyệt chặn, không gửi request",
  evidence: "evidence/FR02/FR02-EP-04.png",
});

// FR02-EP-05: để trống cả hai ô
await openLogin();
sent = false;
page.on("request", onReq);
await page.locator("form button[type=submit]").click();
await sleep(800);
page.off("request", onReq);
const validity = await page.evaluate(() => [...document.querySelectorAll("form input")].map((i) => i.validationMessage));
await page.screenshot({ path: R.shotPath("FR02-EP-05.png") });
R.record({
  id: "FR02-EP-05",
  pass: !sent,
  actual: sent ? "Form gửi request khi để trống" : `Không gửi request; validationMessage: "${validity[0]}"`,
  evidence: "evidence/FR02/FR02-EP-05.png",
});

// FR02-EP-10: thông báo trên UI khi tài khoản bị khóa + vị trí thông báo lỗi (FR-22)
resetBackend();
await fails(3);
await openLogin();
await page.locator("form input").nth(0).fill(USER.email);
await page.locator("form input").nth(1).fill(USER.password);
await page.locator("form button[type=submit]").click();
await sleep(1200);
const ui = await page.evaluate(() => {
  const err = [...document.querySelectorAll("div")].find((d) => /thất bại|khóa|lỗi/i.test(d.textContent) && d.children.length === 0);
  const btn = document.querySelector("form button[type=submit]");
  if (!err || !btn) return null;
  return { text: err.textContent.trim(), errTop: err.getBoundingClientRect().top, btnTop: btn.getBoundingClientRect().top };
});
await page.screenshot({ path: R.shotPath("FR02-EP-10.png") });
R.record({
  id: "FR02-EP-10",
  pass: !!ui && /khóa/i.test(ui.text) && ui.errTop < ui.btnTop,
  actual: ui ? `UI hiện "${ui.text}" (API trả 403 "Tài khoản đã bị khóa…"); thông báo nằm ${ui.errTop < ui.btnTop ? "trên" : "dưới"} nút submit` : "Không thấy thông báo",
  evidence: "evidence/FR02/FR02-EP-10.png",
});

// ---------- Nhóm API ----------
resetBackend();
let r = await api("POST", "/login", WRONG);
const wrongPw = r;
R.record({
  id: "FR02-EP-02",
  pass: r.status === 401,
  actual: fmt(r),
  evidence: await R.apiShot(shotPage, "FR02-EP-02.png", "FR02-EP-02 — mật khẩu sai", `POST /api/login\n${JSON.stringify(WRONG)}`, fmt(r)),
});

r = await api("POST", "/login", { email: "khongtontai@eshop.com", password: "Test1234!" });
R.record({
  id: "FR02-EP-03",
  pass: r.status === wrongPw.status && JSON.stringify(r.body) === JSON.stringify(wrongPw.body),
  actual: `${fmt(r)} (so với mật khẩu sai: ${fmt(wrongPw)})`,
  evidence: await R.apiShot(shotPage, "FR02-EP-03.png", "FR02-EP-03 — email chưa đăng ký", `POST /api/login\n{"email":"khongtontai@eshop.com","password":"Test1234!"}`, fmt(r)),
});

resetBackend();
r = await api("POST", "/login", { email: USER.email, password: "test1234!" });
R.record({ id: "FR02-EP-06", pass: r.status === 401, actual: fmt(r) });

// FR02-BVA-04: bộ đếm tăng đúng 1 → chuỗi status sau 3 lần sai
resetBackend();
const seq = await fails(3);
R.record({
  id: "FR02-BVA-04",
  pass: seq[0].status === 401 && seq[1].status === 401 && seq[2].status !== 200,
  actual: seq.map((x) => x.status).join(", ") + ` — lần 3: ${JSON.stringify(seq[2].body)}`,
});

// FR02-BVA-01..03: n lần sai liên tiếp rồi đăng nhập đúng
for (const [id, n, expectLocked] of [["FR02-BVA-01", 2, false], ["FR02-BVA-02", 3, true], ["FR02-BVA-03", 4, true]]) {
  resetBackend();
  await fails(n);
  r = await api("POST", "/login", USER);
  R.record({
    id,
    pass: expectLocked ? r.status !== 200 : r.status === 200,
    actual: `${n} lần sai → đăng nhập đúng: ${r.status} ${r.body.error || r.body.message}`,
    evidence: await R.apiShot(shotPage, `${id}.png`, `${id} — ${n} lần sai rồi mật khẩu đúng`, `${n} × POST /api/login (sai)\nPOST /api/login ${JSON.stringify(USER)}`, fmt(r).slice(0, 160)),
  });
}

// FR02-EP-07: đang khóa, mật khẩu đúng
resetBackend();
await fails(3);
r = await api("POST", "/login", USER);
R.record({ id: "FR02-EP-07", pass: r.status !== 200, actual: fmt(r) });

// FR02-EP-11 (S5): bộ đếm reset sau khi đăng nhập thành công
resetBackend();
await fails(2);
const ok = await api("POST", "/login", USER);
await fails(2);
r = await api("POST", "/login", USER);
R.record({
  id: "FR02-EP-11",
  pass: ok.status === 200 && r.status === 200,
  actual: `2 sai → đúng (${ok.status}) → 2 sai → đúng (${r.status} ${r.body.error || r.body.message})`,
});

// FR02-EP-12 (S5): khóa tài khoản A không ảnh hưởng tài khoản B
resetBackend();
await fails(3);
r = await api("POST", "/login", ADMIN_ACC);
R.record({ id: "FR02-EP-12", pass: r.status === 200, actual: `test@ bị khóa; admin@ đăng nhập: ${r.status} ${r.body.message || r.body.error}` });

// FR02-EP-13 (S5): email sai định dạng gửi thẳng API
r = await api("POST", "/login", { email: "abc", password: "x" });
R.record({ id: "FR02-EP-13", pass: r.status === 401 || r.status === 400, actual: fmt(r) });

// FR02-BVA-05..07: thời gian khóa 29/30/31 giây (mỗi giá trị một lần khóa mới, chỉ thử 1 lần)
for (const [id, t, expectLocked] of [["FR02-BVA-05", 29, true], ["FR02-BVA-06", 30, false], ["FR02-BVA-07", 31, false]]) {
  resetBackend();
  await fails(3);
  const t0 = Date.now();
  await sleep(t * 1000 - (Date.now() - t0));
  r = await api("POST", "/login", USER);
  const waited = ((Date.now() - t0) / 1000).toFixed(1);
  R.record({
    id,
    pass: expectLocked ? r.status !== 200 : r.status === 200,
    actual: `Sau ${waited}s kể từ lần sai thứ 3: ${r.status} ${r.body.error || r.body.message}`,
    evidence: await R.apiShot(shotPage, `${id}.png`, `${id} — đăng nhập đúng sau ${t}s bị khóa`, `3 × POST /api/login (sai)\n… chờ ${waited}s …\nPOST /api/login ${JSON.stringify(USER)}`, fmt(r).slice(0, 160)),
  });
}

// FR02-BVA-08 (S5, khám phá): đo thời gian khóa thực tế (thử 1 lần ở 175s và 1 lần ở 185s)
if (!skipLong) {
  for (const [id, t] of [["FR02-BVA-08a", 175], ["FR02-BVA-08b", 185]]) {
    resetBackend();
    await fails(3);
    const t0 = Date.now();
    await sleep(t * 1000);
    r = await api("POST", "/login", USER);
    const waited = ((Date.now() - t0) / 1000).toFixed(1);
    R.record({
      id,
      pass: null,
      actual: `Khám phá: sau ${waited}s → ${r.status} ${r.body.error || r.body.message}`,
      note: "Đo thời gian khóa thực tế, không có kết quả mong đợi riêng",
    });
  }
}

// FR02-EP-14 (S5): sau khi hết khóa, 1 lần sai không bị khóa lại ngay
if (!skipLong) {
  resetBackend();
  await fails(3);
  let unlocked = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 240000) {
    await sleep(5000);
    if ((await api("POST", "/login", USER)).status === 200) { unlocked = true; break; }
  }
  r = await api("POST", "/login", WRONG);
  const r2 = await api("POST", "/login", USER);
  R.record({
    id: "FR02-EP-14",
    pass: unlocked ? r.status === 401 && r2.status === 200 : null,
    actual: unlocked ? `Sau khi mở khóa: 1 lần sai → ${r.status}; đăng nhập đúng → ${r2.status}` : "Không mở khóa trong 240s",
  });
}

R.save();
await browser.close();
resetBackend();
console.log("Xong FR02:", R.results.length, "test case");
