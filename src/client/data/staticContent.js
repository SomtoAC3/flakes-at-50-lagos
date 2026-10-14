// Reference content that doesn't need a database — it's fixed copy, not
// data guests or organizers edit at runtime. (Itinerary, dress codes,
// announcements, guests, and gallery uploads all live in Supabase — see
// src/lib/queries.js.)

export const FAQS = [
  { q: "What are the dates?", a: "28 October – 1 November 2026: five days, four nights. We fly into Cairo on the afternoon of 28 October and head home on 1 November." },
  { q: "Where are we going?", a: "Sharm El Sheikh on the Red Sea. We fly Lagos → Cairo → Sharm El Sheikh → Lagos. Cairo is transit only; we continue straight to Sharm." },
  { q: "Where are we staying?", a: "A beach resort in Sharm El Sheikh: Meraki Resort or White Hills Resort. The organizers will confirm which one." },
  { q: "What is included in the package?", a: "Round-trip flight ticket, Egypt sticker visa, meet and assist at the airport, 4 nights in a beach resort, all-inclusive meal plan, private boat cruise with food and drinks, water sports, beach club hangout, and return airport transfer." },
  { q: "Do I need a visa?", a: "Yes. The Egypt sticker visa is included in the package. See Travel Information for what to submit, and for the visa-on-arrival options." },
  { q: "Is transportation included?", a: "Yes. Meet and assist on arrival, the private transfer from Cairo to Sharm El Sheikh, and the return airport transfer are all included." },
  { q: "Will meals be provided?", a: "Yes. The resort stay is on an all-inclusive meal plan, and the private boat cruise includes food and drinks." },
  { q: "What should I wear?", a: "All white for the private boat cruise on 30 October. Bring swimwear, evening outfits and comfortable shoes. See Dress Codes and the packing checklist." },
  { q: "What currency should I bring?", a: "The local currency is the Egyptian Pound (EGP). Carry USD plus some EGP; USD is widely accepted in tourist areas." },
  { q: "Can I travel on different dates?", a: "Flights, visa and transfers are arranged as a group package. If you need different dates, speak to the organizers first." },
  { q: "Can dietary restrictions be accommodated?", a: "Please submit dietary restrictions and allergies in My Trip so the team can coordinate with the resort in advance." },
  { q: "How will schedule changes be communicated?", a: "All changes are posted in Announcements, with urgent updates shown as a banner at the top of the app." },
  { q: "Who should I contact if my flight is delayed?", a: "Contact the organizers listed in Contacts as soon as possible. A group concierge is on call throughout the trip; details are shared at check-in." },
  { q: "Can I bring a guest?", a: "Please check with the organizing team before extending an invitation." },
  { q: "How do I join the WhatsApp group?", a: "A join link is available on the Contacts page." },
  { q: "Where can I find the latest itinerary?", a: "The Itinerary tab always reflects the current schedule. Check Announcements for recent changes." },
];

export const CONTACTS = [
  { role: "Lead Event Organizer", name: "To Be Confirmed", phone: "" },
  { role: "Travel Agent", name: "To Be Confirmed", phone: "" },
  { role: "Group Concierge", name: "On call throughout the trip. Details at check-in.", phone: "" },
  { role: "Resort Contact (Sharm El Sheikh)", name: "To Be Confirmed", phone: "" },
  { role: "Police", name: "Egypt emergency line", phone: "122" },
  { role: "Ambulance", name: "Egypt emergency line", phone: "123" },
  { role: "Tourist Police", name: "Egypt tourist police", phone: "126" },
];

export const GALLERY_FILTERS = ["All", "Arrival", "Beach Club", "Boat Day", "Birthday Dinner", "Quad Biking", "Red Sea", "Behind the Scenes"];

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
  { title: "Dates & Route", body: "28 October – 1 November 2026. Lagos → Cairo → Sharm El Sheikh → Lagos. Cairo is transit only; we continue straight to Sharm El Sheikh." },
  { title: "What's Included", body: "Round-trip flight ticket, Egypt sticker visa, meet and assist at the airport, 4 nights in a beach resort, all-inclusive meal plan, private boat cruise with food and drinks, water sports, beach club hangout, and return airport transfer." },
  { title: "Where You'll Stay", body: "Two resort options in Sharm El Sheikh. Meraki Resort: adult-only energy, stylish design and a vibrant beachfront mood. White Hills Resort: contemporary calm, luminous spaces and a polished Red Sea setting. The organizers will confirm which one." },
  { title: "Visa: Sticker Visa (Embassy Application)", body: "The sticker visa is included in the package. You'll need: your international passport data page, valid for at least 6 months from the travel date; a recent passport photograph on a plain white background; a 3-month bank statement showing a minimum balance of ₦5,000,000; and your intended travel date. Processing takes about 7–10 working days. Submit all documents as clear, properly scanned soft copies." },
  { title: "Visa on Arrival", body: "Without a valid visa: USD 36, payable to immigration on arrival. The fee may change with exchange rates and immigration rules. Holders of a valid UK, US, Canadian or Schengen visa, or a UK residence permit, may also be eligible: USD 36 on arrival. Keep all travel documents to hand on arrival. Fees and eligibility can change, so please confirm before departure." },
  { title: "Airport Transfers", body: "Meet and assist on arrival in Cairo, a private transfer to Sharm El Sheikh on the evening of 28 October, and a return transfer to the airport on 1 November. All included." },
  { title: "Weather", body: "Warm days and mild evenings, 24–32°C." },
  { title: "Currency & Cash", body: "Egyptian Pound (EGP). Carry USD plus some EGP; USD is widely accepted in tourist areas." },
  { title: "Power & Charging", body: "220V, Type C / F plugs. Bring a phone charger, a power bank and a universal travel adapter." },
  { title: "Language", body: "Arabic. English is widely spoken in hotels." },
  { title: "Travel Insurance", body: "Travel insurance is strongly recommended. Bring your insurance documents with you." },
  { title: "Emergency Numbers", body: "Police 122 · Ambulance 123 · Tourist Police 126. A group concierge is on call throughout the trip; details are shared at check-in." },
  { title: "Egypt Travel Etiquette", body: "Resort wear is fine at the resort. Dress more modestly in town and at markets, and always ask before photographing local people." },
];

export const PACKING_LIST = [
  "Passport, valid for 6+ months",
  "Travel insurance documents",
  "Sunglasses + high-SPF sunscreen",
  "Swimwear",
  "Comfortable walking shoes",
  "Evening outfits",
  "All-white outfit for boat day",
  "Wide-brim hat",
  "Personal medication",
  "Camera",
  "Phone charger + power bank",
  "Universal travel adapter",
  "Cash: USD + EGP",
];
