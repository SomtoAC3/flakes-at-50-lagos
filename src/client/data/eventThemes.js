// One look per itinerary event. Each theme sets the six base colour tokens
// (src/index.css) for light and dark, the botanical stem drawn in its hero
// (see Stem in src/shared/flora.jsx), the word set large behind it, and the
// headline face.
//
// Themes are matched by activity id; activities organizers add later fall
// back to a keyword match on the name, then to a cycle of the soft themes.
//
// `panel`/`onPanel` colour the hero block and the event's card in the
// itinerary list. Palettes stay muted so the stem is the one point of colour.
// In dark mode every theme sits on the same neutral near-black ground; only
// the panel carries the theme's tint.

const THEMES = {
  arrival: {
    name: "Golden Hour",
    headline: "serif",
    word: ["LAG", "OS"],
    stem: { kind: "tulip", flower: "#D9774A", leaf: "#6E7A45", center: "#6E7A45" },
    light: { bg: "#F6EEE4", card: "#FCF7F0", chip: "#EDDFCF", text: "#2E2019", dim: "#7A6555", accent: "#A4532F", panel: "#E9CDB0", onPanel: "#2E2019" },
    dark: { bg: "#161616", card: "#1F1F1F", chip: "#2A2A2A", text: "#F3E7DA", dim: "#B9A693", accent: "#E5A27D", panel: "#4A2E1E", onPanel: "#F3E7DA" },
  },
  glam: {
    name: "Blush & Mirror",
    headline: "serif",
    word: ["GL", "OW"],
    stem: { kind: "ranunculus", flower: "#E39AAB", leaf: "#8FA486", center: "#8A2E47" },
    light: { bg: "#F7EEEE", card: "#FCF7F7", chip: "#EEDDDE", text: "#2F1C21", dim: "#7D6168", accent: "#9C3F58", panel: "#5A1626", onPanel: "#F6E9E2" },
    dark: { bg: "#161616", card: "#1F1F1F", chip: "#2A2A2A", text: "#F5E6E9", dim: "#BFA2A9", accent: "#E3A1B1", panel: "#4A111E", onPanel: "#F5E6E9" },
  },
  thanksgiving: {
    name: "Blossomed in Grace",
    headline: "serif",
    word: ["GRA", "CE"],
    // From the High Fashion Meets Couture palette. The panel stays blush in
    // dark mode too, so it reads against the burgundy Glam card above it.
    stem: { kind: "poppy", flower: "#8A1F3D", leaf: "#3E7A5C", center: "#D4A017" },
    light: { bg: "#F6F0EA", card: "#FCF8F4", chip: "#ECDFD8", text: "#2A1015", dim: "#7A5A5F", accent: "#8A1F3D", panel: "#EBCFD2", onPanel: "#2A1015" },
    dark: { bg: "#161616", card: "#1F1F1F", chip: "#2A2A2A", text: "#F6E9E2", dim: "#C3A4A8", accent: "#E8A5B5", panel: "#E2C3C8", onPanel: "#2A1015" },
  },
  beach: {
    name: "All White by the Sea",
    headline: "serif",
    word: ["SHO", "RE"],
    stem: { kind: "daisy", flower: "#FFFFFF", leaf: "#5F8C82", center: "#D9C27A" },
    light: { bg: "#F4F3EF", card: "#FFFFFF", chip: "#E4E9E6", text: "#18302F", dim: "#5F7372", accent: "#2E6A6B", panel: "#CFDEDB", onPanel: "#18302F" },
    dark: { bg: "#161616", card: "#1F1F1F", chip: "#2A2A2A", text: "#ECF3F1", dim: "#9DB3B1", accent: "#9CC6C4", panel: "#22403F", onPanel: "#ECF3F1" },
  },
  breakfast: {
    name: "Butter & Sunlight",
    headline: "sans",
    word: ["RI", "SE"],
    stem: { kind: "cosmos", flower: "#E39B3B", leaf: "#7C8A4A", center: "#6B4A12" },
    light: { bg: "#F7F3E4", card: "#FDFAF0", chip: "#EEE6C9", text: "#2C2A14", dim: "#6F6A4C", accent: "#86680C", panel: "#EFE3A6", onPanel: "#2C2A14" },
    dark: { bg: "#161616", card: "#1F1F1F", chip: "#2A2A2A", text: "#F5F0DC", dim: "#BDB596", accent: "#E8D58A", panel: "#4A4318", onPanel: "#F5F0DC" },
  },
  unscripted: {
    name: "Club Aesthetics",
    headline: "sans",
    word: ["NIG", "HT"],
    stem: { kind: "tulip", flower: "#F26B4E", leaf: "#5E7D5E", center: "#5E7D5E" },
    // A night-out world: dark in both modes.
    light: { bg: "#161616", card: "#1F1F1F", chip: "#2A2A2A", text: "#F2ECE6", dim: "#A9A19B", accent: "#F08A6E", panel: "#232323", onPanel: "#F2ECE6" },
    dark: { bg: "#161616", card: "#1F1F1F", chip: "#2A2A2A", text: "#F2ECE6", dim: "#A9A19B", accent: "#F08A6E", panel: "#232323", onPanel: "#F2ECE6" },
  },
  sunday: {
    name: "Sage & Lilac",
    headline: "serif",
    word: ["SUN", "DAY"],
    stem: { kind: "sprig", flower: "#B9A5DD", leaf: "#56744A", center: "#56744A" },
    light: { bg: "#EEF0E8", card: "#F9FAF5", chip: "#DDE2D2", text: "#1E2A1E", dim: "#5E6B59", accent: "#4A6340", panel: "#BCC6AE", onPanel: "#1E2A1E" },
    dark: { bg: "#161616", card: "#1F1F1F", chip: "#2A2A2A", text: "#EDF1E7", dim: "#A5B19C", accent: "#C7B8E6", panel: "#34412E", onPanel: "#EDF1E7" },
  },
};

