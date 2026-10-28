import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Clock, Shirt, Luggage, Compass, Info, Calendar, Bell } from "lucide-react";
import { COLORS, F, CAPS, DISPLAY_LUXE } from "../../shared/theme";
import { Card, DetailRow, Eyebrow, LoadingNote, ErrorNote } from "../../shared/ui";
import { Bloom, BloomFrame } from "../../shared/flora";
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

// Dark or light ink, whichever reads better on a flower's fill.
function inkOn(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.36 ? "#24151B" : "#FFF8F3";
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

const at = (x, y, s) => ({ position: "absolute", left: `${x}%`, top: `${y}%`, width: `${s}%`, height: `${s}%` });

// The hero block. Four compositions; each theme picks one and supplies the
// flowers and colours, so two events on the same layout still differ.
function EventArt({ theme, colors, act, day }) {
  const { kinds, petals, layout } = theme;
  const p = (i) => petals[i % petals.length];
  const k = (i) => kinds[i % kinds.length];
  const dp = dateParts(day.date);
  const box = "relative w-full overflow-hidden rounded-[34px]";

  if (layout === "cluster") {
    // Bold flat flowers on black, in a loose 2×2 grid.
    return (
      <div className={box} style={{ background: colors.panel, aspectRatio: "1 / 1" }}>
        <div className="bloom-open" style={at(3, 3, 48)}><Bloom kind="clover" color={p(0)} rotate={8} /></div>
        <div className="bloom-open" style={{ ...at(50, 2, 48), animationDelay: "0.08s" }}>
          <BloomFrame kind="ring" color={p(1)} className="w-full h-full">
            <span className="block text-[13px] font-extrabold leading-none" style={{ color: colors.onPanel, fontFamily: F.grotesk, ...CAPS, letterSpacing: "0.04em" }}>
              {act.start_time?.replace(":00", "").replace(" ", "")}
            </span>
          </BloomFrame>
        </div>
        <div className="bloom-open" style={{ ...at(2, 50, 48), animationDelay: "0.16s" }}><Bloom kind="petal6" color={p(2)} center={colors.panel} spin /></div>
        <div className="bloom-open" style={{ ...at(50, 50, 48), animationDelay: "0.24s" }}><Bloom kind="petal4" color={p(3)} rotate={45} /></div>
      </div>
    );
  }

  if (layout === "horizon") {
    // A sun rising over bands of sea or sand, with the start time in the sun.
    const sunInk = inkOn(p(0));
    return (
      <div className={box} style={{ background: colors.panel, aspectRatio: "1 / 1" }}>
        <div className="bloom-open" style={at(8, 8, 13)}><Bloom kind={k(1)} color={p(3)} center={p(0)} /></div>
        <div className="bloom-open" style={{ ...at(80, 16, 9), animationDelay: "0.1s" }}><Bloom kind={k(2)} color={p(3)} rotate={20} /></div>
        <div className="absolute" style={{ left: "17%", top: "20%", width: "66%", aspectRatio: "1 / 1" }}>
          <BloomFrame kind={k(0)} color={p(0)} className="w-full h-full bloom-open">
            <div style={{ color: sunInk, marginTop: "-14%" }}>
              <div className="text-[10px] font-semibold mb-1" style={{ fontFamily: F.body, ...CAPS, letterSpacing: "0.24em" }}>{dp.short} {dp.day} {dp.monthShort}</div>
              <div className="text-[30px] leading-none" style={{ ...DISPLAY_LUXE, fontStyle: "italic" }}>{act.start_time}</div>
            </div>
          </BloomFrame>
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${-12 + i * 4}%`,
              right: `${-12 + i * 4}%`,
              top: `${66 + i * 9}%`,
              height: "60%",
              borderRadius: "50% 50% 0 0 / 22% 22% 0 0",
              background: i === 1 ? p(2) : i === 2 ? colors.bg : p(1),
            }}
          />
        ))}
      </div>
    );
  }

  if (layout === "scatter") {
    // Flowers tossed across the panel around a pebble that holds the date.
    const spots = [
      [4, 6, 24, 10], [70, 4, 18, 30], [82, 30, 14, 0], [2, 40, 15, 45],
      [10, 72, 22, 15], [72, 66, 28, 0], [44, 82, 12, 20], [40, 2, 11, 0],
    ];
    return (
      <div className={box} style={{ background: colors.panel, aspectRatio: "1 / 1" }}>
        {spots.map(([x, y, s, r], i) => (
          <div key={i} className="bloom-open" style={{ ...at(x, y, s), animationDelay: `${i * 0.05}s` }}>
            <Bloom kind={k(i)} color={p(i)} rotate={r} center={k(i) === "daisy" ? p(i + 1) : null} />
          </div>
        ))}
        <div className="absolute" style={{ left: "22%", top: "22%", width: "56%", aspectRatio: "1 / 1" }}>
          <BloomFrame kind="blob" color={colors.card} className="w-full h-full bloom-open">
            <div style={{ color: colors.text }}>
              <div className="text-[10px] font-semibold" style={{ fontFamily: F.body, ...CAPS, letterSpacing: "0.24em", color: colors.accent }}>{dp.weekday}</div>
              <div className="text-[64px] leading-[0.95]" style={{ ...DISPLAY_LUXE, fontWeight: theme.headline === "grotesk" ? 400 : 400 }}>{String(dp.day).padStart(2, "0")}</div>
              <div className="text-[15px] italic" style={DISPLAY_LUXE}>{dp.month}</div>
            </div>
          </BloomFrame>
        </div>
      </div>
    );
  }

  // halo: one great flower with the date set in its heart, smaller ones around.
  const heartInk = inkOn(p(0));
  return (
    <div className={box} style={{ background: colors.panel, aspectRatio: "1 / 1" }}>
      <div className="bloom-open" style={at(-6, -6, 30)}><Bloom kind={k(1)} color={p(1)} rotate={30} /></div>
      <div className="bloom-open" style={{ ...at(78, 8, 16), animationDelay: "0.1s" }}><Bloom kind={k(2)} color={p(2)} center={p(1)} /></div>
      <div className="bloom-open" style={{ ...at(74, 72, 32), animationDelay: "0.15s" }}><Bloom kind={k(3) || k(1)} color={p(3)} rotate={15} /></div>
      <div className="bloom-open" style={{ ...at(4, 80, 12), animationDelay: "0.2s" }}><Bloom kind={k(1)} color={p(4)} rotate={45} /></div>
      <div className="absolute" style={{ left: "14%", top: "14%", width: "72%", aspectRatio: "1 / 1" }}>
        <Bloom kind={k(0)} color={p(0)} spin className="absolute inset-0 bloom-open" />
        <div className="absolute inset-0 flex items-center justify-center text-center" style={{ color: heartInk }}>
          <div>
            <div className="text-[10px] font-semibold" style={{ fontFamily: F.body, ...CAPS, letterSpacing: "0.26em" }}>{dp.weekday}</div>
            <div className="text-[70px] leading-[0.92]" style={DISPLAY_LUXE}>{dp.day}</div>
            <div className="text-[16px] italic" style={DISPLAY_LUXE}>{dp.month}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventTitle({ theme, act }) {
  const { kicker, lead, joiner, tail } = splitTitle(act.name);
  if (theme.headline === "grotesk") {
    return (
      <h1 className="text-[44px] leading-[0.92] font-extrabold" style={{ fontFamily: F.grotesk, color: COLORS.ivory, letterSpacing: "-0.035em", textTransform: "uppercase", textWrap: "balance" }}>
        {kicker && <span className="block text-[13px] tracking-[0.2em] mb-3 font-semibold" style={{ color: COLORS.gold, letterSpacing: "0.2em" }}>{kicker}</span>}
        {lead}
        {tail && <span style={{ color: COLORS.gold }}>{joiner}{tail}</span>}
      </h1>
    );
  }
  return (
    <h1 className="text-[44px] leading-[1] " style={{ ...DISPLAY_LUXE, color: COLORS.ivory, letterSpacing: "-0.025em", textWrap: "balance" }}>
      {kicker && <span className="block text-[12px] font-semibold mb-3" style={{ fontFamily: F.body, color: COLORS.gold, ...CAPS, letterSpacing: "0.22em" }}>{kicker}</span>}
      {lead}
      {tail && <em style={{ color: COLORS.gold }}>{joiner}{tail}</em>}
    </h1>
  );
}

function DressCodeCard({ dc, theme }) {
  return (
    <Link to="/dress-codes" className="block">
      <Card className="relative overflow-hidden">
        <Eyebrow>Dress Code</Eyebrow>
        <div className="text-[24px] leading-tight mb-4 pr-10" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, fontStyle: "italic" }}>{dc.title}</div>
        {dc.palette?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4" aria-label={dc.inspiration || "Colour palette"}>
            {dc.palette.map((c, i) => (
              <Bloom key={c} kind={theme.kinds[i % theme.kinds.length] === "ring" ? "scallop" : theme.kinds[i % theme.kinds.length]} color={c} size={30} rotate={i * 12} style={{ filter: "drop-shadow(0 0 0.5px var(--line))" }} />
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

function Pill({ as: As = "button", solid, children, ...rest }) {
  return (
    <As
      {...rest}
      className="inline-flex items-center gap-2 text-[11px] font-semibold px-4 py-2.5 rounded-full min-h-[42px] active:scale-[0.98] transition-all"
      style={{
        fontFamily: F.body,
        ...CAPS,
        letterSpacing: "0.12em",
        background: solid ? COLORS.ivory : "transparent",
        color: solid ? COLORS.ink : COLORS.ivory,
        border: `1.5px solid ${COLORS.ivory}`,
      }}
    >
      {children}
    </As>
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

  const back = (
    <Link to="/itinerary" className="inline-flex items-center gap-1.5 text-[11px] font-semibold min-h-[36px] mb-4" style={{ color: COLORS.ivoryDim, fontFamily: F.body, ...CAPS, letterSpacing: "0.16em" }}>
      <ArrowLeft size={14} /> Itinerary
    </Link>
  );

  if (error) return <div className="px-5 pt-5">{back}<ErrorNote message={error} /></div>;
  if (!days) return <LoadingNote label="Loading the event…" />;
  if (!entry)
    return (
      <div className="px-5 pt-5">
        {back}
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
    <article className="px-5 pt-5 pb-6">
      {back}
      <EventArt theme={theme} colors={colors} act={act} day={day} />

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
        <p className="mt-8 text-[23px] leading-[1.35] italic" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, textWrap: "pretty" }}>
          {act.description}
        </p>
      )}

      <div className="mt-7 flex flex-wrap gap-2">
        {act.maps_query && (
          <Pill as="a" solid href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.maps_query)}`} target="_blank" rel="noreferrer">
            <MapPin size={13} /> Open in Maps
          </Pill>
        )}
        <Pill onClick={() => downloadICS(act, day.date)}>
          <Calendar size={13} /> Add to Calendar
        </Pill>
        <Pill onClick={() => setNotify((n) => !n)} solid={notify} aria-pressed={notify}>
          <Bell size={13} /> {notify ? "Notifying" : "Notify Me"}
        </Pill>
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
          <DressCodeCard dc={dc} theme={theme} />
        </div>
      )}

      <nav className="mt-10 grid grid-cols-2 gap-3" aria-label="Other events">
        {prev ? <EventStep entry={prev} index={idx - 1} dir="prev" /> : <span />}
        {next ? <EventStep entry={next} index={idx + 1} dir="next" /> : <span />}
      </nav>
    </article>
  );
}

