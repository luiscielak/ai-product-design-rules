(function () {
  const D = window.FINLEY_DATA;
  const C = window.FINLEY_CHARTS;

  const state = {
    screen: "today",
    bucket: "business",
    range: "90d",
    horizon: 90,
    burnMult: 1,
    theme: "light",
    blur: false,
    dqBusy: false,
  };

  const screens = ["data-quality", "today", "business", "cost-to-operate", "forecast"];

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function fmtMoney(n) {
    return C.money(n);
  }

  function fmtMonths(n) {
    return n.toFixed(1) + " months";
  }

  function monthsFor(range) {
    return range === "30d" ? 4 : range === "90d" ? 6 : 12;
  }

  function monthLabels(range) {
    return D.monthStarts.slice(-monthsFor(range)).map(D.shortMonth);
  }

  function spendSeries(bucket, range) {
    return D.bucketOf(bucket).spendByMonth.slice(-monthsFor(range));
  }

  function cashSeries(bucket, range) {
    return D.bucketOf(bucket).cashPath.slice(-monthsFor(range)).map((p) => p.cash);
  }

  function setHash() {
    const url = `#${state.screen}`;
    if (location.hash !== url) history.replaceState(null, "", url);
  }

  function readHash() {
    const id = (location.hash || "#today").slice(1);
    if (screens.includes(id)) state.screen = id;
  }

  function syncBucketTabs() {
    $all("[data-bucket]").forEach((btn) => {
      const allowed = btn.dataset.bucket === state.bucket;
      btn.setAttribute("aria-pressed", allowed ? "true" : "false");
    });
  }

  const titles = {
    today: "Finley — Today",
    business: "Finley — Business",
    "cost-to-operate": "Finley — Cost-to-operate",
    forecast: "Finley — Forecast",
    "data-quality": "Finley — Data quality",
  };

  function showScreen() {
    if (state.bucket === "combined" && state.screen !== "cost-to-operate") state.bucket = "business";
    $all(".screen").forEach((el) => {
      el.classList.toggle("is-active", el.id === "screen-" + state.screen);
    });
    $all(".nav-tabs button").forEach((btn) => {
      btn.setAttribute("aria-current", btn.dataset.screen === state.screen ? "page" : "false");
    });
    document.title = titles[state.screen] || "Finley";
    syncBucketTabs();
    setHash();
    render();
  }

  function bindChrome() {
    $all(".nav-tabs button").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.screen = btn.dataset.screen;
        showScreen();
      });
    });
    $all("[data-bucket]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.bucket = btn.dataset.bucket;
        syncBucketTabs();
        render();
      });
    });
    $all("[data-range]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.range = btn.dataset.range;
        $all("[data-range]").forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
        render();
      });
    });
    $all("[data-horizon]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.horizon = Number(btn.dataset.horizon);
        $all("[data-horizon]").forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
        render();
      });
    });
    $("#theme-toggle").addEventListener("click", () => {
      state.theme = state.theme === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = state.theme;
      $("#theme-toggle").textContent = state.theme === "light" ? "Dark" : "Light";
      render();
    });
    $("#blur-toggle").addEventListener("click", () => {
      state.blur = !state.blur;
      document.body.classList.toggle("is-blurred", state.blur);
      $("#blur-toggle").textContent = state.blur ? "Unblur" : "Blur";
    });
    $("#burn-slider").addEventListener("input", (ev) => {
      state.burnMult = Number(ev.target.value) / 100;
      renderForecast();
    });
    $("#rerun").addEventListener("click", () => {
      if (state.dqBusy) return;
      state.dqBusy = true;
      $("#rerun").disabled = true;
      $("#rerun").textContent = "Checking…";
      $("#dq-empty").hidden = true;
      setTimeout(() => {
        state.dqBusy = false;
        $("#rerun").disabled = false;
        $("#rerun").textContent = "Re-run checks";
        renderDataQuality();
      }, 900);
    });
    window.addEventListener("hashchange", () => {
      readHash();
      showScreen();
    });
  }

  function renderToday() {
    const b = D.bucketOf(state.bucket);
    const burn = D.burnFor(state.bucket, state.range);
    const floor = D.floorProgress(state.bucket);
    const vs = D.monthVsTypical(state.bucket, state.range);
    const runway = floor.runwayMonths;

    $("#today-date").textContent = D.asOfLabel;
    $("#kpi-cash").textContent = fmtMoney(b.cash);
    $("#kpi-debt").textContent = fmtMoney(b.cardDebt);
    $("#kpi-net").textContent = fmtMoney(b.net);
    $("#kpi-burn").textContent = fmtMoney(burn);
    $("#kpi-burn-note").textContent = `Trailing ${state.range.replace("d", " days")}`;
    $("#kpi-runway").textContent = fmtMonths(runway);

    const decision = $("#today-decision");
    const over = vs.delta > 0;
    decision.innerHTML = `<p><strong>${fmtMonths(runway)}</strong> of cash at trailing burn.
      The 3-month floor is <strong>${floor.threeFunded ? "funded" : "short " + fmtMoney(floor.threeMonth - b.cash)}</strong>.
      This month is tracking <strong class="delta ${over ? "up" : "down"}">${over ? "+" : ""}${Math.round(vs.deltaPct * 100)}%</strong>
      vs typical. Next decision: ${b.cardDebt / b.cash > 0.35 ? "card debt vs cash buffer" : "whether to hold the 6-month floor"}.</p>`;

    const spendVals = spendSeries(state.bucket, state.range);
    C.line($("#chart-spend"), {
      aria: "Monthly spending over the selected range",
      labels: monthLabels(state.range),
      series: [{ name: "Spend", values: spendVals, fill: true, className: "" }],
      thresholds: [{ value: burn, label: "Typical " + state.range }],
    });

    const cats = b.categories[state.range] || b.categories["90d"];
    C.bars($("#chart-categories"), {
      aria: "Spend by category",
      items: cats.map((c) => ({ name: c.name, value: c.amount, share: c.share })),
    });

    const labels = monthLabels(state.range);
    C.line($("#chart-cashflow"), {
      aria: "Cash position over the selected range",
      labels,
      series: [{ name: "Cash", values: cashSeries(state.bucket, state.range), fill: true }],
    });

    $("#vs-typical").innerHTML = `
      <p class="kpi-label">This month vs typical ${state.range}</p>
      <p class="kpi-value">${fmtMoney(vs.projected)}</p>
      <p class="kpi-note">Projected from ${fmtMoney(vs.monthToDate)} through day ${vs.dayOfMonth}. Typical is ${fmtMoney(vs.typical)}.</p>
      <p class="delta ${over ? "up" : "down"}">${over ? "Over" : "Under"} typical by ${fmtMoney(Math.abs(vs.delta))}.</p>`;

    const pct = Math.min(115, (b.cash / floor.sixMonth) * 100);
    $("#chart-goal").innerHTML = `<span class="goal-fill${floor.sixFunded ? " is-met" : ""}" style="width:${pct}%"></span>`;
    $("#goal-copy").innerHTML = floor.sixFunded
      ? `<p>${fmtMoney(b.cash)} of ${fmtMoney(floor.sixMonth)} · <strong>funded</strong>, surplus ${fmtMoney(b.cash - floor.sixMonth)}.</p>`
      : `<p>${fmtMoney(b.cash)} of ${fmtMoney(floor.sixMonth)} · <strong>${fmtMoney(floor.sixMonth - b.cash)} short</strong> (${((floor.sixMonth - b.cash) / burn).toFixed(1)} months of burn).</p>`;
  }

  function renderBusiness() {
    const b = D.business;
    const floor = D.floorProgress("business");
    $("#biz-runway").textContent = fmtMonths(floor.runwayMonths);
    $("#biz-runway-note").textContent = `Cash ${fmtMoney(b.cash)} ÷ trailing 90-day burn ${fmtMoney(b.burn90)}`;
    $("#biz-90").textContent = fmtMoney(b.burn90);
    $("#biz-365").textContent = fmtMoney(b.burn365);
    const accel = (b.burn90 - b.burn365) / b.burn365;
    $("#biz-accel").textContent = (accel >= 0 ? "+" : "") + Math.round(accel * 100) + "%";
    $("#biz-accel").className = "kpi-value delta " + (accel > 0.1 ? "up" : "down");

    C.netBars($("#chart-biz-trend"), {
      aria: "Business net cash flow over twelve months",
      items: D.monthStarts.slice(-12).map((iso, i) => {
        const spend = b.spendByMonth.slice(-12)[i];
        const income = b.incomeByMonth.slice(-12)[i];
        return { label: D.shortMonth(iso), in: income, out: spend, value: income - spend };
      }),
    });

    C.bars($("#chart-biz-cats"), {
      aria: "Business categories trailing 90 days",
      items: b.categories["90d"].map((c) => ({ name: c.name, value: c.amount, share: c.share })),
    });

    const vs = D.monthVsTypical("business", "90d");
    C.grouped($("#chart-biz-vs"), {
      aria: "This month versus typical burn",
      keys: ["typical", "projected"],
      labels: ["Typical 90d", "This month (projected)"],
      groups: [
        { label: "Burn", typical: vs.typical, projected: vs.projected },
        { label: "Fixed", typical: b.fixedMonthly, projected: b.fixedMonthly },
        { label: "Variable", typical: b.variableMonthly, projected: Math.round(vs.projected - b.fixedMonthly) },
      ],
    });
  }

  function renderCost() {
    const b = D.bucketOf(state.bucket === "personal" ? "personal" : state.bucket);
    const monthly = D.burnFor(state.bucket === "combined" ? "combined" : state.bucket, "90d");
    $("#cto-month").textContent = fmtMoney(monthly);
    $("#cto-day").textContent = "≈ " + fmtMoney(Math.round(monthly / 30));
    $("#cto-week").textContent = "≈ " + fmtMoney(Math.round((monthly * 7) / 30));

    C.stackedH($("#chart-fixed-var"), {
      aria: "Fixed versus variable monthly cost",
      segments: [
        { name: "Fixed", value: b.fixedMonthly },
        { name: "Variable", value: b.variableMonthly },
      ],
      caption: `Fixed ${fmtMoney(b.fixedMonthly)} / mo · Variable ${fmtMoney(b.variableMonthly)} / mo`,
    });

    C.line($("#chart-cto-trend"), {
      aria: "Cost to operate over twelve months",
      labels: D.monthStarts.slice(-12).map(D.shortMonth),
      series: [{ name: "Monthly cost", values: b.spendByMonth.slice(-12), fill: true }],
    });

    const cats = b.categories["90d"];
    C.bars($("#chart-cto-cats"), {
      aria: "Category breakdown of cost to operate",
      items: cats.map((c) => ({ name: c.name, value: c.amount, share: c.share })),
    });

    const bucketFilter =
      state.bucket === "combined" ? () => true : (s) => s.bucket === (state.bucket === "personal" ? "personal" : "business");
    const rows = D.subscriptions.filter(bucketFilter).sort((a, c) => c.annual - a.annual);
    $("#sub-table").innerHTML = rows
      .map(
        (s) => `<tr>
        <td>${s.name}</td>
        <td>${s.bucket}</td>
        <td>${s.cadence}</td>
        <td>${fmtMoney(s.annual / 12)} / mo</td>
        <td>${fmtMoney(s.annual)} / yr</td>
      </tr>`
      )
      .join("");
  }

  function renderForecast() {
    const fc = D.forecast(state.bucket, state.horizon, state.burnMult);
    const b = D.bucketOf(state.bucket);
    $("#burn-readout").textContent = fmtMoney((b.burn90 / 30) * state.burnMult) + " / day";
    $("#forecast-note").textContent =
      "Naive projection — not a prediction. Confidence band is ±1σ on trailing-90 monthly burn.";

    C.line($("#chart-forecast"), {
      aria: "Projected cash with confidence band and floor thresholds",
      labels: fc.points.map((p) => D.shortMonth(p.date)),
      maxLabels: 6,
      series: [{ name: "Projected cash", values: fc.points.map((p) => p.projected), fill: false }],
      bands: [{ low: fc.points.map((p) => p.low), high: fc.points.map((p) => p.high) }],
      thresholds: [
        { value: b.burn90 * 3, label: "3-month floor" },
        { value: b.burn90, label: "1-month floor" },
        { value: 0, label: "Zero" },
      ],
      min: Math.min(-200, ...fc.points.map((p) => p.low)),
      max: Math.max(b.cash * 1.05, ...fc.points.map((p) => p.high)),
    });

    $("#cross-table").innerHTML = fc.crossings
      .map((c) => {
        let when = "—";
        if (c.already) when = "Already below";
        else if (c.day !== null) {
          const pretty = D.parseISO(c.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          });
          when = `Day ${c.day} · ${pretty}`;
          if (c.day > state.horizon) when += " (past horizon)";
        }
        return `<tr><td>${c.name}</td><td>${fmtMoney(c.amount)}</td><td>${when}</td></tr>`;
      })
      .join("");

    const end = fc.points[fc.points.length - 1];
    $("#forecast-end").textContent = fmtMoney(end.projected);
    $("#forecast-end-note").textContent = `Day ${state.horizon} at ${Math.round(state.burnMult * 100)}% of trailing burn`;
  }

  function renderDataQuality() {
    const counts = D.findings.reduce(
      (acc, f) => {
        acc[f.severity] += 1;
        return acc;
      },
      { critical: 0, warning: 0, info: 0 }
    );
    $("#dq-critical").textContent = String(counts.critical);
    $("#dq-warning").textContent = String(counts.warning);
    $("#dq-info").textContent = String(counts.info);
    $("#dq-table").innerHTML = D.findings
      .map(
        (f) => `<tr>
        <td><span class="sev ${f.severity}">${f.severity}</span></td>
        <td>${f.id}</td>
        <td>${f.subject}</td>
        <td>${f.message}</td>
      </tr>`
      )
      .join("");
  }

  function render() {
    C.hideTip();
    if (state.screen === "today") renderToday();
    if (state.screen === "business") renderBusiness();
    if (state.screen === "cost-to-operate") renderCost();
    if (state.screen === "forecast") renderForecast();
    if (state.screen === "data-quality") renderDataQuality();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (new URLSearchParams(location.search).get("theme") === "dark") {
      state.theme = "dark";
      document.documentElement.dataset.theme = "dark";
      const themeBtn = $("#theme-toggle");
      if (themeBtn) themeBtn.textContent = "Light";
    }
    readHash();
    bindChrome();
    showScreen();
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(render, 120);
    });
  });
})();
