import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(HERE, "out");
const PORT = Number(process.env.PORT || 8771);
const DURATION = 52;
const FPS = 30;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function contentType(file) {
  return TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
}

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
      let rel = decodeURIComponent(url.pathname);
      if (rel === "/") rel = "/demo/explainer/index.html";
      rel = rel.replace(/^\/+/, "");
      const file = path.normalize(path.join(ROOT, rel));
      if (!file.startsWith(ROOT + path.sep) && file !== ROOT) {
        res.writeHead(403);
        res.end("forbidden");
        return;
      }
      const data = await readFile(file);
      res.writeHead(200, {
        "Content-Type": contentType(file),
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

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} -> ${code}`));
    });
  });
}

const KEY_FRAMES = [
  { t: 0.0, name: "00-open" },
  { t: 6.5, name: "01-brief" },
  { t: 11.0, name: "02-new-project" },
  { t: 16.0, name: "03-prd" },
  { t: 21.0, name: "04-lofi" },
  { t: 27.0, name: "05-midfi" },
  { t: 34.5, name: "06-hifi" },
  { t: 41.5, name: "07-prototype" },
  { t: 47.5, name: "08-result-qr" },
  { t: 51.95, name: "09-loop-end" },
];

async function main() {
  await mkdir(path.join(OUT, "frames"), { recursive: true });
  const seqDir = path.join(OUT, ".tmp", "seq");
  await mkdir(seqDir, { recursive: true });

  const py = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  await new Promise((r) => setTimeout(r, 400));
  const url = `http://127.0.0.1:${PORT}/demo/explainer/index.html`;

  const browser = await chromium.launch({
    channel: existsSync("/usr/local/bin/google-chrome") ? "chrome" : undefined,
    headless: true,
    args: [
      "--autoplay-policy=no-user-gesture-required",
      "--font-render-hinting=none",
    ],
  });

  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (err) => console.error("pageerror", err));
  await page.goto(`${url}?pause=1`, { waitUntil: "load", timeout: 30000 });
  await page.waitForFunction(() => window.explainer && window.ready === true, { timeout: 45000 });
  await page.evaluate(() => window.explainer.seek(0, { hard: true }));
  await page.waitForTimeout(200);

  const total = DURATION * FPS;
  const pad = (n) => String(n).padStart(5, "0");
  for (let i = 0; i < total; i++) {
    const t = i / FPS;
    await page.evaluate((t) => window.explainer.seek(t, { hard: true }), t);
    if (i % 30 === 0) console.log(`frame ${i}/${total} t=${t.toFixed(2)}`);
    await page.screenshot({
      path: path.join(seqDir, `${pad(i)}.jpg`),
      type: "jpeg",
      quality: 88,
    });
  }

  // Representative PNG stills from the live composition.
  for (const frame of KEY_FRAMES) {
    await page.evaluate((t) => window.explainer.seek(t, { hard: true }), frame.t);
    await page.waitForTimeout(80);
    await page.screenshot({
      path: path.join(OUT, "frames", `${frame.name}.png`),
      type: "png",
    });
  }

  await browser.close();

  const mp4 = path.join(OUT, "brief-to-prototype-loop.mp4");
  await run("ffmpeg", [
    "-y",
    "-framerate",
    String(FPS),
    "-i",
    path.join(seqDir, "%05d.jpg"),
    "-an",
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-preset",
    "medium",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-t",
    String(DURATION),
    mp4,
  ]);

  py.kill("SIGTERM");
  console.log(`Wrote ${mp4}`);
  console.log(`Frames ${total} @ ${FPS}fps = ${DURATION}s`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
