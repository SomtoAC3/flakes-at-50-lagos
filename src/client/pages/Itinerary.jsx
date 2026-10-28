import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COLORS, F, CAPS, DISPLAY_LUXE } from "../../shared/theme";
import { SectionTitle, LoadingNote, ErrorNote } from "../../shared/ui";
import { Stem } from "../../shared/flora";
import { useObservedTheme } from "../../shared/themeMode";
import { useAuth } from "../../lib/auth";
import { fetchItinerary } from "../../lib/queries";
import { eventTheme, themeColors, splitTitle } from "../data/eventThemes";

// One event, in its theme's colours, with its flower rising from under the
// next card. Cards overlap like a stack of plates; content sits in the top
// part so the overlap never covers it.
function EventCard({ act, day, index }) {
  const mode = useObservedTheme();
  const theme = eventTheme(act, index);
  const c = themeColors(theme, mode);
  const { kicker, lead, joiner, tail } = splitTitle(act.name);
  const sans = theme.headline === "sans";
  const date = new Date(`${day.date}T00:00:00`);
  return (
    <Link
      to={`/itinerary/${act.id}`}
      className="relative block overflow-hidden rounded-[28px] px-5 pt-5 pb-12 pr-[92px] min-h-[188px] active:scale-[0.995] transition-transform"
      style={{ background: c.panel, color: c.onPanel, boxShadow: "0 -14px 28px -22px rgba(0, 0, 0, 0.45)" }}
    >
      <Stem {...theme.stem} width={66} className="absolute" style={{ right: 14, top: 40 }} />
      <div className="text-[10px] font-semibold mb-3" style={{ fontFamily: F.body, ...CAPS, letterSpacing: "0.2em", opacity: 0.75 }}>
        {day.label} · {date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {act.start_time || "Time TBC"}
      </div>
      {kicker && (
        <div className="text-[11px] mb-1" style={{ fontFamily: F.body, opacity: 0.7 }}>
          {kicker}
        </div>
      )}
      <div
        className={sans ? "text-[23px] leading-[1.1] font-semibold" : "text-[25px] leading-[1.08]"}
        style={sans ? { fontFamily: F.body, letterSpacing: "-0.02em", textWrap: "balance" } : { ...DISPLAY_LUXE, letterSpacing: "-0.015em", textWrap: "balance" }}
      >
        {lead}
        {tail && (sans ? <span style={{ opacity: 0.65 }}>{joiner}{tail}</span> : <em>{joiner}{tail}</em>)}
      </div>
      {act.location && (
        <div className="mt-2 text-[12px] truncate" style={{ opacity: 0.72 }}>
          {act.location}
        </div>
      )}
      <span className="sr-only">{theme.name}</span>
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

  const events = days.flatMap((day) => day.activities.map((act) => ({ act, day })));

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Day by Day" title="The Itinerary" sub="Every event has its own page, with directions, timings and what to wear." />

      {events.length === 0 ? (
        <p className="text-[13px]" style={{ color: COLORS.ivoryDim }}>Details for each day are coming soon.</p>
      ) : (
        <ol className="pb-4">
          {events.map(({ act, day }, i) => (
            <li key={act.id} className="relative" style={{ marginTop: i ? -40 : 0, zIndex: i }}>
              <EventCard act={act} day={day} index={i} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
