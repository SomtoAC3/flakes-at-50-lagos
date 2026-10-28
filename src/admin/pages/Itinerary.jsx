import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle, Badge, Field, GoldButton, LoadingNote, ErrorNote } from "../../shared/ui";
import {
  fetchItinerary,
  saveItineraryDay,
  deleteItineraryDay,
  saveItineraryActivity,
  deleteItineraryActivity,
  swapActivityOrder,
} from "../../lib/queries";

const EMPTY_DAY = { date: "", label: "", theme: "", city: "" };
const EMPTY_ACTIVITY = {
  name: "",
  start_time: "",
  end_time: "",
  location: "",
  meeting_point: "",
  departure_time: "",
  transport: "",
  dress_code: "",
  what_to_bring: "",
  description: "",
  notes: "",
  maps_query: "",
};

function weekdayFromDate(date) {
  if (!date) return "";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long" });
}

export default function AdminItinerary() {
  const [days, setDays] = useState(null);
  const [error, setError] = useState("");
  // One editor open at a time:
  //   { type: "day", day? } — new/edit day
  //   { type: "activity", dayId, activity? } — new/edit activity
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  function load() {
    fetchItinerary().then(setDays).catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      await action();
      setEditing(null);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function handleDeleteDay(day) {
    if (!window.confirm(`Delete ${day.label} (${day.theme}) and all its activities? This can't be undone.`)) return;
    run(() => deleteItineraryDay(day.id));
  }

  function handleDeleteActivity(activity) {
    if (!window.confirm(`Delete "${activity.name}"? This can't be undone.`)) return;
    run(() => deleteItineraryActivity(activity.id));
  }

  function moveActivity(day, index, direction) {
    const neighbor = day.activities[index + direction];
    if (!neighbor) return;
    run(() => swapActivityOrder(day.activities[index], neighbor));
  }

  return (
    <div>
      <SectionTitle eyebrow="Plan" title="Itinerary" light sub="Changes go live for guests immediately." />
      <ErrorNote message={error} />

      {!days && !error && <LoadingNote label="Loading itinerary…" />}

      {days && (
        <div className="space-y-4">
          {days.map((day) => (
            <Card dark key={day.id} className="!p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge>{day.label}</Badge>
                    <span className="text-[11px]" style={{ color: COLORS.ivoryDim, fontFamily: F.body }}>
                      {day.weekday} · {day.date} · {day.city}
                    </span>
                  </div>
                  <p className="text-[15px]" style={{ color: COLORS.ivory, fontFamily: F.display, fontWeight: 500, letterSpacing: "-0.02em" }}>
                    {day.theme}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <IconButton label={`Edit ${day.label}`} onClick={() => setEditing({ type: "day", day })}>
                    <Pencil size={13} />
                  </IconButton>
                  <IconButton label={`Delete ${day.label}`} onClick={() => handleDeleteDay(day)}>
                    <Trash2 size={13} />
                  </IconButton>
                </div>
              </div>

              {editing?.type === "day" && editing.day?.id === day.id && (
                <DayForm day={editing.day} busy={busy} onCancel={() => setEditing(null)} onSave={(d) => run(() => saveItineraryDay(d))} />
              )}

              <div className="mt-3 space-y-2">
                {day.activities.map((activity, i) => (
                  <div key={activity.id}>
                    <div className="flex items-center gap-2 rounded-[3px] px-3 py-2.5" style={{ background: COLORS.chip, border: `1px solid ${COLORS.line}` }}>
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <IconButton small label={`Move ${activity.name} up`} disabled={i === 0} onClick={() => moveActivity(day, i, -1)}>
                          <ChevronUp size={12} />
                        </IconButton>
                        <IconButton small label={`Move ${activity.name} down`} disabled={i === day.activities.length - 1} onClick={() => moveActivity(day, i, 1)}>
                          <ChevronDown size={12} />
                        </IconButton>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] truncate" style={{ color: COLORS.ivory }}>{activity.name}</p>
                        <p className="text-[10.5px]" style={{ color: COLORS.ivoryDim, fontFamily: F.body }}>
                          {[activity.start_time, activity.end_time].filter(Boolean).join(" – ") || "No time set"}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <IconButton label={`Edit ${activity.name}`} onClick={() => setEditing({ type: "activity", dayId: day.id, activity })}>
                          <Pencil size={13} />
                        </IconButton>
                        <IconButton label={`Delete ${activity.name}`} onClick={() => handleDeleteActivity(activity)}>
                          <Trash2 size={13} />
                        </IconButton>
                      </div>
                    </div>
                    {editing?.type === "activity" && editing.activity?.id === activity.id && (
                      <ActivityForm
                        activity={editing.activity}
                        busy={busy}
                        onCancel={() => setEditing(null)}
                        onSave={(a) => run(() => saveItineraryActivity(a))}
                      />
                    )}
                  </div>
                ))}

                {editing?.type === "activity" && editing.dayId === day.id && !editing.activity && (
                  <ActivityForm
                    busy={busy}
                    onCancel={() => setEditing(null)}
                    onSave={(a) =>
                      run(() =>
                        saveItineraryActivity({
                          ...a,
                          day_id: day.id,
                          sort_order: (day.activities.at(-1)?.sort_order ?? 0) + 1,
                        })
                      )
                    }
                  />
                )}

                <button
                  onClick={() => setEditing({ type: "activity", dayId: day.id })}
                  className="w-full flex items-center justify-center gap-1.5 text-[11.5px] rounded-[3px] min-h-[38px]"
                  style={{ border: `1.5px dashed ${COLORS.gold}`, color: COLORS.gold }}
                >
                  <Plus size={13} /> Add activity
                </button>
              </div>
            </Card>
          ))}

          {editing?.type === "day" && !editing.day && (
            <Card dark className="!p-4">
              <DayForm busy={busy} onCancel={() => setEditing(null)} onSave={(d) => run(() => saveItineraryDay(d))} />
            </Card>
          )}

          <GoldButton className="w-full" onClick={() => setEditing({ type: "day" })}>
            Add Day
          </GoldButton>
        </div>
      )}
    </div>
  );
}

