// Design tokens shared by the client (guest) and admin sides.
// Palette: obsidian #0B0B0C · ivory #F3EBDA · antique gold #C9A667 /
// #E8D5A8 · deep nile emerald #123832 / #1F5A50.
// Display: Fraunces. Body: Inter. Mono/util: IBM Plex Mono.
// Fonts are loaded globally in src/index.css.

export const F = {
  display: "'Fraunces', serif",
  body: "'Inter', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

export const COLORS = {
  ink: "#0B0B0C",
  ink2: "#141413",
  ivory: "#F3EBDA",
  ivoryDim: "#D9CEB4",
  gold: "#C9A667",
  goldLight: "#E8D5A8",
  emerald: "#123832",
  emeraldLight: "#1F5A50",
};

export const EVENT_START = new Date("2026-10-28T00:00:00");
