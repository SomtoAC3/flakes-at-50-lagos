import { useEffect, useState } from "react";
import { MapPin, Clock, Shirt, Luggage, Compass, Info, ChevronDown, ExternalLink, Calendar, Bell } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle, DetailRow, LoadingNote, ErrorNote } from "../../shared/ui";
import { useAuth } from "../../lib/auth";
import { fetchItinerary } from "../../lib/queries";
import { downloadICS } from "../../lib/ics";

export default function Itinerary() {
  const { configured } = useAuth();
  const [days, setDays] = useState(null);
  const [error, setError] = useState("");
  const [dayIdx, setDayIdx] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [notify, setNotify] = useState({});

  useEffect(() => {
    if (!configured) {
      setError("Supabase isn't connected yet, so the itinerary can't load. Once it's configured this will show the real schedule.");
      return;
    }
    fetchItinerary()
      .then(setDays)
      .catch((e) => setError(e.message));
  }, [configured]);

  if (error) {
    return (
      <div className="px-5 pt-6">
        <SectionTitle eyebrow="Day by Day" title="The Itinerary" light />
        <ErrorNote message={error} />
      </div>
    );
  }
  if (!days) return <LoadingNote label="Loading the itinerary…" />;
  if (days.length === 0) return <div className="px-5 pt-6"><SectionTitle eyebrow="Day by Day" title="The Itinerary" light sub="No days published yet." /></div>;

  const day = days[Math.min(dayIdx, days.length - 1)];

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Day by Day" title="The Itinerary" light sub="Tap a day to explore, tap an activity to see full details." />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-5 px-5" style={{ scrollbarWidth: "none" }}>
        {days.map((d, i) => (
          <button
            key={d.id}
            onClick={() => setDayIdx(i)}
            className="shrink-0 rounded-xl px-3.5 py-2.5 text-left min-h-[44px]"
            style={{
              minWidth: 92,
              background: i === dayIdx ? `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold})` : "rgba(255,255,255,0.04)",
              border: i === dayIdx ? "none" : "1px solid rgba(201,166,103,0.2)",
            }}
          >
            <div className="text-[10px] tracking-wide uppercase" style={{ fontFamily: F.mono, color: i === dayIdx ? COLORS.ink : COLORS.gold }}>
              {d.label}
            </div>
            <div className="text-[12px] font-semibold mt-0.5" style={{ color: i === dayIdx ? COLORS.ink : COLORS.ivory }}>
              {new Date(d.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <div className="text-[11px] tracking-wide uppercase" style={{ fontFamily: F.mono, color: COLORS.gold }}>
          {day.weekday} · {day.city}
        </div>
        <div className="text-[19px]" style={{ fontFamily: F.display, fontWeight: 600, color: COLORS.ivory }}>
          {day.theme}
        </div>
      </div>

      <div className="space-y-3">
        {day.activities.map((act) => {
          const isOpen = expanded === act.id;
          return (
            <Card dark key={act.id} className="!p-0 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : act.id)} className="w-full text-left p-4 flex items-start justify-between gap-3 min-h-[44px]">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] tracking-wide uppercase mb-1" style={{ fontFamily: F.mono, color: COLORS.gold }}>
                    {act.start_time}
                    {act.end_time && act.end_time !== "—" ? ` – ${act.end_time}` : ""}
                  </div>
                  <div className="text-[15px] font-semibold leading-snug" style={{ color: COLORS.ivory, fontFamily: F.display }}>
                    {act.name}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 text-[12px]" style={{ color: COLORS.ivoryDim }}>
                    <MapPin size={11} /> {act.location}
                  </div>
                </div>
                <ChevronDown size={16} color={COLORS.gold} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} className="shrink-0 mt-1" />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 space-y-3" style={{ borderTop: "1px solid rgba(201,166,103,0.15)" }}>
                  <p className="text-[13px] leading-relaxed pt-3" style={{ color: COLORS.ivoryDim }}>
                    {act.description}
                  </p>
                  <DetailRow icon={MapPin} label="Meeting Point" value={act.meeting_point} />
                  <DetailRow icon={Clock} label="Departure Time" value={act.departure_time} />
                  <DetailRow icon={Shirt} label="Dress Code" value={act.dress_code} />
                  <DetailRow icon={Luggage} label="What to Bring" value={act.what_to_bring} />
                  <DetailRow icon={Compass} label="Transportation" value={act.transport} />
                  {act.notes && act.notes !== "To Be Confirmed" && (
                    <div className="flex items-start gap-2 rounded-lg p-2.5" style={{ background: "rgba(201,166,103,0.08)" }}>
                      <Info size={13} color={COLORS.gold} className="shrink-0 mt-0.5" />
                      <span className="text-[12px]" style={{ color: COLORS.ivory }}>{act.notes}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {act.maps_query && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.maps_query)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-full min-h-[36px]"
                        style={{ border: "1px solid rgba(201,166,103,0.35)", color: COLORS.gold }}
                      >
                        <MapPin size={12} /> Open in Maps <ExternalLink size={10} />
                      </a>
                    )}
                    <button
                      onClick={() => downloadICS({ ...act, location: act.location }, day.date)}
                      className="inline-flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-full min-h-[36px]"
                      style={{ border: "1px solid rgba(201,166,103,0.35)", color: COLORS.gold }}
                    >
                      <Calendar size={12} /> Add to Calendar
                    </button>
                    <button
                      onClick={() => setNotify((s) => ({ ...s, [act.id]: !s[act.id] }))}
                      className="inline-flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-full min-h-[36px]"
                      style={{
                        background: notify[act.id] ? COLORS.gold : "transparent",
                        border: "1px solid rgba(201,166,103,0.35)",
                        color: notify[act.id] ? COLORS.ink : COLORS.gold,
                      }}
                    >
                      <Bell size={12} /> {notify[act.id] ? "Notifying" : "Notify Me"}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
