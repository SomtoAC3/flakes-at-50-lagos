import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Shirt, Bell, Sparkles, ArrowRight, Plane, Users, Phone } from "lucide-react";
import { COLORS, F, EVENT_START } from "../../shared/theme";
import { Card, Eyebrow, SectionTitle, GoldButton, Badge, LintelDivider } from "../../shared/ui";
import { useAuth } from "../../lib/auth";
import { fetchItinerary, fetchAnnouncements, fetchSiteContent } from "../../lib/queries";
import { brandingUrl, BRANDING_PATHS } from "../../lib/branding";

const FALLBACK_WELCOME_NOTE =
  "Fifty years, and I still can't believe I get to share this chapter with all of you — in Egypt, of all places. Pack your gold, bring your energy, and let's make this a celebration for the books.";

// Built-in hero slideshow. Photos live in public/landmarks/ (Wikimedia
// Commons, credited on the More page).
const LANDMARKS = [
  { src: "/landmarks/giza.jpg", name: "Pyramids of Giza", place: "Giza" },
  { src: "/landmarks/sphinx.jpg", name: "Great Sphinx", place: "Giza" },
  { src: "/landmarks/citadel.jpg", name: "Mosque of Muhammad Ali", place: "Cairo Citadel" },
  { src: "/landmarks/karnak.jpg", name: "Karnak Temple", place: "Luxor" },
  { src: "/landmarks/abusimbel.jpg", name: "Abu Simbel Temples", place: "Aswan" },
  { src: "/landmarks/redsea.jpg", name: "Coral Reefs", place: "Red Sea" },
];

function LandmarkSlideshow() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % LANDMARKS.length), 4200);
    return () => clearInterval(t);
  }, []);

  const current = LANDMARKS[index];
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl mb-6"
      style={{ height: 190, background: COLORS.chip, border: `1px solid ${COLORS.line}` }}
    >
      {LANDMARKS.map((l, i) => (
        <img
          key={l.src}
          src={l.src}
          alt={i === index ? `${l.name}, ${l.place}` : ""}
          className="absolute inset-0 w-full h-full object-cover"
          loading={i === 0 ? "eager" : "lazy"}
          style={{
            opacity: i === index ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 0.9s ease",
          }}
        />
      ))}
      <div
        className="absolute left-2.5 bottom-2.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold"
        style={{ background: "rgba(255,255,255,0.94)", color: "#111111" }}
      >
        {current.name} <span style={{ color: "#6B6B6B", fontWeight: 500 }}>· {current.place}</span>
      </div>
      <div className="absolute right-3 bottom-3.5 flex gap-1.5" aria-hidden="true">
        {LANDMARKS.map((l, i) => (
          <span
            key={l.src}
            className="w-[5px] h-[5px] rounded-full"
            style={{ background: i === index ? "#FFFFFF" : "rgba(255,255,255,0.55)" }}
          />
        ))}
      </div>
    </div>
  );
}

function useCountdown(target) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

const DAY_MS = 86400000;

function dayStart(dateStr) {
  return new Date(`${dateStr}T00:00:00`);
}

// "3:00 PM" on a given day -> Date; null when the time isn't a real time
// (e.g. "—" or "TBC"), so callers can treat it as still upcoming.
function parseTimeOn(dateStr, timeStr) {
  const m = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(timeStr || "");
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return new Date(`${dateStr}T${String(h).padStart(2, "0")}:${m[2]}:00`);
}

function tripStatus(days, now) {
  if (!days?.length) return null;
  const total = days.length;
  const first = dayStart(days[0].date);
  const lastEnd = new Date(dayStart(days[total - 1].date).getTime() + DAY_MS);
  if (now < first) return { phase: "before", dayNum: 0, total };
  if (now >= lastEnd) return { phase: "after", dayNum: total, total };
  const idx = days.findIndex((d) => {
    const s = dayStart(d.date);
    return now >= s && now < new Date(s.getTime() + DAY_MS);
  });
  return {
    phase: "during",
    dayNum: idx >= 0 ? idx + 1 : Math.min(total, Math.floor((now - first) / DAY_MS) + 1),
    total,
    today: idx >= 0 ? days[idx] : null,
  };
}

