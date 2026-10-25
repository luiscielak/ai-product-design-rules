"use client";

import { useSyncExternalStore } from "react";

declare global {
  interface Window {
    HLTheme?: {
      toggleMode: () => "light" | "dark";
      currentMode: () => "light" | "dark";
    };
  }
}

function subscribe(onChange: () => void) {
  const root = document.documentElement;
  const observer = new MutationObserver(onChange);
  observer.observe(root, { attributes: true, attributeFilter: ["data-mode"] });
  window.addEventListener("storage", onChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onChange);
  };
}

function getMode() {
  return document.documentElement.getAttribute("data-mode") === "dark"
    ? "dark"
    : "light";
}

export function ModeToggle() {
  const mode = useSyncExternalStore(subscribe, getMode, () => "light");

  return (
    <button
      className="portal-quiet-btn"
      type="button"
      aria-pressed={mode === "dark"}
      onClick={() => {
        window.HLTheme?.toggleMode?.();
      }}
    >
      {mode === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
