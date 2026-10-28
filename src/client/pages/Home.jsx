import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Clock, Shirt, Bell, Sparkles, ArrowRight, ArrowUpRight, Plane, Users, Phone, Music } from "lucide-react";
import { COLORS, F, EVENT_START, CAPS, DISPLAY_LUXE } from "../../shared/theme";
import { Card, Eyebrow, SectionTitle, GoldButton, Badge, LintelDivider } from "../../shared/ui";
import { Stem } from "../../shared/flora";
import { useAuth } from "../../lib/auth";
import { fetchItinerary, fetchAnnouncements, fetchSiteContent } from "../../lib/queries";

const FALLBACK_WELCOME_NOTE =
  "Dear Guests,\n\nThe countdown to 50 continues in Lagos. Thank you for showing up with love for Flakes. From arrival and thanksgiving to beachside ease and a night out together, this weekend is a celebration of grace, life and friendship. Here's to beautiful people and meaningful moments. See you in Lagos.";

// Collaborative Spotify playlist for the celebration. Paste the playlist's
// invite link (with its pt/pi parameters) here and the Soundtrack card
// appears on Home; guests open it, join and add songs. Empty hides the card.
const PLAYLIST_INVITE_URL = "";

// Spotify's mark in its brand green, so guests know the playlist opens there.
function SpotifyLogo({ size = 24, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} role="img" aria-label="Spotify">
      <path
        fill="#1ED760"
        d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
      />
    </svg>
  );
}

function useCountdown(target) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = target ? Math.max(0, target.getTime() - now.getTime()) : 0;
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

function formatLongDateRange(days) {
  const first = dayStart(days[0].date);
  const last = dayStart(days[days.length - 1].date);
  const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  return `${fmt(first)} – ${fmt(last)} ${last.getFullYear()}`;
}

// The portrait in an arched frame, with one sprig standing beside it.
function Hero() {
  return (
    <div className="relative px-6 pt-6">
      <div className="relative">
        <img
          src="/hero/flakes.jpg"
          alt="Folake in cream ruffles and crystal hoop earrings"
          className="hero-photo block w-full object-cover"
          style={{ aspectRatio: "4 / 5", objectPosition: "50% 15%", borderRadius: "999px 999px 24px 24px" }}
        />
        <div className="absolute rise-in" style={{ left: -18, bottom: -6, width: 58, animationDelay: "0.3s" }}>
          <Stem kind="sprig" flower={COLORS.flowerLilac} leaf={COLORS.leaf} width={58} />
        </div>
      </div>
      <div
        className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-semibold"
        style={{ writingMode: "vertical-rl", color: COLORS.ivoryDim, fontFamily: F.body, ...CAPS, letterSpacing: "0.36em" }}
        aria-hidden="true"
      >
        Lagos · MMXXVI
      </div>
    </div>
  );
}

