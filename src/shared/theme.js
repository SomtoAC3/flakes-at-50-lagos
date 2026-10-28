// Design tokens shared by the client (guest) and admin sides.
// Values resolve through CSS variables defined in src/index.css, where the
// light palette lives on :root and the dark palette on [data-theme="dark"]
// (toggled by src/shared/themeMode.js; light is the default). Inline styles
// accept var() strings, so every COLORS.* usage follows the active theme.
// Quiet botanical: garden-paper ground #F2EFE7 · deep green ink and accent
// #2E4B3B, hairline rules, and one flat flower on its stem where a page needs
// colour (src/shared/flora.jsx). Dark: #161616 ground, pale sage accent.
// Display: Bodoni Moda with automatic optical sizing, italics for flourish.
// Body: Bricolage Grotesque. Soft round cards, pill buttons.
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
  flowerRose: "var(--flower-rose)",
  flowerCoral: "var(--flower-coral)",
  flowerLilac: "var(--flower-lilac)",
  flowerButter: "var(--flower-butter)",
  leaf: "var(--leaf)",
  danger: "var(--danger)",
  dangerBg: "var(--danger-bg)",
  dangerLine: "var(--danger-line)",
};

// Bodoni Moda with automatic optical sizing: sturdier hairlines at small
// sizes so it stays legible on phones, full couture contrast on headlines.
export const DISPLAY_LUXE = { fontFamily: F.display, fontOpticalSizing: "auto", fontWeight: 400 };

// Small uppercase label style used for eyebrows, buttons and captions.
export const CAPS = { textTransform: "uppercase", letterSpacing: "0.2em" };

// Countdown target until the itinerary loads (the first day of the weekend).
export const EVENT_START = new Date("2026-11-04T00:00:00");

// Every form field in the app: a 48px pill to match GoldButton, with 16px
// text so iOS doesn't zoom in on focus. Multi-line fields can't be a pill, so
// they take the largest radius that still reads as one at three rows.
export const FIELD_CLASS =
  "w-full h-12 rounded-full px-5 text-[16px] outline-none border border-[var(--line)] transition-colors focus:border-[var(--accent)]";
export const TEXTAREA_CLASS =
  "w-full min-h-[104px] rounded-[24px] px-5 py-3 text-[16px] leading-snug outline-none border border-[var(--line)] transition-colors focus:border-[var(--accent)] resize-none block";
export const FIELD_STYLE = { background: COLORS.card, color: COLORS.ivory, fontFamily: F.body };
