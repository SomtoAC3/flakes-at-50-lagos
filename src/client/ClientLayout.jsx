import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { X, AlertTriangle } from "lucide-react";
import { COLORS, F } from "../shared/theme";
import Header from "./Header";
import { MAIN_LINKS } from "./data/navigation";
import { useAuth } from "../lib/auth";
import { fetchAnnouncements } from "../lib/queries";

// When this guest last opened Updates, so the header bell can show a dot for
// anything posted since. Kept per device.
const SEEN_KEY = "updatesSeenAt";
function readSeenAt() {
  try {
    return Number(localStorage.getItem(SEEN_KEY)) || 0;
  } catch {
    return 0;
  }
}

export default function ClientLayout() {
  const { configured } = useAuth();
  const [urgent, setUrgent] = useState(null);
  const [dismissedUrgentId, setDismissedUrgentId] = useState(null);
  const [latestAt, setLatestAt] = useState(0);
  const scrollRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
  }, [location.pathname]);

  const onUpdates = location.pathname === "/updates";
  useEffect(() => {
    if (!onUpdates) return;
    try {
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {
      // Private mode: the dot just comes back next visit.
    }
  }, [onUpdates, latestAt]);

  useEffect(() => {
    if (!configured) return;
    let active = true;
    fetchAnnouncements()
      .then((rows) => {
        if (!active) return;
        const top = rows.find((a) => a.priority === "urgent");
        setUrgent(top ?? null);
        setLatestAt(Math.max(0, ...rows.map((a) => Date.parse(a.created_at) || 0)));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [configured]);

  const showUrgentBanner = urgent && urgent.id !== dismissedUrgentId;
  // Read on each render: leaving Updates re-renders with the new time.
  const hasNew = !onUpdates && latestAt > readSeenAt();

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

        <Header hasNew={hasNew} />

        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-28">
          <Outlet />
        </div>

        <div className="safe-bottom fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-3 pb-3 pt-2 z-40">
          <nav
            className="flex items-center justify-between rounded-full px-2 py-1.5"
            style={{
              background: "var(--nav)",
              border: `1px solid ${COLORS.line}`,
              boxShadow: "var(--shadow-nav)",
              backdropFilter: "blur(8px)",
            }}
            aria-label="Main pages"
          >
            {MAIN_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                aria-label={item.label}
                className="flex-1 flex flex-col items-center justify-center pt-2 pb-1.5 transition-colors min-h-[52px]"
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={23} weight={item.weight || "fill"} color={isActive ? COLORS.ivory : COLORS.ivoryDim} />
                    <span className="block h-[2px] w-4 rounded-full mt-1.5" style={{ background: isActive ? COLORS.gold : "transparent" }} aria-hidden="true" />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
