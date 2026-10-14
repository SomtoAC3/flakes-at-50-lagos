import { useEffect, useState } from "react";
import { ChevronDown, ShieldCheck, UserPlus, X } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle, Badge, DetailRow, LoadingNote, ErrorNote, GoldButton } from "../../shared/ui";
import { fetchAllGuests, setGuestOrganizer, fetchInvites, addInvites, removeInvite } from "../../lib/queries";
import { useAuth } from "../../lib/auth";

const rsvpTone = { attending: "emerald", pending: "gold", "not-attending": "urgent" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Who may sign in. Sign-ups from any other email are refused by the database.
function GuestList({ guests, currentEmail }) {
  const [invites, setInvites] = useState(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  function load() {
    fetchInvites().then(setInvites).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  const signedIn = new Set((guests || []).map((g) => g.email?.toLowerCase()));

  async function handleAdd(e) {
    e.preventDefault();
    const entries = [...new Set(text.split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean))];
    const valid = entries.filter((s) => EMAIL_RE.test(s));
    const invalid = entries.filter((s) => !EMAIL_RE.test(s));
    if (!valid.length) {
      setError(invalid.length ? `Not a valid email: ${invalid.join(", ")}` : "");
      return;
    }
    setBusy(true);
    setError("");
    setNote("");
    try {
      const existing = new Set((invites || []).map((i) => i.email));
      const fresh = valid.filter((s) => !existing.has(s));
      await addInvites(valid);
      const parts = [`Added ${fresh.length} ${fresh.length === 1 ? "guest" : "guests"}.`];
      if (valid.length > fresh.length) parts.push(`${valid.length - fresh.length} already on the list.`);
      if (invalid.length) parts.push(`Skipped (not valid emails): ${invalid.join(", ")}.`);
      setNote(parts.join(" "));
      setText("");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(email) {
    if (!window.confirm(`Remove ${email} from the guest list? They'll lose access to the trip app straight away.`)) return;
    try {
      await removeInvite(email);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Card dark className="mb-6">
      <div className="text-[14px] font-semibold mb-1" style={{ color: COLORS.ivory, fontFamily: F.display }}>
        Guest list{invites ? ` · ${invites.length}` : ""}
      </div>
      <p className="text-[12px] mb-3" style={{ color: COLORS.ivoryDim }}>
        Only these emails can sign in. Paste one or many, separated by new lines or commas.
      </p>
      <ErrorNote message={error} />
      {note && <p className="text-[12px] mb-3" style={{ color: COLORS.gold }}>{note}</p>}
      <form onSubmit={handleAdd} className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder={"ada@example.com\ntunde@example.com"}
          className="w-full rounded-xl px-3 py-2.5 text-[13px] outline-none mb-2 resize-y"
          style={{ background: COLORS.chip, border: `1px solid ${COLORS.line}`, color: COLORS.ivory, fontFamily: F.body }}
        />
        <GoldButton type="submit" icon={UserPlus} disabled={busy || !text.trim()}>
          {busy ? "Adding…" : "Add to guest list"}
        </GoldButton>
      </form>
      {!invites && !error && <LoadingNote label="Loading guest list…" />}
      {invites && (
        <ul className="divide-y" style={{ borderColor: COLORS.line }}>
          {invites.map((i) => (
            <li key={i.email} className="flex items-center justify-between gap-3 py-2" style={{ borderColor: COLORS.line }}>
              <div className="min-w-0">
                <div className="text-[12.5px] truncate" style={{ color: COLORS.ivory }}>{i.email}</div>
                <div className="text-[11px]" style={{ color: COLORS.ivoryDim }}>
                  {signedIn.has(i.email) ? "Signed in" : "Hasn't signed in yet"}
                </div>
              </div>
              {i.email !== currentEmail && (
                <button
                  onClick={() => handleRemove(i.email)}
                  className="flex items-center justify-center rounded-xl min-h-[36px] min-w-[36px] shrink-0"
                  style={{ color: COLORS.ivoryDim }}
                  aria-label={`Remove ${i.email} from the guest list`}
                >
                  <X size={15} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

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
      <SectionTitle eyebrow="Manage" title="Guests" light sub="Who can sign in, plus RSVPs, contact details, and dietary/accessibility needs." />
      <GuestList guests={guests} currentEmail={currentUser?.email?.toLowerCase()} />
      <div className="text-[14px] font-semibold mb-3" style={{ color: COLORS.ivory, fontFamily: F.display }}>
        Signed-in guests
      </div>
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
