/**
 * Navbar logo: the framed "S" mark only (public/logo-frame.svg), no wordmark.
 * 38×44 on desktop, ~31×36 on mobile (see .nav-logo-mark in App.css).
 * The image is decorative; the surrounding home link carries the name via
 * aria-label="Sakdidet, home" (use NAV_LOGO_LABEL).
 */
export const NAV_LOGO_LABEL = 'Sakdidet, home'

export default function NavLogoMark() {
  return (
    <img
      className="nav-logo-mark"
      src={`${import.meta.env.BASE_URL}logo-frame.svg`}
      alt=""
      width={38}
      height={44}
      decoding="async"
    />
  )
}
