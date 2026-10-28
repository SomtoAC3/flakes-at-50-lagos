import { useId } from "react";

// Flat graphic flowers, drawn from polar equations rather than hand-traced
// paths: each kind is a radius function r(t) sampled around a circle in a
// 100×100 box. Used as decoration (always aria-hidden) and as frames that
// hold short text, like the countdown numbers.

const TAU = Math.PI * 2;

const RADIUS = {
  // Six broad, rounded petals.
  petal6: (t) => 50 * (0.42 + 0.58 * Math.abs(Math.cos(3 * t)) ** 0.7),
  // Four plump petals that pinch in at the middle.
  petal4: (t) => 50 * (0.3 + 0.7 * Math.abs(Math.cos(2 * t)) ** 0.55),
  // Twelve slim daisy petals.
  daisy: (t) => 50 * (0.38 + 0.62 * Math.abs(Math.cos(6 * t)) ** 1.6),
  // Scalloped edge: twelve round bumps with sharp notches between.
  scallop: (t) => 43 + 7 * Math.abs(Math.sin(6 * t)),
  // Sixteen pointed rays.
  sun: (t) => 50 * (0.74 + 0.26 * (1 - Math.abs(Math.sin(8 * t))) ** 2),
  // A soft organic pebble.
  blob: (t) => 44 + 3.2 * Math.sin(3 * t + 1) + 2.4 * Math.sin(5 * t + 2) + 1.6 * Math.cos(2 * t),
  // Eight soft lobes, gentle enough to crop a photo.
  cloud: (t) => 50 * (0.86 + 0.14 * Math.abs(Math.cos(4 * t)) ** 0.8),
};

const pathCache = new Map();

// Sample r(t) into a closed path centred on (cx, cy), scaled by sx/sy.
function polarPath(kind, { cx = 50, cy = 50, sx = 1, sy = 1, steps = 240 } = {}) {
  const key = `${kind}:${cx}:${cy}:${sx}:${sy}`;
  if (pathCache.has(key)) return pathCache.get(key);
  const r = RADIUS[kind] || RADIUS.petal6;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TAU;
    const rad = r(t);
    const x = cx + rad * sx * Math.cos(t - Math.PI / 2);
    const y = cy + rad * sy * Math.sin(t - Math.PI / 2);
    d += `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  d += "Z";
  pathCache.set(key, d);
  return d;
}

// Clover is literally four overlapping circles, like a cut-paper shape.
function Clover({ color }) {
  return (
    <g fill={color}>
      <circle cx="50" cy="27" r="24" />
      <circle cx="73" cy="50" r="24" />
      <circle cx="50" cy="73" r="24" />
      <circle cx="27" cy="50" r="24" />
      <rect x="30" y="30" width="40" height="40" />
    </g>
  );
}

export const BLOOM_KINDS = ["petal6", "clover", "scallop", "petal4", "daisy", "sun", "blob"];

/**
 * A single flower.
 * kind: petal6 | petal4 | daisy | scallop | ring | clover | sun | blob | cloud
 * center: colour of the centre dot (null for none). `ring` is a scallop with
 * a hole through the middle.
 */
export function Bloom({ kind = "petal6", color = "currentColor", center = null, size, rotate = 0, spin = false, className = "", style }) {
  const dims = size != null ? { width: size, height: size } : { width: "100%", height: "100%" };
  let shape;
  if (kind === "clover") shape = <Clover color={color} />;
  else if (kind === "ring")
    shape = (
      <path
        fill={color}
        fillRule="evenodd"
        d={`${polarPath("scallop")}M50 28a22 22 0 1 0 0.01 0Z`}
      />
    );
  else shape = <path fill={color} d={polarPath(kind)} />;

  return (
    <svg viewBox="0 0 100 100" {...dims} className={className} style={{ overflow: "visible", display: "block", ...style }} aria-hidden="true" focusable="false">
      <g className={spin ? "bloom-spin" : undefined} style={spin ? { transformBox: "fill-box" } : undefined}>
        <g transform={`rotate(${rotate} 50 50)`}>
          {shape}
          {center && <circle cx="50" cy="50" r={kind === "daisy" ? 15 : 11} fill={center} />}
        </g>
      </g>
    </svg>
  );
}

/** Short content (a number, a word) set inside a flower. */
export function BloomFrame({ kind = "petal6", color, rotate = 0, className = "", style, children }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={style}>
      <Bloom kind={kind} color={color} rotate={rotate} className="absolute inset-0" />
      <div className="relative text-center">{children}</div>
    </div>
  );
}

/** A lucide icon on a small flower, used in place of square icon chips. */
export function BloomIcon({ icon: Icon, kind = "petal6", color = "var(--chip)", iconColor = "var(--accent)", size = 40, iconSize = 16 }) {
  return (
    <span className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      <Bloom kind={kind} color={color} className="absolute inset-0" />
      <Icon size={iconSize} strokeWidth={1.9} color={iconColor} className="relative" />
    </span>
  );
}

/** A photo cropped to a flower silhouette (stretched to the box's ratio). */
export function BloomPhoto({ src, alt, ratio = 1.25, kind = "cloud", position = "xMidYMin", className = "" }) {
  const id = useId().replace(/:/g, "");
  const h = 100 * ratio;
  const d = polarPath(kind, { cx: 50, cy: h / 2, sx: 1, sy: ratio });
  return (
    <svg viewBox={`0 0 100 ${h}`} className={className} style={{ display: "block", width: "100%", height: "auto" }} role="img" aria-label={alt}>
      <defs>
        <clipPath id={`bloom-clip-${id}`}>
          <path d={d} />
        </clipPath>
      </defs>
      <image href={src} width="100" height={h} preserveAspectRatio={`${position} slice`} clipPath={`url(#bloom-clip-${id})`} />
    </svg>
  );
}
