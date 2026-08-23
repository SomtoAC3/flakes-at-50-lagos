import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { COLORS, F } from "../shared/theme";
import { LoadingNote, GoldButton } from "../shared/ui";
import { ShieldAlert } from "lucide-react";

// Gates the entire /admin subtree. Signed out -> straight to /admin/login.
// Signed in but not an organizer -> an explicit "not authorized" screen,
// never the dashboard itself.
export default function RequireOrganizerAuth({ children }) {
  const { loading, user, profile, isOrganizer, signOut } = useAuth();

  if (loading) return <LoadingNote label="Checking your session…" />;
  if (!user) return <Navigate to="/admin/login" replace />;

  if (!profile || !isOrganizer) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.ink }}>
        <div className="text-center max-w-xs">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ background: "rgba(196,68,58,0.14)" }}>
            <ShieldAlert size={22} color="#E0685C" />
          </div>
          <h2 className="text-[18px] mb-2" style={{ fontFamily: F.display, fontWeight: 600, color: COLORS.ivory }}>
            Not authorized
          </h2>
          <p className="text-[12.5px] mb-6" style={{ color: COLORS.ivoryDim }}>
            {user.email} is signed in but isn't an organizer on this trip. Ask an existing organizer to grant access from the admin dashboard.
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
