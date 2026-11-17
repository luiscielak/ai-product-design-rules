# README covers

Three 2400×1200 directions, built from HTML/CSS in `src/` and rendered with Playwright. All UI in the covers is the live Finley sample prototype (or the real stage artifacts behind it). Sample data only.

| Direction | Cover PNGs | In the README |
|---|---|---|
| **A — Editorial** | `out/a-editorial-light.png`, `out/a-editorial-dark.png` | Hero at the top |
| **B — Pipeline** | `out/b-pipeline-light.png`, `out/b-pipeline-dark.png` | `## The path` (six-stage workflow) |
| **C — Typographic** | `out/c-typographic-light.png`, `out/c-typographic-dark.png` | Not used (kept here as an unused alternate) |

GitHub-like README screenshots (desktop / mobile, light / dark) live in `out/readme/`.

Do not set a `height` attribute on README `<img>` tags. The GitHub iOS app scales width to the screen and keeps a fixed height, which squeezes 2:1 covers. Use `width="100%"` (or width only) and let height come from the file.

## Rebuild

From `demo/cover/`:

```bash
npm install
npm run build
```

- `npm run capture` screenshots the Finley prototype into `shots/`
- `npm run render` writes the cover PNGs and README previews
- Covers are 2400×1200. Fonts come from `demo/showreel/fonts/`
