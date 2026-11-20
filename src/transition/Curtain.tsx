/**
 * The theatre curtain: two fabric panels (public/curtain-tile.webp) under a valance
 * (public/curtain-valance.webp). Used only for route transitions (PageTransitionProvider);
 * the root's className carries the phase that PageTransition.css animates.
 */
import './Curtain.css'

export default function Curtain({ className }: { className: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="curtain-panel curtain-panel--left" />
      <div className="curtain-panel curtain-panel--right" />
      <div className="curtain-valance" />
    </div>
  )
}
