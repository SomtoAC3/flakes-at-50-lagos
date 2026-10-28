// Public URLs for the branding bucket — fixed paths overwritten from the
// admin Settings page. Referenced by the manifest, index.html, and sw.js too,
// so keep the filenames in sync if they ever change.
import { supabase } from "./supabaseClient";

const BRANDING_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/branding`;

export function brandingUrl(path, version) {
  return `${BRANDING_BASE}/${path}${version ? `?v=${version}` : ""}`;
}

export const BRANDING_PATHS = {
  icon512: "app-icon-512.png",
  icon192: "app-icon-192.png",
  appleTouch: "apple-touch-icon.png",
  folakePhoto: "folake-photo.png",
  storyHero: "story-hero.png",
};

// Per-dress-code inspiration banner, keyed by the dress code's id.
export function dressCodePhotoPath(id) {
  return `dress-code-${id}.jpg`;
}

// Directory cover photos get a fresh path per upload, so a replaced photo
// never shows from a guest's cache.
export function directoryPhotoPath() {
  return `directory/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
}

// Shrinks a photo to at most maxW wide, saves it as a JPEG at `path` in the
// branding bucket (organizers only) and returns its public URL.
export async function uploadBrandingPhoto(path, file, maxW = 1200) {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, maxW / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't process the image."))), "image/jpeg", 0.85)
  );
  const { error } = await supabase.storage.from("branding").upload(path, blob, { upsert: true, contentType: "image/jpeg", cacheControl: "3600" });
  if (error) throw error;
  return brandingUrl(path);
}