function IconButton({ children, onClick, label, disabled = false, small = false }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className={`${small ? "w-6 h-4" : "w-8 h-8"} rounded-md flex items-center justify-center`}
      style={{
        border: small ? "none" : `1px solid ${COLORS.line}`,
        color: disabled ? "var(--toggle-off)" : COLORS.gold,
        background: small ? "transparent" : COLORS.card,
      }}
    >
      {children}
    </button>
  );
}

function FormShell({ title, busy, onCancel, onSubmit, children }) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[3px] p-3 mt-2 space-y-3"
      style={{ background: COLORS.chip, border: `1px solid ${COLORS.line}` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-semibold" style={{ color: COLORS.gold, fontFamily: F.body }}>{title}</span>
        <button type="button" onClick={onCancel} aria-label="Cancel" className="w-7 h-7 flex items-center justify-center" style={{ color: COLORS.ivoryDim }}>
          <X size={14} />
        </button>
      </div>
      {children}
      <GoldButton type="submit" className="w-full" disabled={busy}>
        {busy ? "Saving…" : "Save"}
      </GoldButton>
    </form>
  );
}

function DayForm({ day, busy, onCancel, onSave }) {
  const [form, setForm] = useState(day ? { ...day } : { ...EMPTY_DAY });
  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: v }));

  function submit(e) {
    e.preventDefault();
    if (!form.date || !form.label || !form.theme || !form.city) return;
    onSave({ ...form, weekday: weekdayFromDate(form.date) });
  }

  return (
    <FormShell title={day ? "Edit day" : "New day"} busy={busy} onCancel={onCancel} onSubmit={submit}>
      <Field label="Date" type="date" value={form.date} onChange={set("date")} />
      <Field label="Label" value={form.label} onChange={set("label")} placeholder="e.g. Day Six" />
      <Field label="Theme" value={form.theme} onChange={set("theme")} placeholder="e.g. The Birthday Finale" />
      <Field label="City" value={form.city} onChange={set("city")} placeholder="e.g. Lagos" />
    </FormShell>
  );
}

function ActivityForm({ activity, busy, onCancel, onSave }) {
  const [form, setForm] = useState(activity ? { ...activity } : { ...EMPTY_ACTIVITY });
  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: v }));

  function submit(e) {
    e.preventDefault();
    if (!form.name) return;
    onSave(form);
  }

  return (
    <FormShell title={activity ? "Edit activity" : "New activity"} busy={busy} onCancel={onCancel} onSubmit={submit}>
      <Field label="Name" value={form.name} onChange={set("name")} placeholder="e.g. Sunset Felucca Cruise" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Starts" value={form.start_time ?? ""} onChange={set("start_time")} placeholder="e.g. 3:00 PM" />
        <Field label="Ends" value={form.end_time ?? ""} onChange={set("end_time")} placeholder="e.g. 7:00 PM" />
      </div>
      <Field label="Location" value={form.location ?? ""} onChange={set("location")} placeholder="Venue name" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Meeting point" value={form.meeting_point ?? ""} onChange={set("meeting_point")} placeholder="e.g. Hotel Lobby" />
        <Field label="Departure time" value={form.departure_time ?? ""} onChange={set("departure_time")} placeholder="e.g. 2:45 PM" />
      </div>
      <Field label="Transport" value={form.transport ?? ""} onChange={set("transport")} placeholder="e.g. Private coach" />
      <Field label="Dress code" value={form.dress_code ?? ""} onChange={set("dress_code")} placeholder="e.g. All white, comfortable shoes" />
      <Field label="What to bring" value={form.what_to_bring ?? ""} onChange={set("what_to_bring")} placeholder="e.g. Sunscreen, sunglasses" />
      <Field label="Description" value={form.description ?? ""} onChange={set("description")} multiline />
      <Field label="Notes" value={form.notes ?? ""} onChange={set("notes")} multiline />
      <Field label="Maps search" value={form.maps_query ?? ""} onChange={set("maps_query")} placeholder="What guests' map app searches for" />
    </FormShell>
  );
}
