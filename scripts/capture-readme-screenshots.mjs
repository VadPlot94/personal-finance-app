import { chromium } from "@playwright/test";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = path.resolve("public/screenshots");
const email = process.env.AUTH_EMAIL;
const password = process.env.AUTH_PASSWORD;

if (!email || !password) {
  console.error("AUTH_EMAIL / AUTH_PASSWORD missing");
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

async function hideChrome(page) {
  await page.addStyleTag({
    content: `
      nextjs-portal, [data-nextjs-toast], [data-next-badge-root] { display: none !important; }
    `,
  });
  await page.evaluate(() => {
    document.querySelectorAll("button").forEach((btn) => {
      const text = (btn.textContent || "").trim().toLowerCase();
      if (text.includes("trigger")) {
        btn.style.setProperty("display", "none", "important");
      }
    });
  });
}

async function shot(page, name) {
  await hideChrome(page);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage: false,
  });
  console.log("saved", name);
}

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  if (page.url().includes("/overview")) return;
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/overview/, { timeout: 30_000 });
}

async function ensureLoginPage(context, page) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  if (page.url().includes("/login")) return;
  await context.clearCookies();
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
}

const desktopPages = [
  ["overview", "/overview"],
  ["budgets", "/budgets"],
  ["transactions", "/transactions"],
  ["pots", "/pots"],
  ["recurring", "/recurring"],
];

const mobilePages = [
  ["overview", "/overview"],
  ["budgets", "/budgets"],
  ["transactions", "/transactions"],
  ["pots", "/pots"],
  ["recurring", "/recurring"],
];

const browser = await chromium.launch({ headless: true });

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const dPage = await desktop.newPage();

// Landing `/` — capture while logged out
await ensureLoginPage(desktop, dPage);
await dPage.goto(`${BASE}/`, { waitUntil: "networkidle" });
await shot(dPage, "desktop-landing");

await login(dPage);
for (const [name, route] of desktopPages) {
  await dPage.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await shot(dPage, `desktop-${name}`);
}

// Overview with expanded left menu
await dPage.goto(`${BASE}/overview`, { waitUntil: "networkidle" });
await hideChrome(dPage);
const maximize = dPage.getByRole("button", { name: /maximize menu/i });
if (await maximize.isVisible().catch(() => false)) {
  await maximize.click();
  await dPage.getByRole("button", { name: /minimize menu/i }).waitFor({
    timeout: 5_000,
  });
  await dPage.waitForTimeout(700);
}
await shot(dPage, "desktop-overview-menu-open");

await ensureLoginPage(desktop, dPage);
await shot(dPage, "desktop-login");
await desktop.close();

const tablet = await browser.newContext({
  viewport: { width: 768, height: 1024 },
  deviceScaleFactor: 1,
});
const tPage = await tablet.newPage();
await login(tPage);
await shot(tPage, "tablet-overview");
await hideChrome(tPage);
const tabletMaximize = tPage.getByRole("button", { name: /maximize menu/i });
if (await tabletMaximize.isVisible().catch(() => false)) {
  await tabletMaximize.click();
  await tPage.getByRole("button", { name: /minimize menu/i }).waitFor({
    timeout: 5_000,
  });
  await tPage.waitForTimeout(700);
}
await shot(tPage, "tablet-overview-menu-open");
await tablet.close();

// Intermediate sm–md: horizontal bottom nav with visible labels
const sm = await browser.newContext({
  viewport: { width: 700, height: 900 },
  deviceScaleFactor: 1,
});
const smPage = await sm.newPage();
await login(smPage);
await smPage.goto(`${BASE}/overview`, { waitUntil: "networkidle" });
await shot(smPage, "sm-overview-nav-labels");
await smPage.goto(`${BASE}/transactions`, { waitUntil: "networkidle" });
await shot(smPage, "sm-transactions-nav-labels");
await sm.close();

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const mPage = await mobile.newPage();
await login(mPage);
for (const [name, route] of mobilePages) {
  await mPage.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  await shot(mPage, `mobile-${name}`);
}
await mobile.close();

await browser.close();
console.log("done");
