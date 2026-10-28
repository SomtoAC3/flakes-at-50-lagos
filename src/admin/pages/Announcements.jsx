import { useEffect, useState } from "react";
import { COLORS } from "../../shared/theme";
import { Card, SectionTitle, Badge, Field, SelectField, GoldButton, LoadingNote, ErrorNote } from "../../shared/ui";
import { fetchAnnouncements, postAnnouncement } from "../../lib/queries";
import { supabase } from "../../lib/supabaseClient";

const priorityTone = { urgent: "urgent", normal: "gold" };

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ category: "", priority: "normal", message: "" });
  const [posting, setPosting] = useState(false);
  const [pushNote, setPushNote] = useState("");

  function load() {
    fetchAnnouncements().then(setAnnouncements).catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function handlePost(e) {
    e.preventDefault();
    if (!form.category || !form.message) return;
    setPosting(true);
    setError("");
    setPushNote("");
    try {
      await postAnnouncement(form);
      // Push failures are non-fatal — the announcement itself is already live.
      try {
        const { data, error: fnError } = await supabase.functions.invoke("send-push", {
          body: { title: `Flakes@50 — ${form.category}`, body: form.message, url: "/updates" },
        });
        if (fnError) throw fnError;
        setPushNote(`Posted. Notification sent to ${data?.sent ?? 0} device${data?.sent === 1 ? "" : "s"}.`);
      } catch {
        setPushNote("Posted. Notifications couldn't be sent — guests will still see it in the app.");
      }
      setForm({ category: "", priority: "normal", message: "" });
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <div>
      <SectionTitle eyebrow="Communicate" title="Announcements" light sub="Posted announcements are visible to every guest immediately, no login required." />
      <ErrorNote message={error} />
      {pushNote && (
        <p className="text-[11.5px] mb-3" style={{ color: COLORS.gold }}>
          {pushNote}
        </p>
      )}

      <Card dark className="mb-6">
        <form onSubmit={handlePost} className="space-y-3">
          <Field label="Category" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} placeholder="e.g. Transportation" />
          <SelectField
            label="Priority"
            value={form.priority}
            onChange={(v) => setForm((f) => ({ ...f, priority: v }))}
            options={[["normal", "Normal"], ["urgent", "Urgent — shows as a banner"]]}
          />
          <Field label="Message" value={form.message} onChange={(v) => setForm((f) => ({ ...f, message: v }))} multiline />
          <GoldButton type="submit" className="w-full" disabled={posting}>
            {posting ? "Posting…" : "Post Announcement"}
          </GoldButton>
        </form>
      </Card>

      {!announcements && !error && <LoadingNote label="Loading announcements…" />}
      {announcements && (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card dark key={a.id} className="!p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge tone={priorityTone[a.priority]}>{a.category}</Badge>
                <span className="text-[10.5px] shrink-0" style={{ color: COLORS.ivoryDim }}>
                  {new Date(a.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: COLORS.ivory }}>{a.message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
