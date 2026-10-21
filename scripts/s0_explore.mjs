// Chụp ảnh khám phá giao diện cho bước S0 (FR-02, FR-09, FR-16).
// Cách chạy: cd scripts && node s0_explore.mjs   (Web :5173 và Admin :5174 phải đang chạy)
import { join } from "node:path";
import { api, launch, login, resetBackend, sleep, USER, ADMIN_ACC, WEB, ADMIN, REPO } from "./lib.mjs";

const ev = (fr, f) => join(REPO, "evidence", fr, f);
resetBackend();
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

// FR-02: trang đăng nhập và thông báo lỗi
await page.goto(`${WEB}/login`);
await page.locator("form input").nth(1).fill("Test1234!");
await page.screenshot({ path: ev("FR02", "S0_U1_login.png") });
await page.locator("form input").nth(0).fill(USER.email);
await page.locator("form input").nth(1).fill("Wrong123!");
await page.locator("form button[type=submit]").click();
await sleep(1000);
await page.screenshot({ path: ev("FR02", "S0_U3_login_error.png") });
resetBackend();

// FR-09: trang Checkout có ô mã giảm giá
const at = await login(ADMIN_ACC);
await api("POST", "/products", { name: "SP Test 400K", price: 400000, description: "SP test", imageUrl: "https://placehold.co/300", category_id: 3 }, at);
const pid = (await api("GET", "/products")).body.find((p) => p.name === "SP Test 400K").id;
await page.goto(`${WEB}/login`);
await page.locator("form input").nth(0).fill(USER.email);
await page.locator("form input").nth(1).fill(USER.password);
await page.locator("form button[type=submit]").click();
await page.waitForURL(`${WEB}/`);
await page.goto(`${WEB}/product/${pid}`);
const add = page.getByRole("button", { name: /Thêm vào giỏ/ });
await add.click(); await add.click();
await page.locator("header a[href='/cart']").click();
await page.getByRole("button", { name: /Tiến hành thanh toán/ }).click();
await sleep(800);
await page.screenshot({ path: ev("FR09", "S0_U2_checkout.png"), fullPage: true });

// FR-16: khu vực Import CSV ở Web Admin
await page.goto(ADMIN);
await page.getByPlaceholder("Email").fill(ADMIN_ACC.email);
await page.getByPlaceholder("Password").fill(ADMIN_ACC.password);
await page.getByRole("button", { name: "Login" }).click();
await page.getByText("Sản phẩm", { exact: true }).click();
await page.waitForSelector("input[type=file]");
await page.setInputFiles("input[type=file]", join(REPO, "test-data", "FR16", "FR16-EP-01_valid_2rows.csv"));
await sleep(600);
await page.screenshot({ path: ev("FR16", "S0_U1_import.png") });

await browser.close();
resetBackend();
console.log("Đã chụp ảnh S0");
