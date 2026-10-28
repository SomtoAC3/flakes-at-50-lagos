import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { COLORS } from "../../shared/theme";
import { Card, SectionTitle, Badge, GoldButton, LoadingNote, ErrorNote } from "../../shared/ui";
import { useAuth } from "../../lib/auth";
import { fetchAnnouncements, fetchReadAnnouncementIds, markAnnouncementRead } from "../../lib/queries";
import { isPushSupported, getPermissionState, getExistingSubscription, subscribeToPush, unsubscribeFromPush } from "../../lib/push";

const priorityTone = { urgent: "urgent", normal: "gold" };

export default function Updates() {
  const { configured, user } = useAuth();
  const [announcements, setAnnouncements] = useState(null);
  const [readIds, setReadIds] = useState(new Set());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!configured) {
      setError("Supabase isn't connected yet, so announcements can't load.");
      return;
    }
    fetchAnnouncements()
      .then(setAnnouncements)
      .catch((e) => setError(e.message));
  }, [configured]);

  useEffect(() => {
    if (!user) return;
    fetchReadAnnouncementIds(user.id).then(setReadIds).catch(() => {});
  }, [user]);

  async function markRead(id) {
    setReadIds((s) => new Set([...s, id]));
    if (user) {
      try {
        await markAnnouncementRead(user.id, id);
      } catch {
        // non-fatal — local state already updated
      }
    }
  }

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Stay in the Loop" title="Announcements" light sub="Real-time updates from the organizing team. Urgent items also appear as a banner." />
      <ErrorNote message={error} />
      <NotificationOptIn userId={user?.id ?? null} />
      {!announcements && !error && <LoadingNote label="Loading announcements…" />}
      {announcements && (
        <div className="space-y-3">
          {announcements.length === 0 && (
            <p className="text-[12.5px]" style={{ color: COLORS.ivoryDim }}>No announcements yet.</p>
          )}
          {announcements.map((a) => {
            const isRead = readIds.has(a.id);
            return (
              <Card dark key={a.id} className="!p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone={priorityTone[a.priority]}>{a.category}</Badge>
                    {!isRead && <span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.gold }} />}
                  </div>
                  <span className="text-[10.5px] shrink-0" style={{ color: COLORS.ivoryDim, fontVariantNumeric: "tabular-nums" }}>
                    {new Date(a.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: COLORS.ivory }}>{a.message}</p>
                {!isRead && (
                  <button onClick={() => markRead(a.id)} className="text-[11px] font-semibold mt-2 min-h-[28px]" style={{ color: COLORS.gold }}>
                    {user ? "Mark as read" : "Mark as read (sign in to sync)"}
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NotificationOptIn({ userId }) {
  const supported = isPushSupported();
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supported) return;
    getExistingSubscription().then((sub) => setSubscribed(Boolean(sub))).catch(() => {});
  }, [supported]);

  async function enable() {
    setBusy(true);
    setError("");
    try {
      await subscribeToPush(userId);
      setSubscribed(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setError("");
    try {
      await unsubscribeFromPush();
      setSubscribed(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!supported) {
    // Most commonly an iPhone opening the site in a Safari tab — push there
    // only exists once the site is saved to the home screen (iOS 16.4+).
    return (
      <Card dark className="!p-4 mb-4 flex items-start gap-2.5">
        <Bell size={15} color={COLORS.gold} className="shrink-0 mt-0.5" />
        <p className="text-[12px] leading-relaxed" style={{ color: COLORS.ivoryDim }}>
          To get notified about new announcements, add this site to your home screen (Share → Add to Home
          Screen) and open it from there.
        </p>
      </Card>
    );
  }

  if (getPermissionState() === "denied") {
    return (
      <Card dark className="!p-4 mb-4 flex items-start gap-2.5">
        <BellOff size={15} color={COLORS.ivoryDim} className="shrink-0 mt-0.5" />
        <p className="text-[12px] leading-relaxed" style={{ color: COLORS.ivoryDim }}>
          Notifications are blocked for this site. Enable them in your device's settings to get announcement
          alerts.
        </p>
      </Card>
    );
  }

  return (
    <Card dark className="!p-4 mb-4">
      <ErrorNote message={error} />
      <div className="grid gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <Bell size={15} color={COLORS.gold} className="shrink-0 mt-0.5" />
          <p className="text-[12px] leading-relaxed" style={{ color: subscribed ? COLORS.ivory : COLORS.ivoryDim }}>
            {subscribed
              ? "Notifications are on — you'll hear about new announcements."
              : "Get a notification on this device when a new announcement is posted."}
          </p>
        </div>
        {subscribed ? (
          <GoldButton variant="outline" onClick={disable} disabled={busy}>
            {busy ? "…" : "Turn off notifications"}
          </GoldButton>
        ) : (
          <GoldButton onClick={enable} disabled={busy}>
            {busy ? "…" : "Enable notifications"}
          </GoldButton>
        )}
      </div>
    </Card>
  );
}
