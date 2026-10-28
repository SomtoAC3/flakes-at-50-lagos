import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowLeft, X, AlertTriangle } from "lucide-react";
import { House, CalendarDots, Bell, Images, List, Moon, Sun } from "@phosphor-icons/react";
import { COLORS, F, CAPS, DISPLAY_LUXE } from "../shared/theme";
import { useThemeMode } from "../shared/themeMode";
import { Stem } from "../shared/flora";
import { useAuth } from "../lib/auth";
import { fetchAnnouncements } from "../lib/queries";

const NAV_MAIN = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/itinerary", label: "Itinerary", icon: CalendarDots },
  { to: "/updates", label: "Updates", icon: Bell },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/more", label: "More", icon: List },
];

// Where the header's back arrow goes: event pages return to the itinerary,
// pages opened from More return there, and the tab pages have none.
const TAB_PATHS = new Set(NAV_MAIN.map((item) => item.to));
function backPath(pathname) {
  if (TAB_PATHS.has(pathname)) return null;
  if (pathname.startsWith("/itinerary/")) return "/itinerary";
  return "/more";
}

export default function ClientLayout() {
  const { configured } = useAuth();
  const [urgent, setUrgent] = useState(null);
  const [dismissedUrgentId, setDismissedUrgentId] = useState(null);
  const scrollRef = useRef(null);
  const location = useLocation();
  const { theme, toggle } = useThemeMode();
  const back = backPath(location.pathname);

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

        <div className="px-3 pt-4 pb-2 grid grid-cols-[44px_1fr_44px] items-center sticky top-0 z-30 backdrop-blur" style={{ background: "var(--header)" }}>
          {back ? (
            <Link to={back} className="flex items-center justify-center min-h-[44px] min-w-[44px]" style={{ color: COLORS.ivory }} aria-label="Back">
              <ArrowLeft size={20} strokeWidth={1.75} />
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          <NavLink to="/" className="justify-self-center" aria-label="Flakes@50 Lagos Edition, home">
            <span className="flex items-center gap-2 text-[23px] leading-none" style={{ ...DISPLAY_LUXE, letterSpacing: "-0.015em", color: COLORS.ivory }}>
              <Stem kind="tulip" headOnly width={15} flower={COLORS.flowerCoral} />
              <span>
                <em>Flakes</em>
                <span style={{ color: COLORS.gold }}>@50</span>
              </span>
            </span>
          </NavLink>
          <button
            onClick={toggle}
            className="flex items-center justify-center min-h-[44px] min-w-[44px]"
            style={{ color: COLORS.ivory }}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-28">
          <Outlet />
        </div>

        <div className="safe-bottom fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-3 pb-3 pt-2 z-40">
          <div
            className="flex items-center justify-between rounded-full px-2 py-1.5"
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
                className="flex-1 flex flex-col items-center justify-center pt-1.5 pb-1 transition-colors min-h-[48px]"
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={19} weight="fill" color={isActive ? COLORS.ivory : COLORS.ivoryDim} />
                    <span
                      className="text-[8.5px] mt-1"
                      style={{ color: isActive ? COLORS.ivory : COLORS.ivoryDim, fontFamily: F.body, fontWeight: isActive ? 700 : 500, ...CAPS, letterSpacing: "0.1em" }}
                    >
                      {item.label}
                    </span>
                    <span className="block h-[2px] w-4 rounded-full mt-1" style={{ background: isActive ? COLORS.gold : "transparent" }} aria-hidden="true" />
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
