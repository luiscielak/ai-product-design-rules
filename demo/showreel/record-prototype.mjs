import { chromium } from "playwright";
import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const APP = path.join(ROOT, "projects/finley/app");
const MEDIA = path.join(HERE, "media");
const RAW = path.join(MEDIA, "raw");
const PORT = Number(process.env.FINLEY_PORT || 4177);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} -> ${code}`));
    });
  });
}

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

async function wait(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function hoverChart(page, sel, seconds) {
  const loc = page.locator(`${sel} .hit-area`);
  await loc.waitFor({ state: "visible", timeout: 8000 });
  const box = await loc.boundingBox();
  if (!box) return;
  const y = box.y + box.height * 0.42;
  const frames = Math.max(12, Math.round(seconds * 24));
  for (let i = 0; i <= frames; i++) {
    const t = i / frames;
    const x = box.x + box.width * (0.1 + 0.8 * t);
    await page.mouse.move(x, y);
    await wait(1000 / 24);
  }
}

async function animateSlider(page, from, to, ms) {
  const steps = Math.max(8, Math.round(ms / 50));
  for (let i = 0; i <= steps; i++) {
    const v = from + (to - from) * (i / steps);
    await page.locator("#burn-slider").evaluate((el, val) => {
      el.value = String(Math.round(val));
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }, v);
    await wait(ms / steps);
  }
}

async function toMp4(src, dest, size) {
  const args = [
    "-y",
    "-i",
    src,
    "-an",
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-preset",
    "fast",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
  ];
  if (size) args.push("-vf", `scale=${size.width}:${size.height}`);
  args.push(dest);
  await run("ffmpeg", args);
}

async function recordClip(browser, { name, viewport, hash, act }) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    recordVideo: { dir: RAW, size: viewport },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  await page.goto(`http://127.0.0.1:${PORT}/${hash}`, { waitUntil: "load", timeout: 20000 });
  await page.waitForTimeout(700);
  await act(page);
  const video = page.video();
  await context.close();
  const src = await video.path();
  const dest = path.join(MEDIA, `${name}.mp4`);
  await toMp4(src, dest, viewport);
  console.log(`wrote ${dest}`);
  return dest;
}

async function flashClips() {
  await run("ffmpeg", [
    "-y",
    "-ss",
    "14",
    "-i",
    path.join(ROOT, "assets/finley-04-midfi-demo.mp4"),
    "-t",
    "2.8",
    "-an",
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-preset",
    "fast",
    "-pix_fmt",
    "yuv420p",
    path.join(MEDIA, "midfi-flash.mp4"),
  ]);
  await run("ffmpeg", [
    "-y",
    "-ss",
    "18",
    "-i",
    path.join(ROOT, "assets/finley-05-hifi-demo.mp4"),
    "-t",
    "2.8",
    "-an",
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-preset",
    "fast",
    "-pix_fmt",
    "yuv420p",
    path.join(MEDIA, "hifi-flash.mp4"),
  ]);
  console.log("wrote mid-fi / hi-fi flashes");
}

async function main() {
  await mkdir(RAW, { recursive: true });
  const server = await startAppServer();
  const browser = await chromium.launch({
    channel: existsSync("/usr/bin/google-chrome") || existsSync("/usr/local/bin/google-chrome")
      ? "chrome"
      : undefined,
    headless: true,
    args: ["--font-render-hinting=none", "--autoplay-policy=no-user-gesture-required"],
  });

  try {
    await recordClip(browser, {
      name: "today",
      viewport: { width: 1600, height: 900 },
      hash: "#today",
      act: async (page) => {
        await page.waitForSelector("#chart-spend svg", { timeout: 8000 });
        await wait(900);
        await hoverChart(page, "#chart-spend", 5.2);
        await wait(400);
        await page.click('[data-range="365d"]');
        await wait(1800);
        await page.click('[data-range="30d"]');
        await wait(1400);
        await page.click('[data-range="90d"]');
        await wait(1200);
      },
    });

    await recordClip(browser, {
      name: "forecast",
      viewport: { width: 1600, height: 900 },
      hash: "#forecast",
      act: async (page) => {
        await page.waitForSelector("#chart-forecast svg", { timeout: 8000 });
        await wait(800);
        await animateSlider(page, 100, 68, 1600);
        await wait(900);
        await animateSlider(page, 68, 138, 1800);
        await wait(800);
        await page.click('[data-horizon="365"]');
        await wait(1400);
      },
    });

    await recordClip(browser, {
      name: "today-tall",
      viewport: { width: 1080, height: 1920 },
      hash: "#today",
      act: async (page) => {
        await page.waitForSelector("#chart-spend svg", { timeout: 8000 });
        await wait(900);
        await hoverChart(page, "#chart-spend", 5.2);
        await wait(400);
        await page.click('[data-range="365d"]');
        await wait(1800);
        await page.click('[data-range="30d"]');
        await wait(1400);
        await page.click('[data-range="90d"]');
        await wait(1200);
      },
    });

    await recordClip(browser, {
      name: "forecast-tall",
      viewport: { width: 1080, height: 1920 },
      hash: "#forecast",
      act: async (page) => {
        await page.waitForSelector("#chart-forecast svg", { timeout: 8000 });
        await wait(800);
        await animateSlider(page, 100, 68, 1600);
        await wait(900);
        await animateSlider(page, 68, 138, 1800);
        await wait(800);
        await page.click('[data-horizon="365"]');
        await wait(1400);
      },
    });

    await recordClip(browser, {
      name: "mobile",
      viewport: { width: 390, height: 844 },
      hash: "#today",
      act: async (page) => {
        await page.waitForSelector("#chart-spend svg", { timeout: 8000 });
        await wait(700);
        await hoverChart(page, "#chart-spend", 3.4);
        await wait(300);
        await page.click('[data-range="365d"]');
        await wait(1100);
        await page.click('[data-range="90d"]');
        await wait(800);
        await page.click('[data-screen="forecast"]');
        await page.waitForSelector("#chart-forecast svg", { timeout: 8000 });
        await wait(500);
        await animateSlider(page, 100, 72, 1400);
        await wait(600);
        await animateSlider(page, 72, 125, 1200);
        await wait(500);
        await page.click('[data-screen="cost-to-operate"]');
        await wait(700);
        await page.click('[data-bucket="combined"]');
        await wait(900);
        await page.mouse.wheel(0, 420);
        await wait(1100);
      },
    });

    await flashClips();
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
