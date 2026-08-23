import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, Bell, Images, LogOut, ShieldCheck } from "lucide-react";
import { COLORS, F } from "../shared/theme";
import { useAuth } from "../lib/auth";

const TABS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/guests", label: "Guests", icon: Users },
  { to: "/admin/announcements", label: "Announcements", icon: Bell },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen w-full" style={{ background: COLORS.ink, fontFamily: F.body }}>
      <div className="w-full max-w-2xl mx-auto min-h-screen flex flex-col">
        <div
          className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur"
          style={{ background: `${COLORS.ink}E6`, borderBottom: "1px solid rgba(201,166,103,0.15)" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck size={16} color={COLORS.gold} className="shrink-0" />
            <span className="text-[12px] sm:text-[13px] tracking-[0.1em] uppercase truncate" style={{ fontFamily: F.mono, color: COLORS.ivory }}>
              Folake at 50 · Admin
            </span>
          </div>
          <button onClick={signOut} className="flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-full shrink-0 min-h-[36px]" style={{ border: "1px solid rgba(201,166,103,0.35)", color: COLORS.gold }}>
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>

        {user && (
          <div className="px-5 pt-2 text-[11px]" style={{ color: COLORS.ivoryDim, fontFamily: F.mono }}>
            {user.email}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto px-5 pt-4 pb-2" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab) => (
            <NavLink key={tab.to} to={tab.to} end={tab.end} className="shrink-0">
              {({ isActive }) => (
                <span
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12.5px] min-h-[40px]"
                  style={{
                    background: isActive ? `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold})` : "rgba(255,255,255,0.04)",
                    color: isActive ? COLORS.ink : COLORS.ivory,
                    border: isActive ? "none" : "1px solid rgba(201,166,103,0.2)",
                  }}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex-1 px-5 pb-16 pt-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
