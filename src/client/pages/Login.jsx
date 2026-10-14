import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { COLORS, F } from "../../shared/theme";
import { GoldButton, ErrorNote, LoadingNote } from "../../shared/ui";
import { useAuth } from "../../lib/auth";

const inputStyle = { background: "var(--card)", border: "1px solid var(--line)", color: COLORS.ivory, fontFamily: F.body };

function friendlyError(err, step) {
  const msg = err?.message || "";
  if (/guest list/i.test(msg)) return "This email isn't on the guest list. Contact the organizers if you think that's a mistake.";
  if (step === "code" && /expired|invalid/i.test(msg)) return "That code is wrong or has expired. Check the latest email, or send a new code.";
  if (/security purposes|rate limit/i.test(msg)) return "Too many attempts. Wait a minute, then try again.";
  return msg || "Something went wrong. Try again.";
}

// Optional guest sign-in for My Trip, the directory and the gallery.
export default function Login() {
  const { configured, loading, user, sendSignInCode, verifySignInCode } = useAuth();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [step, setStep] = useState("email"); // email | code
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  if (loading) return <LoadingNote label="Checking your session…" />;
  if (user) return <Navigate to={from} replace />;

  async function sendCode(e) {
    e?.preventDefault();
    if (!email) return;
    setBusy(true);
    setError("");
    try {
      await sendSignInCode(email);
      if (step === "code") setResent(true);
      setStep("code");
    } catch (err) {
      setError(friendlyError(err, "email"));
    } finally {
      setBusy(false);
    }
  }

  async function verify(e) {
    e.preventDefault();
    if (code.length < 6) return;
    setBusy(true);
    setError("");
    try {
      await verifySignInCode(email, code);
      // The auth listener picks up the new session and the redirect above takes over.
    } catch (err) {
      setError(friendlyError(err, "code"));
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-12" style={{ background: COLORS.ink, fontFamily: F.body }}>
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <h1 className="text-[34px] leading-[1.05]" style={{ fontFamily: F.display, fontWeight: 500, letterSpacing: "-0.02em", color: COLORS.ivory }}>
            Folake at 50
          </h1>
          <p className="text-[15px] mt-1" style={{ fontFamily: F.display, color: COLORS.ivoryDim }}>
            The Egypt Takeover
          </p>
        </div>

        {!configured ? (
          <ErrorNote message="Sign-in isn't available right now. Try again later." />
        ) : step === "email" ? (
          <form onSubmit={sendCode}>
            <p className="text-[13px] mb-5 text-center" style={{ color: COLORS.ivoryDim }}>
              Sign in to RSVP, manage your trip details, and see the guest directory and gallery. Use the email the organizers have for you and we'll send you a code.
            </p>
            <ErrorNote message={error} />
            <label className="block mb-3">
              <span className="text-[11px] block mb-1" style={{ color: COLORS.ivoryDim }}>
                Email address
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-3 py-2.5 text-[16px] outline-none min-h-[44px]"
                style={inputStyle}
              />
            </label>
            <GoldButton type="submit" icon={Mail} className="w-full" disabled={busy}>
              {busy ? "Sending…" : "Send code"}
            </GoldButton>
          </form>
        ) : (
          <form onSubmit={verify}>
            <p className="text-[13px] mb-5 text-center" style={{ color: COLORS.ivoryDim }}>
              {resent ? "New code sent to " : "We sent a code to "}
              <span style={{ color: COLORS.ivory, fontWeight: 600 }}>{email}</span>. Enter it below.
            </p>
            <ErrorNote message={error} />
            <label className="block mb-3">
              <span className="text-[11px] block mb-1" style={{ color: COLORS.ivoryDim }}>
                Sign-in code
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={8}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full rounded-xl px-3 py-2.5 text-[20px] text-center outline-none min-h-[48px] tabular-nums"
                style={{ ...inputStyle, letterSpacing: "0.3em" }}
              />
            </label>
            <GoldButton type="submit" className="w-full" disabled={busy || code.length < 6}>
              {busy ? "Checking…" : "Sign in"}
            </GoldButton>
            <div className="flex items-center justify-between mt-4 text-[12.5px]">
              <button
                type="button"
                onClick={() => { setStep("email"); setCode(""); setError(""); setResent(false); }}
                className="flex items-center gap-1 min-h-[36px]"
                style={{ color: COLORS.ivoryDim }}
              >
                <ArrowLeft size={13} /> Different email
              </button>
              <button type="button" onClick={sendCode} disabled={busy} className="min-h-[36px] font-semibold" style={{ color: COLORS.gold }}>
                Send a new code
              </button>
            </div>
            <p className="text-[11.5px] mt-5 text-center" style={{ color: COLORS.ivoryDim }}>
              Can't find it? Check your spam folder.
            </p>
          </form>
        )}

        <Link to="/" className="flex items-center justify-center gap-1 mt-8 text-[12.5px] min-h-[36px]" style={{ color: COLORS.ivoryDim }}>
          <ArrowLeft size={13} /> Back to the site
        </Link>
      </div>
    </div>
  );
}
