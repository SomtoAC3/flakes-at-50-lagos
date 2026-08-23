// Reference content that doesn't need a database — it's fixed copy, not
// data guests or organizers edit at runtime. (Itinerary, dress codes,
// announcements, guests, and gallery uploads all live in Supabase — see
// src/lib/queries.js.)

export const FAQS = [
  { q: "What dates should I arrive and depart?", a: "Guests are encouraged to arrive by the afternoon of October 28, 2026 and may depart any time on or after November 1, 2026. To Be Confirmed by your travel agent." },
  { q: "Which airport should I use?", a: "To Be Confirmed — arrival airport details will be shared in Travel Information once finalized." },
  { q: "Do I need a visa?", a: "Possibly — entry requirements depend on your nationality. Please confirm current visa requirements with official Egyptian authorities or your airline before booking." },
  { q: "Is transportation included?", a: "Group transportation for scheduled itinerary activities is included. Independent travel outside the itinerary is at each guest's own arrangement and cost." },
  { q: "What is included in the group package?", a: "To Be Confirmed — package inclusions will be shared by the organizing team." },
  { q: "Can I arrange my trip independently?", a: "Yes. Guests are welcome to book their own flights and extend their stay, provided they can meet the group for scheduled activities." },
  { q: "What should I wear?", a: "See the Dress Codes & Style Guide for each event's specific guidance." },
  { q: "What currency should I bring?", a: "The Egyptian Pound (EGP) is the local currency. Many hotels and larger venues accept major cards. Details in Travel Information." },
  { q: "Will meals be provided?", a: "To Be Confirmed — meal inclusions will be listed per itinerary day as details are finalized." },
  { q: "Can dietary restrictions be accommodated?", a: "Please submit dietary restrictions and allergies in My Trip so the team can coordinate with venues in advance." },
  { q: "How will schedule changes be communicated?", a: "All changes are posted in Announcements, with urgent updates shown as a banner at the top of the app." },
  { q: "Who should I contact if my flight is delayed?", a: "Reach out to the Lead Event Organizer or Transportation Coordinator listed in Contacts as soon as possible." },
  { q: "Can I bring a guest?", a: "To Be Confirmed — please check with the organizing team before extending an invitation." },
  { q: "How do I join the WhatsApp group?", a: "A join link is available on the Contacts page." },
  { q: "Where can I find the latest itinerary?", a: "The Itinerary tab always reflects the most current schedule. Check Announcements for recent changes." },
];

export const CONTACTS = [
  { role: "Lead Event Organizer", name: "To Be Confirmed", phone: "" },
  { role: "Travel Agent", name: "To Be Confirmed", phone: "" },
  { role: "Transportation Coordinator", name: "To Be Confirmed", phone: "" },
  { role: "Hotel Contact (Cairo)", name: "To Be Confirmed", phone: "" },
  { role: "Hotel Contact (Red Sea)", name: "To Be Confirmed", phone: "" },
  { role: "Medical Assistance", name: "To Be Confirmed", phone: "" },
  { role: "Local Emergency Services", name: "Egypt Emergency: 122 (Police) / 123 (Ambulance)", phone: "123" },
];

export const GALLERY_FILTERS = ["All", "Welcome", "Cairo", "Boat Party", "Desert Experience", "Birthday Celebration", "Red Sea", "Behind the Scenes"];

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
  { title: "Flights & Arrival", body: "Recommended arrival: October 28, 2026. Recommended departure: November 1, 2026 or later. Flight information, arrival airport, and airport arrival process — To Be Confirmed." },
  { title: "Visa & Passport", body: "Entry requirements vary by nationality. Please confirm current visa requirements with official Egyptian authorities or your airline. Passports should be valid for at least 6 months beyond your travel dates — always verify with your airline." },
  { title: "Travel Insurance", body: "Travel insurance is strongly recommended for all guests. Provider and group policy details — To Be Confirmed." },
  { title: "Airport Transfers", body: "Group transfers are being arranged for guests on shared flight windows — To Be Confirmed." },
  { title: "Hotel Information", body: "Cairo and Red Sea hotel names, addresses, check-in (from) and check-out (until) times, and room arrangements — To Be Confirmed." },
  { title: "Domestic Transportation", body: "Transfer between Cairo and the Red Sea on October 31 — mode (flight or coach) To Be Confirmed." },
  { title: "Currency & Payments", body: "The Egyptian Pound (EGP) is the local currency. Major hotels and restaurants generally accept cards; smaller vendors prefer cash. Notify your bank of international travel." },
  { title: "Weather", body: "Late October / early November in Egypt is typically warm and dry, 26–34°C (79–93°F) by day, cooler in the evening — especially by the water and in the desert." },
  { title: "Time Zone", body: "Egypt Standard Time (EET), UTC+2. Egypt does not observe daylight saving time." },
  { title: "Mobile Data & Wi-Fi", body: "Local SIM cards are available at the airport. Hotels are expected to offer Wi-Fi — confirm details closer to travel." },
  { title: "Egypt Travel Etiquette", body: "Modest dress is appreciated outside resort areas, especially at religious or cultural sites. Always ask before photographing local people." },
];

export const PACKING_LIST = [
  "Passport (valid 6+ months) & printed confirmations",
  "Lightweight, breathable clothing",
  "All-white outfit for the Boat Party",
  "Desert Chic outfit for the sunset experience",
  "Formal wear for the Gala Dinner",
  "Comfortable walking shoes",
  "Sun protection: hat, sunglasses, reef-safe sunscreen",
  "Swimwear & cover-up",
  "Light jacket or shawl for evenings",
  "Universal power adapter (Egypt uses Type C/F, 220V)",
  "Any personal medication",
];
