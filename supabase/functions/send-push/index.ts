// Sends a web push notification to every stored subscription.
// Invoked from the admin Announcements page right after a post succeeds.
// Only organizers may call it; dead subscriptions (410/404) are pruned.
//
// Secrets required (supabase secrets set):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (mailto:...)

import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Caller must be a signed-in organizer.
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) return json({ error: "Not signed in." }, 401);

    const { data: guest } = await admin
      .from("guests")
      .select("is_organizer")
      .eq("id", userData.user.id)
      .maybeSingle();
    if (!guest?.is_organizer) return json({ error: "Organizers only." }, 403);

    const { title, body, url } = await req.json();
    if (!body) return json({ error: "A message body is required." }, 400);

    webpush.setVapidDetails(
      Deno.env.get("VAPID_SUBJECT")!,
      Deno.env.get("VAPID_PUBLIC_KEY")!,
      Deno.env.get("VAPID_PRIVATE_KEY")!
    );

    const { data: subs, error: subsErr } = await admin
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth");
    if (subsErr) return json({ error: subsErr.message }, 500);

    const payload = JSON.stringify({
      title: title || "Flakes@50",
      body,
      url: url || "/updates",
    });

    let sent = 0;
    const dead: string[] = [];
    await Promise.all(
      (subs ?? []).map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          );
          sent++;
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode;
          if (status === 404 || status === 410) dead.push(sub.endpoint);
        }
      })
    );

    if (dead.length > 0) {
      await admin.from("push_subscriptions").delete().in("endpoint", dead);
    }

    return json({ sent, failed: (subs?.length ?? 0) - sent - dead.length, removed: dead.length });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
