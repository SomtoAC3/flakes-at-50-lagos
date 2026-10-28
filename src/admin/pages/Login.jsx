import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, F } from "../../shared/theme";
import { ShieldCheck, LogIn } from "lucide-react";
import { GoldButton, ErrorNote, TextInput } from "../../shared/ui";
import { useAuth } from "../../lib/auth";

export default function AdminLogin() {
  const { signInWithPassword, configured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | signing-in | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    setStatus("signing-in");
    setError("");
    try {
      await signInWithPassword(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setStatus("error");
      setError(err.message || "Sign-in failed. Check your email and password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: COLORS.ink }}>
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-[3px] flex items-center justify-center mb-4 mx-auto" style={{ background: "var(--chip)" }}>
            <ShieldCheck size={22} color={COLORS.gold} />
          </div>
          <h1 className="text-[20px] mb-1" style={{ fontFamily: F.display, fontWeight: 600, color: COLORS.ivory }}>
            Organizer Sign-In
          </h1>
          <p className="text-[12.5px]" style={{ color: COLORS.ivoryDim }}>
            Flakes@50 Lagos · Admin
          </p>
        </div>

        {!configured ? (
          <ErrorNote message="Supabase isn't connected yet, so sign-in is disabled. Once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set, this form will work." />
        ) : (
          <form onSubmit={handleSubmit}>
            <ErrorNote message={error} />
            <TextInput
              wrapperClassName="mb-3"
              label="Email address"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <TextInput
              wrapperClassName="mb-4"
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <GoldButton type="submit" icon={LogIn} className="w-full" disabled={status === "signing-in"}>
              {status === "signing-in" ? "Signing in…" : "Sign in"}
            </GoldButton>
          </form>
        )}
      </div>
    </div>
  );
}
