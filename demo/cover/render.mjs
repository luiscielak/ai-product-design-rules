import { chromium } from "playwright";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const OUT = path.join(HERE, "out");
const PORT = Number(process.env.COVER_PORT || 8791);
const previewOnly = process.argv.includes("--preview-only");
const coversOnly = process.argv.includes("--covers-only");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".md": "text/markdown; charset=utf-8",
};

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
      let rel = decodeURIComponent(url.pathname);
      if (rel.endsWith("/")) rel += "index.html";
      rel = rel.replace(/^\/+/, "");
      const file = path.normalize(path.join(ROOT, rel));
      if (!file.startsWith(ROOT + path.sep) && file !== ROOT) {
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

const COVERS = [
  { id: "a-editorial-light", html: "demo/cover/src/a-editorial.html", theme: "light" },
  { id: "a-editorial-dark", html: "demo/cover/src/a-editorial.html", theme: "dark" },
  { id: "b-pipeline-light", html: "demo/cover/src/b-pipeline.html", theme: "light" },
  { id: "b-pipeline-dark", html: "demo/cover/src/b-pipeline.html", theme: "dark" },
  { id: "c-typographic-dark", html: "demo/cover/src/c-typographic.html", theme: "dark" },
  { id: "c-typographic-light", html: "demo/cover/src/c-typographic.html", theme: "light" },
];

async function waitFonts(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.addEventListener("load", res, { once: true });
              img.addEventListener("error", res, { once: true });
            })
      )
    );
  });
  await page.waitForTimeout(400);
}

async function renderCovers(browser) {
  await mkdir(OUT, { recursive: true });
  for (const cover of COVERS) {
    const page = await browser.newPage({
      viewport: { width: 2400, height: 1200 },
      deviceScaleFactor: 1,
    });
    const q = cover.theme ? `?theme=${cover.theme}` : "";
    await page.goto(`http://127.0.0.1:${PORT}/${cover.html}${q}`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await waitFonts(page);
    await page.locator(".artboard").waitFor();
    const dest = path.join(OUT, `${cover.id}.png`);
    await page.screenshot({ path: dest, type: "png" });
    await page.close();
    console.log("cover", dest);
  }
}

async function renderPreviews(browser) {
  const destDir = path.join(OUT, "readme");
  await mkdir(destDir, { recursive: true });
  for (const name of await readdir(destDir)) {
    if (name.endsWith(".png")) await unlink(path.join(destDir, name));
  }
  const themes = ["light", "dark"];
  const widths = [
    { id: "desktop", viewport: { width: 1280, height: 900 }, dsf: 2 },
    { id: "mobile", viewport: { width: 390, height: 844 }, dsf: 3 },
  ];
  for (const theme of themes) {
    for (const w of widths) {
      const page = await browser.newPage({
        viewport: w.viewport,
        deviceScaleFactor: w.dsf,
      });
      await page.emulateMedia({ colorScheme: theme });
      const q = `?theme=${theme}&frame=${w.id}`;
      await page.goto(`http://127.0.0.1:${PORT}/demo/cover/src/readme-preview.html${q}`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      await waitFonts(page);
      if (w.id === "mobile") {
        const boxes = await page.$$eval(".md img", (imgs) =>
          imgs.slice(0, 2).map((img) => {
            const r = img.getBoundingClientRect();
            return { w: r.width, h: r.height, ratio: r.width / r.height };
          })
        );
        for (const box of boxes) {
          if (Math.abs(box.ratio - 2) > 0.04) {
            throw new Error(
              `cover aspect ${box.ratio.toFixed(3)} (expected ~2:1) at ${box.w.toFixed(1)}x${box.h.toFixed(1)} ${theme}`
            );
          }
          console.log(
            `ok ${theme} ${box.w.toFixed(1)}x${box.h.toFixed(1)} ratio ${box.ratio.toFixed(3)}`
          );
        }
      }
      const dest = path.join(destDir, `${w.id}-${theme}.png`);
      await page.screenshot({ path: dest, type: "png", fullPage: true });
      await page.close();
      console.log("preview", dest);
    }
  }
}

async function writeSwapNotes() {
  const md = `# README covers

Three 2400×1200 directions, built from HTML/CSS in \`src/\` and rendered with Playwright. All UI in the covers is the live Finley sample prototype (or the real stage artifacts behind it). Sample data only.

| Direction | Cover PNGs | In the README |
|---|---|---|
| **A — Editorial** | \`out/a-editorial-light.png\`, \`out/a-editorial-dark.png\` | Hero at the top |
| **B — Pipeline** | \`out/b-pipeline-light.png\`, \`out/b-pipeline-dark.png\` | \`## The path\` (six-stage workflow) |
| **C — Typographic** | \`out/c-typographic-light.png\`, \`out/c-typographic-dark.png\` | Not used (kept here as an unused alternate) |

GitHub-like README screenshots (desktop / mobile, light / dark) live in \`out/readme/\`.

Do not set a \`height\` attribute on README \`<img>\` tags. The GitHub iOS app scales width to the screen and keeps a fixed height, which squeezes 2:1 covers. Use \`width="100%"\` (or width only) and let height come from the file.

## Rebuild

From \`demo/cover/\`:

\`\`\`bash
npm install
npm run build
\`\`\`

- \`npm run capture\` screenshots the Finley prototype into \`shots/\`
- \`npm run render\` writes the cover PNGs and README previews
- Covers are 2400×1200. Fonts come from \`demo/showreel/fonts/\`
`;
  await writeFile(path.join(HERE, "README.md"), md);
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({
    channel:
      existsSync("/usr/bin/google-chrome") || existsSync("/usr/local/bin/google-chrome")
        ? "chrome"
        : undefined,
    headless: true,
    args: ["--font-render-hinting=none", "--hide-scrollbars"],
  });
  try {
    if (!previewOnly) await renderCovers(browser);
    if (!coversOnly) await renderPreviews(browser);
    await writeSwapNotes();
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
