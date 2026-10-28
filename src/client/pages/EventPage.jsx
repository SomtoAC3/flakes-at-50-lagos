import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Clock, Shirt, Luggage, Compass, Info, Calendar, Bell } from "lucide-react";
import { COLORS, F, CAPS, DISPLAY_LUXE } from "../../shared/theme";
import { Card, DetailRow, Eyebrow, LoadingNote, ErrorNote, GoldButton } from "../../shared/ui";
import { Stem } from "../../shared/flora";
import { META_COLORS, useObservedTheme } from "../../shared/themeMode";
import { useAuth } from "../../lib/auth";
import { fetchItinerary, fetchDressCodes } from "../../lib/queries";
import { downloadICS } from "../../lib/ics";
import { eventTheme, themeColors, splitTitle } from "../data/eventThemes";

const TOKEN_MAP = { bg: "--bg", card: "--card", chip: "--chip", text: "--text", dim: "--text-dim", accent: "--accent" };

// While an event page is open, its palette replaces the app's base tokens on
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

// Swiping the page sideways moves to the event before or after it. The page
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

    // Slide the page off, switch events, and bring the new one in from the
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

function dateParts(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return {
    weekday: d.toLocaleDateString("en-GB", { weekday: "long" }),
    short: d.toLocaleDateString("en-GB", { weekday: "short" }),
    day: d.getDate(),
    month: d.toLocaleDateString("en-GB", { month: "long" }),
    monthShort: d.toLocaleDateString("en-GB", { month: "short" }),
  };
}

function timeRange(act) {
  const end = act.end_time && act.end_time !== "—" ? ` – ${act.end_time}` : "";
  return `${act.start_time || "Time TBC"}${end}`;
}

// The hero: the event's word set huge and tonal behind a single stem, like
// a botanical plate. The word is cropped by the panel edge on purpose.
function EventHero({ theme, colors, act, day, number, total }) {
  const dp = dateParts(day.date);
  const ghost = `color-mix(in srgb, ${colors.onPanel} 13%, ${colors.panel})`;
  const label = { fontFamily: F.body, ...CAPS, letterSpacing: "0.22em" };
  return (
    <div className="relative w-full overflow-hidden rounded-[28px]" style={{ background: colors.panel, color: colors.onPanel, aspectRatio: "4 / 5" }}>
      <div className="absolute inset-x-5 top-5 flex justify-between pb-3 text-[10px] font-semibold" style={{ ...label, borderBottom: `1px solid color-mix(in srgb, ${colors.onPanel} 22%, transparent)` }}>
        <span>{dp.short} {dp.day} {dp.monthShort}</span>
        <span>{act.start_time || "Time TBC"}</span>
      </div>
      <div className="absolute inset-x-0 select-none" style={{ top: "17%", ...DISPLAY_LUXE, color: ghost, fontSize: "clamp(120px, 44vw, 190px)", lineHeight: 0.8, letterSpacing: "-0.04em" }} aria-hidden="true">
        <div style={{ marginLeft: "-0.04em" }}>{theme.word[0]}</div>
        <div className="text-right" style={{ marginRight: "-0.06em" }}>{theme.word[1]}</div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-center rise-in" style={{ height: "80%" }}>
        <Stem {...theme.stem} style={{ height: "100%", width: "auto" }} />
      </div>
      <div className="absolute inset-x-5 bottom-5 flex justify-between items-end text-[10px] font-semibold" style={label}>
        <span className="italic normal-case text-[15px] font-normal" style={{ ...DISPLAY_LUXE, letterSpacing: 0 }}>{theme.name}</span>
        <span>{number} / {total}</span>
      </div>
    </div>
  );
}

