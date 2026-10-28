// Cover photos from Google Places for directory entries without an uploaded
// photo. It only runs while a key is set and until the event is over; cards
// fall back to their flower covers otherwise. Google doesn't allow storing
// its photos, so each place is looked up live, once per visit.
//
// Lookups stay in the cheapest tiers: a text search for the place ID only,
// then the place's photo list only, then the photo itself.
const KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY;
const UNTIL = new Date("2026-11-09T23:59:59+01:00").getTime();
const API = "https://places.googleapis.com/v1";
const cache = new Map();

const enabled = () => Boolean(KEY) && Date.now() < UNTIL;

async function call(path, fields, body) {
  const res = await fetch(`${API}/${path}`, {
    method: body ? "POST" : "GET",
    headers: { "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": fields, ...(body && { "Content-Type": "application/json" }) },
    body: body && JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Places request failed (${res.status})`);
  return res.json();
}

async function lookup(query) {
  const { places } = await call("places:searchText", "places.id", { textQuery: query, regionCode: "NG", pageSize: 1 });
  const id = places?.[0]?.id;
  if (!id) return null;
  const { photos } = await call(`places/${id}`, "photos");
  const photo = photos?.[0];
  if (!photo) return null;
  const author = photo.authorAttributions?.[0];
  return {
    src: `${API}/${photo.name}/media?maxWidthPx=800&key=${KEY}`,
    author: author?.displayName || "",
    authorUrl: author?.uri || "",
  };
}

// Resolves to { src, author, authorUrl } or null.
export function fetchPlacePhoto(query) {
  if (!enabled()) return Promise.resolve(null);
  if (!cache.has(query)) cache.set(query, lookup(query).catch(() => null));
  return cache.get(query);
}
