import { COLORS, F, CAPS, DISPLAY_LUXE } from "./theme";

// The `light`/`dark`/`tone` props on these components are kept for
// compatibility with existing call sites; the light theme renders one look.

export function LintelDivider() {
  return (
    <div className="flex items-center gap-3 my-10 select-none" aria-hidden="true">
      <div className="h-px flex-1" style={{ background: COLORS.line }} />
      <div className="w-[5px] h-[5px] rotate-45" style={{ background: COLORS.gold }} />
      <div className="h-px flex-1" style={{ background: COLORS.line }} />
    </div>
  );
}

export function Eyebrow({ children }) {
  return (
    <div className="text-[10px] font-semibold mb-3" style={{ color: COLORS.gold, fontFamily: F.body, ...CAPS, letterSpacing: "0.24em" }}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div className="mb-6">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className="text-[30px] sm:text-[32px] leading-[1.08]"
        style={{ ...DISPLAY_LUXE, letterSpacing: "-0.015em", color: COLORS.ivory, textWrap: "balance" }}
      >
        {title}
      </h2>
      {sub && (
        <p className="mt-2 text-[14px] leading-relaxed" style={{ color: COLORS.ivoryDim, fontFamily: F.body }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function GoldButton({ children, onClick, variant = "solid", icon: Icon, className = "", type = "button", disabled = false }) {
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[2px] text-[11px] font-semibold transition-all active:scale-[0.98] min-h-[46px] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2";
  const styles =
    variant === "solid"
      ? { background: COLORS.ivory, color: COLORS.ink }
      : variant === "outline"
      ? { border: `1px solid ${COLORS.ivory}`, color: COLORS.ivory, background: "transparent" }
      : { background: COLORS.chip, color: COLORS.ivory };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${className}`} style={{ fontFamily: F.body, ...CAPS, letterSpacing: "0.18em", ...styles }}>
      {Icon && <Icon size={14} strokeWidth={1.75} />}
      {children}
    </button>
  );
}

export function Placeholder({ label, ratio = "aspect-[4/3]" }) {
  const hasWidth = /\bw-/.test(ratio);
  return (
    <div
      className={`${ratio} ${hasWidth ? "" : "w-full"} rounded-[3px] flex flex-col items-center justify-center gap-2 text-center px-4`}
      style={{ border: `1.5px dashed ${COLORS.line}`, background: COLORS.chip }}
    >
      <span className="text-[11px] leading-snug" style={{ color: COLORS.ivoryDim, fontFamily: F.body }}>
        {label}
      </span>
    </div>
  );
}

export function Badge({ children, tone = "gold" }) {
  const map = {
    gold: { bg: COLORS.accentSoft, fg: COLORS.gold },
    emerald: { bg: COLORS.accentSoft, fg: COLORS.gold },
    urgent: { bg: COLORS.dangerBg, fg: COLORS.danger },
    ivory: { bg: COLORS.chip, fg: COLORS.ivoryDim },
  };
  const s = map[tone] || map.gold;
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-[2px] text-[9.5px] font-semibold"
      style={{ background: s.bg, color: s.fg, fontFamily: F.body, ...CAPS, letterSpacing: "0.14em" }}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-[3px] p-5 ${className}`}
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.line}`,
        boxShadow: "var(--shadow)",
      }}
    >
      {children}
    </div>
  );
}

export function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      {Icon && (
        <span
          className="w-[38px] h-[38px] shrink-0 flex items-center justify-center"
          style={{ background: COLORS.chip, borderRadius: 2, color: COLORS.gold }}
        >
          <Icon size={16} strokeWidth={2} />
        </span>
      )}
      <div className="leading-snug min-w-0">
        <div className="text-[11px]" style={{ color: COLORS.ivoryDim }}>{label}</div>
        <div className="text-[12.5px] font-medium" style={{ color: COLORS.ivory }}>{value}</div>
      </div>
    </div>
  );
}

export function FieldGroup({ title, children }) {
  return (
    <div>
      <div className="text-[10px] font-semibold mb-2.5" style={{ color: COLORS.gold, fontFamily: F.body, ...CAPS }}>
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
        className="w-full rounded-[3px] px-3 py-2.5 text-[13px] outline-none min-h-[44px]"
        style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, color: COLORS.ivory, fontFamily: F.body }}
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
        className="w-full rounded-[3px] px-3 py-2.5 text-[13px] outline-none min-h-[44px]"
        style={{ background: COLORS.card, border: `1px solid ${COLORS.line}`, color: COLORS.ivory, fontFamily: F.body }}
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

export function LoadingNote({ label = "Loading…" }) {
  return (
    <div className="py-10 text-center text-[13px]" style={{ color: COLORS.ivoryDim, fontFamily: F.body }}>
      {label}
    </div>
  );
}

export function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-[3px] p-3 mb-4 text-[12.5px]" style={{ background: COLORS.dangerBg, color: COLORS.danger, border: `1px solid ${COLORS.dangerLine}` }}>
      {message}
    </div>
  );
}
