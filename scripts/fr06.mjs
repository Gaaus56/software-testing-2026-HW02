// Thực thi test case FR-06 (Chi tiết sản phẩm — Mobile) trên Android Emulator qua adb.
// Yêu cầu:
//   - Emulator đang chạy (ví dụ AVD Pixel_6) và app đã mở trong Expo Go
//     (eshop-sut/frontend-mobile: API_URL = http://10.0.2.2:3000/api; `npx expo start --android`).
//   - Backend :3000 đang chạy.
// Cách chạy: cd scripts && node fr06.mjs
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { Runner, sleep } from "./lib.mjs";

const ADB = join(process.env.LOCALAPPDATA, "Android", "Sdk", "platform-tools", "adb.exe");
const R = new Runner("FR06");
const PRODUCT = "Tai nghe AirPods Pro 2";

const adb = (...a) => execFileSync(ADB, a, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
const adbBin = (...a) => execFileSync(ADB, a, { maxBuffer: 50 * 1024 * 1024 });

// Đọc cây giao diện hiện tại
function dump() {
  adb("shell", "uiautomator", "dump", "/sdcard/ui.xml");
  const xml = adb("exec-out", "cat", "/sdcard/ui.xml");
  return [...xml.matchAll(/<node [^>]*>/g)].map((m) => {
    const a = Object.fromEntries([...m[0].matchAll(/([\w-]+)="([^"]*)"/g)].map((x) => [x[1], x[2]]));
    const [x1, y1, x2, y2] = a.bounds.match(/\d+/g).map(Number);
    return { cls: a.class, text: a.text, desc: a["content-desc"], x: (x1 + x2) >> 1, y: (y1 + y2) >> 1, y1 };
  });
}
const find = (nodes, t) => nodes.find((n) => n.text === t || n.desc === t);
const tap = (n) => adb("shell", "input", "tap", String(n.x), String(n.y));

async function tapText(t, { scroll = false } = {}) {
  for (let i = 0; i < 8; i++) {
    const n = find(dump(), t);
    if (n) { tap(n); await sleep(1200); return true; }
    if (!scroll) break;
    adb("shell", "input", "swipe", "540", "1800", "540", "900", "300");
    await sleep(800);
  }
  throw new Error(`Không thấy "${t}"`);
}

function shot(name) {
  writeFileSync(R.shotPath(name), adbBin("exec-out", "screencap", "-p"));
  return `evidence/FR06/${name}`;
}

// Bấm OK của hộp thoại (Alert) nếu có; trả về nội dung hộp thoại
async function readAlert() {
  const nodes = dump();
  const ok = nodes.find((n) => n.text === "OK" && n.cls.includes("Button"));
  if (!ok) return "";
  const msg = nodes.filter((n) => n.cls.includes("TextView") && n.text && n.text !== "OK").map((n) => n.text).join(" — ");
  return msg;
}
async function closeAlert() {
  const ok = dump().find((n) => n.text === "OK" && n.cls.includes("Button"));
  if (ok) { tap(ok); await sleep(800); }
}

// Header của app nằm dưới thanh trạng thái Android nên không chạm được bằng `input tap`.
// Thay vào đó: nhấn TAB cho tới khi phần tử cần bấm được focus, rồi nhấn ENTER.
function focusedNode() {
  adb("shell", "uiautomator", "dump", "/sdcard/ui.xml");
  const xml = adb("exec-out", "cat", "/sdcard/ui.xml");
  const m = xml.match(/<node [^>]*focused="true"[^>]*>/);
  if (!m) return null;
  return { text: (m[0].match(/ text="([^"]*)"/) || [])[1], desc: (m[0].match(/content-desc="([^"]*)"/) || [])[1] };
}
async function pressHeader(re) {
  const hit = () => { const f = focusedNode(); return f && (re.test(f.desc || "") || re.test(f.text || "")); };
  // TAB đưa focus vào vùng header; DPAD trái/phải để đi qua các mục trong header
  const moves = ["KEYCODE_TAB", ...Array(3).fill("KEYCODE_DPAD_LEFT"), ...Array(3).fill("KEYCODE_DPAD_RIGHT"),
    ...Array(4).fill("KEYCODE_DPAD_UP"), ...Array(3).fill("KEYCODE_DPAD_LEFT"), ...Array(3).fill("KEYCODE_DPAD_RIGHT")];
  if (hit()) { adb("shell", "input", "keyevent", "KEYCODE_ENTER"); await sleep(1200); return; }
  for (const k of moves) {
    adb("shell", "input", "keyevent", k);
    if (hit()) {
      adb("shell", "input", "keyevent", "KEYCODE_ENTER");
      await sleep(1200);
      return;
    }
  }
  throw new Error(`Không focus được ${re}`);
}

async function goHome() {
  await pressHeader(/^EShop Mobile$/);
  adb("shell", "input", "swipe", "540", "900", "540", "1900", "200"); // cuộn lên đầu
  await sleep(500);
}

async function openDetail() {
  await goHome();
  // Tìm thẻ sản phẩm rồi bấm "Xem chi tiết" ngay bên dưới tên
  for (let i = 0; i < 8; i++) {
    const nodes = dump();
    const name = find(nodes, PRODUCT);
    if (name) {
      const btn = nodes.filter((n) => n.text === "Xem chi tiết" && n.y > name.y).sort((a, b) => a.y - b.y)[0];
      if (btn) { tap(btn); await sleep(1500); return; }
    }
    adb("shell", "input", "swipe", "540", "1800", "540", "1000", "300");
    await sleep(800);
  }
  throw new Error("Không mở được chi tiết sản phẩm");
}

async function setQty(value) {
  const input = dump().find((n) => n.cls.includes("EditText"));
  tap(input);
  await sleep(400);
  adb("shell", "input", "keyevent", "KEYCODE_MOVE_END");
  for (let i = 0; i < 25; i++) adb("shell", "input", "keyevent", "KEYCODE_DEL");
  if (value !== "") adb("shell", "input", "text", value.replace(/ /g, "%s"));
  await sleep(400);
  const nodes = dump();
  const after = nodes.find((n) => n.cls.includes("EditText"));
  const label = find(nodes, "Số lượng:");
  if (label) tap(label); // chạm ra ngoài ô để ẩn bàn phím (không dùng Back vì Back thoát app)
  await sleep(500);
  return after ? after.text : "";
}

// Đọc giỏ hàng: số dòng, số lượng của sản phẩm test
async function readCart() {
  await pressHeader(/^Giỏ \(\d+\)$/);
  const nodes = dump();
  const rows = nodes.filter((n) => n.text === PRODUCT).length;
  const qty = nodes.find((n) => n.cls.includes("EditText"));
  const money = nodes.find((n) => (n.text || "").startsWith("Thành tiền"));
  return { rows, qty: qty ? qty.text : null, money: money ? money.text : "", empty: !!find(nodes, "Giỏ hàng của bạn đang trống") };
}

async function clearCart() {
  const navCart = dump().find((n) => /^Giỏ \(\d+\)$/.test(n.text || ""));
  if (navCart && navCart.text !== "Giỏ (0)") {
    await pressHeader(/^Giỏ \(\d+\)$/);
    for (let i = 0; i < 10; i++) {
      const del = find(dump(), "Xóa");
      if (!del) break;
      tap(del);
      await sleep(800);
      await closeAlert();
    }
  }
}

// Một TC nhập số lượng: giỏ trống → chi tiết → nhập → Thêm → đọc thông báo → đọc giỏ
async function qtyCase(id, value, judge, { keepCart = false } = {}) {
  if (!keepCart) await clearCart();
  await openDetail();
  const shown = await setQty(value);
  await tapText("Thêm vào giỏ hàng");
  await sleep(500);
  const alert = await readAlert();
  const ev = shot(`${id}.png`);
  await closeAlert();
  const cart = await readCart();
  shot(`${id}_cart.png`);
  const actual = `Nhập "${value}" (ô hiển thị "${shown}") → thông báo: "${alert || "không có"}"; giỏ: ${cart.empty ? "trống" : `${cart.rows} dòng, số lượng ${cart.qty}, ${cart.money}`}`;
  R.record({ id, pass: judge(cart, alert), actual, evidence: ev });
}

const unchanged = (cart) => cart.empty;
const qtyIs = (q) => (cart) => cart.rows === 1 && cart.qty === String(q);

// Mở app trong Expo Go (URL của Metro: biến môi trường EXPO_URL, mặc định exp://<IP LAN>:8081)
const EXPO_URL = process.env.EXPO_URL || "exp://192.168.1.4:8081";
adb("shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", EXPO_URL);
for (let i = 0; i < 30 && !find(dump(), "EShop Mobile"); i++) await sleep(2000);
// Đóng menu dev của Expo nếu đang hiện
const cont = find(dump(), "Continue");
if (cont) { tap(cont); await sleep(1000); }

// ---------- Hiển thị ----------
await openDetail();
const detail = dump();
const texts = detail.filter((n) => n.cls.includes("TextView") && n.text).map((n) => n.text);
const hasImage = detail.some((n) => n.cls.includes("ImageView"));
const price = texts.find((t) => t.includes("₫")) || "";
const ev11 = shot("FR06-EP-11.png");
const hasCategory = texts.some((t) => /Phụ kiện|Danh mục/i.test(t));
const hasDesc = texts.some((t) => t.length > 15 && !t.includes("₫") && t !== PRODUCT && !t.startsWith("Số lượng"));
R.record({
  id: "FR06-EP-11",
  pass: hasImage && texts.includes(PRODUCT) && !!price && hasDesc && hasCategory,
  actual: `Ảnh: ${hasImage ? "có" : "không"}; tên: ${texts.includes(PRODUCT) ? "có" : "không"}; giá: "${price}"; mô tả: ${hasDesc ? "có" : "không"}; danh mục: ${hasCategory ? "có" : "KHÔNG có"}. Các chữ trên màn: ${texts.join(" | ")}`,
  evidence: ev11,
});
R.record({
  id: "FR06-EP-14",
  pass: /^\d{1,3}([.,]\d{3})+ ₫$/.test(price),
  actual: `Giá hiển thị "${price}"`,
  evidence: ev11,
});
const qtyField = detail.find((n) => n.cls.includes("EditText"));
R.record({ id: "FR06-EP-15", pass: null, actual: "Ô số lượng là EditText với bàn phím số (keyboardType=numeric). Script nhập bằng `adb input text` (tương đương dán), nên mọi ký tự đều đưa vào được; ký tự lọt vào ô được ghi ở các TC EP-03…08", note: "Khám phá" });

// FR06-EP-13: giá trị mặc định
await clearCart();
await openDetail();
const def = dump().find((n) => n.cls.includes("EditText"))?.text;
await tapText("Thêm vào giỏ hàng");
const a13 = await readAlert();
shot("FR06-EP-13.png");
await closeAlert();
const c13 = await readCart();
R.record({ id: "FR06-EP-13", pass: def === "1" && qtyIs(1)(c13), actual: `Mặc định "${def}"; thông báo "${a13}"; giỏ ${c13.rows} dòng, SL ${c13.qty}`, evidence: "evidence/FR06/FR06-EP-13.png" });

// FR06-EP-12: phản hồi sau khi bấm Thêm
R.record({ id: "FR06-EP-12", pass: !!a13, actual: a13 ? `Hiện hộp thoại "${a13}"` : "Không có phản hồi", evidence: "evidence/FR06/FR06-EP-13.png" });

// ---------- Nhập số lượng ----------
await qtyCase("FR06-EP-01", "3", (c, a) => qtyIs(3)(c) && !!a);
await qtyCase("FR06-EP-02", "0", unchanged);
await qtyCase("FR06-EP-03", "-2", unchanged);
await qtyCase("FR06-EP-04", "1.5", unchanged);
await qtyCase("FR06-EP-05", "abc", unchanged);
await qtyCase("FR06-EP-06", "", unchanged);
await qtyCase("FR06-EP-07", " ", unchanged);
await qtyCase("FR06-EP-08", "2abc", unchanged);
await qtyCase("FR06-EP-09", "05", qtyIs(5));
await qtyCase("FR06-BVA-02", "1", qtyIs(1));
await qtyCase("FR06-BVA-03", "2", qtyIs(2));
await qtyCase("FR06-BVA-04", "-1", unchanged);
// Biên khám phá: chỉ cần không crash và hiển thị số lượng/thành tiền hợp lý
const sane = (q) => (c) => c.rows === 1 && c.qty === q && !/NaN|e\+|Infinity/.test(c.money);
await qtyCase("FR06-BVA-05", "2147483647", sane("2147483647"));
await qtyCase("FR06-BVA-06", "2147483648", sane("2147483648"));
await qtyCase("FR06-BVA-07", "99999999999999999999", sane("99999999999999999999"));

// FR06-EP-10: cộng dồn (đã có 2, thêm 3 → 5)
await qtyCase("FR06-EP-10-prep", "2", qtyIs(2));
R.results.pop();
await qtyCase("FR06-EP-10", "3", qtyIs(5), { keepCart: true });

await clearCart();
await goHome();
R.save();
console.log("Xong FR06:", R.results.length, "test case");
