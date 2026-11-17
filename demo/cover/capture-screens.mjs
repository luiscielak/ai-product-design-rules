import { chromium } from "playwright";
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const APP = path.join(ROOT, "projects/finley/app");
const SHOTS = path.join(HERE, "shots");
const PORT = Number(process.env.FINLEY_PORT || 4188);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function startAppServer() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
      let rel = decodeURIComponent(url.pathname);
      if (rel === "/") rel = "/index.html";
      rel = rel.replace(/^\/+/, "");
      const file = path.normalize(path.join(APP, rel));
      if (!file.startsWith(APP + path.sep) && file !== APP) {
        res.writeHead(403);
        res.end("forbidden");
        return;
      }
      const data = await readFile(file);
      res.writeHead(200, {
        "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("not found");
    }
  });
  return new Promise((resolve) => {
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

async function ready(page) {
  await page.waitForFunction(() => document.fonts.status === "loaded" || document.fonts.status === "loading", {
    timeout: 8000,
  }).catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(400);
}

async function hoverSpend(page) {
  const loc = page.locator("#chart-spend .hit-area");
  await loc.waitFor({ state: "visible", timeout: 8000 });
  const box = await loc.boundingBox();
  if (!box) return;
  await page.mouse.move(box.x + box.width * 0.42, box.y + box.height * 0.4);
  await page.waitForTimeout(200);
}

const SHOT_LIST = [
  {
    name: "today-desktop-light",
    viewport: { width: 1440, height: 900 },
    theme: "light",
    hash: "#today",
    wait: "#chart-spend svg",
    act: hoverSpend,
  },
  {
    name: "today-desktop-dark",
    viewport: { width: 1440, height: 900 },
    theme: "dark",
    hash: "#today",
    wait: "#chart-spend svg",
    act: hoverSpend,
  },
  {
    name: "forecast-desktop-light",
    viewport: { width: 1440, height: 900 },
    theme: "light",
    hash: "#forecast",
    wait: "#chart-forecast svg",
  },
  {
    name: "forecast-desktop-dark",
    viewport: { width: 1440, height: 900 },
    theme: "dark",
    hash: "#forecast",
    wait: "#chart-forecast svg",
  },
  {
    name: "data-quality-desktop-light",
    viewport: { width: 1440, height: 900 },
    theme: "light",
    hash: "#data-quality",
    wait: "#screen-data-quality",
  },
  {
    name: "business-desktop-light",
    viewport: { width: 1440, height: 900 },
    theme: "light",
    hash: "#business",
    wait: "#chart-biz-trend svg",
  },
  {
    name: "cto-phone-light",
    viewport: { width: 390, height: 844 },
    theme: "light",
    hash: "#cost-to-operate",
    wait: "#screen-cost-to-operate",
  },
  {
    name: "cto-phone-dark",
    viewport: { width: 390, height: 844 },
    theme: "dark",
    hash: "#cost-to-operate",
    wait: "#screen-cost-to-operate",
  },
  {
    name: "forecast-phone-light",
    viewport: { width: 390, height: 844 },
    theme: "light",
    hash: "#forecast",
    wait: "#chart-forecast svg",
  },
  {
    name: "today-phone-light",
    viewport: { width: 390, height: 844 },
    theme: "light",
    hash: "#today",
    wait: "#chart-spend svg",
  },
  {
    name: "forecast-chart-light",
    viewport: { width: 1440, height: 900 },
    theme: "light",
    hash: "#forecast",
    wait: "#chart-forecast svg",
    clip: "#chart-forecast",
  },
  {
    name: "forecast-chart-dark",
    viewport: { width: 1440, height: 900 },
    theme: "dark",
    hash: "#forecast",
    wait: "#chart-forecast svg",
    clip: "#chart-forecast",
  },
];

async function main() {
  await mkdir(SHOTS, { recursive: true });
  const server = await startAppServer();
  const browser = await chromium.launch({
    channel:
      existsSync("/usr/bin/google-chrome") || existsSync("/usr/local/bin/google-chrome")
        ? "chrome"
        : undefined,
    headless: true,
    args: ["--font-render-hinting=none", "--hide-scrollbars"],
  });

  try {
    for (const shot of SHOT_LIST) {
      const page = await browser.newPage({
        viewport: shot.viewport,
        deviceScaleFactor: shot.viewport.width >= 1000 ? 2 : 3,
      });
      const q = shot.theme === "dark" ? "?theme=dark" : "";
      await page.goto(`http://127.0.0.1:${PORT}/${q}${shot.hash}`, {
        waitUntil: "load",
        timeout: 30000,
      });
      await page.waitForSelector(shot.wait, { timeout: 12000 });
      await ready(page);
      if (shot.act) await shot.act(page);
      await page.addStyleTag({
        content: ".skip{display:none !important} body{overflow:hidden}",
      });
      const dest = path.join(SHOTS, `${shot.name}.png`);
      if (shot.clip) {
        const loc = page.locator(shot.clip);
        await loc.screenshot({ path: dest, type: "png" });
      } else {
        await page.screenshot({ path: dest, type: "png" });
      }
      await page.close();
      console.log("wrote", dest);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
