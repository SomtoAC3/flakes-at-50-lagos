import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle, FieldGroup, Field, SelectField, GoldButton, Placeholder, ErrorNote, LoadingNote } from "../../shared/ui";
import { useAuth } from "../../lib/auth";
import { updateGuestProfile } from "../../lib/queries";

const CHECKLIST_LABELS = {
  rsvp: "RSVP completed",
  passport: "Passport checked",
  flight: "Flight booked",
  visa: "Visa checked",
  insurance: "Travel insurance purchased",
  hotel: "Hotel confirmed",
  transfer: "Airport transfer confirmed",
  dresscode: "Dress codes reviewed",
  emergency: "Emergency contact submitted",
};

const emptyForm = {
  full_name: "",
  phone: "",
  emergency_contact: "",
  flight_arrival: "",
  flight_departure: "",
  travel_agent_status: "not-using",
  hotel_arrangement: "",
  roommate: "",
  dietary: "",
  allergies: "",
  accessibility: "",
  rsvp_status: "pending",
  special_requests: "",
};

export default function MyTrip() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [checklist, setChecklist] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name || "",
      phone: profile.phone || "",
      emergency_contact: profile.emergency_contact || "",
      flight_arrival: profile.flight_arrival || "",
      flight_departure: profile.flight_departure || "",
      travel_agent_status: profile.travel_agent_status || "not-using",
      hotel_arrangement: profile.hotel_arrangement || "",
      roommate: profile.roommate || "",
      dietary: profile.dietary || "",
      allergies: profile.allergies || "",
      accessibility: profile.accessibility || "",
      rsvp_status: profile.rsvp_status || "pending",
      special_requests: profile.special_requests || "",
    });
    setChecklist(profile.checklist || {});
  }, [profile]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const done = Object.values(checklist).filter(Boolean).length;
  const total = Object.keys(CHECKLIST_LABELS).length;

  async function toggleChecklistItem(key) {
    const next = { ...checklist, [key]: !checklist[key] };
    setChecklist(next);
    try {
      await updateGuestProfile(user.id, { checklist: next });
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      await updateGuestProfile(user.id, form);
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (!profile) return <LoadingNote label="Loading your profile…" />;

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Your Profile" title="My Trip" light sub="Private to you and the organizing team." />
      <ErrorNote message={error} />

      <Card dark className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[13px] font-semibold" style={{ color: COLORS.ivory, fontFamily: F.display }}>Trip Progress</span>
          <span className="text-[12px]" style={{ color: COLORS.gold, fontFamily: F.mono }}>{done}/{total}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full" style={{ width: `${(done / total) * 100}%`, background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight})` }} />
        </div>
        <div className="space-y-2">
          {Object.keys(CHECKLIST_LABELS).map((k) => (
            <button key={k} onClick={() => toggleChecklistItem(k)} className="w-full flex items-center gap-2.5 min-h-[36px]">
              <div
                className="w-5 h-5 rounded shrink-0 flex items-center justify-center"
                style={{ background: checklist[k] ? COLORS.gold : "transparent", border: `1px solid ${COLORS.gold}` }}
              >
                {checklist[k] && <Check size={12} color={COLORS.ink} />}
              </div>
              <span className="text-[12.5px] text-left" style={{ color: checklist[k] ? COLORS.ivoryDim : COLORS.ivory, textDecoration: checklist[k] ? "line-through" : "none" }}>
                {CHECKLIST_LABELS[k]}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card dark className="mb-5 flex items-center gap-3">
        <Placeholder label="Profile photo" ratio="aspect-square w-16 h-16 shrink-0 !rounded-full" />
        <div className="min-w-0">
          <div className="text-[13px] font-semibold truncate" style={{ color: COLORS.ivory }}>{form.full_name || "Your Name"}</div>
          <div className="text-[11px]" style={{ color: COLORS.ivoryDim, fontFamily: F.mono }}>RSVP: {form.rsvp_status.toUpperCase()}</div>
        </div>
      </Card>

      <div className="space-y-4">
        <FieldGroup title="Contact Details">
          <Field label="Full Name" value={form.full_name} onChange={(v) => update("full_name", v)} />
          <Field label="Phone Number" value={form.phone} onChange={(v) => update("phone", v)} />
          <Field label="Email Address" value={user?.email} onChange={() => {}} />
          <Field label="Emergency Contact" value={form.emergency_contact} onChange={(v) => update("emergency_contact", v)} placeholder="Name & phone number" />
        </FieldGroup>
        <FieldGroup title="Travel Details">
          <Field label="Flight Arrival Details" value={form.flight_arrival} onChange={(v) => update("flight_arrival", v)} placeholder="Flight number, date, time" />
          <Field label="Flight Departure Details" value={form.flight_departure} onChange={(v) => update("flight_departure", v)} placeholder="Flight number, date, time" />
          <SelectField
            label="Travel Agent Status"
            value={form.travel_agent_status}
            onChange={(v) => update("travel_agent_status", v)}
            options={[["not-using", "Not using group travel agent"], ["booked", "Booked through group travel agent"], ["pending", "Pending booking"]]}
          />
          <Field label="Hotel Arrangement" value={form.hotel_arrangement} onChange={(v) => update("hotel_arrangement", v)} placeholder="e.g. Sharing with group / own booking" />
          <Field label="Roommate Information" value={form.roommate} onChange={(v) => update("roommate", v)} placeholder="Who you're rooming with, if applicable" />
        </FieldGroup>
        <FieldGroup title="Health & Access">
          <Field label="Dietary Restrictions" value={form.dietary} onChange={(v) => update("dietary", v)} />
          <Field label="Allergies" value={form.allergies} onChange={(v) => update("allergies", v)} />
          <Field label="Accessibility Needs" value={form.accessibility} onChange={(v) => update("accessibility", v)} />
        </FieldGroup>
        <FieldGroup title="RSVP & Requests">
          <SelectField
            label="RSVP Status"
            value={form.rsvp_status}
            onChange={(v) => update("rsvp_status", v)}
            options={[["pending", "Pending"], ["attending", "Attending"], ["not-attending", "Not Attending"]]}
          />
          <Field label="Special Requests" value={form.special_requests} onChange={(v) => update("special_requests", v)} multiline />
        </FieldGroup>
      </div>

      <GoldButton className="w-full mt-5" icon={saved ? Check : undefined} onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : saved ? "Saved" : "Save My Details"}
      </GoldButton>
    </div>
  );
}