// A small card in the next event's own colours, so the hand-off previews it.
function EventStep({ entry, index, dir }) {
  const mode = useObservedTheme();
  const t = eventTheme(entry.act, index);
  const c = themeColors(t, mode);
  const { lead } = splitTitle(entry.act.name);
  return (
    <Link
      to={`/itinerary/${entry.act.id}`}
      className={`relative overflow-hidden rounded-[24px] p-4 min-h-[112px] flex flex-col justify-between ${dir === "next" ? "text-right items-end" : ""}`}
      style={{ background: c.panel, color: c.onPanel }}
    >
      <Bloom kind={t.kinds[0]} color={t.petals[0]} size={70} className="absolute" style={{ [dir === "next" ? "left" : "right"]: -20, top: -20, opacity: 0.9 }} />
      <span className="relative inline-flex items-center gap-1 text-[10px] font-semibold" style={{ fontFamily: F.body, ...CAPS, letterSpacing: "0.18em" }}>
        {dir === "prev" && <ArrowLeft size={12} />} {dir === "prev" ? "Before" : "Next"} {dir === "next" && <ArrowRight size={12} />}
      </span>
      <span className="relative text-[16px] leading-tight mt-3" style={{ ...DISPLAY_LUXE, textWrap: "balance" }}>{lead}</span>
    </Link>
  );
}
