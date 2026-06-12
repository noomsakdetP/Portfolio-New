import { Link, useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import '../Overview.css'

/* ── Project data ── */
const PROJECT_IMG_HR = 'https://www.figma.com/api/mcp/asset/6abb6d3e-7f61-4993-8d04-2e1db999a022'
const PROJECT_IMG_STUDENT = 'https://www.figma.com/api/mcp/asset/65a2dbd5-468c-47d7-adbb-f29ec4a25365'
const PROJECT_IMG_HIRE_HUB = 'https://www.figma.com/api/mcp/asset/01438b39-ebfd-44a7-be74-237685dec4ba'
const PROJECT_IMG_FLEXIBLE = 'https://www.figma.com/api/mcp/asset/3b68e995-e98b-41b9-93c2-0b3bf0fea731'
const PROJECT_IMG_WEDDING = 'https://www.figma.com/api/mcp/asset/c8ea807e-f0b2-461a-949e-acd4062451b3'
const PROJECT_IMG_CLEAN = 'https://www.figma.com/api/mcp/asset/ab52fbd4-a2f7-44f0-aa74-953f2b938ca7'

interface Project {
  id: string
  title: string
  subtitle: string
  tags: string[]
  role: string
  timeline: string
  tools: string[]
  platform: string
  image: string
  overview: string
  problem: string
  process: { phase: string; title: string; desc: string }[]
  outcomes: { metric: string; label: string }[]
  nextId: string
}

const projects: Record<string, Project> = {
  'hr-system': {
    id: 'hr-system',
    title: 'HR System',
    subtitle: 'Redesigning enterprise tools for better employee lifecycle management',
    tags: ['Design System', 'UX/UI', 'Angular'],
    role: 'Junior UX/UI Designer',
    timeline: '2025 – Present',
    tools: ['Figma', 'Angular', 'Storybook', 'Design Tokens'],
    platform: 'Desktop Web',
    image: PROJECT_IMG_HR,
    overview:
      'A comprehensive Design System built from the ground up for an HR internal platform — spanning design tokens in Figma all the way to production-ready Angular components. The goal was to create a single source of truth that both designers and developers could trust.',
    problem:
      'The HR platform had grown organically over years, resulting in inconsistent UI patterns, duplicated components, and a slow development cycle. Every new feature required rebuilding from scratch with no shared language between design and engineering.',
    process: [
      {
        phase: '01',
        title: 'Audit & Discovery',
        desc: 'Conducted a full UI audit across 40+ screens. Catalogued every unique color, spacing value, and component variant. Interviewed 6 developers and 3 product managers to identify the biggest pain points.',
      },
      {
        phase: '02',
        title: 'Token Architecture',
        desc: 'Designed a 3-tier token system: Primitive → Semantic → Component. Mapped all values to Figma Variables and CSS custom properties so that a single source of truth drives both design and code.',
      },
      {
        phase: '03',
        title: 'Component Library',
        desc: 'Built 60+ components in Figma with full variant coverage, interactive states, and accessibility annotations. Each component maps 1:1 to an Angular counterpart published in Storybook.',
      },
      {
        phase: '04',
        title: 'Handoff & Documentation',
        desc: 'Created developer-facing documentation for every component — usage guidelines, do/don\'t examples, and prop tables. Reduced design-to-dev handoff time from 2 weeks to 3 days.',
      },
    ],
    outcomes: [
      { metric: '60+', label: 'Components shipped' },
      { metric: '3×', label: 'Faster handoff' },
      { metric: '40%', label: 'Less design debt' },
      { metric: '100%', label: 'Token coverage' },
    ],
    nextId: 'student-activity',
  },
  'student-activity': {
    id: 'student-activity',
    title: 'Student Activity System',
    subtitle: 'A holistic design and development approach for tracking campus life',
    tags: ['Full-Stack Design', 'UX Research', 'Web App'],
    role: 'Full-Stack Designer',
    timeline: '2024',
    tools: ['Figma', 'React', 'Usability Testing'],
    platform: 'Desktop & Mobile Web',
    image: PROJECT_IMG_STUDENT,
    overview:
      'A unified platform for Srinakharinwirot University to track student activity hours, manage club registrations, and surface achievements — replacing a fragmented Excel-based process.',
    problem:
      'Students struggled to track their required activity hours across multiple departments, each running their own spreadsheet. Admins had no visibility into participation trends, and data was often lost at semester end.',
    process: [
      {
        phase: '01',
        title: 'User Research',
        desc: 'Interviewed 12 students and 4 administrative staff. Mapped the existing workflow and identified the top 3 friction points: unclear requirements, no history visibility, and manual verification.',
      },
      {
        phase: '02',
        title: 'Information Architecture',
        desc: 'Redesigned the IA from scratch — separating student-facing flows (register, track, view history) from admin flows (approve, report, export). Card-sorted with 8 participants.',
      },
      {
        phase: '03',
        title: 'Prototype & Test',
        desc: 'Built mid-fi prototypes in Figma, ran 2 rounds of usability testing with 6 users each. Iterated on the approval flow which had the highest error rate in testing.',
      },
      {
        phase: '04',
        title: 'Design System Support',
        desc: 'Created a lightweight component library scoped to the project. Delivered a Figma file with all screens, states, and a developer handoff guide.',
      },
    ],
    outcomes: [
      { metric: '12', label: 'User interviews' },
      { metric: '2×', label: 'Usability rounds' },
      { metric: '80%', label: 'Task success rate' },
      { metric: '0', label: 'Lost data incidents' },
    ],
    nextId: 'impact-hire-hub',
  },
  'impact-hire-hub': {
    id: 'impact-hire-hub',
    title: 'IMPACT Hire Hub',
    subtitle: 'Optimizing recruitment lifecycle with an intuitive internal hiring dashboard',
    tags: ['UX/UI Design', 'Dashboard', 'Intern Project'],
    role: 'UX/UI Design Intern',
    timeline: 'May 2024 – Aug 2024',
    tools: ['Figma', 'FigJam', 'Maze'],
    platform: 'Desktop Web',
    image: PROJECT_IMG_HIRE_HUB,
    overview:
      'An internal recruitment dashboard for IMPACT Exhibition Management, enabling HR to post jobs, track applicants, schedule interviews, and generate hiring reports — all in one place.',
    problem:
      'The HR team was managing recruitment across 4 separate tools (email, spreadsheets, LINE chat, and a legacy ATS). Applicant statuses were frequently lost, and time-to-hire was 40% above industry benchmark.',
    process: [
      {
        phase: '01',
        title: 'Stakeholder Mapping',
        desc: 'Ran a collaborative workshop with HR, hiring managers, and IT. Defined success metrics and mapped the as-is recruitment journey across all touchpoints.',
      },
      {
        phase: '02',
        title: 'Dashboard Architecture',
        desc: 'Designed the information hierarchy for the dashboard: pipeline overview → candidate detail → interview scheduling → offer management. Prioritized density vs. clarity tradeoffs.',
      },
      {
        phase: '03',
        title: 'Interaction Design',
        desc: 'Created high-fidelity prototypes for the 5 most-used workflows. Focused on reducing click depth — the most common HR task (updating candidate status) went from 6 clicks to 2.',
      },
      {
        phase: '04',
        title: 'Validation',
        desc: 'Tested with 5 HR staff using Maze. Achieved 92% task completion rate on core flows. Iterated on the filter system which was the main point of confusion.',
      },
    ],
    outcomes: [
      { metric: '92%', label: 'Task completion' },
      { metric: '6→2', label: 'Clicks to update status' },
      { metric: '4→1', label: 'Tools consolidated' },
      { metric: '5', label: 'HR staff tested' },
    ],
    nextId: 'flexible-benefits',
  },
  'flexible-benefits': {
    id: 'flexible-benefits',
    title: 'Flexible Benefits',
    subtitle: 'Streamlining corporate benefit selection through a user-centered interface',
    tags: ['UX/UI Design', 'Usability Testing', 'Intern Project'],
    role: 'UX/UI Design Intern',
    timeline: 'Sep 2024 – Feb 2025',
    tools: ['Figma', 'Maze', 'Google Forms'],
    platform: 'Desktop & Mobile Web',
    image: PROJECT_IMG_FLEXIBLE,
    overview:
      'A self-service benefits enrollment platform allowing IMPACT employees to allocate their annual welfare budget across health, insurance, lifestyle, and retirement options — with real-time budget tracking.',
    problem:
      'Employees found the annual benefits enrollment confusing — unclear eligibility rules, no budget visibility, and a paper form process that resulted in 30% error rate requiring manual correction by HR.',
    process: [
      {
        phase: '01',
        title: 'Competitive Analysis',
        desc: 'Benchmarked 6 HR benefits platforms. Identified that the best performers used a "shopping cart" mental model with a persistent budget meter — reducing cognitive load significantly.',
      },
      {
        phase: '02',
        title: 'UX Architecture',
        desc: 'Designed the enrollment flow: category browsing → plan selection → budget check → summary → confirm. Added inline eligibility hints to reduce HR support tickets.',
      },
      {
        phase: '03',
        title: 'High-Fidelity Design',
        desc: 'Built complete desktop and mobile responsive designs. Key interaction: a sticky budget tracker that updates live as users add/remove benefits, inspired by e-commerce cart patterns.',
      },
      {
        phase: '04',
        title: 'Usability Testing',
        desc: 'Ran moderated tests with 8 employees across departments. Measured enrollment completion time and error rate. The redesign reduced errors from 30% to under 5%.',
      },
    ],
    outcomes: [
      { metric: '30%→5%', label: 'Error rate' },
      { metric: '8', label: 'Employees tested' },
      { metric: '2×', label: 'Faster enrollment' },
      { metric: '100%', label: 'Mobile responsive' },
    ],
    nextId: 'impact-wedding',
  },
  'impact-wedding': {
    id: 'impact-wedding',
    title: 'IMPACT Wedding',
    subtitle: 'A graceful digital solution for managing large-scale events',
    tags: ['UX/UI Design', 'Event Platform', 'Intern Project'],
    role: 'UX/UI Intern',
    timeline: 'May 2024 – Jul 2024',
    tools: ['Figma', 'FigJam'],
    platform: 'Desktop Web',
    image: PROJECT_IMG_WEDDING,
    overview:
      'An event management platform for IMPACT Arena\'s wedding & banquet division — enabling event coordinators to manage bookings, seating arrangements, vendor coordination, and guest communications.',
    problem:
      'Coordinators managed multiple simultaneous events using printouts and WhatsApp groups. Last-minute changes were error-prone, and there was no unified view of event status across the team.',
    process: [
      {
        phase: '01',
        title: 'Domain Research',
        desc: 'Shadowed 2 event coordinators across a full event day. Mapped their toolset (6 different apps) and identified the highest-friction moments: seating changes and vendor confirmations.',
      },
      {
        phase: '02',
        title: 'Core Workflow Design',
        desc: 'Focused on the 3 most critical workflows: event timeline view, guest list management, and vendor checklist. Used progressive disclosure to keep the interface approachable.',
      },
      {
        phase: '03',
        title: 'Visual Design',
        desc: 'Designed a calm, professional aesthetic fitting the wedding industry. Soft neutrals with gold accents. Prioritized spatial clarity for coordinators working under pressure.',
      },
      {
        phase: '04',
        title: 'Prototype Review',
        desc: 'Presented interactive Figma prototype to 3 senior coordinators. Collected structured feedback and refined the event status indicators and notification system.',
      },
    ],
    outcomes: [
      { metric: '6→1', label: 'Tools consolidated' },
      { metric: '3', label: 'Senior coordinators validated' },
      { metric: '100%', label: 'Mobile-ready' },
      { metric: '2', label: 'Core flows redesigned' },
    ],
    nextId: 'clean-near-u',
  },
  'clean-near-u': {
    id: 'clean-near-u',
    title: 'Clean near U',
    subtitle: 'A modern laundry service app focusing on convenience and cleanliness',
    tags: ['Mobile UX', 'Service Design', 'App'],
    role: 'UX/UI Designer',
    timeline: '2024',
    tools: ['Figma', 'Principle', 'User Testing'],
    platform: 'iOS & Android',
    image: PROJECT_IMG_CLEAN,
    overview:
      'A on-demand laundry pickup & delivery app connecting users with nearby laundry shops. Designed to make scheduling, tracking, and payment frictionless for urban users.',
    problem:
      'Existing laundry apps in Thailand had outdated UI, confusing pricing structures, and no real-time order tracking — leading to high drop-off rates and reliance on phone calls to check order status.',
    process: [
      {
        phase: '01',
        title: 'User Interviews',
        desc: 'Interviewed 10 urban users aged 22–35. Key insight: users don\'t mind paying premium for reliability and predictability — they just want to know exactly when their clothes are coming back.',
      },
      {
        phase: '02',
        title: 'Mobile-First Design',
        desc: 'Designed for iOS & Android simultaneously. Followed platform conventions (bottom tab nav, native inputs, system fonts as fallback). Built a simple 3-step order flow: schedule → confirm → track.',
      },
      {
        phase: '03',
        title: 'Visual System',
        desc: 'Fresh, clean visual identity: white surfaces, soft teal accent, rounded cards. Iconography focused on clarity — every icon passed a 5-second comprehension test with new users.',
      },
      {
        phase: '04',
        title: 'Prototype Testing',
        desc: 'Tested the high-fi prototype with 6 users. Measured time-to-complete the order flow (target: under 90 seconds). Achieved 78 seconds median. Iterated on the address selection screen.',
      },
    ],
    outcomes: [
      { metric: '78s', label: 'Median order time' },
      { metric: '6', label: 'Users tested' },
      { metric: '3', label: 'Step order flow' },
      { metric: '5★', label: 'Avg. comprehension score' },
    ],
    nextId: 'hr-system',
  },
}

/* ── Fade-up animation ── */
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useFadeUp()
  return (
    <div ref={ref} className={`fade-up ${className}`} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  )
}

