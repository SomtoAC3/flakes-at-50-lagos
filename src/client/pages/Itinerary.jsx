import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { F, CAPS, DISPLAY_LUXE } from "../../shared/theme";
import { SectionTitle, LoadingNote, ErrorNote } from "../../shared/ui";
import { Stem } from "../../shared/flora";
import { useObservedTheme } from "../../shared/themeMode";
import { useAuth } from "../../lib/auth";
import { fetchItinerary } from "../../lib/queries";
import { dayTheme, themeColors, splitTitle } from "../data/eventThemes";

// One day, in its theme's colours, with its flower rising from under the
// next card. Cards overlap like a stack of plates; content sits in the top
// part so the overlap never covers it. Times live on the day's page.
function DayCard({ day, index }) {
  const mode = useObservedTheme();
  const theme = dayTheme(day, index);
  const c = themeColors(theme, mode);
  const date = new Date(`${day.date}T00:00:00`);
  const names = day.activities.map((a) => splitTitle(a.name).lead).join(" · ");
  return (
    <Link
      to={`/itinerary/${day.id}`}
      className="relative block overflow-hidden rounded-[28px] px-5 pt-5 pb-12 pr-[92px] min-h-[188px] active:scale-[0.995] transition-transform"
      style={{ background: c.panel, color: c.onPanel }}
    >
      <Stem {...theme.stem} width={66} className="absolute" style={{ right: 14, top: 40 }} />
      <div className="text-[10px] font-semibold mb-3" style={{ fontFamily: F.body, ...CAPS, letterSpacing: "0.2em", opacity: 0.75 }}>
        {day.label} · {date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
      </div>
      <div className="text-[25px] leading-[1.08]" style={{ ...DISPLAY_LUXE, letterSpacing: "-0.015em", textWrap: "balance" }}>
        {day.theme || day.label}
      </div>
      {names && (
        <div className="mt-2 text-[12px] line-clamp-2" style={{ opacity: 0.72 }}>
          {names}
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

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Day by Day" title="The Itinerary" sub="Tap a day to see its activities, with times, places and what to wear." />

      <ol className="pb-4">
        {days.map((day, i) => (
          <li key={day.id} className="relative" style={{ marginTop: i ? -40 : 0, zIndex: i }}>
            <DayCard day={day} index={i} />
          </li>
        ))}
      </ol>
    </div>
  );
}
