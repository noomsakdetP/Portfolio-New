/**
 * Hand-drawn art for My Project, from the Figma SVG exports of Home v2 / Desktop ›
 * My Project (single) (364:2680); sources in design/figma-exports/project. Paths verbatim.
 * The 14px arrow's stroke follows currentColor (text/primary, set in MyProject.css).
 */
export function ArrowRight14({ className = '' }: { className?: string }) {
  return (
    <svg className={`pj-arrow-icon ${className}`} viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
      <path className="pa-stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M1 7H13M8 12L13 7L8 2" />
    </svg>
  )
}

export function UnderlineStrategy({ className = '' }: { className?: string }) {
  return (
    <svg className={`pj-underline ${className}`} viewBox="0 0 128 12" fill="none" aria-hidden="true" focusable="false">
      <path className="pa-stroke-ochre" strokeWidth="2.6" strokeLinecap="round" d="M2 6C23.04 2 40.96 9 64 5C87.04 1 99.84 2 110.08 7C120.32 12 122 6 126 4" />
    </svg>
  )
}

export function UnderlineResults({ className = '' }: { className?: string }) {
  return (
    <svg className={`pj-underline ${className}`} viewBox="0 0 111 12" fill="none" aria-hidden="true" focusable="false">
      <path className="pa-stroke-ochre" strokeWidth="2.6" strokeLinecap="round" d="M2 6C19.98 2 35.52 9 55.5 5C75.48 1 86.58 2 95.46 7C104.34 12 105 6 109 4" />
    </svg>
  )
}

export function ArrowToImage({ className = '' }: { className?: string }) {
  return (
    <svg className={`pj-arrow-favourite ${className}`} viewBox="0 0 130 126" fill="none" aria-hidden="true" focusable="false">
      <path className="pa-stroke-on-inverse" strokeWidth="2.4" strokeLinecap="round" d="M100 30C56.6667 58.6667 33.3333 80.6667 30 96" />
      <path className="pa-stroke-on-inverse" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M26.3 80.4L30 96L39.9 83.4" />
    </svg>
  )
}
