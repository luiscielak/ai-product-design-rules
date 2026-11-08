# Looping explainer (draft)

Silent 16:9 motion-graphics loop of the AI Product Design Rules, using the **Finley** README example. Preview in a browser or render to MP4.

```
demo/explainer/          source
  index.html             1920×1080 composition
  player.js              52.0s timeline (seekable)
  styles.css
  render.mjs             Playwright capture → H.264
  storyboard.md
  inventory.md
out/brief-to-prototype-loop.mp4
out/frames/              representative stills
```

## Preview

From the repo root:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/demo/explainer/index.html
# freeze a time:  .../index.html?t=16
```

## Render

```bash
cd demo/explainer
npm install
npx playwright install chrome   # if channel chrome is missing
npm run render
bash verify.sh
```

Requires: Node 22, ffmpeg/ffprobe, Google Chrome or Playwright Chromium.

`render.mjs` serves the repo root, records one pass, trims to 52s, writes `out/brief-to-prototype-loop.mp4` (silent yuv420p) and PNG frames.

## What this is not

Not a cinematic generated video. Not a live run of the six commands. Not Design Ops Cockpit. Captions and stills come from published Finley evidence; `/new-project` is typeset from the rules and labeled as such.
