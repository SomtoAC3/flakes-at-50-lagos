import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { X, AlertTriangle } from "lucide-react";
import { COLORS, F } from "../shared/theme";
import Header from "./Header";
import { useAuth } from "../lib/auth";
import { fetchAnnouncements } from "../lib/queries";

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

        <Header />

        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
