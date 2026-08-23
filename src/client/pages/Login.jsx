import { useLocation } from "react-router-dom";
import { SectionTitle } from "../../shared/ui";
import MagicLinkForm from "../../shared/MagicLinkForm";

export default function Login() {
  const location = useLocation();
  const from = location.state?.from || "/";

  return (
    <div className="px-5 pt-10">
      <SectionTitle eyebrow="Guest Sign-In" title="Sign In" light sub="Sign in with your email to RSVP, manage your trip details, and see the guest directory." />
      <MagicLinkForm redirectPath={from} helperText="We'll email you a one-time link — no password needed." />
    </div>
  );
}
