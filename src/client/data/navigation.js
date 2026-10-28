// The guest app's pages, as the header menu lists them: the main pages set
// large, then the rest as a quieter directory.

export const MAIN_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/itinerary", label: "Itinerary" },
  { to: "/updates", label: "Updates" },
  { to: "/gallery", label: "Gallery" },
];

export const MORE_LINKS = [
  { to: "/dress-codes", label: "Dress Codes", desc: "Style guides for every event" },
  { to: "/travel", label: "Travel Information", desc: "Flights, visas, hotels & more" },
  { to: "/my-trip", label: "My Trip", desc: "Your profile & checklist" },
  { to: "/directory", label: "Guest Directory", desc: "See who's celebrating" },
  { to: "/story", label: "Folake's Story", desc: "Fifty years of grace" },
  { to: "/faq", label: "FAQs", desc: "Answers to common questions" },
  { to: "/contacts", label: "Contacts", desc: "Emergency & organizer info" },
];
