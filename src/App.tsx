import { lazy, Suspense, useEffect, useRef } from 'react'
import LangToggle from './components/LangToggle'
import { useT } from './i18n/lang'
import NavMenu from './components/NavMenu'
import NavLogoMark, { NAV_LOGO_LABEL } from './components/NavLogo'
import './App.css'
import { HARD_SKILLS, SOFT_SKILLS } from './data/skills'
import { useMagnetic } from './hooks/useMagnetic'
// Light wrapper: static WebP poster first; it lazy-loads the Rive runtime itself.
import HeroFresco from './components/HeroFresco'
import CurtainLoader from './components/CurtainLoader'
import WallLabel from './components/home/WallLabel'
import WhatIDo from './components/home/WhatIDo'
import Impact from './components/home/Impact'
import Experience from './components/home/Experience'
import MyProject from './components/home/MyProject'
import { useCloudRise } from './hooks/useCloudRise'

// 3D scenes are code-split: three.js only downloads after the page renders
const SkillsOrb = lazy(() => import('./components/SkillsOrb'))
const CtaTokens = lazy(() => import('./components/CtaTokens'))


function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`} style={{ transitionDelay: delay ? `${delay}s` : undefined }}>
      {children}
    </div>
  )
}

export default function App() {
  const t = useT()
  const emailRef = useMagnetic<HTMLAnchorElement>(0.3)
  const linkedinRef = useMagnetic<HTMLAnchorElement>(0.45, 60)
  const introRef = useCloudRise<HTMLDivElement>()

  return (
    <>
      {/* Curtain over the page while the hero loads (once per full page load) */}
      <CurtainLoader />

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="#" className="nav-logo" aria-label={NAV_LOGO_LABEL}>
            <NavLogoMark />
          </a>
          <ul className="nav-links">
            <li><a href="#experience">{t("About Me")}</a></li>
            <li><a href="#projects">{t("Project")}</a></li>
            <li><a href="#skills">{t("Skills")}</a></li>
            <li><a href="#experience">{t("Experience")}</a></li>
          </ul>
          <LangToggle />
          <a href="mailto:sakdidetsuttipol@hotmail.com" className="btn-sayhi">{t("Say hi")}</a>
          <NavMenu items={[{ label: 'About Me', href: '#experience' }, { label: 'Project', href: '#projects' }, { label: 'Skills', href: '#skills' }, { label: 'Experience', href: '#experience' }]} />
        </div>
      </nav>

      {/* ── HERO ── */}
      {/* Hero, Wall Label and What I do share the cloud-bank scroll timeline */}
      <div className="home-intro" ref={introRef}>

      {/* Figma: playground › Hero (full-bleed), node 364:2555 */}
      <section className="hero-section hero--fresco" id="about">
        <div className="hero-art">
          <HeroFresco />
        </div>
        <FadeUp className="hero-float">
          <h1 className="hero-float-heading">
            {t("Hey There,")}<br />
            {t("I'm ")}<em className="hero-float-name">Sakdidet</em>
          </h1>
          <p className="hero-float-badge">{t("UI Designer & Design Technologist")}</p>
        </FadeUp>
      </section>

      {/* Wall Label (Figma 416:3119) */}
      <WallLabel />

      {/* What I do: cloud bank + Between design and code (Figma 364:2594) */}
      <WhatIDo />
      </div>

      {/* Impact: What the Design System changed (Figma 364:2618) */}
      <Impact />

      {/* Work Experience (Figma 364:2659) */}
      <Experience />

      {/* My Project: the featured project (Figma 364:2680) */}
      <MyProject />

      {/* ── SKILLS ── */}
      <section className="skills-section" id="skills">
        <div className="skills-inner">
          <FadeUp>
            <div className="skills-header">
              <p className="label-tag">{t("MY EXPERTISE")}</p>
              <h2 className="section-heading">{t("Skills & Capabilities")}</h2>
            </div>
          </FadeUp>
          <Suspense fallback={null}>
            <SkillsOrb />
          </Suspense>
          <div className="skills-grid">
            <FadeUp>
              <div className="skills-col-title">
                <span className="skills-col-icon">🎨</span>
                <h3 className="skills-col-heading">{t("Hard Skills")}</h3>
              </div>
              <div className="skill-cards">
                {HARD_SKILLS.map(s => (
                  <div key={s.title} className="skill-card hard">
                    <p className="skill-card-title">{t(s.title)}</p>
                    <p className="skill-card-desc">{t(s.desc)}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="skills-col-title">
                <span className="skills-col-icon">🧠</span>
                <h3 className="skills-col-heading">{t("Soft Skills")}</h3>
              </div>
              <div className="skill-cards">
                {SOFT_SKILLS.map(s => (
                  <div key={s.title} className="skill-card soft">
                    <p className="skill-card-title">{t(s.title)}</p>
                    <p className="skill-card-desc">{t(s.desc)}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-wrapper">
        <FadeUp>
          <div className="cta-box">
            <Suspense fallback={null}>
              <CtaTokens />
            </Suspense>
            <h2 className="cta-heading">{t("Design is how I think.")}<br />{t("Let's think together.")}</h2>
            <p className="cta-sub">
              {t("Currently open to new opportunities, whether it's a product, a system, or an experience worth building.")}
            </p>
            <div className="cta-actions">
              <a ref={emailRef} href="mailto:sakdidetsuttipol@hotmail.com" className="cta-email">
                sakdidetsuttipol@<wbr />hotmail.com
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M1 6H15M15 6L10 1M15 6L10 11" style={{ stroke: 'var(--color-text-primary)' }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div className="social-links">
                <a ref={linkedinRef} href="http://www.linkedin.com/in/sakdidet-suttipol" target="_blank" rel="noopener noreferrer" className="social-link" aria-label={t("LinkedIn")}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <a href="#" className="footer-logo" aria-label={t("Sakdidet, back to top")}>
              <NavLogoMark />
              <span className="footer-logo-text">Sakdidet</span>
            </a>
            <p className="footer-copy">{t("©2026 Sakdidet. All Rights Reserved.")}</p>
          </div>
          <div className="footer-right">
            <ul className="footer-nav">
              <li><a href="http://www.linkedin.com/in/sakdidet-suttipol" target="_blank" rel="noopener noreferrer">{t("LinkedIn")}</a></li>
            </ul>
            <div className="footer-location">
              <svg width="10" height="13" viewBox="0 0 10 14" fill="none">
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" style={{ fill: 'var(--color-text-muted)' }} />
              </svg>
              {t("Based on Bangkok Thailand")}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