// First activity that hasn't ended yet, scanning forward from today.
function findNextActivity(days, now) {
  for (const day of days) {
    if (new Date(dayStart(day.date).getTime() + DAY_MS) <= now) continue;
    for (const act of day.activities) {
      const ends = parseTimeOn(day.date, act.end_time) || parseTimeOn(day.date, act.start_time);
      if (!ends || ends >= now) return act;
    }
  }
  return null;
}

function formatDateRange(days) {
  const first = dayStart(days[0].date);
  const last = dayStart(days[days.length - 1].date);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const cities = [...new Set(days.map((d) => d.city))].join(" & ");
  return `${fmt(first)} – ${fmt(last)}, ${last.getFullYear()}${cities ? ` · ${cities}` : ""}`;
}

export default function Home() {
  const { configured } = useAuth();
  const [days, setDays] = useState(null);
  const [latestUpdate, setLatestUpdate] = useState(null);
  const [welcomeNote, setWelcomeNote] = useState(FALLBACK_WELCOME_NOTE);
  const [photoOk, setPhotoOk] = useState(true);

  useEffect(() => {
    if (!configured) return;
    let active = true;
    fetchItinerary()
      .then((d) => active && setDays(d))
      .catch(() => {});
    fetchAnnouncements()
      .then((list) => active && setLatestUpdate(list[0] ?? null))
      .catch(() => {});
    fetchSiteContent("welcome_note")
      .then((value) => {
        if (active && value) setWelcomeNote(value);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [configured]);

  const now = new Date();
  const status = tripStatus(days, now);
  const nextActivity = days ? findNextActivity(days, now) : null;
  const countdownTarget = days?.length ? dayStart(days[0].date) : EVENT_START;
  const cd = useCountdown(countdownTarget);

  return (
    <div>
      <div className="px-5 pt-6 pb-10">
        <LandmarkSlideshow />
        <Eyebrow>A Golden Jubilee Across Cairo &amp; The Red Sea</Eyebrow>
        <h1
          className="text-[38px] sm:text-[42px] leading-[1.04] mb-1"
          style={{ fontFamily: F.display, fontWeight: 500, letterSpacing: "-0.02em", color: COLORS.ivory }}
        >
          Folake <span style={{ color: COLORS.gold, fontStyle: "italic" }}>at 50</span>
        </h1>
        <h2
          className="text-[20px] sm:text-[22px] leading-tight mb-4"
          style={{ fontFamily: F.display, fontWeight: 500, letterSpacing: "-0.02em", color: COLORS.ivoryDim, fontStyle: "italic" }}
        >
          The Egypt Takeover
        </h2>
        <p className="text-[13px] mb-1 font-medium" style={{ color: COLORS.ivoryDim, fontFamily: F.body }}>
          {days?.length ? formatDateRange(days) : "Oct 28 – Nov 1, 2026 · Cairo & the Red Sea"}
        </p>

        {status?.phase !== "after" && (
          <div className="mt-6 grid grid-cols-4 gap-2">
            {[["Days", cd.days], ["Hrs", cd.hours], ["Min", cd.minutes], ["Sec", cd.seconds]].map(([label, val]) => (
              <div
                key={label}
                className="rounded-xl py-3 flex flex-col items-center"
                style={{ border: `1px solid ${COLORS.line}`, background: COLORS.card }}
              >
                <span className="text-[20px] sm:text-[22px] tabular-nums" style={{ fontFamily: F.body, color: COLORS.ivory, fontWeight: 600 }}>
                  {pad(val)}
                </span>
                <span className="text-[10px] mt-1 font-medium" style={{ fontFamily: F.body, color: COLORS.ivoryDim }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-7 flex gap-3">
          <Link to="/itinerary" className="flex-1">
            <GoldButton icon={ArrowRight} className="w-full">
              View Itinerary
            </GoldButton>
          </Link>
          <Link to="/updates" className="flex-1">
            <GoldButton variant="outline" className="w-full">
              Latest Updates
            </GoldButton>
          </Link>
        </div>
      </div>

      <div className="px-5">
        <Card>
          <div className="flex items-start gap-3">
            {photoOk && (
              <img
                src={brandingUrl(BRANDING_PATHS.folakePhoto)}
                alt="Folake"
                className="w-16 h-16 rounded-2xl object-cover shrink-0"
                style={{ border: `1px solid ${COLORS.line}` }}
                onError={() => setPhotoOk(false)}
              />
            )}
            <div className="min-w-0">
              <Eyebrow>A Note From Folake</Eyebrow>
              <p className="text-[13.5px] leading-relaxed" style={{ color: COLORS.ivory, fontFamily: F.body }}>
                "{welcomeNote}"
              </p>
            </div>
          </div>
        </Card>
        <LintelDivider />
        <SectionTitle
          eyebrow="The Celebration"
          title="The Celebration of a Lifetime"
          light
          sub="Five days. Two iconic destinations. One extraordinary woman turning 50 in the land of timeless wonders. We're celebrating half a century of life, love, family, friendship and unforgettable memories across Cairo and the Red Sea."
        />

        <Card dark className="mb-4">
          <Eyebrow>Right Now</Eyebrow>
          <div className="flex items-center justify-between mb-4 gap-2">
            <span
              className="text-[17px] min-w-0"
              style={{ fontFamily: F.display, color: COLORS.ivory, fontWeight: 500, letterSpacing: "-0.02em" }}
            >
              {!status && "The countdown is on"}
              {status?.phase === "before" && "Trip has not started"}
              {status?.phase === "during" && (status.today?.theme || `Day ${status.dayNum}`)}
              {status?.phase === "after" && "The trip has ended"}
            </span>
            {status && (
              <Badge tone="gold">{`Day ${status.dayNum} of ${status.total}`}</Badge>
            )}
          </div>
          {nextActivity ? (
            <div className="space-y-3">
              <QuickRow icon={Sparkles} label={status?.phase === "during" ? "Next Activity" : "First Activity"} value={nextActivity.name} />
              {(nextActivity.departure_time || nextActivity.start_time) && (
                <QuickRow
                  icon={Clock}
                  label="Meeting Time"
                  value={parseTimeOn("1970-01-01", nextActivity.departure_time) ? nextActivity.departure_time : nextActivity.start_time}
                />
              )}
              {nextActivity.meeting_point && <QuickRow icon={MapPin} label="Meeting Point" value={nextActivity.meeting_point} />}
              {nextActivity.dress_code && <QuickRow icon={Shirt} label="Dress Code" value={nextActivity.dress_code} />}
              {latestUpdate && (
                <QuickRow icon={Bell} label={`Latest Update — ${latestUpdate.category}`} value={latestUpdate.message} />
              )}
            </div>
          ) : status?.phase === "after" ? (
            <p className="text-[12.5px]" style={{ color: COLORS.ivoryDim }}>
              Five days, two destinations, one unforgettable celebration. Thank you for being part of it — check the Gallery for the memories.
            </p>
          ) : (
            <p className="text-[12.5px]" style={{ color: COLORS.ivoryDim }}>
              {configured ? "The schedule will appear here once it's published." : "Connect Supabase to show the next activity here."}
            </p>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <QuickLinkCard icon={Shirt} title="Dress Codes" to="/dress-codes" />
          <QuickLinkCard icon={Plane} title="Travel Info" to="/travel" />
          <QuickLinkCard icon={Users} title="My Trip" to="/my-trip" />
          <QuickLinkCard icon={Phone} title="Emergency Contacts" to="/contacts" />
        </div>
      </div>
    </div>
  );
}

function QuickRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-[38px] h-[38px] shrink-0 flex items-center justify-center"
        style={{ background: COLORS.chip, borderRadius: 11 }}
      >
        <Icon size={16} color={COLORS.gold} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px]" style={{ color: COLORS.ivoryDim, fontFamily: F.body }}>
          {label}
        </div>
        <div className="text-[13px] leading-snug font-medium" style={{ color: COLORS.ivory }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function QuickLinkCard({ icon: Icon, title, to }) {
  return (
    <Link to={to}>
      <Card dark className="!p-4 h-full flex flex-col gap-3">
        <span
          className="w-[38px] h-[38px] flex items-center justify-center"
          style={{ background: COLORS.chip, borderRadius: 11 }}
        >
          <Icon size={17} color={COLORS.gold} />
        </span>
        <span className="text-[13px]" style={{ color: COLORS.ivory, fontWeight: 500 }}>
          {title}
        </span>
      </Card>
    </Link>
  );
}
