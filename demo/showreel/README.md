# Finley showreel

Silent 42s product teaser of the AI Product Design pipeline, using the **Finley** sample. Two cuts:

- `out/finley-showreel-16x9.mp4` — 1920×1080, loops
- `out/finley-showreel-9x16.mp4` — 1080×1920, Reels / Stories

Not the 52s documentary on PR #3. This one is faster and spends most of its time on the upgraded prototype.

## Preview

From the repo root:

```bash
python3 -m http.server 8766 --bind 127.0.0.1
# 16:9  http://127.0.0.1:8766/demo/showreel/index.html
# 9:16  http://127.0.0.1:8766/demo/showreel/portrait.html
# freeze a time:  .../index.html?t=12
```

## Build

```bash
cd demo/showreel
npm install
npx playwright install chrome   # if channel chrome is missing
npm run record                  # live Finley clips → media/*.mp4
npm run render                  # HTML composition → both MP4s + frames
bash verify.sh
```

Requires Node 22, ffmpeg/ffprobe, Google Chrome or Playwright Chromium.

## Provenance

- Brief / PRD / lo-fi stills: README editorial PNGs
- Mid-fi / hi-fi flashes: crops of `assets/finley-04-midfi-demo.mp4` and `assets/finley-05-hifi-demo.mp4`
- Prototype clips: Playwright recordings of `projects/finley/app/` (sample data)
- QR: `https://github.com/luiscielak/ai-product-design-rules`
