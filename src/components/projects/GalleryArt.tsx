/**
 * Hand-drawn art for /projects, from the Figma SVG exports of Projects v2 / Desktop (441:2696);
 * sources in design/figma-exports/projects. Paths verbatim (except the post base: Figma's masked inner
 * stroke is drawn as a 1px-smaller ellipse); colours come from token classes in
 * Projects.css (ga-*) instead of the exported hex values. All decorative (aria-hidden).
 */
type P = { className?: string }
const svg = { fill: 'none', 'aria-hidden': true, focusable: false } as const

/* ── header doodles ── */
export const UnderlineCollection = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 283.141 8.37778" {...svg}>
    <path className="ga-stroke-accent" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M1.50035 4.1C14.8404 7.43334 28.1804 7.76667 41.5204 5.1C54.8604 1.1 68.2004 0.433337 81.5404 3.1C94.8804 7.1 108.22 7.76667 121.56 5.1C134.9 1.1 148.24 0.433337 161.58 3.1C174.92 7.1 188.26 7.76667 201.6 5.1C214.94 1.1 228.28 0.433337 241.62 3.1C254.96 7.1 268.3 7.76667 281.64 5.1" />
  </svg>
)
export const Underline2 = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 252.14 6.41072" {...svg}>
    <path className="ga-stroke-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M1.00018 3.125C14.8969 5.79167 28.7935 6.125 42.6902 4.125C56.5868 0.791668 70.4835 0.125001 84.3802 2.125C98.2768 5.45833 112.174 6.125 126.07 4.125C139.967 0.791668 153.864 0.125001 167.76 2.125C181.657 5.45833 195.554 6.125 209.45 4.125C223.347 0.791668 237.244 0.125001 251.14 2.125" />
  </svg>
)
export const ArrowToTitle = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 128.401 17.5252" {...svg}>
    <path className="ga-stroke-on-inverse" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M127.2 4.32499C111.867 -2.34167 69.8669 1.65833 1.20025 16.325" />
  </svg>
)
export const ArrowToTitleHead = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 13.9007 13.6527" {...svg}>
    <path className="ga-stroke-on-inverse" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M10.297 1.20002L1.20003 9.02594L12.7004 12.4524" />
  </svg>
)
export const Sparkle20 = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 20 20" {...svg}>
    <path className="ga-fill-ochre" d="M10 0C10 6.66667 13.3333 10 20 10C13.3333 10 10 13.3333 10 20C10 13.3333 6.66667 10 0 10C6.66667 10 10 6.66667 10 0Z" />
  </svg>
)
export const Sparkle12 = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 12 12" {...svg}>
    <path className="ga-fill-accent" d="M6 0C6 4 8 6 12 6C8 6 6 8 6 12C6 8 4 6 0 6C4 6 6 4 6 0Z" />
  </svg>
)
/** "yes, that's me" arrow; drawn on with pathLength=1 + stroke-dashoffset. */
export const ArrowToPortrait = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 72.8973 30.4001" {...svg}>
    <path className="ga-stroke-on-inverse ga-draw" pathLength={1} strokeWidth="2.4" strokeLinecap="round" d="M61.2003 29.2001L71.2003 19.2001C51.2003 -0.799899 27.8669 -4.13323 1.20026 9.2001M71.2003 19.2001L59.2003 11.2001" />
  </svg>
)

/* ── wall dressing ── */
const CRACKS = [
  { w: 46.2002, h: 151.2, d: 'M0.600035 0.600035L30.6 40.6L20.6 90.6L45.6 150.6' },
  { w: 46.2001, h: 141.2, d: 'M45.6001 0.600011L15.6001 35.6L25.6001 90.6L0.600131 140.6' },
  { w: 71.2001, h: 121.2, d: 'M0.600011 0.600011L35.6 30.6L40.6 80.6L70.6 120.6' },
  { w: 36.2003, h: 141.2, d: 'M35.6001 0.60015L15.6001 45.6001L30.6001 85.6001L0.600114 140.6' },
]
export const Crack = ({ n, className = '' }: P & { n: 0 | 1 | 2 | 3 }) => (
  <svg className={className} viewBox={`0 0 ${CRACKS[n].w} ${CRACKS[n].h}`} {...svg}>
    <path className="ga-stroke-crack" opacity="0.5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d={CRACKS[n].d} />
  </svg>
)
export const FloorBoard = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 61.0003 147" {...svg}>
    <path className="ga-stroke-crack" opacity="0.25" strokeLinecap="round" strokeLinejoin="round" d="M60.5001 0.500131L0.500131 146.5" />
  </svg>
)
export const SconceShade = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 32 18" {...svg}>
    <path className="ga-fill-raised" d="M0 0H32L26 18H6L0 0Z" />
  </svg>
)

