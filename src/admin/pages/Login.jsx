import { COLORS, F } from "../../shared/theme";
import { ShieldCheck } from "lucide-react";
import MagicLinkForm from "../../shared/MagicLinkForm";

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.ink }}>
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ background: "rgba(201,166,103,0.14)" }}>
            <ShieldCheck size={22} color={COLORS.gold} />
          </div>
          <h1 className="text-[20px] mb-1" style={{ fontFamily: F.display, fontWeight: 600, color: COLORS.ivory }}>
            Organizer Sign-In
          </h1>
          <p className="text-[12.5px]" style={{ color: COLORS.ivoryDim }}>
            Folake at 50 · Admin
          </p>
        </div>
        <MagicLinkForm redirectPath="/admin" helperText="Sign in with the email your organizer account uses. You'll get an email link — no password." />
      </div>
    </div>
  );
}
