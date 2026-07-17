import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import heroImg from './assets/Rectangle.png'
import projectImg from './assets/project-banner.png'

const HERO_IMG = heroImg
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
  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,600;0,700;1,700&family=Inter:wght@400;500&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="#" className="nav-logo">
            <span className="nav-logo-icon">S</span>
            <span className="nav-logo-text">Sakdidet</span>
          </a>
          <ul className="nav-links">
            <li><a href="#experience">About Me</a></li>
            <li><a href="#projects">Project</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#experience">Experience</a></li>
          </ul>
          <a href="mailto:sakdidetsuttipol@hotmail.com" className="btn-sayhi">Say hi</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section" id="about">
        <div className="hero-inner">
          <FadeUp className="hero-text">
            <div className="badge">
              <span className="badge-dot" />
              UI Designer &amp; Design Technologist
            </div>
            <h1 className="hero-heading">
              Hey There,<br />
              I'm <em className="accent">Sakdidet</em>
            </h1>
            <p className="hero-sub">
              Bridging design decisions into real product. Specialized in
              Design System — from Figma token to production-ready
              components that teams can ship.
            </p>
            <a href="#" className="cv-badge" style={{ display: 'inline-flex', marginBottom: 16 }}>
              <span className="cv-dot" />
              <span className="cv-text">Download My CV</span>
            </a>
            <a href="mailto:sakdidetsuttipol@hotmail.com" className="hero-email-link">
              sakdidetsuttipol@hotmail.com
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M1 6H15M15 6L10 1M15 6L10 11" stroke="#1B1C19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </FadeUp>
          <FadeUp className="hero-image" delay={0.15}>
            <div className="hero-photo-wrap">
              <div
                className="hero-photo-card"
                onMouseMove={e => {
                  const card = e.currentTarget
                  const rect = card.getBoundingClientRect()
                  const x = (e.clientX - rect.left) / rect.width - 0.5
                  const y = (e.clientY - rect.top) / rect.height - 0.5
                  card.style.transform = `rotate(2deg) perspective(600px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.03)`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'rotate(2deg)'
                }}
              >
                <img src={HERO_IMG} alt="Sakdidet" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="projects-section" id="projects">
        <div className="projects-inner">
          <FadeUp>
            <div className="section-header">
              <h2 className="section-heading-dark">My Project</h2>
              <Link to="/projects" className="view-all-btn">
                VIEW ALL PROJECTS
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
              <div className="project-image-col">
                <img src={PROJECT_IMG} alt="HR Design System" />
                <div className="project-image-overlay" />
                <div className="project-image-label">
                  <span className="project-tag">FIGMA · ANGULAR</span>
                  <span className="project-name">HR Design System</span>
                </div>
              </div>
              <div className="project-info-col">
                <div className="project-info-block">
                  <h3 className="project-info-title">Strategy</h3>
                  <p className="project-info-body">
                    Building a unified Design System to standardize UI across the HR platform — from design tokens in Figma to production-ready components in Angular.
                  </p>
                </div>
                <div className="project-info-block">
                  <h3 className="project-info-title">Results</h3>
                  <p className="project-info-body">
                    Building a unified Design System to standardize UI across the HR platform — from design tokens in Figma to production-ready components in Angular.
                  </p>
                </div>
                <Link to="/projects" className="btn-view-project">View Project</Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className="experience-section" id="experience">
        <div className="experience-inner">
          <FadeUp>
            <p className="label-tag">MY JOURNEY</p>
            <h2 className="section-heading">Work Experience</h2>
            <div className="timeline">
              {/* Experience 1 — current job, has connector arrow */}
              <div className="timeline-item timeline-item--active">
                <div className="timeline-dot-wrap"><div className="timeline-dot timeline-dot--active" /></div>
                <div className="timeline-content-wrap">
                  <p className="timeline-date">2025 - Present</p>
                  <h3 className="timeline-company">Advance Research<br />Group (ARSoft)</h3>
                  <p className="timeline-role">Junior Ux/UI Designer</p>
                  <p className="timeline-desc">
                    Designing UI/UX and building a Design System for the HR internal platform — from Figma tokens to Angular component library.
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
                  <p className="timeline-date">May 2024 - Feb 2025</p>
                  <h3 className="timeline-company">IMPACT EXHIBITION<br />MANAGEMENT CO.,LTD</h3>
                  <p className="timeline-role" style={{ marginTop: 32 }}>Skills gained</p>
                  <p className="timeline-desc">
                    Delivered 2 projects: IMPACT Hire Hub and Flexible Benefit platform.<br />
                    Design System Beginner · Prototyping<br />
                    Design for 3 Devices (Tablet, Mobile and Desktop)<br />
                    Usability Testing
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="projects-card">
              <h3 className="projects-card-heading">The project I'm responsible for</h3>
              <div className="project-cards-list">
                <div className="project-card-item">
                  <div className="project-card-header">
                    <span className="project-card-icon">🏗️</span>
                    <h4 className="project-card-title">Design System for HR System and UX/UI Design</h4>
                  </div>
                  <p className="project-card-desc">Built a full Design System with tokens, components, and Storybook documentation for an HR platform.</p>
                </div>
                <div className="project-card-item">
                  <div className="project-card-header">
                    <span className="project-card-icon">🔬</span>
                    <h4 className="project-card-title">Support Design in SWU Research &amp; SWU HUB</h4>
                  </div>
                  <p className="project-card-desc">Built a full Design System with tokens, components, and Storybook documentation for an HR platform.</p>
                </div>
                <div className="project-card-item">
                  <div className="project-card-header">
                    <span className="project-card-icon">🚔</span>
                    <h4 className="project-card-title">Do project SMART POLICE</h4>
                  </div>
                  <p className="project-card-desc">Designed wireframes, interactive prototype, and a foundational Design System for a police management platform (Desktop).</p>
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
              <p className="label-tag">MY EXPERTISE</p>
              <h2 className="section-heading">Skills &amp; Capabilities</h2>
            </div>
          </FadeUp>
          <div className="skills-grid">
            <FadeUp>
              <div className="skills-col-title">
                <span className="skills-col-icon">🎨</span>
                <h3 className="skills-col-heading">Hard Skills</h3>
              </div>
              <div className="skill-cards">
                {[
                  { title: 'Design Thinking', desc: 'Visual hierarchy, typography, and user flow optimization.' },
                  { title: 'Wireframe / Prototype', desc: 'Low to high-fidelity interactive prototypes for user testing.' },
                  { title: 'Responsive Design', desc: 'Fluid layouts that adapt seamlessly across all device sizes.' },
                  { title: 'Design System', desc: 'Scalable component libraries and documentation for consistency.' },
                  { title: 'Figma Advance', desc: 'Master of components, variables, and advanced prototyping.' },
                  { title: 'Design Tokens', desc: 'Token architecture from primitive to semantic, CSS custom properties, and Figma Variables.' },
                  { title: 'Data-Driven UX', desc: 'User behavior analysis with Google Analytics and Hotjar to inform design decisions.' },
                  { title: 'Handoff & Dev Collaboration', desc: 'Structured handoffs with Figma specs, Storybook, and dev-ready documentation.' },
                ].map(s => (
                  <div key={s.title} className="skill-card hard">
                    <p className="skill-card-title">{s.title}</p>
                    <p className="skill-card-desc">{s.desc}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="skills-col-title">
                <span className="skills-col-icon">🧠</span>
                <h3 className="skills-col-heading">Soft Skills</h3>
              </div>
              <div className="skill-cards">
                {[
                  { title: 'Critical Thinking', desc: 'Analyzing complex problems to find efficient design solutions.' },
                  { title: 'Teamwork', desc: 'Collaborating effectively with cross-functional teams to achieve shared goals.' },
                  { title: 'Calm Mindset', desc: 'Maintaining focus and composure in high-pressure environments.' },
                  { title: 'Open Feedback', desc: 'Actively seeking and incorporating constructive feedback to improve design quality.' },
                  { title: 'Empathy', desc: 'Understanding user needs and emotions to create meaningful experiences.' },
                  { title: 'Problem-Solving', desc: 'Translating complex requirements into clear, user-centered design solutions.' },
                ].map(s => (
                  <div key={s.title} className="skill-card soft">
                    <p className="skill-card-title">{s.title}</p>
                    <p className="skill-card-desc">{s.desc}</p>
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
            <h2 className="cta-heading">Design is how I think.<br />Let's think together.</h2>
            <p className="cta-sub">
              Currently open to new opportunities — whether it's a product, a system, or an experience worth building.
            </p>
            <div className="cta-actions">
              <a href="mailto:sakdidetsuttipol@hotmail.com" className="cta-email">
                sakdidetsuttipol@hotmail.com
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M1 6H15M15 6L10 1M15 6L10 11" stroke="#1B1C19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div className="social-links">
                <a href="http://www.linkedin.com/in/sakdidet-suttipol" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
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
            <a href="#" className="footer-logo">
              <span className="nav-logo-icon">S</span>
              <span className="footer-logo-text">Sakdidet</span>
            </a>
            <p className="footer-copy">©2026 Sakdidet. All Rights Reserved.</p>
          </div>
          <div className="footer-right">
            <ul className="footer-nav">
              <li><a href="http://www.linkedin.com/in/sakdidet-suttipol" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
            <div className="footer-location">
              <svg width="10" height="13" viewBox="0 0 10 14" fill="none">
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#555F6F" />
              </svg>
              Based on Bangkok Thailand
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