export default function Home() {
  const { configured } = useAuth();
  const [days, setDays] = useState(null);
  const [latestUpdate, setLatestUpdate] = useState(null);
  const [welcomeNote, setWelcomeNote] = useState(FALLBACK_WELCOME_NOTE);
  const navigate = useNavigate();

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
      <Hero />

      <div className="px-6 pt-9 pb-12">
        <div className="rise-in">
          <Eyebrow>A Golden Jubilee · Lagos Edition</Eyebrow>
          <h1 className="leading-[0.9]" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, letterSpacing: "-0.035em" }}>
            <span className="block whitespace-nowrap text-[56px] sm:text-[68px]">
              <em>Flakes</em><span style={{ color: COLORS.gold }}>@50</span>
            </span>
          </h1>
          <p className="text-[16px] italic mt-5" style={{ ...DISPLAY_LUXE, color: COLORS.ivoryDim }}>
            {days?.length ? `${formatLongDateRange(days)}, Lagos` : "Lagos · Date to be announced"}
          </p>
        </div>

        {countdownTarget && status?.phase !== "after" && (
          <div
            className="mt-9 grid grid-cols-4 py-4"
            style={{ borderTop: `1px solid ${COLORS.line}`, borderBottom: `1px solid ${COLORS.line}` }}
            role="timer"
            aria-label={`${cd.days} days, ${cd.hours} hours, ${cd.minutes} minutes until the celebration`}
          >
            {[["Days", cd.days], ["Hours", cd.hours], ["Minutes", cd.minutes], ["Seconds", cd.seconds]].map(([label, val], i) => (
              <div key={label} className="flex flex-col items-center py-1" style={i ? { borderLeft: `1px solid ${COLORS.line}` } : undefined} aria-hidden="true">
                <span className="text-[34px] leading-none tabular-nums" style={{ ...DISPLAY_LUXE, color: COLORS.ivory }}>
                  {pad(val)}
                </span>
                <span className="text-[8.5px] mt-2.5 font-semibold" style={{ fontFamily: F.body, color: COLORS.ivoryDim, ...CAPS, letterSpacing: "0.22em" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <GoldButton icon={ArrowRight} className="flex-1 flex-row-reverse" onClick={() => navigate("/itinerary")}>
            Itinerary
          </GoldButton>
          <GoldButton variant="outline" className="flex-1" onClick={() => navigate("/updates")}>
            Updates
          </GoldButton>
        </div>
      </div>

      <div className="px-6">
        <figure className="pt-10 pb-2" style={{ borderTop: `1px solid ${COLORS.line}` }}>
          <Eyebrow>A Note From the Planning Team</Eyebrow>
          <span className="block text-[64px] leading-[0.6] mt-4 select-none" style={{ ...DISPLAY_LUXE, color: COLORS.gold }} aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className="text-[18px] leading-[1.6] italic mt-1 whitespace-pre-line" style={{ ...DISPLAY_LUXE, color: COLORS.ivory }}>
            {welcomeNote}
          </blockquote>
          <figcaption className="mt-5 text-[10px] font-semibold" style={{ color: COLORS.ivoryDim, fontFamily: F.body, ...CAPS, letterSpacing: "0.3em" }}>
            — The Planning Team
          </figcaption>
        </figure>

        <LintelDivider />
        <SectionTitle
          eyebrow="The Celebration"
          title="The Celebration of a Lifetime"
          light
          sub="Fifty years, celebrated at home in Lagos. No crowded checklist, no rushing from one thing to the next. Just beautiful people, good music and enough room for the moments you cannot schedule."
        />

        <Card dark className="mb-4">
          <Eyebrow>Right Now</Eyebrow>
          <div className="flex items-center justify-between mb-4 gap-2">
            <span
              className="text-[22px] leading-tight min-w-0"
              style={{ ...DISPLAY_LUXE, color: COLORS.ivory, letterSpacing: "-0.01em" }}
            >
              {!status && "The countdown is on"}
              {status?.phase === "before" && "The celebration has not started"}
              {status?.phase === "during" && (status.today?.theme || `Day ${status.dayNum}`)}
              {status?.phase === "after" && "The celebration has ended"}
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
              Fifty years. One for the books. Thank you for being part of it — check the Gallery for the memories.
            </p>
          ) : (
            <p className="text-[12.5px]" style={{ color: COLORS.ivoryDim }}>
              {configured ? "The schedule will appear here once it's published." : "Connect Supabase to show the next activity here."}
            </p>
          )}
        </Card>

        {PLAYLIST_INVITE_URL && (
          <Card dark className="mb-4 relative">
            <SpotifyLogo className="absolute top-5 right-5" size={24} />
            <Eyebrow>The Soundtrack</Eyebrow>
            <h3 className="text-[22px] leading-tight mb-1" style={{ ...DISPLAY_LUXE, color: COLORS.ivory, letterSpacing: "-0.01em" }}>
              Flakes@50 Lagos
            </h3>
            <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: COLORS.ivoryDim }}>
              Our playlist for the celebration. Join it on Spotify and add the songs you want to hear in Lagos.
            </p>
            <a
              href={PLAYLIST_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[11px] font-semibold min-h-[48px] active:scale-[0.98] transition-all"
              style={{ background: COLORS.ivory, color: COLORS.ink, fontFamily: F.body, ...CAPS, letterSpacing: "0.18em" }}
            >
              <Music size={14} strokeWidth={1.75} />
              Join &amp; Add Songs
            </a>
          </Card>
        )}

        <nav className="mt-8 mb-10" style={{ borderTop: `1px solid ${COLORS.line}` }} aria-label="Guest information">
          <QuickLink icon={Shirt} title="Dress Codes" to="/dress-codes" />
          <QuickLink icon={Plane} title="Travel Info" to="/travel" />
          <QuickLink icon={Users} title="My Trip" to="/my-trip" />
          <QuickLink icon={Phone} title="Emergency Contacts" to="/contacts" />
        </nav>
      </div>
    </div>
  );
}

function QuickRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} strokeWidth={1.5} color={COLORS.gold} className="shrink-0 mt-0.5" />
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

// A directory row: icon, name, arrow, on a hairline.
function QuickLink({ icon: Icon, title, to }) {
  return (
    <Link to={to} className="group flex items-center gap-4 py-4 min-h-[56px]" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
      <Icon size={17} strokeWidth={1.5} color={COLORS.ivoryDim} className="shrink-0" />
      <span className="flex-1 text-[19px] leading-tight" style={{ ...DISPLAY_LUXE, color: COLORS.ivory }}>
        {title}
      </span>
      <ArrowUpRight size={17} strokeWidth={1.5} color={COLORS.gold} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
