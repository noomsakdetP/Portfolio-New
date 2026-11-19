import { lazy, Suspense, useEffect, useRef } from 'react'
import LangToggle from './components/LangToggle'
import { useT } from './i18n/lang'
import NavMenu from './components/NavMenu'
import { Link } from 'react-router-dom'
import './App.css'
import projectImg from './assets/project-banner.png'
import { HARD_SKILLS, SOFT_SKILLS } from './data/skills'
import { useScrollTimeline } from './hooks/useScrollTimeline'
import { useMagnetic } from './hooks/useMagnetic'
import { useExplodeOnScroll } from './hooks/useExplodeOnScroll'
import FooterCube from './components/FooterCube'
// Light wrapper: static WebP poster first; it lazy-loads the Rive runtime itself.
import HeroFresco from './components/HeroFresco'
import CurtainLoader from './components/CurtainLoader'

// 3D scenes are code-split: three.js only downloads after the page renders
const SkillsOrb = lazy(() => import('./components/SkillsOrb'))
const CtaTokens = lazy(() => import('./components/CtaTokens'))

const PROJECT_IMG = projectImg

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
  const timelineRef = useScrollTimeline<HTMLDivElement>()
  const emailRef = useMagnetic<HTMLAnchorElement>(0.3)
  const linkedinRef = useMagnetic<HTMLAnchorElement>(0.45, 60)
  const explodeRef = useExplodeOnScroll<HTMLDivElement>()

  return (
    <>
      {/* Curtain over the page while the hero loads (once per full page load) */}
      <CurtainLoader />

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="#" className="nav-logo">
            <span className="nav-logo-icon">S</span>
            <span className="nav-logo-text">Sakdidet</span>
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
      {/* Figma: playground › Hero (full-bleed), node 364:2555 */}
      <section className="hero-section hero--fresco" id="about">
        <div className="hero-art">
          <HeroFresco />
          <div className="hero-legibility" aria-hidden="true" />
          <a href="#projects" className="hero-scroll-cue" aria-label={t("Scroll to projects")}>
            <span className="hero-scroll-label">{t("Scroll")}</span>
            <span className="hero-scroll-thread" />
          </a>
        </div>
        <FadeUp className="hero-float">
          <h1 className="hero-float-heading">
            {t("Hey There,")}<br />
            {t("I'm ")}<em className="hero-float-name">Sakdidet</em>
          </h1>
          <p className="hero-float-badge">{t("UI Designer & Design Technologist")}</p>
        </FadeUp>
      </section>

      {/* ── PROJECTS ── */}
      <section className="projects-section" id="projects">
        <div className="projects-inner">
          <FadeUp>
            <div className="section-header">
              <h2 className="section-heading-dark">{t("My Project")}</h2>
              <Link to="/projects" className="view-all-btn">
                {t("VIEW ALL PROJECTS")}
                <span className="view-all-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7H13M13 7L8 2M13 7L8 12" stroke="#FAF9F4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="project-grid">
              {/* Exploded view: tokens → UI → grid → components, driven by scroll (useExplodeOnScroll) */}
              <div className="project-image-col" ref={explodeRef}>
                <div className="pj-stack">
                  <div className="pj-layer pj-tokens" aria-hidden="true">
                    <span className="pj-swatch" style={{ background: '#EAB308' }} />
                    <span className="pj-swatch" style={{ background: '#785A00' }} />
                    <span className="pj-swatch" style={{ background: '#FAF9F4' }} />
                    <span className="pj-swatch" style={{ background: '#D3C5AC' }} />
                    <span className="pj-aa">{t("Aa")}</span>
                    <span className="pj-tag">{t("01 · Tokens")}</span>
                  </div>
                  <div className="pj-layer pj-screen">
                    <img src={PROJECT_IMG} alt={t("HR Design System")} />
                    <div className="project-image-overlay" />
                  </div>
                  <div className="pj-layer pj-grid" aria-hidden="true">
                    <span className="pj-tag">{t("02 · Layout grid")}</span>
                  </div>
                  <div className="pj-layer pj-comps" aria-hidden="true">
                    <span className="pj-chip pj-btn">{t("Save changes")}</span>
                    <span className="pj-chip pj-input">{t("Search employee…")}</span>
                    <span className="pj-chip pj-badge">{t("● Active")}</span>
                    <span className="pj-chip pj-toggle"><i /></span>
                    <span className="pj-tag">{t("03 · Components")}</span>
                  </div>
                  <div className="pj-layer pj-top">
                    <div className="project-image-label">
                      <span className="project-tag">{t("FIGMA · ANGULAR")}</span>
                      <span className="project-name">{t("HR Design System")}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="project-info-col">
                <div className="project-info-block">
                  <h3 className="project-info-title">{t("Strategy")}</h3>
                  <p className="project-info-body">
                    {t("Building a unified Design System to standardize UI across the HR platform — from design tokens in Figma to production-ready components in Angular.")}
                  </p>
                </div>
                <div className="project-info-block">
                  <h3 className="project-info-title">{t("Results")}</h3>
                  <p className="project-info-body">
                    {t("Building a unified Design System to standardize UI across the HR platform — from design tokens in Figma to production-ready components in Angular.")}
                  </p>
                </div>
                <Link to="/projects" className="btn-view-project">{t("View Project")}</Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className="experience-section" id="experience">
        <div className="experience-inner">
          <FadeUp>
            <p className="label-tag">{t("MY JOURNEY")}</p>
            <h2 className="section-heading">{t("Work Experience")}</h2>
            <div className="timeline" ref={timelineRef}>
              <span className="timeline-progress" aria-hidden="true" />
              {/* Experience 1 — current job, has connector arrow */}
              <div className="timeline-item timeline-item--active">
                <div className="timeline-dot-wrap"><div className="timeline-dot timeline-dot--active" /></div>
                <div className="timeline-content-wrap">
                  <p className="timeline-date">{t("2025 - Present")}</p>
                  <h3 className="timeline-company">{t("Advance Research")}<br />{t("Group (ARSoft)")}</h3>
                  <p className="timeline-role">{t("Junior Ux/UI Designer")}</p>
                  <p className="timeline-desc">
                    {t("Designing UI/UX and building a Design System for the HR internal platform — from Figma tokens to Angular component library.")}
                  </p>
                  {/* dashed connector line — visible only on desktop */}
                  <div className="timeline-connector" aria-hidden="true">
                    <svg className="timeline-connector-line" viewBox="0 0 180 2" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="1" x2="170" y2="1" stroke="#785A00" strokeWidth="2" strokeDasharray="6 4"/>
                    </svg>
                    <svg className="timeline-connector-arrow" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="#785A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot-wrap"><div className="timeline-dot" /></div>
                <div>
                  <p className="timeline-date">{t("May 2024 - Feb 2025")}</p>
                  <h3 className="timeline-company">{t("IMPACT EXHIBITION")}<br />{t("MANAGEMENT CO.,LTD")}</h3>
                  <p className="timeline-role" style={{ marginTop: 32 }}>{t("Skills gained")}</p>
                  <p className="timeline-desc">
                    {t("Delivered 2 projects: IMPACT Hire Hub and Flexible Benefit platform.")}<br />
                    {t("Design System Beginner · Prototyping")}<br />
                    {t("Design for 3 Devices (Tablet, Mobile and Desktop)")}<br />
                    {t("Usability Testing")}
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="projects-card">
              <h3 className="projects-card-heading">{t("The project I'm responsible for")}</h3>
              <div className="project-cards-list">
                <div className="project-card-item">
                  <div className="project-card-header">
                    <span className="project-card-icon">🏗️</span>
                    <h4 className="project-card-title">{t("Design System for HR System and UX/UI Design")}</h4>
                  </div>
                  <p className="project-card-desc">{t("Built a full Design System with tokens, components, and Storybook documentation for an HR platform.")}</p>
                </div>
                <div className="project-card-item">
                  <div className="project-card-header">
                    <span className="project-card-icon">🔬</span>
                    <h4 className="project-card-title">{t("Support Design in SWU Research & SWU HUB")}</h4>
                  </div>
                  <p className="project-card-desc">{t("Built a full Design System with tokens, components, and Storybook documentation for an HR platform.")}</p>
                </div>
                <div className="project-card-item">
                  <div className="project-card-header">
                    <span className="project-card-icon">🚔</span>
                    <h4 className="project-card-title">{t("Do project SMART POLICE")}</h4>
                  </div>
                  <p className="project-card-desc">{t("Designed wireframes, interactive prototype, and a foundational Design System for a police management platform (Desktop).")}</p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

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
              {t("Currently open to new opportunities — whether it's a product, a system, or an experience worth building.")}
            </p>
            <div className="cta-actions">
              <a ref={emailRef} href="mailto:sakdidetsuttipol@hotmail.com" className="cta-email">
                sakdidetsuttipol@<wbr />hotmail.com
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M1 6H15M15 6L10 1M15 6L10 11" stroke="#1B1C19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
            <a href="#" className="footer-logo" aria-label={t("Sakdidet — back to top")}>
              <FooterCube />
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
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#555F6F" />
              </svg>
              {t("Based on Bangkok Thailand")}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
