import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Clock, Shirt, Luggage, Compass, Info, ChevronDown } from "lucide-react";
import { COLORS, F, CAPS, DISPLAY_LUXE } from "../../shared/theme";
import { Card, DetailRow, Eyebrow, LoadingNote, ErrorNote, GoldButton } from "../../shared/ui";
import { Stem } from "../../shared/flora";
import { META_COLORS, useObservedTheme } from "../../shared/themeMode";
import { useAuth } from "../../lib/auth";
import { fetchItinerary } from "../../lib/queries";
import { downloadICS } from "../../lib/ics";
import { dayTheme, themeColors } from "../data/eventThemes";

const TOKEN_MAP = { bg: "--bg", card: "--card", chip: "--chip", text: "--text", dim: "--text-dim", accent: "--accent" };

// While a day page is open, its palette replaces the app's base tokens on
// <html>, so the header, nav and every shared component take on the event's
// look. Removing them on the way out restores the guest's light/dark theme.
function useEventTokens(colors) {
  useLayoutEffect(() => {
    if (!colors) return;
    const root = document.documentElement;
    for (const [k, v] of Object.entries(TOKEN_MAP)) root.style.setProperty(v, colors[k]);
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", colors.bg);
    return () => {
      for (const v of Object.values(TOKEN_MAP)) root.style.removeProperty(v);
      const mode = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      meta?.setAttribute("content", META_COLORS[mode]);
    };
  }, [colors]);
}