const BY_ID = {
  "d1-a1": "arrival",
  "d2-a1": "glam",
  "d2-a2": "thanksgiving",
  "d3-a1": "beach",
  "d4-a1": "breakfast",
  "d4-a2": "unscripted",
  "d5-a1": "sunday",
};

const BY_KEYWORD = [
  [/arriv|check.?in|welcome/i, "arrival"],
  [/glam|makeup|getting ready|beauty/i, "glam"],
  [/thanksgiving service|service/i, "thanksgiving"],
  [/beach|pool|boat|yacht/i, "beach"],
  [/breakfast|brunch|lunch/i, "breakfast"],
  [/party|unscripted|night|club|dinner/i, "unscripted"],
  [/church|sunday|prayer/i, "sunday"],
];

const FALLBACK_CYCLE = ["glam", "arrival", "sunday", "breakfast"];

// The theme for an activity; `index` is its position in the whole weekend,
// used only for the fallback cycle.
export function eventTheme(act, index = 0) {
  const key =
    BY_ID[act?.id] ||
    BY_KEYWORD.find(([re]) => re.test(act?.name || ""))?.[1] ||
    FALLBACK_CYCLE[index % FALLBACK_CYCLE.length];
  return { key, ...THEMES[key] };
}

// The theme's colours for a light/dark mode.
export function themeColors(theme, mode) {
  return mode === "dark" ? theme.dark : theme.light;
}

// The matching dress code row, if the activity names one.
export const DRESS_CODE_BY_THEME = { thanksgiving: "thanksgiving", beach: "beach", unscripted: "unscripted" };

// "Thanksgiving Service: Fí Ọlá Kẹ – Blossomed in Grace" → kicker + title;
// the title's tail after " at " or " – " is set as a flourish.
export function splitTitle(name = "") {
  const colon = name.indexOf(": ");
  const kicker = colon > 0 ? name.slice(0, colon) : null;
  const title = colon > 0 ? name.slice(colon + 2) : name;
  const m = /^(.+?)(\s(?:at|–)\s)(.+)$/.exec(title);
  return m ? { kicker, lead: m[1], joiner: m[2], tail: m[3] } : { kicker, lead: title, joiner: "", tail: "" };
}
