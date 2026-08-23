import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home as HomeIcon, CalendarDays, Bell, Images, Menu, X, AlertTriangle, Sparkles } from "lucide-react";
import { COLORS, F } from "../shared/theme";
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
    <div className="min-h-screen w-full flex justify-center" style={{ background: COLORS.ink, fontFamily: F.body }}>
      <div className="w-full max-w-[480px] min-h-screen relative flex flex-col" style={{ background: COLORS.ink }}>
        {showUrgentBanner && (
          <div className="px-4 py-2.5 flex items-start gap-2 text-[12px]" style={{ background: "#3A1512", color: "#F3C7BE" }}>
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
          style={{ background: `${COLORS.ink}E6`, borderBottom: "1px solid rgba(201,166,103,0.15)" }}
        >
          <NavLink to="/" className="flex items-center gap-2">
            <Sparkles size={16} color={COLORS.gold} />
            <span className="text-[13px] tracking-[0.15em] uppercase" style={{ fontFamily: F.mono, color: COLORS.ivory }}>
              Folake at 50
            </span>
          </NavLink>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-28">
          <Outlet />
        </div>

        <div
          className="safe-bottom fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-3 pb-3 pt-2 z-40"
          style={{ background: `linear-gradient(to top, ${COLORS.ink} 70%, transparent)` }}
        >
          <div
            className="flex items-center justify-between rounded-2xl px-2 py-2"
            style={{ background: "rgba(20,20,19,0.92)", border: "1px solid rgba(201,166,103,0.22)", backdropFilter: "blur(8px)" }}
          >
            {NAV_MAIN.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-colors min-h-[44px]"
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.6} color={isActive ? COLORS.gold : "#9C9483"} />
                    <span className="text-[9.5px] tracking-wide" style={{ color: isActive ? COLORS.gold : "#9C9483", fontFamily: F.mono }}>
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
