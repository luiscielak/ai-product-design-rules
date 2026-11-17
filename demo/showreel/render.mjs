import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(HERE, "out");
const PORT = Number(process.env.PORT || 8772);
const DURATION = 42;
const FPS = 30;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} -> ${code}`));
    });
  });
}

const CUTS = [
  {
    id: "16x9",
    html: "index.html",
    viewport: { width: 1920, height: 1080 },
    mp4: "finley-showreel-16x9.mp4",
    poster: "poster-16x9.jpg",
    posterT: 12.4,
    frames: [
      { t: 0.0, name: "16x9-00-open" },
      { t: 2.6, name: "16x9-01-hook" },
      { t: 4.1, name: "16x9-02-brief" },
      { t: 5.1, name: "16x9-03-prd" },
      { t: 6.1, name: "16x9-04-lofi" },
      { t: 7.2, name: "16x9-05-midfi" },
      { t: 8.5, name: "16x9-06-hifi" },
      { t: 12.4, name: "16x9-07-today-hover" },
      { t: 19.6, name: "16x9-08-range" },
      { t: 25.4, name: "16x9-09-forecast" },
      { t: 32.0, name: "16x9-10-mobile" },
      { t: 38.2, name: "16x9-11-endcard" },
      { t: 41.85, name: "16x9-12-loop-end" },
    ],
  },
  {
    id: "9x16",
    html: "portrait.html",
    viewport: { width: 1080, height: 1920 },
    mp4: "finley-showreel-9x16.mp4",
    poster: "poster-9x16.jpg",
    posterT: 31.2,
    frames: [
      { t: 0.0, name: "9x16-00-open" },
      { t: 2.6, name: "9x16-01-hook" },
      { t: 12.4, name: "9x16-02-today" },
      { t: 25.4, name: "9x16-03-forecast" },
      { t: 32.0, name: "9x16-04-mobile" },
      { t: 38.2, name: "9x16-05-endcard" },
    ],
  },
];

async function renderCut(browser, cut) {
  const seqDir = path.join(OUT, ".tmp", cut.id);
  await mkdir(seqDir, { recursive: true });
  await mkdir(path.join(OUT, "frames"), { recursive: true });

  const page = await browser.newPage({
    viewport: cut.viewport,
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (err) => console.error(`[${cut.id}]`, err));
  const url = `http://127.0.0.1:${PORT}/demo/showreel/${cut.html}?pause=1`;
  await page.goto(url, { waitUntil: "load", timeout: 45000 });
  await page.waitForFunction(() => window.showreel && window.ready === true, { timeout: 60000 });
  await page.evaluate(async () => window.showreel.seek(0, { hard: true }));
  await page.waitForTimeout(250);

  const total = DURATION * FPS;
  const pad = (n) => String(n).padStart(5, "0");
  for (let i = 0; i < total; i++) {
    const t = i / FPS;
    await page.evaluate(async (t) => window.showreel.seek(t, { hard: true }), t);
    if (i % 30 === 0) console.log(`[${cut.id}] frame ${i}/${total} t=${t.toFixed(2)}`);
    await page.screenshot({
      path: path.join(seqDir, `${pad(i)}.jpg`),
      type: "jpeg",
      quality: 86,
    });
  }

  for (const frame of cut.frames) {
    await page.evaluate(async (t) => window.showreel.seek(t, { hard: true }), frame.t);
    await page.waitForTimeout(60);
    await page.screenshot({
      path: path.join(OUT, "frames", `${frame.name}.png`),
      type: "png",
    });
  }

  await page.evaluate(async (t) => window.showreel.seek(t, { hard: true }), cut.posterT);
  await page.waitForTimeout(60);
  await page.screenshot({
    path: path.join(OUT, cut.poster),
    type: "jpeg",
    quality: 90,
  });

  await page.close();

  const mp4 = path.join(OUT, cut.mp4);
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
  console.log(`wrote ${mp4}`);
}

async function gifFrom16x9() {
  const mp4 = path.join(OUT, "finley-showreel-16x9.mp4");
  const gif = path.join(OUT, "finley-showreel-teaser.gif");
  const palette = path.join(OUT, ".tmp", "palette.png");
  await run("ffmpeg", [
    "-y",
    "-ss",
    "10.2",
    "-t",
    "6.5",
    "-i",
    mp4,
    "-vf",
    "fps=12,scale=720:-1:flags=lanczos,palettegen=stats_mode=diff",
    palette,
  ]);
  await run("ffmpeg", [
    "-y",
    "-ss",
    "10.2",
    "-t",
    "6.5",
    "-i",
    mp4,
    "-i",
    palette,
    "-lavfi",
    "fps=12,scale=720:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5",
    "-loop",
    "0",
    gif,
  ]);
  console.log(`wrote ${gif}`);
}

async function main() {
  await mkdir(path.join(OUT, ".tmp"), { recursive: true });
  const py = spawn("python3", ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"], {
    cwd: ROOT,
    stdio: "inherit",
  });
  await new Promise((r) => setTimeout(r, 500));

  const browser = await chromium.launch({
    channel: existsSync("/usr/bin/google-chrome") || existsSync("/usr/local/bin/google-chrome")
      ? "chrome"
      : undefined,
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required", "--font-render-hinting=none"],
  });

  try {
    const only = process.argv[2];
    const cuts = only ? CUTS.filter((c) => c.id === only) : CUTS;
    if (!cuts.length) throw new Error(`unknown cut ${only}`);
    for (const cut of cuts) {
      await renderCut(browser, cut);
    }
    if (!only || only === "16x9") await gifFrom16x9();
  } finally {
    await browser.close();
    py.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
