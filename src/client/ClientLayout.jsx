import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home as HomeIcon, CalendarDays, Bell, Images, Menu, X, AlertTriangle, Sun, Moon } from "lucide-react";
import { COLORS, F, CAPS, DISPLAY_LUXE } from "../shared/theme";
import { useThemeMode } from "../shared/themeMode";
import { useAuth } from "../lib/auth";
import { fetchAnnouncements } from "../lib/queries";

const NAV_MAIN = [
  { to: "/", label: "Home", icon: HomeIcon, end: true },
  { to: "/itinerary", label: "Itinerary", icon: CalendarDays },
  { to: "/updates", label: "Updates", icon: Bell },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/more", label: "More", icon: Menu },
];

export default function ClientLayout() {
  const { configured } = useAuth();
  const [urgent, setUrgent] = useState(null);
  const [dismissedUrgentId, setDismissedUrgentId] = useState(null);
  const scrollRef = useRef(null);
  const location = useLocation();
  const { theme, toggle } = useThemeMode();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!configured) return;
    let active = true;
    fetchAnnouncements()
      .then((rows) => {
        if (!active) return;
        const top = rows.find((a) => a.priority === "urgent");
        setUrgent(top ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [configured]);

  const showUrgentBanner = urgent && urgent.id !== dismissedUrgentId;

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: COLORS.ink, fontFamily: F.body, color: COLORS.ivory }}>
      <div className="w-full max-w-[480px] min-h-screen relative flex flex-col" style={{ background: COLORS.ink }}>
        {showUrgentBanner && (
          <div className="px-4 py-2.5 flex items-start gap-2 text-[12px]" style={{ background: COLORS.dangerBg, color: COLORS.danger }}>
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span className="font-semibold">{urgent.category}: </span>
              {urgent.message}
            </div>
            <button onClick={() => setDismissedUrgentId(urgent.id)} className="shrink-0 opacity-70 hover:opacity-100 min-h-[24px] min-w-[24px]" aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        )}

        <div
          className="px-5 pt-5 pb-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur"
          style={{ background: "var(--header)", borderBottom: `1px solid ${COLORS.line}` }}
        >
          <NavLink to="/" className="flex items-baseline gap-2" aria-label="Folake at 50, home">
            <span className="text-[21px] leading-none" style={{ ...DISPLAY_LUXE, fontWeight: 400, letterSpacing: "-0.01em", color: COLORS.ivory }}>
              Folake
            </span>
            <span className="text-[9.5px] font-semibold" style={{ fontFamily: F.body, color: COLORS.gold, ...CAPS, letterSpacing: "0.3em" }}>
              at Fifty
            </span>
          </NavLink>
          <button
            onClick={toggle}
            className="flex items-center justify-center rounded-[2px] min-h-[34px] min-w-[34px]"
            style={{ border: `1px solid ${COLORS.line}`, color: COLORS.ivoryDim }}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-28">
          <Outlet />
        </div>

        <div className="safe-bottom fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-3 pb-3 pt-2 z-40">
          <div
            className="flex items-center justify-between rounded-[3px] px-2 py-2"
            style={{
              background: "var(--nav)",
              border: `1px solid ${COLORS.line}`,
              boxShadow: "var(--shadow-nav)",
              backdropFilter: "blur(8px)",
            }}
          >
            {NAV_MAIN.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-[3px] transition-colors min-h-[44px]"
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} strokeWidth={isActive ? 1.9 : 1.4} color={isActive ? COLORS.ivory : COLORS.ivoryDim} />
                    <span
                      className="text-[8.5px]"
                      style={{ color: isActive ? COLORS.ivory : COLORS.ivoryDim, fontFamily: F.body, fontWeight: isActive ? 700 : 500, ...CAPS, letterSpacing: "0.1em" }}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
