# Finley prototype

Clickable sample of Finley, a personal-finance decision dashboard. All figures are invented mock data.

The original Finley brief asked for a **single static HTML app** with no build step, so this prototype follows that instead of the pipeline's Next.js default.

## How to run

From this directory:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173). Any static server works (`npx serve`, etc.). Opening `index.html` as a file also works.

## Screens

| Route | Screen | Job |
| --- | --- | --- |
| `#today` | Today | Know where I stand |
| `#business` | Business | Understand business burn and runway |
| `#cost-to-operate` | Cost-to-operate | Know the real number per day / week / month |
| `#forecast` | Forecast | Plan forward (naive projection, not a prediction) |
| `#data-quality` | Data quality | Trust the data |

## What is interactive

- Primary nav, Business / Personal / Combined buckets
- Time range (30 / 90 / 365 days) on Today
- Forecast horizon (30 / 60 / 90 / 365) and a burn-rate slider
- Chart hover tooltips; arrow keys on line charts
- Light / dark theme and a blur-sensitive toggle
- Data quality “Re-run checks” loading state

Charts: spending vs cash, category breakdown (rolled up to 7), cash in vs out, this-month vs typical, six-month cash-floor progress, fixed vs variable, and a forecast with a confidence band and floor thresholds.

## Stack

Vanilla HTML, CSS, and JavaScript. SVG charts are custom (no chart-library dependency) so the hi-fi tokens stay in control. Type: Source Serif 4 + IBM Plex Sans.

## Known gaps

- CSV upload is labeled only; the sample set is already in memory
- No live bank connection, auth, or persistence
- Combined forecast is not a separate tab (Today and Forecast stay Business / Personal)
- Motion respects `prefers-reduced-motion`
