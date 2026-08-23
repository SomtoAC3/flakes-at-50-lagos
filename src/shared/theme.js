// Design tokens shared by the client (guest) and admin sides.
// Palette: off-white #FAFAF9 · plain white cards · black text #111111 ·
// neutral grey #6B6B6B / #F0F0EE · lapis #1E3D63 (the only color).
// Display: Fraunces (headers only, tracking -0.02em). Everything else: Figtree.
// Flat color only — no gradients anywhere. Rounded rectangles 12–16px.
// Fonts are loaded globally in src/index.css.

export const F = {
  display: "'Fraunces', serif",
  body: "'Figtree', sans-serif",
  mono: "'Figtree', sans-serif",
};

export const COLORS = {
  // Legacy keys, remapped to the light theme so existing usages restyle:
  // ink = page ground (and text on lapis), ivory = primary text,
  // ivoryDim = secondary text, gold = lapis accent.
  ink: "#FAFAF9",
  ink2: "#FFFFFF",
  ivory: "#111111",
  ivoryDim: "#6B6B6B",
  gold: "#1E3D63",
  goldLight: "#2E5488",
  emerald: "#16304E",
  emeraldLight: "#2E5488",
  // New tokens.
  card: "#FFFFFF",
  chip: "#F0F0EE",
  line: "rgba(17,17,17,0.09)",
};

export const EVENT_START = new Date("2026-10-28T00:00:00");
