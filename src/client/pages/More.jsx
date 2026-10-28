import { Link } from "react-router-dom";
import { Shirt, Plane, Users, Globe2, BookOpen, HelpCircle, Phone, ArrowUpRight } from "lucide-react";
import { COLORS, F, DISPLAY_LUXE } from "../../shared/theme";
import { Card, SectionTitle, GoldButton } from "../../shared/ui";
import { useAuth } from "../../lib/auth";
import { MORE_LINKS } from "../data/navigation";

const ICONS = {
  "/dress-codes": Shirt,
  "/travel": Plane,
  "/my-trip": Users,
  "/directory": Globe2,
  "/story": BookOpen,
  "/faq": HelpCircle,
  "/contacts": Phone,
};

function LinkIcon({ to, ...props }) {
  const Icon = ICONS[to];
  return <Icon {...props} />;
}

export default function More() {
  const { user, signOut } = useAuth();

  return (
    <div className="px-5 pt-6">
      <SectionTitle eyebrow="Explore" title="More" light />

      <Card dark className="mb-4 grid gap-3">
        <div>
          <div className="text-[13px] font-semibold" style={{ color: COLORS.ivory }}>
            {user ? user.email : "Not signed in"}
          </div>
          <div className="text-[11.5px]" style={{ color: COLORS.ivoryDim }}>
            {user ? "Signed in as a guest" : "Sign in to RSVP, use My Trip, and the directory"}
          </div>
        </div>
        {user ? (
          <GoldButton variant="outline" onClick={signOut}>
            Sign out
          </GoldButton>
        ) : (
          <GoldButton as={Link} to="/login">
            Sign in
          </GoldButton>
        )}
      </Card>

      <nav className="mt-6" style={{ borderTop: `1px solid ${COLORS.line}` }} aria-label="More pages">
        {MORE_LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="group flex items-center gap-4 py-4 min-h-[60px]" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
            <LinkIcon to={l.to} size={17} strokeWidth={1.5} color={COLORS.ivoryDim} className="shrink-0" />
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
