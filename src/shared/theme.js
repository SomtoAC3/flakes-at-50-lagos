// Design tokens shared by the client (guest) and admin sides.
// Values resolve through CSS variables defined in src/index.css, where the
// light palette lives on :root and the dark palette on [data-theme="dark"]
// (toggled by src/shared/themeMode.js; light is the default). Inline styles
// accept var() strings, so every COLORS.* usage follows the active theme.
// Floral editorial: blush-cream ground #FBF1EA · aubergine ink · raspberry
// accent #B8335E, with flat flower shapes from src/shared/flora.jsx
// (dark: #141012 ground, pink accent #F29BB5, the same bright flowers).
// Display: Bodoni Moda with automatic optical sizing, italics for flourish.
// Body and bold headlines: Bricolage Grotesque. Soft round cards, pill buttons.
// Fonts are loaded globally in src/index.css.

export const F = {
  display: "'Bodoni Moda', 'Didot', Georgia, serif",
  body: "'Bricolage Grotesque', system-ui, sans-serif",
  grotesk: "'Bricolage Grotesque', system-ui, sans-serif",
  mono: "'Bricolage Grotesque', sans-serif",
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
  onFlower: "var(--on-flower)",
  flowerPink: "var(--flower-pink)",
  flowerPeach: "var(--flower-peach)",
  flowerSage: "var(--flower-sage)",
  flowerButter: "var(--flower-butter)",
  flowerLilac: "var(--flower-lilac)",
  flowerOrange: "var(--flower-orange)",
  danger: "var(--danger)",
  dangerBg: "var(--danger-bg)",
  dangerLine: "var(--danger-line)",
};

// Bodoni Moda with automatic optical sizing: sturdier hairlines at small
// sizes so it stays legible on phones, full couture contrast on headlines.
export const DISPLAY_LUXE = { fontFamily: F.display, fontOpticalSizing: "auto", fontWeight: 400 };

// Small uppercase label style used for eyebrows, buttons and captions.
export const CAPS = { textTransform: "uppercase", letterSpacing: "0.2em" };

// The flower set in order, for cycling colours across a list.
export const FLOWER_SET = [COLORS.flowerPink, COLORS.flowerPeach, COLORS.flowerSage, COLORS.flowerButter, COLORS.flowerLilac];

// Countdown target until the itinerary loads (the first day of the weekend).
export const EVENT_START = new Date("2026-11-04T00:00:00");
