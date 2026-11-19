/**
 * Hand-drawn art for Skills, from the Figma SVG exports of Home v2 / Desktop › Skills
 * (364:2704); sources in design/figma-exports/skills. Paths verbatim.
 */
export function UnderlineCapabilities({ className = '' }: { className?: string }) {
  return (
    <svg className={`sk-underline ${className}`} viewBox="0 0 317 12" fill="none" aria-hidden="true" focusable="false">
      <path className="sk-stroke-madder" strokeWidth="2.6" strokeLinecap="round" d="M-90.4156 6.2462C-19.7763 2.50222 37.7534 9.05419 111.72 5.3102C185.687 1.56622 226.779 2.50222 259.653 7.1822C292.527 11.8622 307.201 6.2462 313.856 4.37421" />
    </svg>
  )
}

export function ArrowPickACard({ className = '' }: { className?: string }) {
  return (
    <svg className={`sk-arrow ${className}`} viewBox="0 0 150 120" fill="none" aria-hidden="true" focusable="false">
      <path className="sk-stroke-ink" strokeWidth="2.4" strokeLinecap="round" d="M120 30C83.3334 30 53.3333 50 30 90" />
      <path className="sk-stroke-ink" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M31.2 74L30 90L43.3 81.1" />
    </svg>
  )
}
