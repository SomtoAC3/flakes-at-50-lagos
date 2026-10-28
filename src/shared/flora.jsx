// Flat botanical stems, in the manner of a seed-catalogue plate: one flower
// head, a single stem and a few leaves, all solid fills with no outlines.
// Drawn in a 120×240 box with the head centred near (60, 56). Always
// decorative (aria-hidden); size it with `width` or a className.

const HEAD_Y = 56;

// A pointed leaf of length `len` and half-width `w`, rooted at (x, y) and
// turned `angle` degrees from pointing right.
function Leaf({ x, y, len, w, angle, color }) {
  return <path fill={color} transform={`translate(${x} ${y}) rotate(${angle})`} d={`M0 0Q${len / 2} ${-w} ${len} 0Q${len / 2} ${w} 0 0Z`} />;
}

// Petals of rx × ry set in a ring around the head, `offset` out from centre.
function Petals({ count, rx, ry, offset, color }) {
  return (
    <g fill={color}>
      {Array.from({ length: count }, (_, i) => (
        <ellipse key={i} cx="60" cy={HEAD_Y - offset} rx={rx} ry={ry} transform={`rotate(${(360 / count) * i} 60 ${HEAD_Y})`} />
      ))}
    </g>
  );
}

const HEADS = {
  tulip: ({ flower }) => <path fill={flower} d="M38 40C38 74 48 86 60 86C72 86 82 74 82 40L71 54L60 34L49 54Z" />,
  ranunculus: ({ flower, center }) => (
    <g>
      <circle cx="60" cy={HEAD_Y} r="26" fill={flower} />
      <g fill="none" stroke={center} strokeWidth="2.2" opacity="0.55">
        <circle cx="60" cy={HEAD_Y} r="18" />
        <circle cx="60" cy={HEAD_Y} r="10" />
      </g>
      <circle cx="60" cy={HEAD_Y} r="4" fill={center} />
    </g>
  ),
  poppy: ({ flower, center }) => (
    <g>
      <g fill={flower}>
        <circle cx="60" cy={HEAD_Y - 13} r="17" />
        <circle cx="73" cy={HEAD_Y} r="17" />
        <circle cx="60" cy={HEAD_Y + 13} r="17" />
        <circle cx="47" cy={HEAD_Y} r="17" />
      </g>
      <circle cx="60" cy={HEAD_Y} r="8" fill={center} />
    </g>
  ),
  daisy: ({ flower, center }) => (
    <g>
      <Petals count={14} rx={4.5} ry={13} offset={17} color={flower} />
      <circle cx="60" cy={HEAD_Y} r="8.5" fill={center} />
    </g>
  ),
  cosmos: ({ flower, center }) => (
    <g>
      <Petals count={8} rx={9} ry={15} offset={15} color={flower} />
      <circle cx="60" cy={HEAD_Y} r="6.5" fill={center} />
    </g>
  ),
  // Lavender-like: buds climbing the top of the stem.
  sprig: ({ flower }) => (
    <g fill={flower}>
      {[[60, 30, 6], [54, 42, 6.5], [66, 50, 7], [53, 61, 7.5], [67, 71, 7.5], [55, 82, 8], [65, 92, 8]].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
      ))}
    </g>
  ),
};

// Where the stem starts under each head, and that kind's leaves.
const STEMS = {
  tulip: { top: 82, leaves: [[60, 168, 62, 12, -62], [60, 196, 56, 11, -122]] },
  ranunculus: { top: 80, leaves: [[60, 150, 44, 11, -32], [60, 186, 48, 12, -150]] },
  poppy: { top: 84, leaves: [[60, 172, 54, 7, -58]] },
  daisy: { top: 70, leaves: [[60, 140, 40, 9, -28], [60, 176, 44, 10, -152]] },
  cosmos: { top: 64, leaves: [[60, 130, 46, 4, -24], [60, 150, 42, 4, -160], [60, 188, 38, 4, -36]] },
  sprig: { top: 92, leaves: [[60, 120, 34, 7, -34], [60, 120, 34, 7, -146], [60, 158, 38, 8, -30], [60, 158, 38, 8, -150], [60, 198, 40, 8, -28], [60, 198, 40, 8, -152]] },
};

export const STEM_KINDS = Object.keys(HEADS);

/**
 * One flower on its stem.
 * kind: tulip | ranunculus | poppy | daisy | cosmos | sprig
 * headOnly crops to the flower head, for small marks like the wordmark.
 */
export function Stem({ kind = "tulip", flower = "currentColor", leaf = "currentColor", center = "currentColor", width, headOnly = false, className = "", style }) {
  const Head = HEADS[kind] || HEADS.tulip;
  const { top, leaves } = STEMS[kind] || STEMS.tulip;
  return (
    <svg
      viewBox={headOnly ? "28 20 64 72" : "0 0 120 240"}
      width={width}
      className={className}
      style={{ display: "block", overflow: "visible", height: width == null ? undefined : "auto", ...style }}
      aria-hidden="true"
      focusable="false"
    >
      {!headOnly && (
        <g>
          <path d={`M60 ${top}C58 130 62 186 60 240`} fill="none" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
          {leaves.map(([x, y, len, w, angle], i) => (
            <Leaf key={i} x={x} y={y} len={len} w={w} angle={angle} color={leaf} />
          ))}
        </g>
      )}
      <Head flower={flower} center={center} />
    </svg>
  );
}