export default function Overview() {
  const { projectId } = useParams<{ projectId: string }>()
  const project = projects[projectId ?? ''] ?? projects['hr-system']
  const nextProject = projects[project.nextId]

  useEffect(() => { window.scrollTo(0, 0) }, [projectId])

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
      <section className="ov-hero">
        <div className="ov-hero-inner">
          <FadeUp>
            <Link to="/projects" className="ov-back-link">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M15 6H1M1 6L6 1M1 6L6 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              All Projects
            </Link>
          </FadeUp>

          <FadeUp delay={0.05}>
            <div className="ov-hero-tags">
              {project.tags.map(t => <span key={t} className="detail-badge">{t}</span>)}
            </div>
            <h1 className="ov-title">{project.title}</h1>
            <p className="ov-subtitle">{project.subtitle}</p>
          </FadeUp>

          {/* Project meta row */}
          <FadeUp delay={0.1}>
            <div className="ov-meta-row">
              <div className="ov-meta-item">
                <span className="ov-meta-label">Role</span>
                <span className="ov-meta-value">{project.role}</span>
              </div>
              <div className="ov-meta-divider" />
              <div className="ov-meta-item">
                <span className="ov-meta-label">Timeline</span>
                <span className="ov-meta-value">{project.timeline}</span>
              </div>
              <div className="ov-meta-divider" />
              <div className="ov-meta-item">
                <span className="ov-meta-label">Platform</span>
                <span className="ov-meta-value">{project.platform}</span>
              </div>
              <div className="ov-meta-divider" />
              <div className="ov-meta-item">
                <span className="ov-meta-label">Tools</span>
                <span className="ov-meta-value">{project.tools.join(' · ')}</span>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Hero image */}
        <FadeUp delay={0.15} className="ov-hero-img-wrap">
          <img src={project.image} alt={project.title} className="ov-hero-img" />
        </FadeUp>
      </section>

      {/* ── OVERVIEW & PROBLEM ── */}
      <section className="ov-section">
        <div className="ov-container">
          <div className="ov-two-col">
            <FadeUp className="ov-col-left">
              <p className="label-tag">OVERVIEW</p>
              <h2 className="ov-section-heading">Project Brief</h2>
            </FadeUp>
            <FadeUp delay={0.1} className="ov-col-right">
              <p className="ov-body-large">{project.overview}</p>
            </FadeUp>
          </div>

          <div className="ov-divider" />

          <div className="ov-two-col">
            <FadeUp className="ov-col-left">
              <p className="label-tag">CHALLENGE</p>
              <h2 className="ov-section-heading">The Problem</h2>
            </FadeUp>
            <FadeUp delay={0.1} className="ov-col-right">
              <div className="ov-problem-card">
                <div className="ov-problem-quote">"</div>
                <p className="ov-body-large">{project.problem}</p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="ov-process-section">
        <div className="ov-container">
          <FadeUp>
            <p className="label-tag" style={{ color: '#FFDF9A' }}>MY PROCESS</p>
            <h2 className="ov-section-heading" style={{ color: '#FAF9F4' }}>How I approached it</h2>
          </FadeUp>
          <div className="ov-process-grid">
            {project.process.map((step, i) => (
              <FadeUp key={step.phase} delay={i * 0.08} className="ov-process-card">
                <span className="ov-process-num">{step.phase}</span>
                <h3 className="ov-process-title">{step.title}</h3>
                <p className="ov-process-desc">{step.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUTCOMES ── */}
      <section className="ov-section">
        <div className="ov-container">
          <FadeUp>
            <p className="label-tag">IMPACT</p>
            <h2 className="ov-section-heading">Key Outcomes</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="ov-outcomes-grid">
              {project.outcomes.map(o => (
                <div key={o.label} className="ov-outcome-card">
                  <span className="ov-outcome-metric">{o.metric}</span>
                  <span className="ov-outcome-label">{o.label}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── NEXT PROJECT ── */}
      {nextProject && (
        <section className="ov-next-section">
          <div className="ov-container">
            <FadeUp>
              <div className="ov-next-inner">
                <div className="ov-next-text">
                  <p className="label-tag">NEXT PROJECT</p>
                  <h2 className="ov-next-title">{nextProject.title}</h2>
                  <p className="ov-next-sub">{nextProject.subtitle}</p>
                  <Link to={`/projects/${nextProject.id}`} className="ov-next-btn">
                    View Case Study
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                      <path d="M1 6H15M15 6L10 1M15 6L10 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
                <div className="ov-next-img-wrap">
                  <img src={nextProject.image} alt={nextProject.title} />
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

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
                  <path d="M1 6H15M15 6L10 1M15 6L10 11" stroke="#1B1C19" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
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
                <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#555F6F"/>
              </svg>
              Based on Bangkok Thailand
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
