/** Timeline for the silent 42s Finley showreel. */

export const DURATION = 42;
/** Last seconds hold t=0 so the 16:9 file loops without a snap. */
export const LOOP_HOLD = 1.8;

export const STEPS = [
  { id: "brief", label: "Brief" },
  { id: "prd", label: "PRD" },
  { id: "lofi", label: "Lo-fi" },
  { id: "midfi", label: "Mid-fi" },
  { id: "hifi", label: "Hi-fi" },
  { id: "proto", label: "Prototype" },
];

/**
 * Scene windows. Adjacent scenes overlap ~0.25s for a snappy crossfade.
 * `step` indexes STEPS, or -1 for open/end.
 */
export const SCENES = [
  { id: "open", t0: 0.0, t1: 3.9, step: -1, kicker: "AI product design", name: "", caption: "", sample: "" },
  { id: "brief", t0: 3.55, t1: 4.75, step: 0, kicker: "Stage 1", name: "Brief", caption: "One page. The decisions the product has to answer.", sample: "" },
  { id: "prd", t0: 4.5, t1: 5.7, step: 1, kicker: "Stage 2", name: "PRD", caption: "Requirements a reviewer can reject.", sample: "" },
  { id: "lofi", t0: 5.45, t1: 6.7, step: 2, kicker: "Stage 3", name: "Lo-fi", caption: "One question per screen.", sample: "" },
  { id: "midfi", t0: 6.45, t1: 7.9, step: 3, kicker: "Stage 4", name: "Mid-fi", caption: "Tokens, components, states.", sample: "" },
  { id: "hifi", t0: 7.65, t1: 9.3, step: 4, kicker: "Stage 5", name: "Hi-fi", caption: "Color roles. A component gallery.", sample: "" },
  { id: "proto-today", t0: 9.05, t1: 18.3, step: 5, kicker: "Stage 6 · live", name: "Prototype", caption: "Hover a point. The chart answers back.", sample: "Finley · sample data" },
  { id: "proto-range", t0: 17.95, t1: 23.5, step: 5, kicker: "Stage 6 · live", name: "Prototype", caption: "30 / 90 / 365 days. Same mock ledger.", sample: "Finley · sample data" },
  { id: "proto-forecast", t0: 23.15, t1: 29.0, step: 5, kicker: "Stage 6 · live", name: "Prototype", caption: "Drag burn. Watch runway move.", sample: "Finley · sample data" },
  { id: "proto-mobile", t0: 28.65, t1: 36.5, step: 5, kicker: "Stage 6 · live", name: "Prototype", caption: "Same prototype. On a phone.", sample: "Finley · sample data" },
  { id: "end", t0: 36.1, t1: 40.2, step: -1, kicker: "AI product design", name: "", caption: "", sample: "" },
];

const FADE = 0.28;
const HOLD_START = DURATION - LOOP_HOLD; // 40.2
const OPEN_RETURN = HOLD_START - 0.8; // 39.4

function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}

function range(t, a, b) {
  if (b === a) return t >= a ? 1 : 0;
  return clamp((t - a) / (b - a), 0, 1);
}

export function sceneOpacity(scene, t) {
  if (scene.id === "open" && t >= OPEN_RETURN && t < HOLD_START) {
    return range(t, OPEN_RETURN, HOLD_START);
  }
  if (t < scene.t0 || t > scene.t1) return 0;
  const fadeIn = scene.t0 <= 0 ? 1 : range(t, scene.t0, scene.t0 + FADE);
  const fadeOut = 1 - range(t, scene.t1 - FADE, scene.t1);
  return Math.min(fadeIn, fadeOut);
}

export function kenScale(scene, t) {
  if (document.documentElement.classList.contains("portrait")) return 1;
  if (scene.id === "open" || scene.id === "end") return 1;
  const u = range(t, scene.t0, scene.t1);
  return 1 + 0.035 * u;
}

function $(sel) {
  return document.querySelector(sel);
}

function $all(sel) {
  return Array.from(document.querySelectorAll(sel));
}

function beatOpacity(vis) {
  // Three beats, then they clear as the pipeline flash starts.
  // During loop hold vis=0, so beat 0 is on — matches t=0.
  return [
    (1 - range(vis, 1.05, 1.25)) * (vis < 3.55 ? 1 : 1 - range(vis, 3.45, 3.75)),
    range(vis, 1.1, 1.3) * (1 - range(vis, 2.25, 2.45)),
    range(vis, 2.3, 2.5) * (1 - range(vis, 3.45, 3.75)),
  ];
}

