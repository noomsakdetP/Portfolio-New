/**
 * First-load intro state (the Cloud welcome on Home).
 *
 * The intro plays only when this page load started on "/" and it hasn't played in this
 * browser session. Anything that leaves that first view (a page transition) finishes it,
 * so going back to Home later never replays it.
 *
 * Subscribable (useSyncExternalStore) so the hero can wait for it before starting Rive.
 */
const SESSION_KEY = 'cloud-welcome-played'

function playedThisSession() {
  try { return sessionStorage.getItem(SESSION_KEY) === '1' } catch { return false }
}

const startedOnHome = window.location.pathname === import.meta.env.BASE_URL
let pending = startedOnHome && !playedThisSession()
const listeners = new Set<() => void>()

/** True until the intro has finished (or was never going to play). */
export const isIntroPending = () => pending

/** Remember for this session that the intro has been shown. */
export function markIntroSeen() {
  try { sessionStorage.setItem(SESSION_KEY, '1') } catch { /* storage blocked: the page-load state still applies */ }
}

/** The intro is over (opened, faded, or skipped by navigating away). */
export function finishIntro() {
  if (!pending) return
  pending = false
  listeners.forEach((l) => l())
}

export function subscribeIntro(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