function EventTitle({ theme, act }) {
  const { kicker, lead, joiner, tail } = splitTitle(act.name);
  const kick = kicker && (
    <span className="block text-[12px] font-semibold mb-3" style={{ fontFamily: F.body, color: COLORS.gold, ...CAPS, letterSpacing: "0.2em" }}>
      {kicker}
    </span>
  );
  if (theme.headline === "sans") {
    return (
      <h1 className="text-[36px] leading-[1.05] font-semibold" style={{ fontFamily: F.body, color: COLORS.ivory, letterSpacing: "-0.03em", textWrap: "balance" }}>
        {kick}
        {lead}
        {tail && <span style={{ color: COLORS.gold }}>{joiner}{tail}</span>}
      </h1>
    );
  }
  return (
    <h1 className="text-[40px] leading-[1.04]" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, letterSpacing: "-0.02em", textWrap: "balance" }}>
      {kick}
      {lead}
      {tail && <em style={{ color: COLORS.gold }}>{joiner}{tail}</em>}
    </h1>
  );
}

function DressCodeCard({ dc }) {
  return (
    <Link to="/dress-codes" className="block">
      <Card>
        <Eyebrow>Dress Code</Eyebrow>
        <div className="text-[24px] leading-tight mb-4 pr-10" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, fontStyle: "italic" }}>{dc.title}</div>
        {dc.palette?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4" aria-label={dc.inspiration || "Colour palette"}>
            {dc.palette.map((c) => (
              <span key={c} className="block w-7 h-7 rounded-full" style={{ background: c, boxShadow: `inset 0 0 0 1px ${COLORS.line}` }} />
            ))}
          </div>
        )}
        {dc.description && <p className="text-[13px] leading-relaxed mb-3" style={{ color: COLORS.ivoryDim }}>{dc.description}</p>}
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: COLORS.gold, ...CAPS, letterSpacing: "0.16em" }}>
          The full style guide <ArrowRight size={13} />
        </span>
      </Card>
    </Link>
  );
}