export function seek(t, opts = {}) {
  const time = ((t % DURATION) + DURATION) % DURATION;
  const hard = !!opts.hard;
  const inHold = time >= HOLD_START;
  const vis = inHold ? 0 : time;
  const waits = [];

  for (const scene of SCENES) {
    const el = document.querySelector(`[data-scene="${scene.id}"]`);
    if (!el) continue;
    const o = sceneOpacity(scene, vis);
    el.style.opacity = String(o);
    const media = el.querySelector("img.ken, video.ken");
    if (media) media.style.transform = `scale(${kenScale(scene, vis)})`;
    const video = el.querySelector("video");
    if (video && video.readyState >= 1) {
      const local = vis - scene.t0 + (Number(video.dataset.offset) || 0);
      if (o > 0.02 && local >= 0) {
        const target = Math.max(0, Math.min(local, (video.duration || 12) - 0.05));
        if (hard) {
          video.pause();
          if (Math.abs(video.currentTime - target) > 0.02) {
            waits.push(
              new Promise((res) => {
                const done = () => {
                  video.removeEventListener("seeked", done);
                  res();
                };
                video.addEventListener("seeked", done);
                video.currentTime = target;
                setTimeout(done, 90);
              })
            );
          }
        } else {
          if (video.paused) video.play().catch(() => {});
          if (Math.abs(video.currentTime - target) > 0.35) video.currentTime = target;
        }
      } else if (!video.paused) {
        video.pause();
      }
    }
  }

  let top = SCENES[0];
  let best = -1;
  for (const scene of SCENES) {
    const o = sceneOpacity(scene, vis);
    if (o > best) {
      best = o;
      top = scene;
    }
  }

  const chrome = inHold || vis >= OPEN_RETURN ? SCENES[0] : top;
  const hideChrome = chrome.id === "open" || chrome.id === "end";
  const proto = chrome.step === 5;
  const chromeEl = $("#chrome");
  if (chromeEl) {
    chromeEl.style.opacity = hideChrome ? "0" : "1";
    chromeEl.classList.toggle("is-proto", proto);
  }

  const kicker = $("#kicker");
  const name = $("#stage-name");
  const caption = $("#caption");
  const sample = $("#sample");
  const topbar = $(".topbar");
  if (kicker) kicker.textContent = chrome.kicker;
  if (name) name.textContent = chrome.name;
  if (caption) caption.textContent = chrome.caption;
  if (sample) sample.textContent = "";
  const isPortrait = document.documentElement.classList.contains("portrait");
  if (topbar) topbar.style.opacity = proto && !isPortrait ? "0" : "1";
  if (caption) caption.style.opacity = proto && !isPortrait ? "0" : "1";

  $all(".rail .cell").forEach((cell, i) => {
    cell.classList.toggle("on", chrome.step === i);
  });

  const beatVis = vis >= OPEN_RETURN ? 0 : vis;
  const beats = beatOpacity(beatVis);
  const beatMul = vis >= OPEN_RETURN ? range(vis, OPEN_RETURN, HOLD_START) : 1;
  $all(".beat").forEach((el, i) => {
    el.style.opacity = String((beats[i] || 0) * beatMul);
  });

  const openTitle = $("#title-open");
  const endTitle = $("#title-end");
  if (openTitle) {
    const o = inHold
      ? 1
      : vis >= OPEN_RETURN
        ? range(vis, OPEN_RETURN, HOLD_START)
        : sceneOpacity(SCENES[0], vis);
    openTitle.style.opacity = String(clamp(o, 0, 1));
  }
  if (endTitle) {
    const o = inHold ? 0 : sceneOpacity(SCENES[SCENES.length - 1], vis);
    endTitle.style.opacity = String(clamp(o, 0, 1));
  }

  const sub = $("#beat-sub");
  if (sub) {
    sub.style.opacity = String(beats[2] > 0.2 ? beats[2] : 0);
  }

  document.documentElement.dataset.t = time.toFixed(3);
  return waits.length ? Promise.all(waits) : undefined;
}

let playing = false;
let startPerf = 0;
let startT = 0;
let raf = 0;

function tick(now) {
  if (!playing) return;
  const t = startT + (now - startPerf) / 1000;
  if (t >= DURATION) {
    seek(DURATION);
    playing = false;
    window.done = true;
    window.dispatchEvent(new Event("showreel-done"));
    return;
  }
  seek(t);
  raf = requestAnimationFrame(tick);
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((res) => setTimeout(res, ms))]);
}

export async function prepare() {
  try {
    await withTimeout(document.fonts.ready, 4000);
    const imgs = $all("img").map((img) =>
      img.decode ? img.decode().catch(() => {}) : Promise.resolve()
    );
    const videos = $all("video").map(
      (v) =>
        withTimeout(
          new Promise((res) => {
            if (v.readyState >= 2) {
              res();
              return;
            }
            v.addEventListener("loadeddata", () => res(), { once: true });
            v.addEventListener("error", () => res(), { once: true });
            try {
              v.load();
            } catch {
              res();
            }
          }),
          8000
        )
    );
    await Promise.all([...imgs, ...videos]);
  } catch (err) {
    console.warn("prepare", err);
  }
  window.ready = true;
}

export function play(from = 0) {
  playing = true;
  window.done = false;
  startT = from;
  startPerf = performance.now();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(tick);
}

export function stop() {
  playing = false;
  cancelAnimationFrame(raf);
}

window.showreel = { DURATION, LOOP_HOLD, SCENES, STEPS, seek, play, stop, prepare };

const params = new URLSearchParams(location.search);
const tParam = params.get("t");

prepare().then(() => {
  if (tParam !== null) {
    seek(Number(tParam));
    window.ready = true;
    return;
  }
  if (params.has("pause")) {
    seek(0);
    return;
  }
  play(0);
});
