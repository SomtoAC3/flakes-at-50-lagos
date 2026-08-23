import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { COLORS } from "../../shared/theme";
import { Card, SectionTitle, GoldButton, LoadingNote, ErrorNote } from "../../shared/ui";
import { fetchPendingGallery, setGalleryStatus } from "../../lib/queries";

export default function AdminGallery() {
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");

  function load() {
    fetchPendingGallery().then(setPending).catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function decide(id, status) {
    try {
      await setGalleryStatus(id, status);
      setPending((rows) => rows.filter((r) => r.id !== id));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <SectionTitle eyebrow="Moderate" title="Gallery Uploads" light sub="Approve or reject guest photos before they appear in the shared gallery." />
      <ErrorNote message={error} />
      {!pending && !error && <LoadingNote label="Loading pending uploads…" />}
      {pending && (
        <div className="space-y-4">
          {pending.length === 0 && <p className="text-[12.5px]" style={{ color: COLORS.ivoryDim }}>Nothing pending review.</p>}
          {pending.map((p) => (
            <Card dark key={p.id} className="!p-3">
              <div className="aspect-video rounded-xl overflow-hidden mb-3" style={{ border: "1px solid rgba(201,166,103,0.18)" }}>
                <img src={p.url} alt={p.caption || "Pending upload"} className="w-full h-full object-cover" />
              </div>
              <div className="text-[11.5px] mb-3" style={{ color: COLORS.ivoryDim }}>
                {p.category || "Uncategorized"} · {new Date(p.created_at).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <GoldButton icon={Check} className="flex-1" onClick={() => decide(p.id, "approved")}>Approve</GoldButton>
                <GoldButton icon={X} variant="outline" className="flex-1" onClick={() => decide(p.id, "rejected")}>Reject</GoldButton>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
