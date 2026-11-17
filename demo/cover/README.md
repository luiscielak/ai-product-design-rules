# README covers

Three 2400×1200 directions, built from HTML/CSS in `src/` and rendered with Playwright. All UI in the covers is the live Finley sample prototype (or the real stage artifacts behind it). Sample data only.

| Direction | Cover PNGs | Idea |
|---|---|---|
| **A — Editorial** (in the README) | `out/a-editorial-light.png`, `out/a-editorial-dark.png` | Headline + one-line value, then desktop Today + phone Forecast |
| **B — Pipeline** | `out/b-pipeline-light.png`, `out/b-pipeline-dark.png` | Six-stage strip ending on the live prototype |
| **C — Typographic** | `out/c-typographic-light.png`, `out/c-typographic-dark.png` | Large type over a tight crop of the Forecast chart |

GitHub-like README screenshots (desktop / mobile, light / dark) live in `out/readme/`.

## Rebuild

From `demo/cover/`:

```bash
npm install
npm run build
```

- `npm run capture` screenshots the Finley prototype into `shots/`
- `npm run render` writes the cover PNGs and README previews
- Covers are 2400×1200. Fonts come from `demo/showreel/fonts/`

## Swap the README cover

The repo README uses direction A via `<picture>` (`prefers-color-scheme`). To try B or C, point `srcset` / `src` at the matching files in `out/` and keep `width="1280" height="640"`.
