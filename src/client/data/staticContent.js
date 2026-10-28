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
  { q: "Where can I get my makeup done?", a: "Glam by Tola, Beauty by Tejj Studio, House of Tara and Beautiebycassie are all recommended. Addresses and numbers are in the Directory." },
  { q: "Is the Sunday service compulsory?", a: "No. The Church Thanksgiving on Sunday 8 November is optional, a gentle close to the weekend." },
  { q: "Will meals be provided?", a: "Yes, at the main events. Please submit dietary restrictions and allergies in My Trip so the team can plan ahead." },
  { q: "What currency should I bring?", a: "The Nigerian Naira (NGN). Cards are widely accepted in hotels and restaurants; carry some cash for small purchases." },
  { q: "Do I need a visa?", a: "Guests travelling from outside Nigeria may need one. See Travel Information, and confirm with the Nigeria Immigration Service or your airline." },
  { q: "How will schedule changes be communicated?", a: "All changes are posted in Announcements, with urgent updates shown as a banner at the top of the app." },
  { q: "Who should I contact if I'm running late?", a: "Call or WhatsApp Racheal, Guest & Coordination Relations, on +234 814 222 3486." },
  { q: "Can I bring a guest?", a: "Please check with the host team before extending an invitation." },
  { q: "Where can I find the latest itinerary?", a: "The Itinerary tab always reflects the current schedule. Check Announcements for recent changes." },
];

// The Directory page: things to do in Lagos and people to call. Entries are
// grouped by category in the order the categories first appear.
// Directory entries. Places (anything with an address or photo) show as cards
// with a cover; people and phone lines show as rows. `image` is a photo URL
// (uploaded from admin), and `rating`/`reviews` are the Google rating and
// review count, copied from the place's Google Maps listing.
export const DIRECTORY = [
  { category: "Makeup", name: "Glam by Tola", bio: "Makeup studio in Lekki Phase 1. Book ahead for event days.", address: "5a Saheed Ola Close, Lekki Phase 1", phone: "+234 703 682 5949" },
  { category: "Makeup", name: "Beauty by Tejj Studio", bio: "Lekki studio for bridal, editorial and everyday glam.", address: "24 Admiralty Way, Lekki Phase 1", phone: "+234 817 006 4007" },
  { category: "Makeup", name: "House of Tara", bio: "Tara Fela-Durotoye's beauty house, with a makeup studio and its own product line.", address: "Road 12, No 13A Onikepo Akande, off Admiralty Way, Lekki Phase 1", phone: "+234 802 292 2922" },
  { category: "Makeup", name: "Beautiebycassie", bio: "Makeup artist. Message on WhatsApp to book.", phone: "+234 808 945 5430", whatsapp: "+234 907 693 3903" },
  { category: "Eat & Drink", name: "PÁNU", bio: "New York and Italian-style deli café from Taiwo and Kehinde Smith. Panuzzo sandwiches and inventive lattes.", address: "9 Otunba Adedoyin Ogungbe Cres, Lekki Phase 1" },
  { category: "Eat & Drink", name: "NOK by Alara", bio: "Contemporary West African dining in a garden beside the Alara concept store.", address: "12A Akin Olugbade St, Victoria Island" },
  { category: "Eat & Drink", name: "Salma's Authentic Lebanese Cuisine", bio: "Lebanese favourites: mezze, grills and shawarma.", address: "20/24 Ozumba Mbadiwe Ave, Victoria Island" },
  { category: "Eat & Drink", name: "SLoW", bio: "Tropical brasserie mixing Latin American and West African flavours, with a central bar and live jazz.", address: "2 Musa Yar'Adua St, Victoria Island" },
  { category: "Cafés & Pastries", name: "Cusp", bio: "French-inspired patisserie with West African touches: pastries, bread, desserts and coffee.", address: "3A Danmole St, Victoria Island" },
  { category: "Cafés & Pastries", name: "Tiffany Amber Café", address: "15 Gerrard Rd, Ikoyi" },
  { category: "Art & Culture", name: "Nike Art Gallery", bio: "Thousands of Nigerian artworks over five floors, from paintings to adire textiles, gathered by artist Nike Davies-Okundaye.", address: "2 Nike Art Gallery Rd, Lekki Phase 1" },
  { category: "Art & Culture", name: "Terra Kulture", bio: "Arts centre with a theatre, gallery, bookshop and Nigerian restaurant.", address: "Plot 1376 Tiamiyu Savage St, Victoria Island" },
  { category: "Padel", name: "Play Padel Landmark", bio: "Padel courts at Landmark in Oniru, a short walk from the beach.", address: "Landmark Village, Plot 3/4, Water Corporation Drive, Oniru, Victoria Island" },
  { category: "Padel", name: "Padel X Nigeria", bio: "Ikoyi courts with bookings, coaching and organised matches.", address: "23AA Cooper Rd, Ikoyi" },
  { category: "Host Team", name: "Racheal", detail: "Guest & Coordination Relations", phone: "+234 814 222 3486", whatsapp: "+234 814 222 3486" },
  { category: "Host Team", name: "Engr. Jamiu Badmos", detail: "Emergency", phone: "+234 809 944 5063", whatsapp: "+234 809 944 5063" },
  { category: "Host Team", name: "Engr. Niyi Olayiwola", detail: "Emergency", phone: "+234 702 577 3091", whatsapp: "+234 702 577 3091" },
  { category: "Emergency Lines", name: "National emergency line", phone: "112" },
  { category: "Emergency Lines", name: "Lagos State emergency line", phone: "767" },
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
  { title: "Entry & Visas", body: "Guests travelling from outside Nigeria may need a visa. Check current requirements with the Nigeria Immigration Service well before you travel, and make sure your passport is valid for at least 6 months." },
  { title: "Getting Around", body: "Lagos traffic can be heavy, especially at rush hour and on the bridges between Lekki, Victoria Island and Ikoyi. Allow plenty of extra time between events." },
  { title: "Weather", body: "Warm and humid, usually 25–32°C in November. Pack light, breathable fabrics." },
  { title: "Currency & Cash", body: "Nigerian Naira (NGN). Cards are widely accepted in hotels and restaurants; carry some cash for small purchases." },
  { title: "Power & Charging", body: "230V, Type D / G plugs. Bring a phone charger, a power bank and a travel adapter if you're coming from abroad." },
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
