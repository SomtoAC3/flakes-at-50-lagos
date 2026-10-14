import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { LoadingNote } from "../shared/ui";

// Gates My Trip and the directory, pages that touch a guest's own personal
// data or other guests', behind sign-in. The rest of the guest site is public.
export default function RequireGuestAuth({ children }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingNote label="Checking your session…" />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return children;
}
