import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../lib/auth";
import { COLORS, F } from "../shared/theme";
import { LoadingNote, GoldButton } from "../shared/ui";

// Gates My Trip / Directory / Gallery — pages that touch a guest's own
// personal data or other guests' — behind sign-in. The rest of the guest site
// is public. Signed in but not on the guest list (e.g. removed by an
// organizer) -> an explicit screen, no content.
export default function RequireGuestAuth({ children }) {
  const { loading, user, isInvited, signOut } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingNote label="Checking your session…" />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  if (!isInvited) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.ink }}>
        <div className="text-center max-w-xs">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ background: COLORS.dangerBg }}>
            <ShieldAlert size={22} color={COLORS.danger} />
          </div>
          <h2 className="text-[18px] mb-2" style={{ fontFamily: F.display, fontWeight: 600, color: COLORS.ivory }}>
            Not on the guest list
          </h2>
          <p className="text-[12.5px] mb-6" style={{ color: COLORS.ivoryDim }}>
            {user.email} isn't on the guest list for this trip. If you think that's a mistake, contact the organizers.
          </p>
          <GoldButton variant="outline" onClick={signOut}>
            Sign out
          </GoldButton>
        </div>
      </div>
    );
  }

  return children;
}
