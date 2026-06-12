import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import '../Detail.css'

const IMG_HR_SYSTEM = 'https://www.figma.com/api/mcp/asset/6abb6d3e-7f61-4993-8d04-2e1db999a022'
const IMG_STUDENT_ACTIVITY = 'https://www.figma.com/api/mcp/asset/65a2dbd5-468c-47d7-adbb-f29ec4a25365'
const IMG_IMPACT_HIRE_HUB = 'https://www.figma.com/api/mcp/asset/01438b39-ebfd-44a7-be74-237685dec4ba'
const IMG_FLEXIBLE_BENEFITS = 'https://www.figma.com/api/mcp/asset/3b68e995-e98b-41b9-93c2-0b3bf0fea731'
const IMG_IMPACT_WEDDING = 'https://www.figma.com/api/mcp/asset/c8ea807e-f0b2-461a-949e-acd4062451b3'
const IMG_CLEAN_NEAR_U = 'https://www.figma.com/api/mcp/asset/ab52fbd4-a2f7-44f0-aa74-953f2b938ca7'

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
    title: 'Flexible Benefits Design Project & Usability Testing',
    desc: 'Streamlining corporate benefit selection through a user-centered interface, reducing cognitive load for thousands of employees.',
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
            <h2 className="cta-heading">Let's make something amazing<br />together</h2>
            <p className="cta-sub">
              Have a project in mind? I'm currently accepting new commissions for 2024.
              Let's build your vision from the ground up.
            </p>
            <div className="cta-actions">
              <a href="mailto:sakdidetsuttipol@hotmail.com" className="cta-email">
                sakdidetsuttipol@hotmail.com
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path d="M1 6H15M15 6L10 1M15 6L10 11" stroke="#1B1C19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
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
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Facebook</a></li>
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
