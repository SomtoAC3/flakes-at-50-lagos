import { supabase } from "./supabaseClient";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("[push] service worker registration failed:", err);
    });
  }
}

/**
 * Push works only in a secure context with SW + Push + Notification APIs.
 * On iOS that additionally means iOS 16.4+ AND the site opened from the
 * home screen — plain Safari tabs report no PushManager, so this check
 * doubles as the "install first" signal on iPhones.
 */
export function isPushSupported() {
  return (
    Boolean(VAPID_PUBLIC_KEY) &&
    Boolean(supabase) &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getPermissionState() {
  return "Notification" in window ? Notification.permission : "unsupported";
}

export async function getExistingSubscription() {
  if (!isPushSupported()) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((ch) => ch.charCodeAt(0)));
}

export async function subscribeToPush(userId = null) {
  if (!isPushSupported()) throw new Error("Notifications aren't supported here.");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notifications were not allowed.");

  const reg = await navigator.serviceWorker.ready;
  const sub =
    (await reg.pushManager.getSubscription()) ||
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    }));

  const json = sub.toJSON();
  const row = {
    endpoint: sub.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
    user_id: userId,
  };
  // No upsert: ON CONFLICT DO UPDATE needs a SELECT policy to read the
  // conflicting row, and this table deliberately has none. Insert, and on a
  // duplicate endpoint fall back to updating that row.
  const { error } = await supabase.from("push_subscriptions").insert(row);
  if (error?.code === "23505") {
    const { error: updateError } = await supabase
      .from("push_subscriptions")
      .update(row)
      .eq("endpoint", sub.endpoint);
    if (updateError) throw updateError;
  } else if (error) {
    throw error;
  }
  return sub;
}

export async function unsubscribeFromPush() {
  const sub = await getExistingSubscription();
  if (!sub) return;
  await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
  await sub.unsubscribe();
}