// Swiping the page sideways moves to the day before or after it. The page
// follows the finger; at the first and last event it only gives a little and
// springs back. Vertical scrolling and pinch-zoom stay with the browser.
function useEventSwipe(ref, ready, prevId, nextId) {
  const navigate = useNavigate();
  useEffect(() => {
    const el = ref.current;
    if (!ready || !el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
    let start = null;
    let horizontal = null;
    let dx = 0;
    let dragged = false;

    const place = (x, transition = "none", opacity = "") => {
      el.style.transition = transition;
      el.style.transform = x ? `translateX(${x}px)` : "";
      el.style.opacity = opacity;
    };

    // Slide the page off, switch days, and bring the new one in from the
    // side the finger was heading.
    const go = (id, dir) => {
      const w = el.offsetWidth;
      const arrive = () => {
        navigate(`/itinerary/${id}`);
        window.scrollTo(0, 0);
        if (still) return place(0);
        place(-dir * w * 0.25, "none", "0");
        requestAnimationFrame(() => requestAnimationFrame(() => place(0, `transform 320ms ${EASE}, opacity 240ms ease-out`)));
      };
      if (still) return arrive();
      place(dir * w, "transform 200ms ease-in, opacity 200ms ease-in", "0");
      setTimeout(arrive, 200);
    };

    const down = (e) => {
      dragged = false;
      if (e.pointerType === "mouse" || start) return;
      // Leave the browser's own edge swipe (back/forward) alone.
      if (e.clientX < 24 || e.clientX > window.innerWidth - 24) return;
      start = { x: e.clientX, y: e.clientY, t: e.timeStamp, id: e.pointerId };
      horizontal = null;
      dx = 0;
    };

    const move = (e) => {
      if (!start || e.pointerId !== start.id) return;
      const x = e.clientX - start.x;
      const y = e.clientY - start.y;
      if (horizontal === null) {
        if (Math.abs(x) < 10 && Math.abs(y) < 10) return;
        horizontal = Math.abs(x) > Math.abs(y);
        if (!horizontal) return (start = null);
      }
      const w = el.offsetWidth;
      const target = x > 0 ? prevId : nextId;
      dx = target ? x : Math.sign(x) * (1 - 1 / ((Math.abs(x) * 0.55) / w + 1)) * w;
      dragged = true;
      place(dx);
    };

    const up = (e) => {
      if (!start || e.pointerId !== start.id) return;
      const speed = Math.abs(e.clientX - start.x) / Math.max(1, e.timeStamp - start.t);
      const target = dx > 0 ? prevId : nextId;
      start = null;
      if (!horizontal) return;
      const far = Math.abs(dx) > el.offsetWidth * 0.25 || (speed > 0.5 && Math.abs(dx) > 30);
      if (e.type === "pointerup" && target && far) go(target, Math.sign(dx));
      else place(0, `transform 320ms ${EASE}`);
    };

    // A swipe that ends over a link or button shouldn't also press it.
    const click = (e) => {
      if (!dragged) return;
      dragged = false;
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
    };
  }, [ref, ready, prevId, nextId, navigate]);
}

// The glam session sends guests to the makeup artists in the Directory.
const isGlam = (act) => /glam|make-?up/i.test(act.name || "");
// Older notes pointed to "Makeup Appointments" in Travel, which is gone:
// the Find a Makeup Artist button replaces them.
const showNotes = (notes) => notes && notes !== "To Be Confirmed" && !/makeup appointments/i.test(notes);

const longDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

function timeRange(act) {
  const start = act.start_time || "Time TBC";
  return act.end_time && act.end_time !== "—" ? `${start} – ${act.end_time}` : start;
}

// One activity: time, name and place, opening to the full details.
function Activity({ act, day, open, onToggle }) {
  const [notify, setNotify] = useState(false);
  const glam = isGlam(act);
  return (
    <Card className="!p-0 overflow-hidden">
      <button onClick={onToggle} aria-expanded={open} className="w-full text-left p-5 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold mb-1.5" style={{ fontFamily: F.body, color: COLORS.gold, ...CAPS, letterSpacing: "0.18em" }}>
            {timeRange(act)}
          </div>
          <h2 className="text-[21px] leading-[1.15]" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, letterSpacing: "-0.01em", textWrap: "balance" }}>
            {act.name}
          </h2>
          {act.location && (
            <div className="flex items-start gap-1.5 mt-2 text-[12.5px]" style={{ color: COLORS.ivoryDim }}>
              <MapPin size={13} className="shrink-0 mt-[2px]" /> {act.location}
            </div>
          )}
        </div>
        <ChevronDown
          size={18}
          color={COLORS.gold}
          className="shrink-0 mt-1"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4" style={{ borderTop: `1px solid ${COLORS.line}` }}>
          {act.description && (
            <p className="text-[14px] leading-relaxed pt-4" style={{ color: COLORS.ivory, textWrap: "pretty" }}>{act.description}</p>
          )}
          <DetailRow icon={MapPin} label="Meeting Point" value={act.meeting_point} />
          <DetailRow icon={Clock} label="Departures" value={act.departure_time} />
          <DetailRow icon={Shirt} label="Dress Code" value={act.dress_code} />
          <DetailRow icon={Luggage} label="What to Bring" value={act.what_to_bring} />
          <DetailRow icon={Compass} label="Transportation" value={act.transport} />
          {showNotes(act.notes) && (
            <div className="flex items-start gap-3 rounded-[18px] p-3.5" style={{ background: COLORS.chip }}>
              <Info size={14} color={COLORS.gold} className="shrink-0 mt-0.5" />
              <p className="text-[12.5px] leading-relaxed" style={{ color: COLORS.ivory }}>{act.notes}</p>
            </div>
          )}
          <div className="grid gap-3 pt-1">
            {glam && (
              <GoldButton as={Link} to="/directory?category=Makeup">
                Find a Makeup Artist
              </GoldButton>
            )}
            {act.maps_query && (
              <GoldButton
                as="a"
                variant={glam ? "outline" : "solid"}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.maps_query)}`}
                target="_blank"
                rel="noreferrer"
              >
                Open in Maps
              </GoldButton>
            )}
            <GoldButton variant="outline" onClick={() => downloadICS(act, day.date)}>
              Add to Calendar
            </GoldButton>
            <GoldButton variant={notify ? "solid" : "outline"} onClick={() => setNotify((n) => !n)} aria-pressed={notify}>
              {notify ? "Notifying" : "Notify Me"}
            </GoldButton>
          </div>
        </div>
      )}
    </Card>
  );
}

// The day's activities, one open at a time. A link to a single activity
// opens it; a day with only one opens that one.
function Activities({ day, openId }) {
  const [expanded, setExpanded] = useState(() => openId || (day.activities.length === 1 ? day.activities[0].id : null));
  if (day.activities.length === 0)
    return <p className="text-[14px]" style={{ color: COLORS.ivoryDim }}>Details for this day are coming soon.</p>;
  return (
    <div className="grid gap-3">
      {day.activities.map((act) => (
        <Activity
          key={act.id}
          act={act}
          day={day}
          open={expanded === act.id}
          onToggle={() => setExpanded((id) => (id === act.id ? null : act.id))}
        />
      ))}
    </div>
  );
}

// A day's page, at /itinerary/:id. Old links to an activity id land on its
// day with that activity open.
export default function DayPage() {
  const { id } = useParams();
  const { configured } = useAuth();
  const mode = useObservedTheme();
  const [days, setDays] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!configured) {
      setError("Supabase isn't connected yet, so this day can't load.");
      return;
    }
    fetchItinerary().then(setDays).catch((e) => setError(e.message));
  }, [configured]);

  const list = days || [];
  const idx = list.findIndex((d) => d.id === id || d.activities.some((a) => a.id === id));
  const day = idx >= 0 ? list[idx] : null;
  const openId = day?.activities.some((a) => a.id === id) ? id : null;
  const theme = day ? dayTheme(day, idx) : null;
  const colors = theme ? themeColors(theme, mode) : null;
  useEventTokens(colors);
  const pageRef = useRef(null);
  useEventSwipe(pageRef, !!day, list[idx - 1]?.id, list[idx + 1]?.id);

  if (error) return <div className="px-5 pt-5"><ErrorNote message={error} /></div>;
  if (!days) return <LoadingNote label="Loading the day…" />;
  if (!day)
    return (
      <div className="px-5 pt-5">
        <p className="text-[14px]" style={{ color: COLORS.ivoryDim }}>This isn't on the itinerary any more. The full schedule is in the Itinerary.</p>
      </div>
    );

  const prev = list[idx - 1];
  const next = list[idx + 1];

  return (
    <div className="overflow-x-clip">
      <article ref={pageRef} className="px-5 pt-5 pb-6 touch-pan-y touch-pinch-zoom">
        <header className="mb-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <Eyebrow>{day.label} · {longDate(day.date)}</Eyebrow>
            <h1 className="text-[27px] leading-[1.08]" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, letterSpacing: "-0.015em", textWrap: "balance" }}>
              {day.theme || day.label}
            </h1>
          </div>
          <Stem {...theme.stem} headOnly width={30} className="shrink-0 mb-1" />
        </header>

        <Activities key={`${day.id}-${openId}`} day={day} openId={openId} />

        <nav className="mt-10 pt-5 grid grid-cols-2 gap-4" style={{ borderTop: `1px solid ${COLORS.line}` }} aria-label="Other days">
          {prev ? <DayStep day={prev} dir="prev" /> : <span />}
          {next ? <DayStep day={next} dir="next" /> : <span />}
        </nav>
      </article>
    </div>
  );
}

// A quiet text link to the neighbouring day.
function DayStep({ day, dir }) {
  const next = dir === "next";
  return (
    <Link to={`/itinerary/${day.id}`} className={`group flex flex-col gap-2 min-h-[72px] ${next ? "items-end text-right" : ""}`}>
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: COLORS.ivoryDim, fontFamily: F.body, ...CAPS, letterSpacing: "0.18em" }}>
        {!next && <ArrowLeft size={12} />}
        {day.label}
        {next && <ArrowRight size={12} />}
      </span>
      <span className="text-[17px] leading-snug group-hover:underline underline-offset-4" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, textWrap: "balance", textDecorationThickness: "1px" }}>{day.theme || day.label}</span>
    </Link>
  );
}
