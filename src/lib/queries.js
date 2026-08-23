import { supabase } from "./supabaseClient";

function requireSupabase() {
  if (!supabase) throw new Error("Supabase is not configured yet — set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.");
  return supabase;
}

// ---------------------------------------------------------------------------
// Itinerary (public read)
// ---------------------------------------------------------------------------
export async function fetchItinerary() {
  const db = requireSupabase();
  const { data: days, error: daysError } = await db.from("itinerary_days").select("*").order("sort_order");
  if (daysError) throw daysError;

  const { data: activities, error: actError } = await db.from("itinerary_activities").select("*").order("sort_order");
  if (actError) throw actError;

  return days.map((day) => ({
    ...day,
    activities: activities.filter((a) => a.day_id === day.id),
  }));
}

// ---------------------------------------------------------------------------
// Dress codes (public read)
// ---------------------------------------------------------------------------
export async function fetchDressCodes() {
  const db = requireSupabase();
  const { data, error } = await db.from("dress_codes").select("*").order("sort_order");
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Announcements (public read; read-receipts + posting need a session)
// ---------------------------------------------------------------------------
export async function fetchAnnouncements() {
  const db = requireSupabase();
  const { data, error } = await db.from("announcements").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchReadAnnouncementIds(guestId) {
  if (!guestId) return new Set();
  const db = requireSupabase();
  const { data, error } = await db.from("announcement_reads").select("announcement_id").eq("guest_id", guestId);
  if (error) throw error;
  return new Set(data.map((r) => r.announcement_id));
}

export async function markAnnouncementRead(guestId, announcementId) {
  const db = requireSupabase();
  const { error } = await db.from("announcement_reads").upsert({ guest_id: guestId, announcement_id: announcementId });
  if (error) throw error;
}

export async function postAnnouncement({ category, priority, message }) {
  const db = requireSupabase();
  const { error } = await db.from("announcements").insert({ category, priority, message });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Guest profile / My Trip
// ---------------------------------------------------------------------------
export async function updateGuestProfile(guestId, fields) {
  const db = requireSupabase();
  const { error } = await db.from("guests").update(fields).eq("id", guestId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Guest directory (opted-in, attending guests — requires a session)
// ---------------------------------------------------------------------------
export async function fetchDirectory() {
  const db = requireSupabase();
  const { data, error } = await db.from("guest_directory").select("*");
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------
export async function fetchApprovedGallery(category) {
  const db = requireSupabase();
  let query = db.from("gallery_uploads").select("*").eq("status", "approved").order("created_at", { ascending: false });
  if (category && category !== "All") query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data.map((row) => ({ ...row, url: publicGalleryUrl(row.storage_path) }));
}

export function publicGalleryUrl(storagePath) {
  const db = requireSupabase();
  return db.storage.from("gallery").getPublicUrl(storagePath).data.publicUrl;
}

export async function uploadGalleryPhoto({ guestId, file, category, caption }) {
  const db = requireSupabase();
  const ext = file.name.split(".").pop();
  const path = `${guestId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: uploadError } = await db.storage.from("gallery").upload(path, file);
  if (uploadError) throw uploadError;

  const { error: insertError } = await db.from("gallery_uploads").insert({
    guest_id: guestId,
    storage_path: path,
    category,
    caption,
    status: "pending",
  });
  if (insertError) throw insertError;
}

export async function fetchPendingGallery() {
  const db = requireSupabase();
  const { data, error } = await db.from("gallery_uploads").select("*").eq("status", "pending").order("created_at");
  if (error) throw error;
  return data.map((row) => ({ ...row, url: publicGalleryUrl(row.storage_path) }));
}

export async function setGalleryStatus(id, status) {
  const db = requireSupabase();
  const { error } = await db.from("gallery_uploads").update({ status }).eq("id", id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Admin: guests + stats
// ---------------------------------------------------------------------------
export async function fetchAllGuests() {
  const db = requireSupabase();
  const { data, error } = await db.from("guests").select("*").order("created_at");
  if (error) throw error;
  return data;
}

export async function fetchAdminStats() {
  const db = requireSupabase();
  const [{ count: totalGuests }, { count: attending }, { count: pendingUploads }, guests] = await Promise.all([
    db.from("guests").select("id", { count: "exact", head: true }),
    db.from("guests").select("id", { count: "exact", head: true }).eq("rsvp_status", "attending"),
    db.from("gallery_uploads").select("id", { count: "exact", head: true }).eq("status", "pending"),
    db.from("guests").select("full_name, phone, email"),
  ]);
  const incompleteProfiles = (guests.data || []).filter((g) => !g.full_name || !g.phone).length;
  return {
    totalGuests: totalGuests ?? 0,
    attending: attending ?? 0,
    incompleteProfiles,
    pendingUploads: pendingUploads ?? 0,
  };
}

export async function setGuestOrganizer(guestId, isOrganizer) {
  const db = requireSupabase();
  const { error } = await db.from("guests").update({ is_organizer: isOrganizer }).eq("id", guestId);
  if (error) throw error;
}
