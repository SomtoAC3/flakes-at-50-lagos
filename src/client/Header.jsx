import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Moon, Sun } from "@phosphor-icons/react";
import { COLORS, F, CAPS, DISPLAY_LUXE } from "../shared/theme";
import { useThemeMode } from "../shared/themeMode";
import { Stem } from "../shared/flora";
import { useAuth } from "../lib/auth";
import { MAIN_LINKS, MORE_LINKS } from "./data/navigation";

// Event pages get a back arrow to the itinerary; every other page is reached
// from the menu and has none.
function backPath(pathname) {
  return pathname.startsWith("/itinerary/") ? "/itinerary" : null;
}

function Wordmark() {
  return (
    <NavLink to="/" aria-label="Flakes@50 Lagos Edition, home">
      <span className="flex items-center gap-2 text-[23px] leading-none" style={{ ...DISPLAY_LUXE, letterSpacing: "-0.015em", color: COLORS.ivory }}>
        <Stem kind="tulip" headOnly width={15} flower={COLORS.flowerCoral} />
        <span>
          <em>Flakes</em>
          <span style={{ color: COLORS.gold }}>@50</span>
        </span>
      </span>
    </NavLink>
  );
}

function ThemeButton() {
  const { theme, toggle } = useThemeMode();
  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center min-h-[44px] min-w-[44px]"
      style={{ color: COLORS.ivory }}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
    </button>
  );
}

// Two solid bars that cross into an X when the menu is open.
function MenuGlyph({ open }) {
  const bar = "absolute left-0 h-[2px] w-[22px] rounded-full transition-transform duration-300";
  return (
    <span className="relative block h-[10px] w-[22px]" aria-hidden="true">
      <span className={bar} style={{ top: 0, background: "currentColor", transform: open ? "translateY(4px) rotate(45deg)" : "none" }} />
      <span className={bar} style={{ top: 8, background: "currentColor", transform: open ? "translateY(-4px) rotate(-45deg)" : "none" }} />
    </span>
  );
}

// The drop-down panel: main pages set large, a hairline, the rest of the
// app as label + one-line description, then the guest's sign-in pill.
function MenuPanel({ onClose, onNavigate, pathname }) {
  const { user, signOut } = useAuth();
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const pill = "inline-flex items-center text-[11px] font-semibold px-3.5 rounded-full min-h-[32px]";
  const pillType = { fontFamily: F.body, ...CAPS, letterSpacing: "0.14em" };

  return (
    <div className="fixed inset-0 z-50 flex justify-center" role="dialog" aria-modal="true" aria-label="Menu">
      <button className="menu-backdrop absolute inset-0 w-full cursor-default" style={{ background: "rgba(10, 10, 10, 0.45)" }} onClick={onClose} aria-label="Close menu" tabIndex={-1} />
      <div
        className="menu-panel relative w-full max-w-[480px] self-start overflow-y-auto rounded-b-[28px]"
        style={{
          maxHeight: "calc(100dvh - 24px)",
          background: "radial-gradient(120% 60% at 88% 0%, color-mix(in srgb, var(--flower-rose) 24%, transparent), transparent 70%), var(--card)",
          color: COLORS.ivory,
        }}
      >
        <div className="px-3 pt-4 pb-2 grid grid-cols-[1fr_auto] items-center">
          <div className="pl-2">
            <Wordmark />
          </div>
          <div className="flex items-center">
            <ThemeButton />
            <button ref={closeRef} onClick={onClose} className="flex items-center justify-center min-h-[44px] min-w-[44px]" aria-label="Close menu">
              <MenuGlyph open />
            </button>
          </div>
        </div>

        <nav className="px-5 pt-7 pb-7" aria-label="Main pages">
          {MAIN_LINKS.map((l) => {
            const current = l.end ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={onNavigate}
                aria-current={current ? "page" : undefined}
                className="block text-[38px] leading-[1.2]"
                style={{ ...DISPLAY_LUXE, letterSpacing: "-0.02em", color: current ? COLORS.gold : COLORS.ivory }}
              >
                {current ? <em>{l.label}</em> : l.label}
              </Link>
            );
          })}
        </nav>

        <nav className="px-5 py-6 grid gap-3.5" style={{ borderTop: `1px solid ${COLORS.line}` }} aria-label="More pages">
          {MORE_LINKS.map((l) => (
            <Link key={l.to} to={l.to} onClick={onNavigate} aria-current={pathname === l.to ? "page" : undefined} className="block">
              <div className="text-[15px] leading-snug" style={{ color: COLORS.ivory, fontWeight: pathname === l.to ? 600 : 400 }}>{l.label}</div>
              <div className="text-[13px] leading-snug" style={{ color: COLORS.ivoryDim }}>{l.desc}</div>
            </Link>
          ))}
        </nav>

        <div className="px-5 pt-5 pb-6 flex items-center justify-between gap-3" style={{ borderTop: `1px solid ${COLORS.line}` }}>
          {user ? (
            <>
              <span className="text-[12px] truncate" style={{ color: COLORS.ivoryDim }}>{user.email}</span>
              <button onClick={signOut} className={pill} style={{ ...pillType, border: `1px solid ${COLORS.line}`, color: COLORS.ivory }}>
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={onNavigate} className={pill} style={{ ...pillType, background: COLORS.gold, color: COLORS.ink }}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  // The page the menu was opened on; navigating anywhere else closes it.
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;
  const menuButton = useRef(null);
  const back = backPath(pathname);

  const close = () => {
    setOpenOn(null);
    menuButton.current?.focus();
  };

  return (
    <>
      {/* With a back arrow the wordmark sits centred; elsewhere it sits left,
          in line with the page. */}
      <div
        className={`px-3 pt-4 pb-2 grid items-center sticky top-0 z-30 backdrop-blur ${back ? "grid-cols-[88px_1fr_88px]" : "grid-cols-[1fr_auto]"}`}
        style={{ background: "var(--header)" }}
      >
        {back && (
          <Link to={back} className="flex items-center justify-center min-h-[44px] min-w-[44px] w-[44px]" style={{ color: COLORS.ivory }} aria-label="Back">
            <ArrowLeft size={20} strokeWidth={1.75} />
          </Link>
        )}
        <div className={back ? "justify-self-center" : "pl-2"}>
          <Wordmark />
        </div>
        <div className="flex items-center justify-self-end" style={{ color: COLORS.ivory }}>
          <ThemeButton />
          <button
            ref={menuButton}
            onClick={() => setOpenOn(pathname)}
            className="flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <MenuGlyph open={false} />
          </button>
        </div>
      </div>
      {open && <MenuPanel onClose={close} onNavigate={() => setOpenOn(null)} pathname={pathname} />}
    </>
  );
}
