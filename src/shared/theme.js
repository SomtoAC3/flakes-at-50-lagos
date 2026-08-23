// Design tokens shared by the client (guest) and admin sides.
// Values resolve through CSS variables defined in src/index.css, where the
// light palette lives on :root and the dark palette on [data-theme="dark"]
// (toggled by src/shared/themeMode.js). Inline styles accept var() strings,
// so every COLORS.* usage follows the active theme automatically.
// Light palette: off-white #FAFAF9 · white cards · black text · lapis #1E3D63.
// Dark palette: near-black ground · dark cards · light text · sky lapis #8FAFD9.
// Display: Fraunces (headers only, tracking -0.02em). Everything else: Figtree.
// Flat color only — no gradients anywhere. Rounded rectangles 12–16px.
// Fonts are loaded globally in src/index.css.

export const F = {
  display: "'Fraunces', serif",
  body: "'Figtree', sans-serif",
  mono: "'Figtree', sans-serif",
};

export const COLORS = {
  // Legacy keys, remapped: ink = page ground (and text on the accent),
  // ivory = primary text, ivoryDim = secondary text, gold = accent.
  ink: "var(--bg)",
  ink2: "var(--card)",
  ivory: "var(--text)",
  ivoryDim: "var(--text-dim)",
  gold: "var(--accent)",
  goldLight: "var(--accent)",
  emerald: "var(--accent)",
  emeraldLight: "var(--accent)",
  // New tokens.
  card: "var(--card)",
  chip: "var(--chip)",
  line: "var(--line)",
  accentSoft: "var(--accent-soft)",
  danger: "var(--danger)",
  dangerBg: "var(--danger-bg)",
  dangerLine: "var(--danger-line)",
};

export const EVENT_START = new Date("2026-10-28T00:00:00");
