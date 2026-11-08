/** Timeline for the 1920×1080 silent looping explainer. Duration is 52.0s. */

export const DURATION = 52;

export const STEPS = [
  { id: "new-project", n: "01", cmd: "/new-project", role: "Project Manager" },
  { id: "prd", n: "02", cmd: "/prd", role: "Product Owner" },
  { id: "lofi", n: "03", cmd: "/lofi", role: "UX Designer" },
  { id: "midfi", n: "04", cmd: "/midfi", role: "Product Designer" },
  { id: "hifi", n: "05", cmd: "/hifi", role: "UI Designer" },
  { id: "ui-proto", n: "06", cmd: "/ui-proto", role: "UI Engineer" },
];

/**
 * Scene windows. Adjacent scenes overlap 0.4s for a crossfade.
 * `step` indexes STEPS, or -1 for brief/open/close (not a command).
 */
export const SCENES = [
  { id: "open", t0: 0.0, t1: 4.8, step: -1, kicker: "AI product design rules", cmd: "", caption: "Six commands. Six roles. One paper trail you can review.", counter: "" },
  { id: "brief", t0: 4.4, t1: 9.6, step: -1, kicker: "You write this", cmd: "", caption: "Every screen, chart, and number has to answer a decision in under 60 seconds.", counter: "INPUT" },
  { id: "new-project", t0: 9.2, t1: 13.4, step: 0, kicker: "Project Manager", cmd: "/new-project", caption: "A project folder with app/, docs/, design/", counter: "01 / 06" },
  { id: "prd", t0: 13.0, t1: 18.6, step: 1, kicker: "Product Owner", cmd: "/prd", caption: "Five screens, each with a job — and anti-patterns reviewers should reject.", counter: "02 / 06" },
  { id: "lofi", t0: 18.2, t1: 23.8, step: 2, kicker: "UX Designer", cmd: "/lofi", caption: "One question per screen. ASCII for mobile and desktop.", counter: "03 / 06" },
  { id: "midfi", t0: 23.4, t1: 31.2, step: 3, kicker: "Product Designer", cmd: "/midfi", caption: "Tokens, components, states, and a ui.html overview.", counter: "04 / 06" },
  { id: "hifi", t0: 30.8, t1: 38.6, step: 4, kicker: "UI Designer", cmd: "/hifi", caption: "Every color has exactly one role, next to a live component gallery.", counter: "05 / 06" },
  { id: "proto", t0: 38.2, t1: 44.6, step: 5, kicker: "UI Engineer", cmd: "/ui-proto", caption: "Clickable on desktop and phone — the brief, built.", counter: "06 / 06" },
  { id: "end", t0: 44.2, t1: 52.0, step: -1, kicker: "AI PRODUCT DESIGN RULES", cmd: "", caption: "Same brief. Working prototype.", counter: "" },
];

const FADE = 0.4;

function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}

function range(t, a, b) {
  if (b === a) return t >= a ? 1 : 0;
  return clamp((t - a) / (b - a), 0, 1);
}

export function sceneOpacity(scene, t) {
  if (t < scene.t0 || t > scene.t1) return 0;
  const fadeIn = range(t, scene.t0, scene.t0 + FADE);
  const fadeOut = 1 - range(t, scene.t1 - FADE, scene.t1);
  return Math.min(fadeIn, fadeOut);
}

export function kenScale(scene, t) {
  const u = range(t, scene.t0, scene.t1);
  return 1 + 0.045 * u;
}

function $(sel) {
  return document.querySelector(sel);
}

function $all(sel) {
  return Array.from(document.querySelectorAll(sel));
}

export function seek(t, opts = {}) {
  const time = ((t % DURATION) + DURATION) % DURATION;
  const hard = !!opts.hard;

  for (const scene of SCENES) {
    const el = document.querySelector(`[data-scene="${scene.id}"]`);
    if (!el) continue;
    const o = sceneOpacity(scene, time);
    el.style.opacity = String(o);
    const media = el.querySelector("img.ken, video.ken");
    if (media) {
      media.style.transform = `scale(${kenScale(scene, time)})`;
    }
    const video = el.querySelector("video");
    if (video && video.readyState >= 1) {
      const local = time - scene.t0;
      if (o > 0.02 && local >= 0) {
        const target = Math.max(0, Math.min(local, (video.duration || 8) - 0.05));
        if (hard) {
          video.pause();
          if (Math.abs(video.currentTime - target) > 0.02) {
            video.currentTime = target;
          }
        } else {
          if (video.paused) {
            video.play().catch(() => {});
          }
          if (Math.abs(video.currentTime - target) > 0.35) {
            video.currentTime = target;
          }
        }
      } else if (!video.paused) {
        video.pause();
      }
    }
  }

  // Chrome labels follow the scene with the highest opacity (stable during overlaps).
  let top = SCENES[0];
  let best = -1;
  for (const scene of SCENES) {
    const o = sceneOpacity(scene, time);
    if (o >= best) {
      best = o;
      top = scene;
    }
  }

  const chrome = time >= 50.4 ? SCENES[0] : top;
  const kicker = document.getElementById("kicker-role");
  const cmd = document.getElementById("kicker-cmd");
  const caption = document.getElementById("caption");
  const counter = document.getElementById("counter");
  const idx = document.getElementById("kicker-idx");
  if (kicker) kicker.textContent = chrome.kicker;
  if (cmd) cmd.textContent = chrome.cmd;
  if (caption) caption.textContent = chrome.caption;
  if (counter) counter.textContent = chrome.counter;
  if (idx) {
    idx.textContent = chrome.step >= 0 ? STEPS[chrome.step].n : "";
  }

  $all(".rail .cell").forEach((cell, i) => {
    cell.classList.toggle("on", chrome.step === i);
  });

  const openTitle = document.getElementById("title-open");
  const endTitle = document.getElementById("title-end");
  if (openTitle) {
    const o =
      sceneOpacity(SCENES[0], time) * (1 - range(time, 3.2, 4.6)) +
      range(time, 50.4, 52.0);
    openTitle.style.opacity = String(clamp(o, 0, 1));
  }
  if (endTitle) {
    const o = sceneOpacity(SCENES[SCENES.length - 1], time) * (1 - range(time, 50.4, 52.0)) * range(time, 44.4, 45.4);
    endTitle.style.opacity = String(clamp(o, 0, 1));
  }

  document.documentElement.dataset.t = time.toFixed(3);
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
    window.dispatchEvent(new Event("explainer-done"));
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
          5000
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

window.explainer = { DURATION, SCENES, STEPS, seek, play, stop, prepare };

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
