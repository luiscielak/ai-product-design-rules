/**
 * The Hooman Loop — Theme engine (mode + palette).
 *
 * Mode is the only real axis: "light" | "dark".
 * Palette is kept for API compatibility. Konstrukt 2.0 ships one palette,
 * "atelier"; the 1.x names (hl, sqdl, courage, minimal, blueprint) are
 * accepted and normalized to it, so stored preferences keep working.
 *
 * Applies data-mode and data-palette on <html>.
 * Optional: data-hl-lock-mode="light" forces light mode for this document only
 * (no MODE_KEY writes; palette still syncs).
 * Persists to localStorage; syncs across tabs.
 *
 * Backwards-compatible:
 *   - On first load after rebrand, copies any `sqdl-*` localStorage keys → `hl-*`,
 *     then deletes the originals (sentinel `hl-storage-migrated` prevents re-run).
 *   - Migrates ancient `sqdl-theme` key on first load.
 *   - Keeps `data-theme` attribute in sync with `data-mode`.
 *   - Falls back to reading `data-sqdl-lock-mode` if the new attribute is absent.
 *   - Accepts any 1.x palette name and renders it as `atelier`.
 *   - Exposes `window.SQDLTheme` as an alias for `window.HLTheme` so legacy
 *     inline scripts keep working.
 */
(function () {
  /* ── Storage migration: SQDL → HL (one-shot per browser) ── */
  try {
    if (!localStorage.getItem('hl-storage-migrated')) {
      for (var mi = localStorage.length - 1; mi >= 0; mi--) {
        var oldKey = localStorage.key(mi);
        if (oldKey && oldKey.indexOf('sqdl-') === 0) {
          var newKey = 'hl-' + oldKey.slice(5);
          if (localStorage.getItem(newKey) == null) {
            localStorage.setItem(newKey, localStorage.getItem(oldKey));
          }
          localStorage.removeItem(oldKey);
        }
      }
      localStorage.setItem('hl-storage-migrated', '1');
    }
  } catch (e) { /* ignore */ }

  /* Chromeless layout for portal pages loaded in preview iframes (?embed=1) */
  try {
    if (new URL(window.location.href).searchParams.get('embed') === '1') {
      document.documentElement.setAttribute('data-embed', 'true');
    }
  } catch (e) { /* ignore */ }

  var MODE_KEY = 'hl-mode';
  var PALETTE_KEY = 'hl-palette';
  var LEGACY_THEME_KEY = 'hl-theme';
  var PALETTES = ['atelier'];
  var LEGACY_PALETTES = ['hl', 'sqdl', 'courage', 'minimal', 'blueprint'];
  var DEFAULT_PALETTE = 'atelier';

  /* Backwards-compat: every 1.x palette name renders as atelier. */
  function normalizePalette(name) {
    if (LEGACY_PALETTES.indexOf(name) !== -1) return DEFAULT_PALETTE;
    return name;
  }

  function isModeLockedLight() {
    var root = document.documentElement;
    return (
      root.getAttribute('data-hl-lock-mode') === 'light' ||
      root.getAttribute('data-sqdl-lock-mode') === 'light'
    );
  }

  /* ── Storage helpers ── */
  function getStored(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function setStored(key, val) {
    try {
      if (val != null) localStorage.setItem(key, val);
      else localStorage.removeItem(key);
    } catch (e) {}
  }

  /* ── System preference ── */
  function systemMode() {
    if (typeof window.matchMedia !== 'function') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /* ── Migrate legacy theme key ── */
  function migrateLegacy() {
    var legacy = getStored(LEGACY_THEME_KEY);
    if (legacy && !getStored(MODE_KEY)) {
      setStored(MODE_KEY, legacy === 'dark' ? 'dark' : 'light');
      setStored(PALETTE_KEY, DEFAULT_PALETTE);
      try { localStorage.removeItem(LEGACY_THEME_KEY); } catch (e) {}
    }
  }

  /* ── Apply to DOM ── */
  function apply(mode, palette) {
    var root = document.documentElement;
    root.setAttribute('data-mode', mode);
    root.setAttribute('data-theme', mode); // backward compat
    root.setAttribute('data-palette', normalizePalette(palette));
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#121212' : '#F5F5F0');
  }

  /* ── Read current state ── */
  function currentMode() {
    var m = document.documentElement.getAttribute('data-mode');
    if (m === 'dark' || m === 'light') return m;
    return getStored(MODE_KEY) || systemMode();
  }

  function currentPalette() {
    var p = normalizePalette(document.documentElement.getAttribute('data-palette'));
    if (PALETTES.indexOf(p) !== -1) return p;
    var stored = normalizePalette(getStored(PALETTE_KEY));
    return PALETTES.indexOf(stored) !== -1 ? stored : DEFAULT_PALETTE;
  }

  /* ── Init ── */
  function init() {
    migrateLegacy();
    var palette = normalizePalette(getStored(PALETTE_KEY));
    if (PALETTES.indexOf(palette) === -1) palette = DEFAULT_PALETTE;

    if (isModeLockedLight()) {
      apply('light', palette);
      setStored(PALETTE_KEY, palette);
    } else {
      var mode = getStored(MODE_KEY);
      if (mode !== 'dark' && mode !== 'light') mode = systemMode();
      apply(mode, palette);
      setStored(MODE_KEY, mode);
      setStored(PALETTE_KEY, palette);
    }

    window.addEventListener('storage', function (e) {
      if (e.key === MODE_KEY || e.key === PALETTE_KEY) {
        var p = normalizePalette(getStored(PALETTE_KEY)) || currentPalette();
        if (isModeLockedLight()) {
          apply('light', PALETTES.indexOf(p) !== -1 ? p : DEFAULT_PALETTE);
        } else {
          var m = getStored(MODE_KEY) || currentMode();
          apply(m, p);
        }
      }
    });
  }

  /* ── Public API ── */
  function toggleMode() {
    if (isModeLockedLight()) {
      apply('light', currentPalette());
      return 'light';
    }
    var next = currentMode() === 'dark' ? 'light' : 'dark';
    setStored(MODE_KEY, next);
    apply(next, currentPalette());
    return next;
  }

  function setMode(mode) {
    if (mode !== 'dark' && mode !== 'light') return;
    if (isModeLockedLight()) {
      apply('light', currentPalette());
      return;
    }
    setStored(MODE_KEY, mode);
    apply(mode, currentPalette());
  }

  function setPalette(name) {
    var p = normalizePalette(name);
    if (PALETTES.indexOf(p) === -1) return;
    setStored(PALETTE_KEY, p);
    apply(currentMode(), p);
  }

  window.HLTheme = {
    init: init,
    toggle: toggleMode,      // backward compat alias
    toggleMode: toggleMode,
    setMode: setMode,
    setPalette: setPalette,
    current: currentMode,    // backward compat alias
    currentMode: currentMode,
    currentPalette: currentPalette,
    palettes: PALETTES
  };
  window.SQDLTheme = window.HLTheme;
  window.PortalTheme = window.HLTheme;

  init();
})();
