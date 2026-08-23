import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { LoadingNote } from "../shared/ui";

// Gates My Trip / Directory / Gallery — pages that touch a guest's own
// personal data or identity — behind a signed-in guest session.
export default function RequireGuestAuth({ children }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingNote label="Checking your session…" />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}
