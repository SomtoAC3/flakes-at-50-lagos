import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import { COLORS, F, CAPS, DISPLAY_LUXE } from "../../shared/theme";
import { SectionTitle, LoadingNote, ErrorNote } from "../../shared/ui";
import { Bloom } from "../../shared/flora";
import { useObservedTheme } from "../../shared/themeMode";
import { useAuth } from "../../lib/auth";
import { fetchItinerary } from "../../lib/queries";
import { eventTheme, themeColors, splitTitle } from "../data/eventThemes";

function timeRange(act) {
  const end = act.end_time && act.end_time !== "—" ? ` – ${act.end_time}` : "";
  return `${act.start_time || "Time TBC"}${end}`;
}

// One event, dressed in its own theme, with a flower peeking off the edge.
function EventCard({ act, index }) {
  const mode = useObservedTheme();
  const theme = eventTheme(act, index);
  const c = themeColors(theme, mode);
  const { kicker, lead, joiner, tail } = splitTitle(act.name);
  const grotesk = theme.headline === "grotesk";
  return (
    <Link
      to={`/itinerary/${act.id}`}
      className="group relative block overflow-hidden rounded-[30px] p-5 pr-24 min-h-[150px] active:scale-[0.99] transition-transform"
      style={{ background: c.panel, color: c.onPanel }}
    >
      <Bloom
        kind={theme.kinds[0]}
        color={theme.petals[0]}
        center={theme.kinds[0] === "daisy" ? theme.petals[1] : null}
        size={150}
        spin
        className="absolute"
        style={{ right: -48, top: "50%", marginTop: -75 }}
      />
      <Bloom kind={theme.kinds[1] || theme.kinds[0]} color={theme.petals[1 % theme.petals.length]} size={38} rotate={20} className="absolute" style={{ right: 70, bottom: 14 }} />
      <div className="relative">
        <div className="text-[10px] font-semibold mb-2.5" style={{ fontFamily: F.body, ...CAPS, letterSpacing: "0.22em", opacity: 0.85 }}>
          {timeRange(act)}
        </div>
        {kicker && (
          <div className="text-[10px] font-semibold mb-1" style={{ fontFamily: F.body, ...CAPS, letterSpacing: "0.18em", opacity: 0.7 }}>
            {kicker}
          </div>
        )}
        <div
          className={grotesk ? "text-[25px] leading-[0.95] font-extrabold" : "text-[25px] leading-[1.05]"}
          style={grotesk ? { fontFamily: F.grotesk, textTransform: "uppercase", letterSpacing: "-0.03em", textWrap: "balance" } : { ...DISPLAY_LUXE, letterSpacing: "-0.02em", textWrap: "balance" }}
        >
          {lead}
          {tail && (grotesk ? <span style={{ opacity: 0.7 }}>{joiner}{tail}</span> : <em>{joiner}{tail}</em>)}
        </div>
        {act.location && (
          <div className="flex items-center gap-1.5 mt-3 text-[12px]" style={{ opacity: 0.8 }}>
            <MapPin size={12} className="shrink-0" /> <span className="truncate">{act.location}</span>
          </div>
        )}
      </div>
      <span className="sr-only">{theme.name}</span>
      <ArrowUpRight size={18} className="absolute right-4 top-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function Itinerary() {
  const { configured } = useAuth();
  const [days, setDays] = useState(null);
  const [error, setError] = useState("");

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
        <SectionTitle eyebrow="Day by Day" title="The Itinerary" />
        <ErrorNote message={error} />
      </div>
    );
  }
  if (!days) return <LoadingNote label="Loading the itinerary…" />;
  if (days.length === 0) return <div className="px-5 pt-6"><SectionTitle eyebrow="Day by Day" title="The Itinerary" sub="No days published yet." /></div>;

  // Position across the whole weekend, so fallback themes don't repeat by day.
  let n = 0;

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Day by Day" title="The Itinerary" sub="Every event has its own page, with directions, timings and what to wear." />

      <div className="space-y-10">
        {days.map((d) => {
          const date = new Date(`${d.date}T00:00:00`);
          return (
            <section key={d.id} aria-labelledby={`day-${d.id}`}>
              <header className="flex items-end gap-4 mb-4 pb-3" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
                <div className="text-[52px] leading-[0.8] shrink-0" style={{ ...DISPLAY_LUXE, color: COLORS.gold }}>
                  {String(date.getDate()).padStart(2, "0")}
                </div>
                <div className="min-w-0 pb-0.5">
                  <div id={`day-${d.id}`} className="text-[10px] font-semibold mb-1" style={{ fontFamily: F.body, ...CAPS, letterSpacing: "0.22em", color: COLORS.ivoryDim }}>
                    {d.label} · {d.weekday} {date.toLocaleDateString("en-GB", { month: "long" })}
                  </div>
                  {d.theme && (
                    <div className="text-[19px] leading-tight italic" style={{ ...DISPLAY_LUXE, color: COLORS.ivory }}>
                      {d.theme}
                    </div>
                  )}
                </div>
              </header>
              <div className="space-y-3">
                {d.activities.map((act) => (
                  <EventCard key={act.id} act={act} index={n++} />
                ))}
                {d.activities.length === 0 && (
                  <p className="text-[13px]" style={{ color: COLORS.ivoryDim }}>Details for this day are coming soon.</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
