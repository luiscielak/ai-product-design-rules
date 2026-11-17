/**
 * Finley sample dataset.
 * Invented consultant finances for the prototype — not live accounts.
 * Headline cash / burn figures match the Finley example used in earlier stages.
 */
window.FINLEY_DATA = (function () {
  const AS_OF = "2026-05-18";

  function addDays(iso, days) {
    const d = new Date(iso + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function monthLabel(iso) {
    const d = new Date(iso + "T12:00:00Z");
    return d.toLocaleDateString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });
  }

  function shortMonth(iso) {
    const d = new Date(iso + "T12:00:00Z");
    return d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
  }

  function parseISO(iso) {
    return new Date(iso + "T12:00:00Z");
  }

  /** Business monthly spend Jun 2024 → May 2026. Quiet year, then a tools/contractor ramp. */
  const businessSpendByMonth = [
    118, 96, 142, 88, 121, 134, 109, 156, 98, 171, 144, 162,
    188, 214, 196, 248, 312, 401, 478, 562, 648, 711, 754, 739,
  ];

  const personalSpendByMonth = [
    2840, 2710, 3022, 2688, 2914, 3102, 2766, 2890, 3055, 2720, 2988, 3140,
    2812, 2764, 3098, 2880, 2944, 3210, 2775, 3012, 2960, 3188, 2872, 3040,
  ];

  const businessIncomeByMonth = [
    0, 4200, 0, 0, 8600, 0, 2400, 0, 0, 7200, 0, 1800,
    0, 6400, 0, 0, 9100, 0, 0, 4800, 0, 0, 7600, 0,
  ];

  const personalIncomeByMonth = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  const monthStarts = [];
  for (let i = 23; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(2026, 4, 1));
    d.setUTCMonth(d.getUTCMonth() - i);
    monthStarts.push(d.toISOString().slice(0, 10));
  }

  function sliceMonths(values, range) {
    const n = range === "30d" ? 1 : range === "90d" ? 3 : range === "365d" ? 12 : 24;
    return values.slice(-n);
  }

  function mean(values) {
    if (!values.length) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  const businessCategories = {
    "30d": [
      { name: "Tools & software", amount: 198, share: 0.27 },
      { name: "Contractors", amount: 160, share: 0.22 },
      { name: "Cloud & hosting", amount: 104, share: 0.14 },
      { name: "Travel", amount: 86, share: 0.12 },
      { name: "Pro services", amount: 72, share: 0.1 },
      { name: "Banking & fees", amount: 38, share: 0.05 },
      { name: "Other", amount: 81, share: 0.11 },
    ],
    "90d": [
      { name: "Tools & software", amount: 186, share: 0.25 },
      { name: "Contractors", amount: 140, share: 0.19 },
      { name: "Cloud & hosting", amount: 98, share: 0.13 },
      { name: "Pro services", amount: 84, share: 0.11 },
      { name: "Travel", amount: 72, share: 0.1 },
      { name: "Banking & fees", amount: 41, share: 0.06 },
      { name: "Other", amount: 118, share: 0.16 },
    ],
    "365d": [
      { name: "Tools & software", amount: 92, share: 0.22 },
      { name: "Cloud & hosting", amount: 74, share: 0.18 },
      { name: "Contractors", amount: 61, share: 0.15 },
      { name: "Pro services", amount: 48, share: 0.12 },
      { name: "Banking & fees", amount: 36, share: 0.09 },
      { name: "Travel", amount: 29, share: 0.07 },
      { name: "Other", amount: 72, share: 0.17 },
    ],
  };

  const personalCategories = {
    "30d": [
      { name: "Housing", amount: 1850, share: 0.61 },
      { name: "Groceries", amount: 420, share: 0.14 },
      { name: "Transport", amount: 210, share: 0.07 },
      { name: "Health", amount: 164, share: 0.05 },
      { name: "Utilities", amount: 148, share: 0.05 },
      { name: "Dining", amount: 132, share: 0.04 },
      { name: "Other", amount: 116, share: 0.04 },
    ],
    "90d": [
      { name: "Housing", amount: 1850, share: 0.61 },
      { name: "Groceries", amount: 398, share: 0.13 },
      { name: "Transport", amount: 226, share: 0.07 },
      { name: "Utilities", amount: 155, share: 0.05 },
      { name: "Health", amount: 142, share: 0.05 },
      { name: "Dining", amount: 128, share: 0.04 },
      { name: "Other", amount: 141, share: 0.05 },
    ],
    "365d": [
      { name: "Housing", amount: 1820, share: 0.62 },
      { name: "Groceries", amount: 376, share: 0.13 },
      { name: "Transport", amount: 198, share: 0.07 },
      { name: "Utilities", amount: 149, share: 0.05 },
      { name: "Health", amount: 136, share: 0.05 },
      { name: "Dining", amount: 118, share: 0.04 },
      { name: "Other", amount: 143, share: 0.05 },
    ],
  };

  const subscriptions = [
    { name: "Adobe Creative Cloud", annual: 239.88, bucket: "business", cadence: "monthly" },
    { name: "Cursor", annual: 192.0, bucket: "business", cadence: "monthly" },
    { name: "Figma Professional", annual: 180.0, bucket: "business", cadence: "monthly" },
    { name: "iCloud+", annual: 119.88, bucket: "personal", cadence: "monthly" },
    { name: "Notion", annual: 96.0, bucket: "business", cadence: "monthly" },
    { name: "GitHub", annual: 48.0, bucket: "business", cadence: "monthly" },
    { name: "Domains & email", annual: 48.0, bucket: "business", cadence: "annual" },
    { name: "Spotify", annual: 131.88, bucket: "personal", cadence: "monthly" },
  ];

  const findings = [
    {
      id: "DQ-01",
      severity: "critical",
      check: "Unclassified account",
      subject: "New Card (…9999)",
      message: "Missing from classification.json. Add a bucket + subtype before Today metrics can treat it as business or personal.",
    },
    {
      id: "DQ-02",
      severity: "critical",
      check: "Stale balance",
      subject: "Apple Card (…3030)",
      message: "Balance −$1,402.92 with 1 transaction in 365 days. Reconnect or confirm the export is current.",
    },
    {
      id: "DQ-03",
      severity: "critical",
      check: "Transfer mismatch",
      subject: "Checking → Savings",
      message: "A $1,200 transfer on Apr 3 is tagged as spend on one side only. Pair it or Today will inflate burn.",
    },
    {
      id: "DQ-04",
      severity: "warning",
      check: "Duplicate merchant",
      subject: "Figma",
      message: "Two active subscriptions share a merchant string. Confirm one is personal before Cost-to-operate rolls them up.",
    },
    {
      id: "DQ-05",
      severity: "warning",
      check: "Missing receipt",
      subject: "United Airlines $486.20",
      message: "Travel over $250 with no note. Optional, but Forecast treats it as repeating if it stays untagged.",
    },
    {
      id: "DQ-06",
      severity: "info",
      check: "New merchant",
      subject: "Linear",
      message: "First seen May 9. Not yet in the subscription radar.",
    },
  ];

  function dailySpendSeries(monthly, range) {
    const days = range === "30d" ? 30 : range === "90d" ? 90 : 180;
    const latest = monthly[monthly.length - 1];
    const prev = monthly[monthly.length - 2] || latest;
    const out = [];
    for (let i = days - 1; i >= 0; i -= 1) {
      const t = 1 - i / (days - 1);
      const base = prev + (latest - prev) * Math.min(1, t * 1.15);
      const wobble = Math.sin(i * 0.45) * base * 0.08 + Math.cos(i * 0.17) * 18;
      const weekend = i % 7 === 0 || i % 7 === 6 ? 0.7 : 1;
      out.push({
        date: addDays(AS_OF, -i),
        amount: Math.max(8, (base / 30) * weekend + wobble / 30),
      });
    }
    return out;
  }

  function cashPath(endCash, monthlySpend, monthlyIncome) {
    const points = new Array(monthlySpend.length);
    let cash = endCash;
    for (let i = monthlySpend.length - 1; i >= 0; i -= 1) {
      points[i] = {
        date: monthStarts[i],
        cash: Math.round(cash),
        spend: monthlySpend[i],
        income: monthlyIncome[i],
      };
      cash = Math.max(1200, cash - monthlyIncome[i] + monthlySpend[i]);
    }
    return points;
  }

  const business = {
    cash: 4727,
    cardDebt: 2109,
    net: 2618,
    burn90: 739,
    burn365: 412,
    burn30: 739,
    fixedMonthly: 77,
    variableMonthly: 662,
    spendByMonth: businessSpendByMonth,
    incomeByMonth: businessIncomeByMonth,
    categories: businessCategories,
    cashPath: cashPath(4727, businessSpendByMonth, businessIncomeByMonth),
  };

  const personal = {
    cash: 8240,
    cardDebt: 640,
    net: 7600,
    burn90: 3040,
    burn365: 2940,
    burn30: 3040,
    fixedMonthly: 2180,
    variableMonthly: 860,
    spendByMonth: personalSpendByMonth,
    incomeByMonth: personalIncomeByMonth,
    categories: personalCategories,
    cashPath: cashPath(8240, personalSpendByMonth, personalIncomeByMonth),
  };

  function combined() {
    return {
      cash: business.cash + personal.cash,
      cardDebt: business.cardDebt + personal.cardDebt,
      net: business.net + personal.net,
      burn90: business.burn90 + personal.burn90,
      burn365: business.burn365 + personal.burn365,
      burn30: business.burn30 + personal.burn30,
      fixedMonthly: business.fixedMonthly + personal.fixedMonthly,
      variableMonthly: business.variableMonthly + personal.variableMonthly,
      spendByMonth: business.spendByMonth.map((v, i) => v + personal.spendByMonth[i]),
      incomeByMonth: business.incomeByMonth.map((v, i) => v + personal.incomeByMonth[i]),
      categories: {
        "30d": [
          { name: "Housing", amount: 1850, share: 0.49 },
          { name: "Tools & software", amount: 198, share: 0.05 },
          { name: "Groceries", amount: 420, share: 0.11 },
          { name: "Contractors", amount: 160, share: 0.04 },
          { name: "Transport", amount: 210, share: 0.06 },
          { name: "Cloud & hosting", amount: 104, share: 0.03 },
          { name: "Other", amount: 837, share: 0.22 },
        ],
        "90d": [
          { name: "Housing", amount: 1850, share: 0.49 },
          { name: "Groceries", amount: 398, share: 0.11 },
          { name: "Tools & software", amount: 186, share: 0.05 },
          { name: "Contractors", amount: 140, share: 0.04 },
          { name: "Transport", amount: 226, share: 0.06 },
          { name: "Cloud & hosting", amount: 98, share: 0.03 },
          { name: "Other", amount: 881, share: 0.23 },
        ],
        "365d": [
          { name: "Housing", amount: 1820, share: 0.54 },
          { name: "Groceries", amount: 376, share: 0.11 },
          { name: "Tools & software", amount: 92, share: 0.03 },
          { name: "Transport", amount: 198, share: 0.06 },
          { name: "Cloud & hosting", amount: 74, share: 0.02 },
          { name: "Contractors", amount: 61, share: 0.02 },
          { name: "Other", amount: 731, share: 0.22 },
        ],
      },
    };
  }

  function bucketOf(name) {
    if (name === "personal") return personal;
    if (name === "combined") return combined();
    return business;
  }

  function burnFor(bucket, range) {
    const b = bucketOf(bucket);
    if (range === "30d") return b.burn30;
    if (range === "365d") return b.burn365;
    return b.burn90;
  }

  function monthVsTypical(bucket, range) {
    const b = bucketOf(bucket);
    const typical = burnFor(bucket, range);
    const dayOfMonth = 18;
    const monthToDate = Math.round(typical * 1.15 * (dayOfMonth / 30));
    const projected = Math.round(monthToDate * (30 / dayOfMonth));
    return {
      typical,
      monthToDate,
      projected,
      dayOfMonth,
      delta: projected - typical,
      deltaPct: typical ? (projected - typical) / typical : 0,
    };
  }

  function floorProgress(bucket) {
    const b = bucketOf(bucket);
    const one = b.burn90;
    const three = b.burn90 * 3;
    const six = b.burn90 * 6;
    return {
      cash: b.cash,
      oneMonth: one,
      threeMonth: three,
      sixMonth: six,
      runwayMonths: b.burn90 ? b.cash / b.burn90 : 0,
      oneFunded: b.cash >= one,
      threeFunded: b.cash >= three,
      sixFunded: b.cash >= six,
    };
  }

  function forecast(bucket, days, burnMultiplier) {
    const b = bucketOf(bucket);
    const daily = (b.burn90 / 30) * burnMultiplier;
    const monthlySigma = b.burn90 * 0.28;
    const points = [];
    for (let i = 0; i <= days; i += 7) {
      const cash = b.cash - daily * i;
      points.push({
        date: addDays(AS_OF, i),
        day: i,
        projected: cash,
        high: cash + monthlySigma * Math.sqrt(Math.max(1, i) / 30),
        low: cash - monthlySigma * Math.sqrt(Math.max(1, i) / 30),
      });
    }
    if (points[points.length - 1].day !== days) {
      const cash = b.cash - daily * days;
      points.push({
        date: addDays(AS_OF, days),
        day: days,
        projected: cash,
        high: cash + monthlySigma * Math.sqrt(days / 30),
        low: cash - monthlySigma * Math.sqrt(days / 30),
      });
    }
    const crossings = [
      { name: "3-month floor", amount: b.burn90 * 3 },
      { name: "1-month floor", amount: b.burn90 },
      { name: "Zero cash", amount: 0 },
    ].map((t) => {
      if (daily <= 0) return { ...t, day: null, date: null };
      const day = Math.round((b.cash - t.amount) / daily);
      if (day < 0) return { ...t, day: 0, date: AS_OF, already: true };
      return { ...t, day, date: addDays(AS_OF, day) };
    });
    return { points, daily, crossings, start: b.cash };
  }

  return {
    AS_OF,
    asOfLabel: "Monday, May 18, 2026",
    monthStarts,
    monthLabel,
    shortMonth,
    parseISO,
    addDays,
    sliceMonths,
    mean,
    findings,
    subscriptions,
    business,
    personal,
    combined: combined(),
    bucketOf,
    burnFor,
    monthVsTypical,
    floorProgress,
    forecast,
    dailySpendSeries,
    ranges: [
      { id: "30d", label: "30d" },
      { id: "90d", label: "90d" },
      { id: "365d", label: "365d" },
    ],
    horizons: [
      { id: 30, label: "30d" },
      { id: 60, label: "60d" },
      { id: 90, label: "90d" },
      { id: 365, label: "365d" },
    ],
  };
})();
