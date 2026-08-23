import { COLORS, F } from "./theme";

export function LintelDivider({ tone = "gold" }) {
  const color = tone === "gold" ? COLORS.gold : COLORS.emeraldLight;
  return (
    <div className="flex items-center gap-3 my-8 select-none" aria-hidden="true">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${color}66)` }} />
      <div className="flex items-center gap-1.5" style={{ color }}>
        <span className="w-1 h-1 rotate-45" style={{ background: color }} />
        <span className="w-1.5 h-1.5 rotate-45" style={{ background: color }} />
        <span className="w-1 h-1 rotate-45" style={{ background: color }} />
      </div>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${color}66)` }} />
    </div>
  );
}

export function Eyebrow({ children }) {
  return (
    <div className="uppercase tracking-[0.28em] text-[11px] font-medium mb-2" style={{ color: COLORS.gold, fontFamily: F.mono }}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, sub, light }) {
  return (
    <div className="mb-6">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-[26px] sm:text-[28px] leading-[1.1]" style={{ fontFamily: F.display, fontWeight: 600, color: light ? COLORS.ivory : COLORS.ink }}>
        {title}
      </h2>
      {sub && (
        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: light ? COLORS.ivoryDim : "#5b5546", fontFamily: F.body }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function GoldButton({ children, onClick, variant = "solid", icon: Icon, className = "", type = "button", disabled = false }) {
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[13px] font-semibold tracking-wide transition-all active:scale-[0.97] min-h-[44px] disabled:opacity-50 disabled:pointer-events-none";
  const styles =
    variant === "solid"
      ? { background: `linear-gradient(135deg, ${COLORS.goldLight}, ${COLORS.gold})`, color: COLORS.ink }
      : variant === "outline"
      ? { border: `1px solid ${COLORS.gold}`, color: COLORS.gold, background: "transparent" }
      : { background: "rgba(243,235,218,0.08)", color: COLORS.ivory };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${className}`} style={{ fontFamily: F.body, ...styles }}>
      {Icon && <Icon size={15} strokeWidth={2} />}
      {children}
    </button>
  );
}

export function Placeholder({ label, ratio = "aspect-[4/3]" }) {
  const hasWidth = /\bw-/.test(ratio);
  return (
    <div
      className={`${ratio} ${hasWidth ? "" : "w-full"} rounded-2xl flex flex-col items-center justify-center gap-2 text-center px-4`}
      style={{ border: `1.5px dashed ${COLORS.gold}77`, background: "linear-gradient(160deg, rgba(201,166,103,0.08), rgba(18,56,50,0.10))" }}
    >
      <span className="text-[11px] leading-snug" style={{ color: COLORS.gold, fontFamily: F.mono }}>
        {label}
      </span>
    </div>
  );
}

export function Badge({ children, tone = "gold" }) {
  const map = {
    gold: { bg: "rgba(201,166,103,0.15)", fg: COLORS.gold },
    emerald: { bg: "rgba(31,90,80,0.18)", fg: COLORS.emeraldLight },
    urgent: { bg: "rgba(196,68,58,0.16)", fg: "#E0685C" },
    ivory: { bg: "rgba(243,235,218,0.12)", fg: COLORS.ivory },
  };
  const s = map[tone] || map.gold;
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
      style={{ background: s.bg, color: s.fg, fontFamily: F.mono }}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = "", dark = false }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: dark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
        border: dark ? "1px solid rgba(201,166,103,0.18)" : "1px solid rgba(11,11,12,0.06)",
        boxShadow: dark ? "none" : "0 1px 2px rgba(11,11,12,0.04)",
      }}
    >
      {children}
    </div>
  );
}

export function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      {Icon && <Icon size={13} color={COLORS.gold} className="shrink-0 mt-0.5" />}
      <div className="text-[12.5px] leading-snug min-w-0">
        <span style={{ color: COLORS.ivoryDim }}>{label}: </span>
        <span style={{ color: COLORS.ivory }}>{value}</span>
      </div>
    </div>
  );
}

export function FieldGroup({ title, children }) {
  return (
    <div>
      <div className="text-[11px] tracking-[0.15em] uppercase mb-2.5" style={{ color: COLORS.gold, fontFamily: F.mono }}>
        {title}
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

export function Field({ label, value, onChange, placeholder, multiline, type = "text" }) {
  const Comp = multiline ? "textarea" : "input";
  return (
    <label className="block">
      <span className="text-[11px] block mb-1" style={{ color: COLORS.ivoryDim }}>
        {label}
      </span>
      <Comp
        type={multiline ? undefined : type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        rows={multiline ? 3 : undefined}
        className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none min-h-[44px]"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,166,103,0.25)", color: COLORS.ivory }}
      />
    </label>
  );
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-[11px] block mb-1" style={{ color: COLORS.ivoryDim }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-3 py-2.5 text-[13px] outline-none min-h-[44px]"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,166,103,0.25)", color: COLORS.ivory }}
      >
        {options.map(([v, l]) => (
          <option key={v} value={v} style={{ color: "#000" }}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

export function LoadingNote({ label = "Loading…" }) {
  return (
    <div className="py-10 text-center text-[13px]" style={{ color: COLORS.ivoryDim, fontFamily: F.mono }}>
      {label}
    </div>
  );
}

export function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl p-3 mb-4 text-[12.5px]" style={{ background: "rgba(196,68,58,0.12)", color: "#E0685C", border: "1px solid rgba(196,68,58,0.3)" }}>
      {message}
    </div>
  );
}
