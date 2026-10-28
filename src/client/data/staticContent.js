// Reference content that doesn't need a database — it's fixed copy, not
// data guests or organizers edit at runtime. (Itinerary, dress codes,
// announcements, guests, and gallery uploads all live in Supabase — see
// src/lib/queries.js.)

export const FAQS = [
  { q: "What are the dates?", a: "Wednesday 4 to Sunday 8 November 2026. The full schedule is in the Itinerary tab." },
  { q: "Where is the celebration?", a: "Lagos, Nigeria. The Thanksgiving Service is at RCCG The King's Court, Victoria Island; Flakes Unscripted is at The Jewel Aeida, Lekki Phase 1. Each event's location is in the Itinerary tab." },
  { q: "Where are guests staying?", a: "Joneer Court, 15 Admiralty Way, Lekki Phase 1. See Travel Information for details." },
  { q: "How do I get to Beach Day?", a: "Departures to YOLO Beach leave from Bics Garden at 10:00 AM, 11:00 AM and 12:00 PM. Pick the one that suits you." },
  { q: "What should I wear?", a: "Each event has its own look: High Fashion Meets Couture for the Thanksgiving Service, All White for Beach Day, and Club Aesthetics. High Fashion. for Flakes Unscripted. See Dress Codes for colours and inspiration." },
  { q: "Where can I get my makeup done?", a: "Glam by Tola, Beauty by Tejj Studio, House of Tara and Beautiebycassie are all recommended. Addresses and numbers are under Makeup Appointments in Travel Information." },
  { q: "Is the Sunday service compulsory?", a: "No. The Church Thanksgiving on Sunday 8 November is optional, a gentle close to the weekend." },
  { q: "Will meals be provided?", a: "Yes, at the main events. Please submit dietary restrictions and allergies in My Trip so the team can plan ahead." },
  { q: "What currency should I bring?", a: "The Nigerian Naira (NGN). Cards are widely accepted in hotels and restaurants; carry some cash for small purchases." },
  { q: "Do I need a visa?", a: "Guests travelling from outside Nigeria may need one. See Travel Information, and confirm with the Nigeria Immigration Service or your airline." },
  { q: "How will schedule changes be communicated?", a: "All changes are posted in Announcements, with urgent updates shown as a banner at the top of the app." },
  { q: "Who should I contact if I'm running late?", a: "Call or WhatsApp Racheal, Guest & Coordination Relations, on +234 814 222 3486." },
  { q: "Can I bring a guest?", a: "Please check with the host team before extending an invitation." },
  { q: "Where can I find the latest itinerary?", a: "The Itinerary tab always reflects the current schedule. Check Announcements for recent changes." },
];

export const CONTACTS = [
  { role: "Guest & Coordination Relations", name: "Racheal", phone: "+234 814 222 3486" },
  { role: "Emergency", name: "Engr. Jamiu Badmos", phone: "+234 809 944 5063" },
  { role: "Emergency", name: "Engr. Niyi Olayiwola", phone: "+234 702 577 3091" },
  { role: "National Emergency", name: "National emergency line", phone: "112" },
  { role: "Lagos State Emergency", name: "Lagos State emergency line", phone: "767" },
];

export const GALLERY_FILTERS = ["All", "Thanksgiving", "Beach Day", "Flakes Unscripted", "Family & Friends", "Behind the Scenes"];

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
  { title: "Dates", body: "Wednesday 4 – Sunday 8 November 2026 · Lagos, Nigeria. The Itinerary tab has the full schedule." },
  { title: "Where We're Staying", body: "Joneer Court, 15 Admiralty Way, Lekki Phase 1 (Airbnb)." },
  { title: "Getting to Lagos", body: "Murtala Muhammed International Airport (LOS) serves international and domestic flights. Share your flight details in My Trip so the team knows when you land." },
  { title: "Makeup Appointments", body: "Glam by Tola: 5a Saheed Ola Close, Lekki Phase 1 · 0703 682 5949\nBeauty by Tejj Studio: 24 Admiralty Way, Lekki Phase 1 · 0817 006 4007\nHouse of Tara: Road 12, No 13A Onikepo Akande, off Admiralty Way, Lekki Phase 1 · 0802 292 2922\nBeautiebycassie: WhatsApp 0907 693 3903 · Phone 0808 945 5430" },
  { title: "Eat & Drink", body: "PÁNU: 9 Otunba Adedoyin Ogungbe Cres, Lekki Phase 1\nNOK by Alara: 12A Akin Olugbade St, Victoria Island\nSalma's Authentic Lebanese Cuisine: 20/24 Ozumba Mbadiwe Ave, Victoria Island\nSLoW: 2 Musa Yar'Adua St, Victoria Island" },
  { title: "Cafés & Pastries", body: "Cusp: 3A Danmole St, Victoria Island\nTiffany Amber Café: 15 Gerrard Rd, Ikoyi" },
  { title: "Art & Culture", body: "Nike Art Gallery: 2 Nike Art Gallery Rd, Lekki Phase 1\nTerra Kulture: Plot 1376 Tiamiyu Savage St, Victoria Island" },
  { title: "Padel", body: "Play Padel Landmark: Landmark Village, Plot 3/4, Water Corporation Drive, Oniru, Victoria Island\nPadel X Nigeria: 23AA Cooper Rd, Ikoyi" },
  { title: "Entry & Visas", body: "Guests travelling from outside Nigeria may need a visa. Check current requirements with the Nigeria Immigration Service well before you travel, and make sure your passport is valid for at least 6 months." },
  { title: "Getting Around", body: "Lagos traffic can be heavy, especially at rush hour and on the bridges between Lekki, Victoria Island and Ikoyi. Allow plenty of extra time between events." },
  { title: "Weather", body: "Warm and humid, usually 25–32°C in November. Pack light, breathable fabrics." },
  { title: "Currency & Cash", body: "Nigerian Naira (NGN). Cards are widely accepted in hotels and restaurants; carry some cash for small purchases." },
  { title: "Power & Charging", body: "230V, Type D / G plugs. Bring a phone charger, a power bank and a travel adapter if you're coming from abroad." },
  { title: "Emergency Numbers", body: "National emergency line 112 · Lagos State emergency line 767. Host team emergency contacts are in Contacts." },
];

export const PACKING_LIST = [
  "Passport or ID",
  "Outfits for each dress code: couture for Thursday, all white for the beach, club glam for Saturday",
  "Comfortable shoes for dancing",
  "Swimwear, sunglasses + sunscreen",
  "Personal medication",
  "Phone charger + power bank",
  "Travel adapter (guests from abroad)",
  "Cash: some NGN",
];
