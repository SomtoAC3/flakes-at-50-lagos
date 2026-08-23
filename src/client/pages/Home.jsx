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
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
  const cities = [...new Set(days.map((d) => d.city))].join(" & ").toUpperCase();
  return `${fmt(first)} — ${fmt(last)}, ${last.getFullYear()}${cities ? ` · ${cities}` : ""}`;
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
      <div className="relative px-5 pt-8 pb-10 overflow-hidden">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] max-w-[110vw] rounded-full opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${COLORS.gold}55, transparent 70%)` }}
        />
        <svg width="100%" height="90" viewBox="0 0 400 90" className="mb-6 relative" aria-hidden="true">
          <path d="M 20 80 Q 200 -10 380 80" stroke={COLORS.gold} strokeWidth="1" fill="none" opacity="0.6" />
          <path d="M 60 82 Q 200 20 340 82" stroke={COLORS.gold} strokeWidth="1" fill="none" opacity="0.35" />
          <circle cx="200" cy="46" r="5" fill={COLORS.gold} opacity="0.9" />
        </svg>
        <Eyebrow>A Golden Jubilee Across Cairo &amp; The Red Sea</Eyebrow>
        <h1 className="text-[38px] sm:text-[42px] leading-[1.02] mb-1" style={{ fontFamily: F.display, fontWeight: 600, color: COLORS.ivory }}>
          Folake <span style={{ color: COLORS.gold, fontStyle: "italic", fontWeight: 500 }}>at 50</span>
        </h1>
        <h2 className="text-[20px] sm:text-[22px] leading-tight mb-4" style={{ fontFamily: F.display, fontWeight: 500, color: COLORS.ivoryDim, fontStyle: "italic" }}>
          The Egypt Takeover
        </h2>
        <p className="text-[13px] mb-1" style={{ color: COLORS.ivoryDim, fontFamily: F.mono }}>
          {days?.length ? formatDateRange(days) : "OCT 28 — NOV 1, 2026 · CAIRO & THE RED SEA"}
        </p>

        {status?.phase !== "after" && (
          <div className="mt-6 grid grid-cols-4 gap-2">
            {[["DAYS", cd.days], ["HRS", cd.hours], ["MIN", cd.minutes], ["SEC", cd.seconds]].map(([label, val]) => (
              <div key={label} className="rounded-xl py-3 flex flex-col items-center" style={{ border: "1px solid rgba(201,166,103,0.35)", background: "rgba(201,166,103,0.06)" }}>
                <span className="text-[20px] sm:text-[22px] tabular-nums" style={{ fontFamily: F.mono, color: COLORS.gold, fontWeight: 600 }}>
                  {pad(val)}
                </span>
                <span className="text-[9px] tracking-[0.2em] mt-1" style={{ fontFamily: F.mono, color: COLORS.ivoryDim }}>
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
        <LintelDivider />
        <Card dark>
          <div className="flex items-start gap-3">
            {photoOk && (
              <img
                src={brandingUrl(BRANDING_PATHS.folakePhoto)}
                alt="Folake"
                className="w-16 h-16 rounded-full object-cover shrink-0"
                style={{ border: "1px solid rgba(201,166,103,0.4)" }}
                onError={() => setPhotoOk(false)}
              />
            )}
            <div className="min-w-0">
              <Eyebrow>A Note From Folake</Eyebrow>
              <p className="text-[14px] leading-relaxed italic" style={{ color: COLORS.ivory, fontFamily: F.display }}>
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
            <span className="text-[16px] min-w-0" style={{ fontFamily: F.display, color: COLORS.ivory, fontWeight: 600 }}>
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
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(201,166,103,0.14)" }}>
        <Icon size={13} color={COLORS.gold} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] tracking-wide uppercase" style={{ color: COLORS.ivoryDim, fontFamily: F.mono }}>
          {label}
        </div>
        <div className="text-[13px] leading-snug" style={{ color: COLORS.ivory }}>
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
        <Icon size={18} color={COLORS.gold} />
        <span className="text-[13px]" style={{ color: COLORS.ivory, fontWeight: 500 }}>
          {title}
        </span>
      </Card>
    </Link>
  );
}
