/* Service worker: receives web push messages and shows notifications.
   No offline caching — the app always loads fresh from the network. */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Folake@50";
  const options = {
    body: data.body || "There's a new announcement.",
    icon: "https://aqjkxcuczeldfleibtzd.supabase.co/storage/v1/object/public/branding/app-icon-192.png",
    badge: "https://aqjkxcuczeldfleibtzd.supabase.co/storage/v1/object/public/branding/app-icon-192.png",
    data: { url: data.url || "/updates" },
    tag: data.tag || "announcement",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/updates";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const win of windows) {
        if (new URL(win.url).origin === self.location.origin) {
          win.navigate(url);
          return win.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
