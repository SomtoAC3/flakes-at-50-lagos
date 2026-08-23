import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { COLORS, F } from "./theme";
import { GoldButton, ErrorNote } from "./ui";
import { useAuth } from "../lib/auth";

/**
 * Shared email-magic-link sign-in form. `redirectPath` controls where
 * Supabase sends the user back to after they click the link in their
 * inbox (e.g. "/" for guests, "/admin" for organizers).
 */
export default function MagicLinkForm({ redirectPath = "/", helperText }) {
  const { signInWithMagicLink, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setError("");
    try {
      await signInWithMagicLink(email, redirectPath);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong sending the link.");
    }
  }

  if (!configured) {
    return (
      <ErrorNote message="Supabase isn't connected yet, so sign-in is disabled. Once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set, this form will send real magic links." />
    );
  }

  if (status === "sent") {
    return (
      <div className="text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto"
          style={{ background: COLORS.chip }}
        >
          <Check size={22} color={COLORS.gold} />
        </div>
        <p className="text-[14px]" style={{ color: COLORS.ivory }}>
          Check <span style={{ color: COLORS.gold }}>{email}</span> for a sign-in link.
        </p>
        <p className="text-[12px] mt-2" style={{ color: COLORS.ivoryDim }}>
          Open it on this device to finish signing in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto">
      {helperText && (
        <p className="text-[12.5px] mb-4 text-center" style={{ color: COLORS.ivoryDim }}>
          {helperText}
        </p>
      )}
      <ErrorNote message={error} />
      <label className="block mb-3">
        <span className="text-[11px] block mb-1" style={{ color: COLORS.ivoryDim }}>
          Email address
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl px-3 py-2.5 text-[13px] outline-none min-h-[44px]"
          style={{ background: "var(--card)", border: "1px solid var(--line)", color: COLORS.ivory, fontFamily: F.body }}
        />
      </label>
      <GoldButton type="submit" icon={Mail} className="w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send sign-in link"}
      </GoldButton>
    </form>
  );
}
