// Reference content that doesn't need a database — it's fixed copy, not
// data guests or organizers edit at runtime. (Itinerary, dress codes,
// announcements, guests, and gallery uploads all live in Supabase — see
// src/lib/queries.js.)

export const FAQS = [
  { q: "What are the dates?", a: "To Be Confirmed. The full schedule will appear in the Itinerary tab as soon as it is published." },
  { q: "Where is the celebration?", a: "Lagos, Nigeria. Venue details To Be Confirmed; check the Itinerary tab for each event's location." },
  { q: "Where should out-of-town guests stay?", a: "Hotel recommendations To Be Confirmed. See Travel Information for updates." },
  { q: "Is transportation provided?", a: "To Be Confirmed. Any shuttle or transfer arrangements will be posted in Announcements." },
  { q: "Will meals be provided?", a: "Yes, at the main events. Please submit dietary restrictions and allergies in My Trip so the team can plan ahead." },
  { q: "What should I wear?", a: "Each event has its own look. See Dress Codes for colours, inspiration and what to avoid." },
  { q: "What currency should I bring?", a: "The Nigerian Naira (NGN). Cards are widely accepted in hotels and restaurants; carry some cash for small purchases." },
  { q: "Do I need a visa?", a: "Guests travelling from outside Nigeria may need one. See Travel Information, and confirm with the Nigeria Immigration Service or your airline." },
  { q: "Can dietary restrictions be accommodated?", a: "Please submit dietary restrictions and allergies in My Trip so the team can coordinate in advance." },
  { q: "How will schedule changes be communicated?", a: "All changes are posted in Announcements, with urgent updates shown as a banner at the top of the app." },
  { q: "Who should I contact if I'm running late?", a: "Contact the organizers listed in Contacts as soon as possible." },
  { q: "Can I bring a guest?", a: "Please check with the organizing team before extending an invitation." },
  { q: "How do I join the WhatsApp group?", a: "A join link is available on the Contacts page." },
  { q: "Where can I find the latest itinerary?", a: "The Itinerary tab always reflects the current schedule. Check Announcements for recent changes." },
];

export const CONTACTS = [
  { role: "Lead Event Organizer", name: "To Be Confirmed", phone: "" },
  { role: "Guest Relations", name: "To Be Confirmed", phone: "" },
  { role: "Venue Contact", name: "To Be Confirmed", phone: "" },
  { role: "Emergency", name: "National emergency line", phone: "112" },
  { role: "Lagos State Emergency", name: "Lagos State emergency line", phone: "767" },
];

export const GALLERY_FILTERS = ["All", "The Celebration", "Dinner", "The Party", "Family & Friends", "Behind the Scenes"];

export const STORY_SECTIONS = [
  { title: "About Folake", body: "A short biography celebrating who Folake is — To Be Confirmed / awaiting content." },
  { title: "Her Journey to 50", body: "Reflections on the road to this milestone — To Be Confirmed." },
  { title: "Family", body: "Stories and photos of Folake's family — To Be Confirmed." },
  { title: "Friendships", body: "The people who've shaped her journey — To Be Confirmed." },
  { title: "Career & Accomplishments", body: "Milestones worth celebrating — To Be Confirmed." },
  { title: "Favorite Memories", body: "Moments that made her smile — To Be Confirmed." },
  { title: "Fifty Years of Grace", body: "A closing reflection — To Be Confirmed." },
];

export const TRAVEL_SECTIONS = [
  { title: "Dates & Venue", body: "Lagos, Nigeria. Dates and venue To Be Confirmed; the Itinerary tab will have the full schedule once it's published." },
  { title: "Getting to Lagos", body: "Murtala Muhammed International Airport (LOS) serves international and domestic flights. Share your flight details in My Trip so the team knows when you land." },
  { title: "Where to Stay", body: "Hotel recommendations for out-of-town guests To Be Confirmed." },
  { title: "Entry & Visas", body: "Guests travelling from outside Nigeria may need a visa. Check current requirements with the Nigeria Immigration Service well before you travel, and make sure your passport is valid for at least 6 months." },
  { title: "Getting Around", body: "Lagos traffic can be heavy, especially at rush hour and on bridges between the Island and Mainland. Allow plenty of extra time between events." },
  { title: "Weather", body: "Warm and humid all year, usually 25–32°C. Pack light, breathable fabrics." },
  { title: "Currency & Cash", body: "Nigerian Naira (NGN). Cards are widely accepted in hotels and restaurants; carry some cash for small purchases." },
  { title: "Power & Charging", body: "230V, Type D / G plugs. Bring a phone charger, a power bank and a travel adapter if you're coming from abroad." },
  { title: "Language", body: "English." },
  { title: "Emergency Numbers", body: "National emergency line 112 · Lagos State emergency line 767." },
];

export const PACKING_LIST = [
  "Passport or ID",
  "Outfits for each dress code",
  "Comfortable shoes for dancing",
  "Sunglasses + sunscreen",
  "Personal medication",
  "Phone charger + power bank",
  "Travel adapter (guests from abroad)",
  "Cash: some NGN",
];
