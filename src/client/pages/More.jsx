import { Link } from "react-router-dom";
import { Shirt, Plane, Users, Globe2, BookOpen, HelpCircle, Phone, ArrowUpRight, LogIn, LogOut } from "lucide-react";
import { COLORS, F, DISPLAY_LUXE } from "../../shared/theme";
import { Card, SectionTitle } from "../../shared/ui";
import { useAuth } from "../../lib/auth";

const MORE_LINKS = [
  { to: "/dress-codes", label: "Dress Codes", icon: Shirt, desc: "Style guides for every event" },
  { to: "/travel", label: "Travel Information", icon: Plane, desc: "Flights, visas, hotels & more" },
  { to: "/my-trip", label: "My Trip", icon: Users, desc: "Your profile & checklist" },
  { to: "/directory", label: "Guest Directory", icon: Globe2, desc: "See who's celebrating" },
  { to: "/story", label: "Folake's Story", icon: BookOpen, desc: "Fifty years of grace" },
  { to: "/faq", label: "FAQs", icon: HelpCircle, desc: "Answers to common questions" },
  { to: "/contacts", label: "Contacts", icon: Phone, desc: "Emergency & organizer info" },
];

export default function More() {
  const { user, signOut } = useAuth();

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Explore" title="More" light />

      <Card dark className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[13px] font-semibold" style={{ color: COLORS.ivory }}>
            {user ? user.email : "Not signed in"}
          </div>
          <div className="text-[11.5px]" style={{ color: COLORS.ivoryDim }}>
            {user ? "Signed in as a guest" : "Sign in to RSVP, use My Trip, and the directory"}
          </div>
        </div>
        {user ? (
          <button onClick={signOut} className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-full min-h-[38px] whitespace-nowrap shrink-0" style={{ border: `1.5px solid ${COLORS.gold}`, color: COLORS.gold }}>
            <LogOut size={13} /> Sign out
          </button>
        ) : (
          <Link to="/login" className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-full min-h-[38px] whitespace-nowrap shrink-0" style={{ border: `1.5px solid ${COLORS.gold}`, color: COLORS.gold }}>
            <LogIn size={13} /> Sign in
          </Link>
        )}
      </Card>

      <nav className="mt-6" style={{ borderTop: `1px solid ${COLORS.line}` }} aria-label="More pages">
        {MORE_LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="group flex items-center gap-4 py-4 min-h-[60px]" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
            <l.icon size={17} strokeWidth={1.5} color={COLORS.ivoryDim} className="shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[19px] leading-tight" style={{ ...DISPLAY_LUXE, color: COLORS.ivory }}>{l.label}</div>
              <div className="text-[12px] mt-0.5" style={{ color: COLORS.ivoryDim }}>{l.desc}</div>
            </div>
            <ArrowUpRight size={17} strokeWidth={1.5} color={COLORS.gold} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </nav>

      <p className="text-[10.5px] text-center pt-6 pb-2" style={{ color: COLORS.ivoryDim, fontFamily: F.body }}>
        Flakes@50 · Lagos Edition
      </p>
    </div>
  );
}
