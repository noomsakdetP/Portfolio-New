/**
 * /projects: "The Collection". Figma: Projects v2 / Desktop (441:2696).
 * Header with the feature portrait, the gallery wall of works, CTA and footer.
 * Works live in src/data/projects.ts; every timing in src/components/projects/motion.ts.
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import LangToggle from '../components/LangToggle'
import NavMenu from '../components/NavMenu'
import NavLogoMark, { NAV_LOGO_LABEL } from '../components/NavLogo'
import { useT } from '../i18n/lang'
import TransitionLink from '../transition/TransitionLink'
import ProjectsHeader from '../components/projects/ProjectsHeader'
import GalleryWall from '../components/projects/GalleryWall'
import { motionCssVars } from '../components/projects/motion'
import '../components/projects/Projects.css'

export default function Projects() {
  const t = useT()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="coll" style={motionCssVars()}>
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <TransitionLink to="/" className="nav-logo" aria-label={NAV_LOGO_LABEL}>
            <NavLogoMark />
          </TransitionLink>
          <ul className="nav-links">
            <li><TransitionLink to="/#experience">{t("About Me")}</TransitionLink></li>
            <li><TransitionLink to="/projects">{t("Project")}</TransitionLink></li>
            <li><TransitionLink to="/#skills">{t("Skills")}</TransitionLink></li>
            <li><TransitionLink to="/#experience">{t("Experience")}</TransitionLink></li>
          </ul>
          <LangToggle />
          <a href="mailto:sakdidetsuttipol@hotmail.com" className="btn-sayhi">{t("Say hi")}</a>
          <NavMenu items={[{ label: 'About Me', to: '/#experience' }, { label: 'Project', to: '/projects' }, { label: 'Skills', to: '/#skills' }, { label: 'Experience', to: '/#experience' }]} />
        </div>
      </nav>

      <main>
        <ProjectsHeader />
        <GalleryWall />
      </main>

      {/* ── CTA (Figma 441:2835) ── */}
      <div className="cta-wrapper">
        <div className="cta-box">
          <h2 className="cta-heading">{t("Design is how I think.")}<br />{t("Let's think together.")}</h2>
          <p className="cta-sub">
            {t("Currently open to new opportunities, whether it's a product, a system, or an experience worth building.")}
          </p>
          <div className="cta-actions">
            <a href="mailto:sakdidetsuttipol@hotmail.com" className="cta-email">
              sakdidetsuttipol@<wbr />hotmail.com
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                <path d="M1 6H15M15 6L10 1M15 6L10 11" style={{ stroke: 'var(--color-text-primary)' }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <div className="social-links">
              <a href="http://www.linkedin.com/in/sakdidet-suttipol" target="_blank" rel="noopener noreferrer" className="social-link" aria-label={t("LinkedIn")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER (Figma 441:2842) ── */}
      <footer className="footer coll-footer">
        <div className="footer-inner">
          <div>
            <Link to="/" className="footer-logo">
              <NavLogoMark />
              <span className="footer-logo-text">Sakdidet</span>
            </Link>
            <p className="footer-copy">{t("©2026 Sakdidet. All Rights Reserved.")}</p>
          </div>
          <div className="footer-right">
            <ul className="footer-nav">
              <li><a href="http://www.linkedin.com/in/sakdidet-suttipol" target="_blank" rel="noopener noreferrer">{t("LinkedIn")}</a></li>
            </ul>
            <div className="footer-location">
              <svg width="10" height="13" viewBox="0 0 10 14" fill="none" aria-hidden="true">
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" style={{ fill: 'var(--color-text-muted)' }} />
              </svg>
              {t("Based in Bangkok, Thailand")}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
