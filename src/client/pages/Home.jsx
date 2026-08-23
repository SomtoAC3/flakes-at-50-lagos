import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Shirt, Compass, Sparkles, ArrowRight, Plane, Users, Phone } from "lucide-react";
import { COLORS, F, EVENT_START } from "../../shared/theme";
import { Card, Eyebrow, SectionTitle, GoldButton, Placeholder, Badge, LintelDivider } from "../../shared/ui";
import { useAuth } from "../../lib/auth";
import { fetchItinerary } from "../../lib/queries";

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

export default function Home() {
  const { configured } = useAuth();
  const cd = useCountdown(EVENT_START);
  const [firstActivity, setFirstActivity] = useState(null);

  useEffect(() => {
    if (!configured) return;
    let active = true;
    fetchItinerary()
      .then((days) => {
        if (!active) return;
        setFirstActivity(days[0]?.activities?.[0] ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [configured]);

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
          OCT 28 — NOV 1, 2026 · CAIRO &amp; THE RED SEA
        </p>

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
            <Placeholder label="Folake's photo" ratio="aspect-square w-16 h-16 shrink-0 !rounded-full" />
            <div className="min-w-0">
              <Eyebrow>A Note From Folake</Eyebrow>
              <p className="text-[14px] leading-relaxed italic" style={{ color: COLORS.ivory, fontFamily: F.display }}>
                "Fifty years, and I still can't believe I get to share this chapter with all of you — in Egypt, of all places. Pack your gold, bring your energy, and let's make this a celebration for the books."
              </p>
              <p className="text-[11px] mt-2" style={{ color: COLORS.gold, fontFamily: F.mono }}>
                — WELCOME MESSAGE, TO BE CONFIRMED / EDITABLE
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
          <div className="flex items-center justify-between mb-4">
            <span className="text-[16px]" style={{ fontFamily: F.display, color: COLORS.ivory, fontWeight: 600 }}>
              Trip has not started
            </span>
            <Badge tone="gold">Day 0 of 5</Badge>
          </div>
          {firstActivity ? (
            <div className="space-y-3">
              <QuickRow icon={Sparkles} label="Next Activity" value={firstActivity.name} />
              <QuickRow icon={Clock} label="Meeting Time" value={firstActivity.departure_time === "—" ? firstActivity.start_time : firstActivity.departure_time} />
              <QuickRow icon={MapPin} label="Meeting Point" value={firstActivity.meeting_point} />
              <QuickRow icon={Shirt} label="Dress Code" value={firstActivity.dress_code} />
              <QuickRow icon={Compass} label="Transportation" value="On schedule — no changes reported" />
            </div>
          ) : (
            <p className="text-[12.5px]" style={{ color: COLORS.ivoryDim }}>
              {configured ? "Loading the itinerary…" : "Connect Supabase to show the next activity here."}
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
