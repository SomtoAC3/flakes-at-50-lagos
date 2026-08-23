import { useEffect, useState } from "react";
import { COLORS } from "../../shared/theme";
import { Card, SectionTitle, Badge, LoadingNote, ErrorNote } from "../../shared/ui";
import { useAuth } from "../../lib/auth";
import { fetchAnnouncements, fetchReadAnnouncementIds, markAnnouncementRead } from "../../lib/queries";

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
                  <span className="text-[10.5px] shrink-0" style={{ color: COLORS.ivoryDim, fontFamily: "'IBM Plex Mono', monospace" }}>
                    {new Date(a.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: COLORS.ivory }}>{a.message}</p>
                {!isRead && (
                  <button onClick={() => markRead(a.id)} className="text-[11px] mt-2 min-h-[28px]" style={{ color: COLORS.gold }}>
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
