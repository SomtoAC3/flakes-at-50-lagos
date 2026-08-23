import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle, LoadingNote, ErrorNote } from "../../shared/ui";
import { fetchAdminStats } from "../../lib/queries";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <SectionTitle eyebrow="Overview" title="Admin Dashboard" light />
      <ErrorNote message={error} />
      {!stats && !error && <LoadingNote label="Loading stats…" />}
      {stats && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatTile label="Total Guests Invited" value={stats.totalGuests} />
          <StatTile label="RSVP: Attending" value={stats.attending} />
          <StatTile label="Incomplete Profiles" value={stats.incompleteProfiles} />
          <StatTile label="Pending Gallery Uploads" value={stats.pendingUploads} />
        </div>
      )}

      <Card dark className="flex items-start gap-2.5">
        <ShieldCheck size={15} color={COLORS.gold} className="shrink-0 mt-0.5" />
        <p className="text-[12px] leading-relaxed min-w-0" style={{ color: COLORS.ivory }}>
          Guest personal data (contact info, travel documents, dietary/accessibility needs) is only visible here to
          authenticated organizers, enforced by Supabase row-level security — not just hidden in the UI.
        </p>
      </Card>
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <Card dark className="!p-4">
      <div className="text-[22px] mb-1" style={{ fontFamily: F.mono, color: COLORS.gold, fontWeight: 600 }}>{value}</div>
      <div className="text-[11px]" style={{ color: COLORS.ivoryDim }}>{label}</div>
    </Card>
  );
}
