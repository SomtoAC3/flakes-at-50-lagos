import { Link } from "react-router-dom";
import { Shirt, Plane, Users, Globe2, BookOpen, HelpCircle, Phone, ChevronRight, LogIn, LogOut } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { Card, SectionTitle } from "../../shared/ui";
import { BloomIcon } from "../../shared/flora";
import { useAuth } from "../../lib/auth";

const MORE_KINDS = ["petal6", "scallop", "petal4", "daisy"];

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

      <div className="space-y-2.5">
        {MORE_LINKS.map((l, i) => (
          <Link key={l.to} to={l.to}>
            <Card dark className="flex items-center gap-3 !py-3.5">
              <BloomIcon icon={l.icon} kind={MORE_KINDS[i % MORE_KINDS.length]} />
              <div className="flex-1 text-left min-w-0">
                <div className="text-[13.5px] font-semibold" style={{ color: COLORS.ivory }}>{l.label}</div>
                <div className="text-[11.5px]" style={{ color: COLORS.ivoryDim }}>{l.desc}</div>
              </div>
              <ChevronRight size={15} color={COLORS.gold} className="shrink-0" />
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-[10.5px] text-center pt-6 pb-2" style={{ color: COLORS.ivoryDim, fontFamily: F.body }}>
        Flakes@50 · Lagos Edition
      </p>
    </div>
  );
}
