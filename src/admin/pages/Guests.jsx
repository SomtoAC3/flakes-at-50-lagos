import { useEffect, useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle, Badge, DetailRow, LoadingNote, ErrorNote } from "../../shared/ui";
import { fetchAllGuests, setGuestOrganizer } from "../../lib/queries";
import { useAuth } from "../../lib/auth";

const rsvpTone = { attending: "emerald", pending: "gold", "not-attending": "urgent" };

export default function Guests() {
  const { user: currentUser } = useAuth();
  const [guests, setGuests] = useState(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  function load() {
    fetchAllGuests().then(setGuests).catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function toggleOrganizer(g) {
    try {
      await setGuestOrganizer(g.id, !g.is_organizer);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <SectionTitle eyebrow="Manage" title="Guests" light sub="RSVPs, contact details, and dietary/accessibility needs." />
      <ErrorNote message={error} />
      {!guests && !error && <LoadingNote label="Loading guests…" />}
      {guests && (
        <div className="space-y-3">
          {guests.length === 0 && <p className="text-[12.5px]" style={{ color: COLORS.ivoryDim }}>No guests have signed in yet.</p>}
          {guests.map((g) => {
            const isOpen = expanded === g.id;
            return (
              <Card dark key={g.id} className="!p-0 overflow-hidden">
                <button onClick={() => setExpanded(isOpen ? null : g.id)} className="w-full text-left p-4 flex items-center justify-between gap-3 min-h-[44px]">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-semibold" style={{ color: COLORS.ivory, fontFamily: F.display }}>
                        {g.full_name || g.email || "Unnamed guest"}
                      </span>
                      <Badge tone={rsvpTone[g.rsvp_status] || "gold"}>{g.rsvp_status}</Badge>
                      {g.is_organizer && <Badge tone="emerald">Organizer</Badge>}
                    </div>
                    <div className="text-[11.5px] mt-0.5 truncate" style={{ color: COLORS.ivoryDim }}>{g.email}</div>
                  </div>
                  <ChevronDown size={16} color={COLORS.gold} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} className="shrink-0" />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 space-y-2.5" style={{ borderTop: `1px solid ${COLORS.line}` }}>
                    <div className="pt-3 space-y-2">
                      <DetailRow label="Phone" value={g.phone || "—"} />
                      <DetailRow label="Emergency Contact" value={g.emergency_contact || "—"} />
                      <DetailRow label="Flight Arrival" value={g.flight_arrival || "—"} />
                      <DetailRow label="Flight Departure" value={g.flight_departure || "—"} />
                      <DetailRow label="Hotel Arrangement" value={g.hotel_arrangement || "—"} />
                      <DetailRow label="Dietary Restrictions" value={g.dietary || "—"} />
                      <DetailRow label="Allergies" value={g.allergies || "—"} />
                      <DetailRow label="Accessibility Needs" value={g.accessibility || "—"} />
                      <DetailRow label="Special Requests" value={g.special_requests || "—"} />
                    </div>
                    <button
                      onClick={() => toggleOrganizer(g)}
                      disabled={g.id === currentUser?.id}
                      className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-xl min-h-[36px] disabled:opacity-40"
                      style={{ border: `1.5px solid ${COLORS.gold}`, color: COLORS.gold }}
                    >
                      <ShieldCheck size={12} />
                      {g.is_organizer ? "Remove organizer access" : "Grant organizer access"}
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
