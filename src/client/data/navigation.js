// The guest app's pages: the bottom nav's tabs, then the rest of the app as
// the More page lists them. Updates lives in the header, as the bell.
// The nav shows icons only (labels are for screen readers). More is a plain
// three-line icon, so it takes the bold weight rather than fill.
import { House, CalendarDots, AddressBook, Image as ImageIcon, List } from "@phosphor-icons/react";

export const MAIN_LINKS = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/itinerary", label: "Itinerary", icon: CalendarDots },
  { to: "/directory", label: "Directory", icon: AddressBook },
  { to: "/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/more", label: "More", icon: List, weight: "bold" },
];

export const MORE_LINKS = [
  { to: "/dress-codes", label: "Dress Codes", desc: "Style guides for every event" },
  { to: "/travel", label: "Travel Information", desc: "Flights, visas & where we're staying" },
  { to: "/my-trip", label: "My Trip", desc: "Your profile & checklist" },
  { to: "/guests", label: "Guest List", desc: "See who's celebrating" },
  { to: "/story", label: "Folake's Story", desc: "Fifty years of grace" },
  { to: "/faq", label: "FAQs", desc: "Answers to common questions" },
];
