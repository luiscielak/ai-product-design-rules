/**
 * Small SVG chart kit for the Finley prototype.
 * Hover tooltips, keyboard focus, and CSS-driven first-paint motion.
 */
window.FINLEY_CHARTS = (function () {
  let tip;

  function ensureTip() {
    if (tip) return tip;
    tip = document.createElement("div");
    tip.className = "chart-tip";
    tip.id = "chart-tip";
    tip.role = "tooltip";
    tip.hidden = true;
    document.body.appendChild(tip);
    return tip;
  }

  function money(n, digits) {
    const abs = Math.abs(n);
    const sign = n < 0 ? "−" : "";
    if (digits === "k" && abs >= 1000) {
      return sign + "$" + (abs / 1000).toFixed(abs >= 10000 ? 0 : 1) + "k";
    }
    return (
      sign +
      "$" +
      abs.toLocaleString("en-US", {
        maximumFractionDigits: abs >= 100 ? 0 : 2,
        minimumFractionDigits: 0,
      })
    );
  }

  function showTip(html, x, y) {
    const el = ensureTip();
    el.innerHTML = html;
    el.hidden = false;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const left = Math.min(window.innerWidth - w - 8, Math.max(8, x + 14));
    const top = Math.min(window.innerHeight - h - 8, Math.max(8, y - h - 12));
    el.style.left = left + "px";
    el.style.top = top + "px";
  }

  function hideTip() {
    if (tip) tip.hidden = true;
  }

  function svgEl(name, attrs) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) node.setAttribute(k, String(v));
    });
    return node;
  }

  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function layout(el, pad) {
    const rect = el.getBoundingClientRect();
    const width = Math.max(240, rect.width || el.clientWidth || 560);
    const height = Math.max(160, Number(el.dataset.height) || rect.height || 220);
    return {
      width,
      height,
      l: pad.l,
      r: width - pad.r,
      t: pad.t,
      b: height - pad.b,
      iw: width - pad.l - pad.r,
      ih: height - pad.t - pad.b,
    };
  }

  function yScale(min, max, box) {
    const span = max - min || 1;
    return (v) => box.b - ((v - min) / span) * box.ih;
  }

  function xScale(n, box) {
    return (i) => box.l + (n <= 1 ? box.iw / 2 : (i / (n - 1)) * box.iw);
  }

  function niceMax(v) {
    if (v <= 0) return 1;
    const mag = Math.pow(10, Math.floor(Math.log10(v)));
    const n = v / mag;
    const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return nice * mag;
  }

  function mountSvg(el, box, label) {
    clear(el);
    const svg = svgEl("svg", {
      viewBox: `0 0 ${box.width} ${box.height}`,
      role: "img",
      "aria-label": label || "Chart",
      class: "chart-svg",
    });
    el.appendChild(svg);
    return svg;
  }

  function gridY(svg, box, min, max, ticks) {
    const y = yScale(min, max, box);
    for (let i = 0; i <= ticks; i += 1) {
      const v = min + ((max - min) * i) / ticks;
      const gy = y(v);
      svg.appendChild(
        svgEl("line", {
          x1: box.l,
          x2: box.r,
          y1: gy,
          y2: gy,
          class: "grid-line",
        })
      );
      const label = svgEl("text", {
        x: box.l - 8,
        y: gy + 4,
        class: "axis-label",
        "text-anchor": "end",
      });
      label.textContent = money(v, "k");
      svg.appendChild(label);
    }
  }

  function xLabels(svg, box, labels, maxLabels) {
    const cap = maxLabels || 6;
    const step = Math.max(1, Math.ceil(labels.length / cap));
    labels.forEach((lab, i) => {
      if (i % step !== 0 && i !== labels.length - 1) return;
      const x = box.l + (labels.length <= 1 ? box.iw / 2 : (i / (labels.length - 1)) * box.iw);
      const t = svgEl("text", {
        x,
        y: box.b + 18,
        class: "axis-label",
        "text-anchor": "middle",
      });
      t.textContent = lab;
      svg.appendChild(t);
    });
  }

  function line(el, spec) {
    const pad = { t: 16, r: 12, b: 32, l: 48 };
    const box = layout(el, pad);
    const series = spec.series || [];
    const labels = spec.labels || series.map((_, i) => String(i + 1));
    const extras = spec.bands || [];
    const thresholds = spec.thresholds || [];
    let min = spec.min;
    let max = spec.max;
    if (min === undefined || max === undefined) {
      const vals = series.flatMap((s) => s.values);
      extras.forEach((b) => vals.push(...b.low, ...b.high));
      thresholds.forEach((t) => vals.push(t.value));
      min = Math.min(0, ...vals);
      max = niceMax(Math.max(...vals) * 1.08);
    }
    const svg = mountSvg(el, box, spec.aria);
    const y = yScale(min, max, box);
    const x = xScale(Math.max(series[0]?.values.length || 2, 2), box);
    gridY(svg, box, min, max, 4);

    extras.forEach((band) => {
      const d = band.high
        .map((v, i) => `${i === 0 ? "M" : "L"}${x(i)} ${y(v)}`)
        .join(" ");
      const back = band.low
        .slice()
        .reverse()
        .map((v, i) => `L${x(band.low.length - 1 - i)} ${y(v)}`)
        .join(" ");
      svg.appendChild(
        svgEl("path", {
          d: `${d} ${back} Z`,
          class: "band",
        })
      );
    });

    thresholds.forEach((t) => {
      const gy = y(t.value);
      svg.appendChild(
        svgEl("line", {
          x1: box.l,
          x2: box.r,
          y1: gy,
          y2: gy,
          class: "threshold-line",
        })
      );
      const lab = svgEl("text", {
        x: box.r,
        y: gy - 6,
        class: "threshold-label",
        "text-anchor": "end",
      });
      lab.textContent = t.label;
      svg.appendChild(lab);
    });

    series.forEach((s) => {
      const n = s.values.length;
      const xs = xScale(n, box);
      const lineD = s.values.map((v, i) => `${i === 0 ? "M" : "L"}${xs(i)} ${y(v)}`).join(" ");
      if (s.fill) {
        const area =
          lineD +
          ` L${xs(n - 1)} ${y(Math.max(0, min))} L${xs(0)} ${y(Math.max(0, min))} Z`;
        svg.appendChild(svgEl("path", { d: area, class: `area ${s.className || ""}` }));
      }
      svg.appendChild(svgEl("path", { d: lineD, class: `line ${s.className || ""}` }));
    });

    xLabels(svg, box, labels, spec.maxLabels);

    const hover = svgEl("g", { class: "hover-layer" });
    const vline = svgEl("line", { class: "hover-rule", y1: box.t, y2: box.b, visibility: "hidden" });
    hover.appendChild(vline);
    const dots = (series[0]?.values || []).map(() => {
      const c = svgEl("circle", { r: 4, class: "hover-dot", visibility: "hidden" });
      hover.appendChild(c);
      return c;
    });
    svg.appendChild(hover);

    const n = series[0]?.values.length || 0;
    const xs = xScale(n, box);
    const hit = svgEl("rect", {
      x: box.l,
      y: box.t,
      width: box.iw,
      height: box.ih,
      class: "hit-area",
      tabindex: "0",
      role: "application",
      "aria-label": spec.aria || "Interactive chart",
    });
    svg.appendChild(hit);

    function atIndex(i, clientX, clientY) {
      if (i < 0 || i >= n) return;
      vline.setAttribute("x1", xs(i));
      vline.setAttribute("x2", xs(i));
      vline.setAttribute("visibility", "visible");
      series.forEach((s, si) => {
        if (!dots[i]) return;
        if (si === 0) {
          dots[i].setAttribute("cx", xs(i));
          dots[i].setAttribute("cy", y(s.values[i]));
          dots[i].setAttribute("visibility", "visible");
        }
      });
      dots.forEach((d, di) => {
        if (di !== i) d.setAttribute("visibility", "hidden");
      });
      const rows = series
        .map((s) => `<div><span>${s.name}</span><strong>${money(s.values[i])}</strong></div>`)
        .join("");
      showTip(`<p>${labels[i]}</p>${rows}`, clientX, clientY);
    }

    function fromEvent(ev) {
      const r = svg.getBoundingClientRect();
      const px = ((ev.clientX - r.left) / r.width) * box.width;
      const t = (px - box.l) / box.iw;
      const i = Math.round(t * (n - 1));
      atIndex(Math.max(0, Math.min(n - 1, i)), ev.clientX, ev.clientY);
    }

    hit.addEventListener("pointermove", fromEvent);
    hit.addEventListener("pointerenter", fromEvent);
    hit.addEventListener("pointerleave", () => {
      vline.setAttribute("visibility", "hidden");
      dots.forEach((d) => d.setAttribute("visibility", "hidden"));
      hideTip();
    });
    hit.addEventListener("keydown", (ev) => {
      const current = Number(hit.dataset.i || 0);
      let next = current;
      if (ev.key === "ArrowRight") next = Math.min(n - 1, current + 1);
      if (ev.key === "ArrowLeft") next = Math.max(0, current - 1);
      if (next === current) return;
      ev.preventDefault();
      hit.dataset.i = String(next);
      const r = svg.getBoundingClientRect();
      const cx = r.left + (xs(next) / box.width) * r.width;
      atIndex(next, cx, r.top + 24);
    });
    hit.addEventListener("blur", hideTip);
  }

  function bars(el, spec) {
    const items = spec.items || [];
    const horizontal = spec.horizontal !== false;
    const pad = horizontal ? { t: 8, r: 56, b: 8, l: 128 } : { t: 16, r: 12, b: 32, l: 48 };
    const box = layout(el, pad);
    const max = niceMax(Math.max(...items.map((i) => i.value), spec.compare || 0) * 1.05);
    const svg = mountSvg(el, box, spec.aria);
    if (!horizontal) gridY(svg, box, 0, max, 4);

    items.forEach((item, i) => {
      if (horizontal) {
        const rowH = box.ih / items.length;
        const y = box.t + i * rowH + rowH * 0.18;
        const h = rowH * 0.64;
        const w = (item.value / max) * box.iw;
        const g = svgEl("g", { class: "bar-row", tabindex: "0", role: "img", "aria-label": `${item.name} ${money(item.value)}` });
        const name = svgEl("text", { x: box.l - 10, y: y + h / 2 + 4, class: "bar-name", "text-anchor": "end" });
        name.textContent = item.name;
        g.appendChild(name);
        g.appendChild(
          svgEl("rect", {
            x: box.l,
            y,
            width: Math.max(2, w),
            height: h,
            class: `bar ${item.className || ""}`,
            rx: 2,
          })
        );
        if (spec.compare) {
          const cx = box.l + (spec.compare / max) * box.iw;
          g.appendChild(svgEl("line", { x1: cx, x2: cx, y1: y - 2, y2: y + h + 2, class: "compare-mark" }));
        }
        const val = svgEl("text", { x: box.l + w + 8, y: y + h / 2 + 4, class: "bar-value" });
        val.textContent = money(item.value);
        g.appendChild(val);
        g.addEventListener("pointerenter", (ev) => {
          showTip(
            `<p>${item.name}</p><div><span>Amount</span><strong>${money(item.value)}</strong></div>${
              item.share !== undefined
                ? `<div><span>Share</span><strong>${Math.round(item.share * 100)}%</strong></div>`
                : ""
            }`,
            ev.clientX,
            ev.clientY
          );
        });
        g.addEventListener("pointerleave", hideTip);
        g.addEventListener("blur", hideTip);
        svg.appendChild(g);
      }
    });
  }

  function grouped(el, spec) {
    const groups = spec.groups || [];
    const pad = { t: 16, r: 12, b: 32, l: 48 };
    const box = layout(el, boxPad(el, pad));
    const keys = spec.keys || [];
    const max = niceMax(
      Math.max(
        ...groups.flatMap((g) => keys.map((k) => g[k] || 0)),
        1
      ) * 1.08
    );
    const svg = mountSvg(el, box, spec.aria);
    gridY(svg, box, 0, max, 4);
    const slot = box.iw / groups.length;
    const barW = Math.min(18, (slot * 0.7) / keys.length);
    groups.forEach((g, gi) => {
      keys.forEach((k, ki) => {
        const val = g[k] || 0;
        const x = box.l + gi * slot + slot * 0.15 + ki * (barW + 4);
        const y = yScale(0, max, box)(val);
        const h = box.b - y;
        const rec = svgEl("rect", {
          x,
          y,
          width: barW,
          height: Math.max(0, h),
          class: `bar series-${ki}`,
          rx: 2,
          tabindex: "0",
          "aria-label": `${g.label} ${k} ${money(val)}`,
        });
        rec.addEventListener("pointerenter", (ev) => {
          showTip(
            `<p>${g.label}</p><div><span>${spec.labels[ki]}</span><strong>${money(val)}</strong></div>`,
            ev.clientX,
            ev.clientY
          );
        });
        rec.addEventListener("pointerleave", hideTip);
        rec.addEventListener("focus", (ev) => {
          const r = rec.getBoundingClientRect();
          showTip(
            `<p>${g.label}</p><div><span>${spec.labels[ki]}</span><strong>${money(val)}</strong></div>`,
            r.left,
            r.top
          );
        });
        rec.addEventListener("blur", hideTip);
        svg.appendChild(rec);
      });
      const lab = svgEl("text", {
        x: box.l + gi * slot + slot / 2,
        y: box.b + 18,
        class: "axis-label",
        "text-anchor": "middle",
      });
      lab.textContent = g.label;
      svg.appendChild(lab);
    });
  }

  function boxPad(_el, pad) {
    return pad;
  }

  function stackedH(el, spec) {
    const segs = spec.segments || [];
    const total = segs.reduce((a, s) => a + s.value, 0) || 1;
    const pad = { t: 28, r: 12, b: 28, l: 12 };
    const box = layout(el, pad);
    const svg = mountSvg(el, box, spec.aria);
    let x = box.l;
    segs.forEach((s, i) => {
      const w = (s.value / total) * box.iw;
        const rec = svgEl("rect", {
        x,
        y: box.t + 4,
        width: Math.max(w - 2, 2),
        height: 40,
        class: `bar series-${i}`,
        rx: 2,
        tabindex: "0",
        "aria-label": `${s.name} ${money(s.value)}`,
      });
      rec.addEventListener("pointerenter", (ev) => {
        showTip(
          `<p>${s.name}</p><div><span>Monthly</span><strong>${money(s.value)}</strong></div><div><span>Share</span><strong>${Math.round(
            (s.value / total) * 100
          )}%</strong></div>`,
          ev.clientX,
          ev.clientY
        );
      });
      rec.addEventListener("pointerleave", hideTip);
      rec.addEventListener("blur", hideTip);
      svg.appendChild(rec);
      if (w > 70) {
        const t = svgEl("text", { x: x + 8, y: box.t + 30, class: "stack-label" });
        t.textContent = s.name;
        svg.appendChild(t);
      }
      x += w;
    });
    const cap = svgEl("text", { x: box.l, y: box.b + 4, class: "axis-label" });
    cap.textContent = spec.caption || "";
    svg.appendChild(cap);
  }

  function netBars(el, spec) {
    const items = spec.items || [];
    const pad = { t: 16, r: 12, b: 32, l: 48 };
    const box = layout(el, pad);
    const peak = niceMax(Math.max(...items.map((i) => Math.abs(i.value)), 1) * 1.08);
    const svg = mountSvg(el, box, spec.aria);
    const y = yScale(-peak, peak, box);
    gridY(svg, box, -peak, peak, 4);
    svg.appendChild(
      svgEl("line", { x1: box.l, x2: box.r, y1: y(0), y2: y(0), class: "zero-line" })
    );
    const slot = box.iw / items.length;
    const barW = Math.min(28, slot * 0.55);
    items.forEach((item, i) => {
      const x = box.l + i * slot + (slot - barW) / 2;
      const y0 = y(0);
      const y1 = y(item.value);
      const top = Math.min(y0, y1);
      const h = Math.max(2, Math.abs(y1 - y0));
      const rec = svgEl("rect", {
        x,
        y: top,
        width: barW,
        height: h,
        class: item.value >= 0 ? "bar series-0" : "bar series-1",
        rx: 2,
        tabindex: "0",
        "aria-label": `${item.label} ${money(item.value)}`,
      });
      rec.addEventListener("pointerenter", (ev) => {
        showTip(
          `<p>${item.label}</p><div><span>Net</span><strong>${money(item.value)}</strong></div>${
            item.in !== undefined
              ? `<div><span>In</span><strong>${money(item.in)}</strong></div><div><span>Out</span><strong>${money(item.out)}</strong></div>`
              : ""
          }`,
          ev.clientX,
          ev.clientY
        );
      });
      rec.addEventListener("pointerleave", hideTip);
      rec.addEventListener("blur", hideTip);
      svg.appendChild(rec);
      const lab = svgEl("text", {
        x: x + barW / 2,
        y: box.b + 18,
        class: "axis-label",
        "text-anchor": "middle",
      });
      lab.textContent = item.label;
      svg.appendChild(lab);
    });
  }

  function goal(el, spec) {
    const pad = { t: 8, r: 12, b: 8, l: 12 };
    const box = layout(el, pad);
    const svg = mountSvg(el, box, spec.aria);
    const pct = Math.max(0, Math.min(spec.value / spec.target, 1.15));
    const y = box.t + 18;
    svg.appendChild(
      svgEl("rect", { x: box.l, y, width: box.iw, height: 16, class: "goal-track", rx: 8 })
    );
    svg.appendChild(
      svgEl("rect", {
        x: box.l,
        y,
        width: Math.min(box.iw, box.iw * pct),
        height: 16,
        class: spec.value >= spec.target ? "goal-fill is-met" : "goal-fill",
        rx: 8,
      })
    );
    const mark = box.l + box.iw * Math.min(1, spec.target / spec.target);
    svg.appendChild(svgEl("line", { x1: mark, x2: mark, y1: y - 4, y2: y + 20, class: "goal-mark" }));
    const t = svgEl("text", { x: box.l, y: y + 38, class: "axis-label" });
    t.textContent = `${money(spec.value)} of ${money(spec.target)}`;
    svg.appendChild(t);
  }

  return { line, bars, grouped, stackedH, netBars, goal, money, hideTip };
})();
