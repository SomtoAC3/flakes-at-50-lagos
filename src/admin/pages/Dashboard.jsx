import { useEffect, useState } from "react";
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
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <Card dark className="!p-4">
      <div className="text-[22px] mb-1 tabular-nums" style={{ fontFamily: F.body, color: COLORS.ivory, fontWeight: 600 }}>{value}</div>
      <div className="text-[11px]" style={{ color: COLORS.ivoryDim }}>{label}</div>
    </Card>
  );
}
