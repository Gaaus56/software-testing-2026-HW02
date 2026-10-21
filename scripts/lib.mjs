// Thư viện dùng chung cho các script thực thi test case HW02.
// - api(): gọi Backend API, trả về { status, body }
// - resetBackend(): khởi động lại backend (DB được seed lại)
// - Runner: ghi kết quả từng test case ra scripts/results/<FR>.json
// - apiShot(): chụp ảnh request/response (minh chứng cho test ở tầng API)
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = join(HERE, "..");
export const API = "http://localhost:3000/api";
export const WEB = "http://localhost:5173";
export const ADMIN = "http://localhost:5174";

export const USER = { email: "test@eshop.com", password: "Test1234!" };
export const ADMIN_ACC = { email: "admin@eshop.com", password: "Admin123!" };

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Khởi động lại backend (DB được seed lại). Tắt tiến trình node server.js đang giữ cổng 3000,
// rồi chạy lại server tách rời khỏi script này.
const BACKEND_DIR = join(REPO, "..", "eshop-sut", "backend");
export function resetBackend() {
  execFileSync("powershell", ["-NoProfile", "-Command",
    "Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { $p = Get-CimInstance Win32_Process -Filter \"ProcessId=$($_.OwningProcess)\"; if ($p.CommandLine -like '*server.js*') { Stop-Process -Id $_.OwningProcess -Force } }"],
    { stdio: "ignore" });
  const child = spawn("node", ["server.js"], { cwd: BACKEND_DIR, detached: true, stdio: "ignore", windowsHide: true });
  child.unref();
  for (let i = 0; i < 50; i++) {
    execFileSync("powershell", ["-NoProfile", "-Command", "Start-Sleep -Milliseconds 200"], { stdio: "ignore" });
    try {
      execFileSync("curl.exe", ["-s", "-f", "-o", "NUL", "http://localhost:3000/api/products"], { stdio: "ignore" });
      return;
    } catch {}
  }
  throw new Error("Backend không khởi động được");
}

export async function api(method, path, body, token, extraHeaders = {}) {
  const headers = { "Content-Type": "application/json", ...extraHeaders };
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  // Thử lại khi kết nối keep-alive cũ bị đóng do backend vừa khởi động lại
  for (let attempt = 0; ; attempt++) {
    try {
      res = await fetch(API + path, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      break;
    } catch (e) {
      if (attempt >= 3) throw e;
      await sleep(300);
    }
  }
  const text = await res.text();
  let parsed;
  try { parsed = JSON.parse(text); } catch { parsed = text; }
  return { status: res.status, body: parsed };
}

export async function login(acc) {
  const r = await api("POST", "/login", acc);
  if (r.status !== 200) throw new Error(`Login ${acc.email} thất bại: ${JSON.stringify(r.body)}`);
  return r.body.token;
}

export async function launch() {
  return chromium.launch({ channel: "msedge", headless: true });
}

export class Runner {
  constructor(fr) {
    this.fr = fr;
    this.results = [];
    this.evidenceDir = join(REPO, "evidence", fr);
    mkdirSync(this.evidenceDir, { recursive: true });
  }

  // status: "Pass" | "Fail" | "Blocked"
  record({ id, actual, pass, evidence = "", note = "" }) {
    const status = pass === null ? "Blocked" : pass ? "Pass" : "Fail";
    this.results.push({ id, status, actual, evidence, note, time: new Date().toISOString() });
    console.log(`${status.padEnd(7)} ${id}  ${actual}`);
  }

  save() {
    mkdirSync(join(REPO, "scripts", "results"), { recursive: true });
    writeFileSync(
      join(REPO, "scripts", "results", `${this.fr}.json`),
      JSON.stringify(this.results, null, 2),
      "utf8",
    );
  }

  shotPath(name) {
    return join(this.evidenceDir, name);
  }

  // Ảnh minh chứng cho test case ở tầng API: hiện request và response.
  async apiShot(page, file, title, request, response) {
    const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
    const html = `<!doctype html><meta charset="utf-8"><body style="font:14px Consolas,monospace;background:#1e1e1e;color:#ddd;padding:16px;width:900px">
<div style="color:#9cdcfe;font:bold 16px Segoe UI">${esc(title)}</div>
<div style="color:#888;margin:4px 0 12px">${esc(new Date().toLocaleString("vi-VN"))} · EShop API http://localhost:3000</div>
<div style="color:#ce9178">REQUEST</div><pre style="white-space:pre-wrap;background:#252526;padding:8px">${esc(request)}</pre>
<div style="color:#ce9178">RESPONSE</div><pre style="white-space:pre-wrap;background:#252526;padding:8px">${esc(response)}</pre></body>`;
    await page.setContent(html);
    await page.setViewportSize({ width: 940, height: 200 });
    await page.screenshot({ path: this.shotPath(file), fullPage: true });
    return `evidence/${this.fr}/${file}`;
  }
}

export const fmt = (r) => `${r.status} ${typeof r.body === "string" ? r.body : JSON.stringify(r.body)}`;
