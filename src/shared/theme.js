// Design tokens shared by the client (guest) and admin sides.
// Values resolve through CSS variables defined in src/index.css, where the
// light palette lives on :root and the dark palette on [data-theme="dark"]
// (toggled by src/shared/themeMode.js; light is the default). Inline styles
// accept var() strings, so every COLORS.* usage follows the active theme.
// Editorial luxury: studio-stone ground #F3F2EF · near-black ink · warm grey ·
// antique gold #82612D (dark: #0F0E0D ground, gold #CDA968).
// Display: Fraunces, light weight at a high optical size. Labels: uppercase
// Figtree with wide tracking. Hairlines over boxes; corners nearly square.
// Fonts are loaded globally in src/index.css.

export const F = {
  display: "'Fraunces', Georgia, serif",
  body: "'Figtree', system-ui, sans-serif",
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

// Fraunces at its largest optical size: high-contrast, couture-weight strokes.
export const DISPLAY_LUXE = { fontFamily: "'Fraunces', Georgia, serif", fontVariationSettings: '"opsz" 144', fontWeight: 300 };

// Small uppercase label style used for eyebrows, buttons and captions.
export const CAPS = { textTransform: "uppercase", letterSpacing: "0.2em" };

export const EVENT_START = new Date("2026-10-28T00:00:00");
