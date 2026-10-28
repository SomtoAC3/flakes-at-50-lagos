import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Bell, Moon, Sun } from "@phosphor-icons/react";
import { COLORS, DISPLAY_LUXE } from "../shared/theme";
import { useThemeMode } from "../shared/themeMode";
import { Stem } from "../shared/flora";
import { MAIN_LINKS } from "./data/navigation";

// Where the back arrow goes: event pages return to the itinerary, pages
// opened from More return there, and the tab pages and Updates (opened from
// the header bell) have none.
const TAB_PATHS = new Set([...MAIN_LINKS.map((l) => l.to), "/updates"]);
function backPath(pathname) {
  if (TAB_PATHS.has(pathname)) return null;
  if (pathname.startsWith("/itinerary/")) return "/itinerary";
  return "/more";
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

function UpdatesBell({ hasNew }) {
  return (
    <NavLink
      to="/updates"
      className="relative flex items-center justify-center min-h-[44px] min-w-[44px]"
      style={({ isActive }) => ({ color: isActive ? COLORS.gold : COLORS.ivory })}
      aria-label={hasNew ? "Updates, new posts" : "Updates"}
    >
      <Bell size={20} weight="fill" />
      {hasNew && (
        <span
          className="absolute top-[11px] right-[11px] w-2 h-2 rounded-full"
          style={{ background: COLORS.flowerCoral, boxShadow: "0 0 0 2px var(--bg)" }}
          aria-hidden="true"
        />
      )}
    </NavLink>
  );
}

export default function Header({ hasNew = false }) {
  const { pathname } = useLocation();
  const back = backPath(pathname);

  // With a back arrow the wordmark sits centred between it and the bell and
  // theme toggle; on the tab pages it sits left, in line with the page.
  return (
    <div
      className={`px-3 pt-4 pb-2 grid items-center sticky top-0 z-30 ${back ? "grid-cols-[88px_1fr_88px]" : "grid-cols-[1fr_auto]"}`}
      style={{ background: "var(--bg)" }}
    >
      {back && (
        <Link to={back} className="justify-self-start flex items-center justify-center min-h-[44px] min-w-[44px]" style={{ color: COLORS.ivory }} aria-label="Back">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </Link>
      )}
      <div className={back ? "justify-self-center" : "pl-2"}>
        <Wordmark />
      </div>
      <div className="flex justify-self-end">
        <UpdatesBell hasNew={hasNew} />
        <ThemeButton />
      </div>
    </div>
  );
}
