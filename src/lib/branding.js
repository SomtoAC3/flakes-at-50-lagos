// Public URLs for the branding bucket — fixed paths overwritten from the
// admin Settings page. Referenced by the manifest, index.html, and sw.js too,
// so keep the filenames in sync if they ever change.
const BRANDING_BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/branding`;

export function brandingUrl(path, version) {
  return `${BRANDING_BASE}/${path}${version ? `?v=${version}` : ""}`;
}

export const BRANDING_PATHS = {
  icon512: "app-icon-512.png",
  icon192: "app-icon-192.png",
  appleTouch: "apple-touch-icon.png",
  folakePhoto: "folake-photo.png",
};
