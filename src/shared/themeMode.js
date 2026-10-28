import { useCallback, useEffect, useState } from "react";

// Theme (light/dark) state. Light is the default regardless of the device
// setting; dark applies only after a guest picks it with the header toggle.
// The inline script in index.html applies the stored choice before first
// paint; this module keeps React, localStorage, and the
// <meta name="theme-color"> tag in sync after that.

const STORAGE_KEY = "theme";
export const META_COLORS = { light: "#FBF1EA", dark: "#141012" };

export function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", META_COLORS[theme] ?? META_COLORS.light);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private browsing / storage disabled — theme still applies for this visit.
  }
}

export function useThemeMode() {
  const [theme, setTheme] = useState(currentTheme);

  const toggle = useCallback(() => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }, []);

  return { theme, toggle };
}

// Follows the active theme without owning the toggle, for components that
// only need to react to it (the header's toggle changes data-theme).
export function useObservedTheme() {
  const [theme, setTheme] = useState(currentTheme);
  useEffect(() => {
    const obs = new MutationObserver(() => setTheme(currentTheme()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return theme;
}
