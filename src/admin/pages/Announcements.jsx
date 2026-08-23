import { useEffect, useState } from "react";
import { COLORS } from "../../shared/theme";
import { Card, SectionTitle, Badge, Field, SelectField, GoldButton, LoadingNote, ErrorNote } from "../../shared/ui";
import { fetchAnnouncements, postAnnouncement } from "../../lib/queries";

const priorityTone = { urgent: "urgent", normal: "gold" };

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ category: "", priority: "normal", message: "" });
  const [posting, setPosting] = useState(false);

  function load() {
    fetchAnnouncements().then(setAnnouncements).catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function handlePost(e) {
    e.preventDefault();
    if (!form.category || !form.message) return;
    setPosting(true);
    setError("");
    try {
      await postAnnouncement(form);
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
