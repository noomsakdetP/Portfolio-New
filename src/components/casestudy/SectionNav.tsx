import { useEffect, useState } from 'react'
import { useLang, useT } from '../../i18n/lang'

type Item = { id: string; label: string }

const slug = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

/**
 * "You are here" navigation for long case studies, built from the page's section headings.
 * - Wide screens: a rail on the left with every step; the current one is highlighted.
 * - Smaller screens: a pill at the bottom ("03 / 09 · Define") that opens the full list.
 * Rebuilds when `pageKey` changes (another project was opened).
 */
export default function SectionNav({ pageKey }: { pageKey: string }) {
  const t = useT()
  const { lang } = useLang()
  const [items, setItems] = useState<Item[]>([])
  const [active, setActive] = useState(0)
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const heads = Array.from(document.querySelectorAll<HTMLElement>('section.ov-section .ov-section-heading, section.ov-process-section .ov-section-heading'))
    const sections: HTMLElement[] = []
    const used = new Set<string>()
    const list: Item[] = []
    heads.forEach(h => {
      const sec = h.closest('section') as HTMLElement | null
      if (!sec || sections.includes(sec)) return
      const label = (h.textContent ?? '').trim()
      let id = sec.id || `cs-${slug(label)}`
      while (used.has(id)) id += '-2'
      used.add(id)
      sec.id = id
      sections.push(sec)
      list.push({ id, label })
    })
    // publish after the DOM scan (not synchronously inside the effect)
    const raf = requestAnimationFrame(() => { setItems(list); setActive(0); onScroll() })

    // the section crossing the middle of the viewport is "current"
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) setActive(sections.indexOf(e.target as HTMLElement)) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    sections.forEach(s => io.observe(s))

    // only show the navigator between the first and the last section
    function onScroll() {
      if (!sections.length) return
      const first = sections[0].getBoundingClientRect(), last = sections[sections.length - 1].getBoundingClientRect()
      setShow(first.top < window.innerHeight * 0.6 && last.bottom > window.innerHeight * 0.4)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [pageKey, lang])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (items.length < 3) return null
  const go = (id: string) => {
    setOpen(false)
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <>
      {/* rail (wide screens) */}
      <nav className={`cs-rail ${show ? 'is-on' : ''}`} aria-label={t('Case study sections')}>
        <ol>
          {items.map((it, i) => (
            <li key={it.id} className={i === active ? 'is-active' : i < active ? 'is-done' : ''}>
              <button onClick={() => go(it.id)} aria-current={i === active ? 'step' : undefined}>
                <span className="cs-rail-dot" /> <span className="cs-rail-label">{it.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* pill + sheet (smaller screens) */}
      <div className={`cs-pill-wrap ${show ? 'is-on' : ''}`}>
        {open && (
          <ol className="cs-sheet" id="cs-sheet">
            {items.map((it, i) => (
              <li key={it.id}>
                <button className={i === active ? 'is-active' : ''} onClick={() => go(it.id)}>
                  <span>{pad(i + 1)}</span>{it.label}
                </button>
              </li>
            ))}
          </ol>
        )}
        <button className="cs-pill" onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls="cs-sheet">
          <span className="cs-pill-count">{pad(active + 1)} / {pad(items.length)}</span>
          <span className="cs-pill-label">{items[active]?.label}</span>
          <span className="cs-pill-caret" aria-hidden="true">{open ? '▾' : '▴'}</span>
        </button>
      </div>
    </>
  )
}
