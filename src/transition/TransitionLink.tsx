/**
 * TransitionLink: a drop-in for react-router's <Link> that plays the page-transition curtain.
 *
 * Falls back to the normal link behaviour for: modified / middle clicks, target other than
 * _self, reloadDocument, external URLs (and mailto: etc.), and same-page links (same path +
 * query, e.g. a #hash on the current page). While a transition is running, clicks do nothing.
 */
import type { MouseEvent } from 'react'
import { Link, useLocation, useResolvedPath, type LinkProps } from 'react-router-dom'
import { usePageTransition } from './pageTransition'

const ABSOLUTE_URL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i

export default function TransitionLink({ to, onClick, ...rest }: LinkProps) {
  const { go, isBusy } = usePageTransition()
  const location = useLocation()
  const target = useResolvedPath(to)

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if ((rest.target && rest.target !== '_self') || rest.reloadDocument) return
    if (typeof to === 'string' && ABSOLUTE_URL.test(to)) return
    if (target.pathname === location.pathname && target.search === location.search) return
    e.preventDefault() // stops <Link> from navigating; go() navigates behind the curtain
    if (!isBusy()) go(to)
  }

  return <Link to={to} onClick={handleClick} {...rest} />
}