export default function EventPage() {
  const { activityId } = useParams();
  const { configured } = useAuth();
  const mode = useObservedTheme();
  const [days, setDays] = useState(null);
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState("");
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    if (!configured) {
      setError("Supabase isn't connected yet, so this event can't load.");
      return;
    }
    fetchItinerary().then(setDays).catch((e) => setError(e.message));
    fetchDressCodes().then(setCodes).catch(() => {});
  }, [configured]);

  useEffect(() => setNotify(false), [activityId]);

  // Every activity in weekend order, with its day and theme.
  const all = (days || []).flatMap((day) => day.activities.map((act) => ({ act, day })));
  const idx = all.findIndex((e) => e.act.id === activityId);
  const entry = idx >= 0 ? all[idx] : null;
  const theme = entry ? eventTheme(entry.act, idx) : null;
  const colors = theme ? themeColors(theme, mode) : null;
  useEventTokens(colors);
  const pageRef = useRef(null);
  useEventSwipe(pageRef, !!entry, all[idx - 1]?.act.id, all[idx + 1]?.act.id);

  if (error) return <div className="px-5 pt-5"><ErrorNote message={error} /></div>;
  if (!days) return <LoadingNote label="Loading the event…" />;
  if (!entry)
    return (
      <div className="px-5 pt-5">
        <p className="text-[14px]" style={{ color: COLORS.ivoryDim }}>This event isn't on the itinerary any more. The full schedule is in the Itinerary.</p>
      </div>
    );

  const { act, day } = entry;
  const dp = dateParts(day.date);
  const prev = all[idx - 1];
  const next = all[idx + 1];
  const dc = act.dress_code ? codes.find((c) => c.title?.trim().toLowerCase() === act.dress_code.trim().toLowerCase()) : null;
  const showNotes = act.notes && act.notes !== "To Be Confirmed";

  return (
    <div className="overflow-x-clip">
      <article ref={pageRef} className="px-5 pt-5 pb-6 touch-pan-y touch-pinch-zoom">
        <EventHero theme={theme} colors={colors} act={act} day={day} number={idx + 1} total={all.length} />

        <header className="mt-7 rise-in">
          <Eyebrow>{day.label} · {dp.weekday} {dp.day} {dp.month}</Eyebrow>
          <EventTitle theme={theme} act={act} />
        </header>

        <dl className="mt-7 grid grid-cols-2" style={{ borderTop: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}` }}>
          <div className="py-4 pr-3">
            <dt className="text-[10px] font-semibold mb-1.5" style={{ color: COLORS.ivoryDim, ...CAPS, letterSpacing: "0.22em" }}>When</dt>
            <dd className="text-[19px] leading-tight" style={{ ...DISPLAY_LUXE, color: COLORS.ivory }}>{timeRange(act)}</dd>
          </div>
          <div className="py-4 pl-4" style={{ borderLeft: `1px solid ${COLORS.line}` }}>
            <dt className="text-[10px] font-semibold mb-1.5" style={{ color: COLORS.ivoryDim, ...CAPS, letterSpacing: "0.22em" }}>Where</dt>
            <dd className="text-[16px] leading-snug" style={{ ...DISPLAY_LUXE, color: COLORS.ivory }}>{act.location || "To be confirmed"}</dd>
          </div>
        </dl>

        {act.description && (
          <p className="mt-8 text-[19px] leading-[1.5] italic" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, textWrap: "pretty" }}>
            {act.description}
          </p>
        )}

        <div className="mt-7 grid gap-3">
          {act.maps_query && (
            <GoldButton as="a" icon={MapPin} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.maps_query)}`} target="_blank" rel="noreferrer">
              Open in Maps
            </GoldButton>
          )}
          <GoldButton variant="outline" icon={Calendar} onClick={() => downloadICS(act, day.date)}>
            Add to Calendar
          </GoldButton>
          <GoldButton variant={notify ? "solid" : "outline"} icon={Bell} onClick={() => setNotify((n) => !n)} aria-pressed={notify}>
            {notify ? "Notifying" : "Notify Me"}
          </GoldButton>
        </div>

        {/* The dress code gets its own card below when it matches a guide. */}
        {(act.meeting_point || act.departure_time || (act.dress_code && !dc) || act.what_to_bring || act.transport) && (
          <Card className="mt-8 space-y-3.5">
            <DetailRow icon={MapPin} label="Meeting Point" value={act.meeting_point} />
            <DetailRow icon={Clock} label="Departures" value={act.departure_time} />
            {!dc && <DetailRow icon={Shirt} label="Dress Code" value={act.dress_code} />}
            <DetailRow icon={Luggage} label="What to Bring" value={act.what_to_bring} />
            <DetailRow icon={Compass} label="Transportation" value={act.transport} />
          </Card>
        )}

        {showNotes && (
          <div className="mt-4 flex items-start gap-3 rounded-[24px] p-4" style={{ background: COLORS.chip }}>
            <Info size={15} color={COLORS.gold} className="shrink-0 mt-0.5" />
            <p className="text-[13px] leading-relaxed" style={{ color: COLORS.ivory }}>{act.notes}</p>
          </div>
        )}

        {dc && (
          <div className="mt-4">
            <DressCodeCard dc={dc} />
          </div>
        )}

        <nav className="mt-12 pt-5 grid grid-cols-2 gap-4" style={{ borderTop: `1px solid ${COLORS.line}` }} aria-label="Other events">
          {prev ? <EventStep entry={prev} index={idx - 1} dir="prev" /> : <span />}
          {next ? <EventStep entry={next} index={idx + 1} dir="next" /> : <span />}
        </nav>
      </article>
    </div>
  );
}

// A quiet text link to the neighbouring event, with its flower as a marker.
function EventStep({ entry, index, dir }) {
  const t = eventTheme(entry.act, index);
  const { lead } = splitTitle(entry.act.name);
  const next = dir === "next";
  return (
    <Link to={`/itinerary/${entry.act.id}`} className={`group flex flex-col gap-2 min-h-[72px] ${next ? "items-end text-right" : ""}`}>
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: COLORS.ivoryDim, fontFamily: F.body, ...CAPS, letterSpacing: "0.18em" }}>
        {!next && <ArrowLeft size={12} />}
        {next ? "Next" : "Before"}
        {next && <ArrowRight size={12} />}
      </span>
      <span className={`flex items-start gap-2 ${next ? "flex-row-reverse" : ""}`}>
        <Stem kind={t.stem.kind} flower={t.stem.flower} center={t.stem.center} headOnly width={14} className="shrink-0 mt-1" />
        <span className="text-[17px] leading-snug group-hover:underline underline-offset-4" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, textWrap: "balance", textDecorationThickness: "1px" }}>{lead}</span>
      </span>
    </Link>
  );
}