/* ── under restoration drape ── */
export const SignString = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 142 50.2126" {...svg}>
    <path className="ga-stroke-ochre" strokeWidth="2" strokeLinecap="round" d="M1.00009 49.2125L71.0001 1.21252L141 49.2125" />
  </svg>
)
export const Nail = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 10 10" {...svg}>
    <circle className="ga-fill-ochre" cx="5" cy="5" r="5" />
  </svg>
)
export const TieBackRope = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 381.655 34.859" {...svg}>
    <path className="ga-stroke-ochre" strokeWidth="5" d="M0.827719 2.359C114.828 42.359 266.828 42.359 380.828 2.359" />
  </svg>
)

/* ── floor: velvet rope, posts, sign ── */
export const VelvetRope = ({ wide, className = '' }: P & { wide: boolean }) => (
  wide ? (
    <svg className={className} viewBox="0 0 371.002 57.5009" {...svg}>
      <path className="ga-stroke-accent" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" d="M5.50093 5.50093C113.501 67.5009 257.501 67.5009 365.501 5.50093" />
    </svg>
  ) : (
    <svg className={className} viewBox="0 0 331.001 57.5007" {...svg}>
      <path className="ga-stroke-accent" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" d="M5.50066 5.50066C101.501 67.5007 229.501 67.5007 325.501 5.50066" />
    </svg>
  )
)
export const PostFinial = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 20 20" {...svg}>
    <circle className="ga-fill-ochre ga-stroke-ink" cx="10" cy="10" r="9.5" />
  </svg>
)
export const PostBase = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 54 14" {...svg}>
    <ellipse className="ga-fill-ochre ga-stroke-ink" cx="27" cy="7" rx="26" ry="6" strokeWidth="2" />
  </svg>
)
export const SignFoot = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 48 12" {...svg}>
    <ellipse className="ga-fill-ink" cx="24" cy="6" rx="24" ry="6" />
  </svg>
)

/* ── wall doodles ── */
export const YearUnderline = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 72.5006 5.5" {...svg}>
    <path className="ga-stroke-accent" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M1.2503 2.75C9.02808 4.75 16.8059 4.75 24.5836 2.75C32.3614 0.75 40.1392 0.75 47.917 2.75C55.6947 4.75 63.4725 4.75 71.2503 2.75" />
  </svg>
)
export const ArrowToLamp = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 72.4001 26.4001" {...svg}>
    <path className="ga-stroke-ink" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M71.2001 1.20005C34.5334 3.86672 11.2001 11.8667 1.20007 25.2001" />
  </svg>
)
export const ArrowToLampHead = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 13.3214 14.2768" {...svg}>
    <path className="ga-stroke-ink" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M2.91613 1.20016L1.20003 13.0768L12.1211 8.10388" />
  </svg>
)
export const ArrowToFirstWork = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 66.4004 52.4004" {...svg}>
    <path className="ga-stroke-ink" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M65.2002 1.20017C63.8669 9.86684 42.5335 26.5335 1.20018 51.2002" />
  </svg>
)
export const ArrowToFirstWorkHead = ({ className = '' }: P) => (
  <svg className={className} viewBox="0 0 14.3913 12.7371" {...svg}>
    <path className="ga-stroke-ink" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M7.29487 1.20019L1.2 11.5371L13.1913 11.0807" />
  </svg>
)

/** Knot + hanging wire, centred on (x, y). The wire reaches 175px either side, 52px down. */
export function Knot({ x, y, small = false }: { x: number; y: number; small?: boolean }) {
  const s = small ? 0.7 : 1
  return (
    <g className="gw-knot" style={{ transformOrigin: `${x}px ${y}px` }}>
      {!small && (
        <path className="gw-wire ga-stroke-ochre" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          d={`M${x - 175} ${y + 52}L${x} ${y}L${x + 175} ${y + 52}`} />
      )}
      <circle className="ga-fill-card ga-stroke-accent" cx={x} cy={y} r={9.5 * s} strokeWidth={5 * s} />
      <circle className="ga-fill-accent" cx={x} cy={y} r={4 * s} />
    </g>
  )
}
