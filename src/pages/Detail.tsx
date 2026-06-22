import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import '../Detail.css'
import imgHrSystem from '../assets/project-banner.png'
import imgImpactHireHub from '../assets/banner-impact.png'
import imgFlexibleBenefits from '../assets/flexible-benefit.png'
import imgImpactWedding from '../assets/12.png'
import imgCleanNearU from '../assets/banner-casestudy.png'

const IMG_HR_SYSTEM = imgHrSystem
const IMG_STUDENT_ACTIVITY = ''
const IMG_IMPACT_HIRE_HUB = imgImpactHireHub
const IMG_FLEXIBLE_BENEFITS = imgFlexibleBenefits
const IMG_IMPACT_WEDDING = imgImpactWedding
const IMG_CLEAN_NEAR_U = imgCleanNearU

const projects = [
  {
    id: 'hr-system',
    image: IMG_HR_SYSTEM,
    role: 'Junior UX/UI Design',
    title: 'HR System',
    desc: 'Redesigning enterprise systems for better employee lifecycle management.',
  },
  {
    id: 'student-activity',
    image: IMG_STUDENT_ACTIVITY,
    role: 'Full-Stack Designer',
    title: 'Student Activity System',
    desc: 'A holistic design and development approach for tracking campus life and achievements.',
  },
  {
    id: 'impact-hire-hub',
    image: IMG_IMPACT_HIRE_HUB,
    role: 'UX/UI Design Intern',
    title: 'IMPACT Hire Hub',
    desc: 'Optimizing the recruitment lifecycle with an intuitive internal hiring dashboard.',
  },
  {
    id: 'flexible-benefits',
    image: IMG_FLEXIBLE_BENEFITS,
    roles: ['UX/UI Design Intern', 'Usability Testing'],
    title: 'Flexible Benefits Awareness Design Project',
    desc: 'Enhancing employee understanding of organizational benefits through design.',
  },
  {
    id: 'impact-wedding',
    image: IMG_IMPACT_WEDDING,
    role: 'UX/UI Intern',
    title: 'IMPACT Wedding',
    desc: 'A graceful digital solution for managing large-scale events and guest experiences.',
  },
  {
    id: 'clean-near-u',
    image: IMG_CLEAN_NEAR_U,
    role: 'UX/UI Designer',
    title: 'Clean near U',
    desc: 'A modern laundry service app focusing on convenience and cleanliness.',
  },
]

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

export default function Detail() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="nav-logo">
            <span className="nav-logo-icon">S</span>
            <span className="nav-logo-text">Sakdidet</span>
          </Link>
          <ul className="nav-links">
            <li><Link to="/#experience">About Me</Link></li>
            <li><Link to="/projects">Project</Link></li>
            <li><Link to="/#skills">Skills</Link></li>
            <li><Link to="/#experience">Experience</Link></li>
          </ul>
          <a href="mailto:sakdidetsuttipol@hotmail.com" className="btn-sayhi">Say hi</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="detail-hero">
        <div className="detail-hero-inner">
          <FadeUp>
            <p className="label-tag">PORTFOLIO ARCHIVE</p>
            <h1 className="detail-heading">
              Sakdidet's Creative<br />
              <em className="accent">Journey</em>
            </h1>
            <p className="detail-sub">
              A curated selection of interface designs, full-stack systems, and
              usability explorations focused on human-centric solutions.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── PROJECT GRID ── */}
      <section className="detail-grid-section">
        <div className="detail-grid">
          {projects.map((p, i) => (
            <FadeUp key={p.id} delay={i * 0.05} className="project-card">
              <Link to={`/projects/${p.id}`} className="project-card-link">
                <div className="project-card-img-wrap">
                  <img src={p.image} alt={p.title} />
                  <div className="project-card-overlay" />
                  <span className="project-card-cta">View Case Study →</span>
                </div>
                <div className="project-card-body">
                  <div className="project-card-tags">
                    {'roles' in p && p.roles
                      ? p.roles.map(r => <span key={r} className="detail-badge">{r}</span>)
                      : <span className="detail-badge">{p.role}</span>
                    }
                  </div>
                  <h3 className="project-card-name">{p.title}</h3>
                  <p className="project-card-desc">{p.desc}</p>
                </div>
              </Link>
            </FadeUp>
          ))}
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
            <Link to="/" className="footer-logo">
              <span className="nav-logo-icon">S</span>
              <span className="footer-logo-text">Sakdidet</span>
            </Link>
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
