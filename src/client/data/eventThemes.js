// One look per itinerary event. Each theme sets the six base colour tokens
// (src/index.css) for light and dark, the flowers its art is built from, a
// hero layout (see EventArt in EventPage.jsx) and the headline face.
//
// Themes are matched by activity id; activities organizers add later fall
// back to a keyword match on the name, then to a cycle of the soft themes.
//
// `panel`/`onPanel` colour the hero art block and the event's card in the
// itinerary list. `petals` feed the flower art, in order of prominence.

const THEMES = {
  arrival: {
    name: "Golden Hour",
    layout: "horizon",
    headline: "serif",
    kinds: ["sun", "daisy", "petal4"],
    petals: ["#F4D272", "#F08A5D", "#FBD3B6", "#FFF4EA"],
    light: { bg: "#FCEDE3", card: "#FFF7F1", chip: "#F7D9C6", text: "#3A1E14", dim: "#83594A", accent: "#B9461E", panel: "#F4A27A", onPanel: "#3A1E14" },
    dark: { bg: "#1D120D", card: "#2A1B14", chip: "#3A271D", text: "#FBE8DC", dim: "#C3A08F", accent: "#F4A27A", panel: "#7A3418", onPanel: "#FBE8DC" },
  },
  glam: {
    name: "Blush & Mirror",
    layout: "scatter",
    headline: "serif",
    kinds: ["ring", "petal6", "daisy", "petal4"],
    petals: ["#E86A92", "#F5B8C8", "#FFF4F0", "#C9A3D9"],
    light: { bg: "#FCE8EE", card: "#FFF6F8", chip: "#F7D3DE", text: "#3B1624", dim: "#87566A", accent: "#B8335E", panel: "#F5B8C8", onPanel: "#3B1624" },
    dark: { bg: "#1D0F15", card: "#2B1820", chip: "#3C222D", text: "#FCE6EE", dim: "#C79DAE", accent: "#F5A0BC", panel: "#6E2440", onPanel: "#FCE6EE" },
  },
  thanksgiving: {
    name: "Blossomed in Grace",
    layout: "halo",
    headline: "serif",
    kinds: ["petal6", "scallop", "petal4", "daisy"],
    // From the High Fashion Meets Couture palette.
    petals: ["#B5176A", "#D4A017", "#F2C4CE", "#0B6E4F", "#C1121F", "#1F2A44"],
    light: { bg: "#F8EFE7", card: "#FFF9F4", chip: "#F0DCD3", text: "#2A0F14", dim: "#7B5559", accent: "#9E1F45", panel: "#7B1E2B", onPanel: "#FBEDE6" },
    dark: { bg: "#18090D", card: "#251217", chip: "#381C23", text: "#FBEDE6", dim: "#C5A2A6", accent: "#F2A0B4", panel: "#5E1420", onPanel: "#FBEDE6" },
  },
  beach: {
    name: "All White by the Sea",
    layout: "horizon",
    headline: "serif",
    kinds: ["sun", "daisy", "blob"],
    petals: ["#FFFFFF", "#8BC1CF", "#A9C7B8", "#F3E3C3"],
    light: { bg: "#F6F5F0", card: "#FFFFFF", chip: "#E3ECEA", text: "#13303A", dim: "#5A7279", accent: "#24707F", panel: "#BFDDE2", onPanel: "#13303A" },
    dark: { bg: "#0C171B", card: "#132328", chip: "#1C3238", text: "#EEF6F5", dim: "#9DB8BC", accent: "#8BC1CF", panel: "#1B4752", onPanel: "#EEF6F5" },
  },
  breakfast: {
    name: "Butter & Sunlight",
    layout: "scatter",
    headline: "grotesk",
    kinds: ["petal4", "clover", "daisy", "sun"],
    petals: ["#F3B33D", "#FFFBEA", "#E8743B", "#A9B79A"],
    light: { bg: "#FFF7DD", card: "#FFFCEF", chip: "#F8E8AE", text: "#3A2A08", dim: "#7F6A3A", accent: "#9A5F00", panel: "#F6D265", onPanel: "#3A2A08" },
    dark: { bg: "#1A1406", card: "#26200E", chip: "#3A3015", text: "#FFF4D2", dim: "#C9B88A", accent: "#F6D265", panel: "#6B5310", onPanel: "#FFF4D2" },
  },
  unscripted: {
    name: "Club Aesthetics",
    layout: "cluster",
    headline: "grotesk",
    kinds: ["clover", "ring", "petal6", "petal4"],
    petals: ["#F26B2A", "#F2A2C0", "#9B6BE0", "#F6D33C"],
    // A night-out world: black in both modes.
    light: { bg: "#0E0B0C", card: "#1B1617", chip: "#2A2224", text: "#F8EDE6", dim: "#B9A7A2", accent: "#F2A2C0", panel: "#000000", onPanel: "#F8EDE6" },
    dark: { bg: "#0E0B0C", card: "#1B1617", chip: "#2A2224", text: "#F8EDE6", dim: "#B9A7A2", accent: "#F2A2C0", panel: "#000000", onPanel: "#F8EDE6" },
  },
  sunday: {
    name: "Sage & Lilac",
    layout: "halo",
    headline: "serif",
    kinds: ["daisy", "petal4", "blob"],
    petals: ["#FFFFFF", "#C9B6E4", "#A9B79A", "#E9DDF4"],
    light: { bg: "#EFF2EA", card: "#FAFBF6", chip: "#DCE3D2", text: "#1F2A1C", dim: "#5F6E58", accent: "#4F6B42", panel: "#B9C6A8", onPanel: "#1F2A1C" },
    dark: { bg: "#10140E", card: "#1A2017", chip: "#283023", text: "#EEF2E8", dim: "#A6B39C", accent: "#C9B6E4", panel: "#3B4A32", onPanel: "#EEF2E8" },
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
