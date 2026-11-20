import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TransitionLink from '../transition/TransitionLink'
import { useT } from '../i18n/lang'

export type NavItem = { label: string; href?: string; to?: string }

/**
 * Hamburger menu for phones/tablets (≤ 860px, where .nav-links is hidden).
 * Closes on link tap, Escape, or route change.
 */
export default function NavMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)
  const t = useT()
  const { pathname } = useLocation()
  const [lastPath, setLastPath] = useState(pathname)

  // close when the route changes (adjusting state during render is the recommended pattern)
  if (pathname !== lastPath) { setLastPath(pathname); setOpen(false) }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        className={`nav-menu-btn ${open ? 'is-open' : ''}`}
        aria-label={open ? t('Close menu') : t('Open menu')}
        aria-expanded={open}
        aria-controls="nav-menu-panel"
        onClick={() => setOpen(o => !o)}
      >
        <span /><span />
      </button>
      <div id="nav-menu-panel" className={`nav-menu-panel ${open ? 'is-open' : ''}`} hidden={!open}>
        <ul>
          {items.map(it => (
            <li key={it.label}>
              {it.to
                ? <TransitionLink to={it.to} onClick={() => setOpen(false)}>{t(it.label)}</TransitionLink>
                : <a href={it.href} onClick={() => setOpen(false)}>{t(it.label)}</a>}
            </li>
          ))}
          <li><a href="mailto:sakdidetsuttipol@hotmail.com" className="nav-menu-cta" onClick={() => setOpen(false)}>{t('Say hi →')}</a></li>
        </ul>
      </div>
    </>
  )
}
