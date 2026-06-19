import { Link, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import '../Overview.css'

/* ── Project data ── */
import hrBanner from '../assets/project-banner.png'
const PROJECT_IMG_HR = hrBanner
const PROJECT_IMG_STUDENT = 'https://www.figma.com/api/mcp/asset/65a2dbd5-468c-47d7-adbb-f29ec4a25365'
import bannerImpact from '../assets/banner-impact.png'
import overviewImpact from '../assets/overview-impact.png'
import problemImpact from '../assets/problem-impact.png'
import solutionImpact from '../assets/solution-impact.png'
import feature01 from '../assets/feature-01.png'
import jobSearch02 from '../assets/job-search-02.png'
import uploadResume from '../assets/upload-resume.png'
import npsFeedback from '../assets/NPS-feedback.png'
import appStepTracker from '../assets/Application Step Tracker.png'
import historyTracker from '../assets/history tracker.png'
const PROJECT_IMG_HIRE_HUB = bannerImpact
import flexibleBenefit from '../assets/flexible-benefit.png'
import weddingBanner from '../assets/12.png'
import typographyImg from '../assets/Typography.png'
import wireframeWedding1 from '../assets/wireframe-wedding1.webp'
import wireframeWedding2 from '../assets/wireframe-wedding2.webp'
import wireframeWedding3 from '../assets/wireframe-wedding3.webp'
import uiWedding1 from '../assets/UI-wedding1.webp'
import uiWedding2 from '../assets/UI-wedding2.webp'
import uiWedding3 from '../assets/UI-wedding3.webp'
import uiWedding4 from '../assets/UI-wedding4.webp'
import uiWedding5 from '../assets/UI-wedding5.webp'
import uiWedding6 from '../assets/UI-wedding6.webp'
import uiWedding7 from '../assets/UI-wedding7.webp'
import rewardImg from '../assets/reward.png'
import bannerCasestudy from '../assets/banner-casestudy.png'
import workflowImg from '../assets/workflow.png'
import flowFlexible from '../assets/Flow Flexible.png'
import genderImg from '../assets/gender.png'
import generationImg from '../assets/generation.png'
import top5activityImg from '../assets/top5activity.png'
import wireframeImg from '../assets/Wireframe.png'
import avgCompletionTime from '../assets/average Completion time.png'
import taskSuccessRate from '../assets/task success rate.png'
import susScore from '../assets/sus score.png'
import uiDesign1 from '../assets/UI Design1.webp'
import uiDesign2 from '../assets/UI Design2.webp'
import uiDesign3 from '../assets/UI Design3.webp'
import uiDesign4 from '../assets/UI Design4.webp'
import uiDesign5 from '../assets/UI Design5.webp'
import uiDesign6 from '../assets/UI Design6.webp'
import uiDesign7 from '../assets/UI Design7.webp'
import uiDesign8 from '../assets/UI Design8.webp'
import uiDesign9 from '../assets/UI Design9.webp'
import uiDesign10 from '../assets/UI Design10.webp'
import persona1 from '../assets/Persona 1.png'
import persona2 from '../assets/Persona 2.png'
import persona3 from '../assets/Persona 3.png'
const PROJECT_IMG_FLEXIBLE = flexibleBenefit
const PROJECT_IMG_WEDDING = 'https://www.figma.com/api/mcp/asset/c8ea807e-f0b2-461a-949e-acd4062451b3'
const PROJECT_IMG_CLEAN = 'https://www.figma.com/api/mcp/asset/ab52fbd4-a2f7-44f0-aa74-953f2b938ca7'

interface Project {
  overviewImage?: string
  problemImage?: string
  solution?: string[]
  solutionImage?: string
  features?: { title: string; desc: string; image?: string }[]
  result?: string
  learnings?: string[]
  goals?: { number: string; desc: string; objective: string }[]
  uxProcess?: { content: string; bullets: string[]; afterText: string; workflowImg: string; flowImg: string }
  personas?: { title: string; desc: string; image: string }[]
  mockupSection?: { content: string; image: string }
  wireframes?: { intro: string; bullets: string[]; closing: string; images: string[] }
  uiDesignWedding?: { content: string; slides: string[] }
  popularVote?: { content: string; image: string }
  designSystem?: {
    intro: string
    subsections: { title: string; content: string; bullets?: string[]; image?: string }[]
    closing: string
  }
  uiDesign?: { paragraphs: string[]; slides: string[] }
  usabilityTesting?: { content: string; images: { src: string; label: string; desc: string }[] }
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
  storybookUrl?: string
  goalText?: string
  empathize?: { intro: string; bullets: string[]; closing: string }
}

const projects: Record<string, Project> = {
  'hr-system': {
    id: 'hr-system',
    title: 'HR System Redesign — Phase 2',
    subtitle: 'Took over and led UX/UI design for Phase 2, designing 9 core modules covering the full employee lifecycle',
    tags: ['Enterprise UX', 'Design System', 'Phase 2'],
    role: 'Junior UX/UI Designer',
    timeline: '2025 – Present',
    tools: ['Figma', 'Design System', 'Prototyping'],
    platform: 'Desktop Web',
    image: PROJECT_IMG_HR,
    overview:
      'Inherited and led UX/UI design for Phase 2 of an enterprise HR System at ARSoft, designing 9 core modules end-to-end — expanding the system beyond Phase 1 with a focus on the full employee lifecycle from recruitment to career growth. Each module was designed to align with the existing Design System while introducing consistent patterns for complex workflows.',
    problem:
      'Phase 1 had established the foundation, but the system needed to scale across the full HR lifecycle — from hiring to offboarding and long-term talent development. The challenge was to design 9 interconnected modules that felt cohesive, reduced user friction, and could be handed off efficiently to developers.',
    process: [
      {
        phase: '01',
        title: 'Handover & Discovery',
        desc: 'Reviewed Phase 1 deliverables, existing components, and design tokens. Mapped out the 9 modules — Recruit, PMS, Training, Employee, Offboarding, Disciplinary Management, Competency Management, IDP, Talent Management, and Career Development — to understand scope and dependencies.',
      },
      {
        phase: '02',
        title: 'User Flow & Information Architecture',
        desc: 'Defined user flows for each module based on HR workflows and stakeholder requirements. Structured the information architecture to ensure logical navigation across interconnected modules covering the full employee lifecycle.',
      },
      {
        phase: '03',
        title: 'UI Design & Design System Alignment',
        desc: 'Designed all 9 modules in Figma, extending the Design System with new components and patterns where needed. Maintained consistency across modules through shared tokens, reusable components, and documented interaction states.',
      },
      {
        phase: '04',
        title: 'Prototype & Handoff',
        desc: 'Built interactive prototypes for key user journeys across each module. Prepared developer-ready handoff documentation including component specs, spacing guidelines, and annotated flows to streamline the development process.',
      },
    ],
    outcomes: [
      { metric: '9', label: 'Modules designed' },
      { metric: '22+', label: 'Components + Full Design Tokens' },
      { metric: 'Storybook', label: 'Component documentation' },
      { metric: '✦', label: 'Icons & assets library organized' },
    ],
    nextId: 'student-activity',
    storybookUrl: 'https://hr-design-system.vercel.app/',
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
    timeline: 'May 2024 – Feb 2025',
    tools: ['Figma'],
    platform: 'Desktop · Mobile · Tablet',
    image: PROJECT_IMG_HIRE_HUB,
    overview:
      'A recruitment landing page designed for IMPACT Exhibition Management, aimed at improving the application experience and creating a centralized platform for external job seekers.',
    overviewImage: overviewImpact,
    problem:
      'Previously, there was no dedicated channel for external candidates to apply for jobs at IMPACT. Available openings weren\'t clearly listed, and applicants had to fill out a lengthy 22-page Google Form. This has led to confusion, inefficiency.',
    problemImage: problemImpact,
    solution: [
      'Created a clean and accessible landing page that clearly displays open job positions and application instructions.',
      'Replaced a 22-page Google Form with a multi-step application process, making it less overwhelming for users.',
      'Designed a progressive form that collects essential information upfront, then requests additional documents only from qualified applicants.',
      'Ensured the design is responsive across all major devices, improving accessibility and usability.',
    ],
    solutionImage: solutionImpact,
    learnings: [
      'This was my first real-world UX/UI project, and it gave me valuable experience working as part of a team. I learned how to structure user flows, design responsive layouts, and think critically about improving long and complex processes.',
      'Since this was a live internship project, some parts of the data were not fully complete, and we didn\'t conduct usability testing at the time. However, it helped me realize how important user feedback is, and I plan to keep improving based on what I\'ve learned.',
    ],
    result: 'This staged approach helped simplify a previously overwhelming 22-page Google Form. By collecting data progressively and only prompting document uploads from qualified applicants, the experience became more efficient and user-friendly — especially on mobile devices.',
    features: [
      { title: 'Job Recommendation System', desc: 'Suggests relevant job openings based on the candidate\'s selected field of interest during registration.', image: feature01 },
      { title: 'Job Search', desc: 'Allows users to search for jobs using filters such as location, department, and job type.', image: jobSearch02 },
      { title: 'Resume Upload', desc: 'Applicants can upload their own resumes directly through the system for faster processing.', image: uploadResume },
      { title: 'NPS Feedback Feature', desc: 'Allows applicants to rate their application experience using a Net Promoter Score (NPS), helping the company collect valuable feedback for future improvements.', image: npsFeedback },
      { title: 'Application Step Tracker', desc: 'Collects user information step by step to reduce friction and minimize overwhelm throughout the application process.', image: appStepTracker },
      { title: 'Application Status Tracking', desc: 'Let candidates track the real-time status of their application after submission, such as "Under Review," "Interview Scheduled," or "Accepted."', image: historyTracker },
    ],
    process: [
      {
        phase: '01',
        title: 'Landing Page Design',
        desc: 'Created a clean and accessible landing page that clearly displays open job positions and application instructions.',
      },
      {
        phase: '02',
        title: 'Multi-Step Application',
        desc: 'Replaced a 22-page Google Form with a multi-step application process, making it less overwhelming for users.',
      },
      {
        phase: '03',
        title: 'Progressive Form',
        desc: 'Designed a progressive form that collects essential information upfront, then requests additional documents only from qualified applicants.',
      },
      {
        phase: '04',
        title: 'Responsive Design',
        desc: 'Ensured the design is responsive across all major devices, improving accessibility and usability.',
      },
    ],
    outcomes: [
      { metric: '22-page', label: 'Google Form Replaced' },
      { metric: '6', label: 'Features Designed' },
      { metric: '3', label: 'Platforms Supported' },
      { metric: 'Progressive', label: 'Data Collection Applied' },
    ],
    nextId: 'flexible-benefits',
  },
  'flexible-benefits': {
    id: 'flexible-benefits',
    title: 'Flexible Benefits Awareness Design Project',
    subtitle: 'Enhancing employee understanding of organizational benefits through design',
    tags: ['UX/UI Design', 'Usability Testing', 'Intern Project'],
    role: 'UX/UI Design Intern',
    timeline: 'May 2024 – Feb 2025',
    tools: ['Figma', 'Google Forms', 'FigJam', 'Power BI'],
    platform: 'Mobile',
    image: PROJECT_IMG_FLEXIBLE,
    overview:
      'This project focused on developing a comprehensive solution for increasing awareness of flexible benefits within an organization. As a UX/UI designer, I led the research, ideation, and design phases to create an engaging platform that informs employees about their benefits and how to utilize them effectively.',
    problem:
      'Employees are unaware of how to access or use their benefit options. The previous system lacked flexibility and failed to encourage employee engagement. There was no centralized or clear communication channel for benefit-related information, and no data was available to track usage or user behavior.',
    solution: [
      'View and join company activities.',
      'Collect and track points.',
      'Redeem benefits that suit their needs.',
      'View transaction history and activity updates.',
    ],
    process: [
      {
        phase: '01',
        title: 'View & Join Activities',
        desc: 'Designed a mobile interface that allows employees to browse and join company activities with ease.',
      },
      {
        phase: '02',
        title: 'Collect & Track Points',
        desc: 'Built a points system UI that lets employees collect and track accumulated points from participating in activities.',
      },
      {
        phase: '03',
        title: 'Redeem Benefits',
        desc: 'Designed a benefit redemption flow where employees can choose rewards that best suit their personal needs.',
      },
      {
        phase: '04',
        title: 'History & Updates',
        desc: 'Created a transaction history and activity update section so employees can monitor their benefit usage over time.',
      },
    ],
    outcomes: [
      { metric: '94.12%', label: 'Task Success Rate' },
      { metric: '17', label: 'Participants' },
      { metric: '69', label: 'SUS Score (Good)' },
      { metric: '1:38', label: 'Avg. Completion Time' },
    ],
    usabilityTesting: {
      content: 'To validate the effectiveness and user-friendliness of the flexible benefits application, usability testing was conducted with 17 participants. The goal was to observe real user interactions and gather measurable insights before moving forward.',
      images: [
        {
          src: avgCompletionTime,
          label: 'Average Completion Time',
          desc: 'The average time it took for participants to complete the task — from opening the prototype to successfully submitting a benefit request — was 1 minute and 38 seconds. This serves as a baseline for future redesigns, helping to measure improvement over time.',
        },
        {
          src: taskSuccessRate,
          label: 'Task Success Rate',
          desc: 'Out of 17 participants, 16 completed the task successfully, resulting in a 94.12% success rate. This indicates that the UI was intuitive and guided users effectively through the process.',
        },
        {
          src: susScore,
          label: 'SUS (System Usability Scale) Score',
          desc: 'The average SUS score from all participants was 69, which is considered "Good" on the usability scale. While not perfect, this suggests the UI is effective and provides a strong foundation for further enhancement.',
        },
      ],
    },
    uiDesign: {
      paragraphs: [
        'The redesigned UI follows a clean and modern aesthetic in line with the company\'s branding. Key flows such as benefit claiming and onboarding were simplified to enhance clarity and reduce friction.',
        'A clickable Figma prototype was created to demonstrate how users could browse, select, and submit benefits seamlessly.',
      ],
      slides: [uiDesign1, uiDesign2, uiDesign3, uiDesign4, uiDesign5, uiDesign6, uiDesign7, uiDesign8, uiDesign9, uiDesign10],
    },
    mockupSection: {
      content: 'After analyzing the data and defining the user personas, I began the visual design phase by sketching the mobile interface to ensure clarity and accessibility.',
      image: wireframeImg,
    },
    personas: [
      {
        title: 'Recent Graduate',
        desc: 'Early in their career, this group is motivated by opportunities for self-development and career growth. They are tech-savvy, eager to explore new features, and often value benefits related to learning, wellness, and networking.',
        image: persona1,
      },
      {
        title: 'Mid-Career with Family',
        desc: 'This group prioritizes work-life balance and benefits that support their family\'s well-being, such as healthcare, flexible hours, and education support. Their decision-making is practical, and they tend to favor features that save time.',
        image: persona2,
      },
      {
        title: 'Near Retirement',
        desc: 'Experienced employees approaching retirement often value security, medical coverage, and clarity in processes. They may not adapt to new technology as quickly, so accessibility and simplicity in UI design are crucial.',
        image: persona3,
      },
    ],
    uxProcess: {
      content: 'Next, I created user personas based on assumed employee demographics. I analyzed internal organizational data by:',
      bullets: [
        'Separating by gender',
        'Segmenting by generation (e.g. Gen Z, Millennials, Gen X)',
        'Reviewing the top 5 most-participated activities from the previous year',
      ],
      afterText: 'After identifying patterns and preferences, I mapped out a user workflow for the future system and created an Information Architecture Flow to structure the application\'s core features and navigation logic.',
      workflowImg: workflowImg,
      flowImg: flowFlexible,
    },
    goals: [
      {
        number: 'GOAL 1',
        desc: 'Measure the average time users take to complete essential tasks during usability testing.',
        objective: 'Use the time data as a baseline for future redesigns and performance comparison, ensuring continuous improvement in usability.',
      },
      {
        number: 'GOAL 2',
        desc: 'Measure the percentage of users who can complete tasks without assistance.',
        objective: 'Achieve at least a 80% success rate across test participants.',
      },
      {
        number: 'GOAL 3',
        desc: 'Evaluate overall user satisfaction with a standard SUS questionnaire.',
        objective: 'Score 65 or higher, which indicates "Good Usability".',
      },
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
    image: weddingBanner,
    overview:
      'This project was a freelance opportunity focused on improving the customer experience in selecting wedding decoration items. It was designed for a wedding organizer team that wanted to enhance how clients interact with and communicate their preferences.',
    problem:
      'Customers often struggled to remember or communicate the specific items they had selected to different departments (e.g., florist, lighting team, stage setup). There was no clear system to review or share their chosen decorations after the initial selection.',
    solution: [
      'Browse & select wedding items',
      'View a shareable summary page',
    ],
    process: [
      {
        phase: '01',
        title: 'Browse & Select Items',
        desc: 'Designed a web-based interface that allowed clients to browse and select wedding items such as flowers, stages, props, and lighting with ease.',
      },
      {
        phase: '02',
        title: 'Summary Page',
        desc: 'After making selections, clients can view a summary page that lists all their chosen items, making it easy to review everything in one place.',
      },
      {
        phase: '03',
        title: 'Save & Share',
        desc: 'The summary could be saved or shared with relevant departments, making the planning process smoother and reducing miscommunication between teams.',
      },
    ],
    popularVote: {
      content: 'The project received a Popular Vote award from R2i (Routine to Innovation) competition, reflecting its user-friendly concept and visual appeal. With further development, it has the potential to be used as a real internal tool to help streamline the wedding planning process for clients and staff.',
      image: rewardImg,
    },
    uiDesignWedding: {
      content: 'The interface was designed with a romantic, soft tone to match the wedding theme. Using the Sukhumvit font and carefully selected color palettes, the layout ensures clarity, elegance, and a seamless experience for users selecting wedding packages.',
      slides: [uiWedding1, uiWedding2, uiWedding3, uiWedding4, uiWedding5, uiWedding6, uiWedding7],
    },
    wireframes: {
      intro: 'Before jumping into the visual design, I created low-fidelity wireframes to define the layout, content structure, and user flow of the wedding platform. The wireframes were essential for:',
      bullets: [
        'Mapping the user journey from the landing page to the final document generation',
        'Main page',
        'Package selection',
        'Wedding design customization',
        'Design detail preview',
        'Summary of selected items',
        'Final PDF report',
      ],
      closing: 'The goal was to ensure usability and logical flow before investing time in high-fidelity mockups. Each screen was structured with clarity and simplicity in mind, allowing stakeholders to review and provide feedback quickly during the early development stages.',
      images: [wireframeWedding1, wireframeWedding2, wireframeWedding3],
    },
    designSystem: {
      intro: 'The visual identity of this wedding platform follows a soft, elegant aesthetic that aligns with the romantic tone of wedding planning.',
      subsections: [
        {
          title: 'Typography',
          content: 'The Sukhumvit font was chosen for its modern, clean appearance and excellent legibility in both large headers and smaller interface text. We used a structured type scale for clarity and hierarchy:',
          bullets: [
            'H1–H5 for prominent headings, ranging from 60px to 28px',
            'S1 & B1 for body content and UI labels',
            'Regular and bold styles were applied to balance readability and visual emphasis',
          ],
          image: typographyImg,
        },
        {
          title: 'Color & Material Design',
          content: 'The color system follows Material Design principles, ensuring consistent application of tones for accessibility and UI feedback.',
          bullets: [
            'Primary colors: Soft pastels in pink, peach, and burgundy for emotional warmth',
            'Secondary & Third colors: Used to differentiate sections and support interaction components',
            'Gradients and grayscale: Added depth and visual interest across cards, buttons, and backgrounds',
          ],
        },
      ],
      closing: 'Three distinct color palettes were explored to provide visual flexibility, and a final palette was selected that best represented the client\'s brand and the nature of the event. The result is a cohesive and emotionally engaging UI that elevates the digital wedding planning experience.',
    },
    outcomes: [
      { metric: '🏆', label: 'Popular Vote · R2i Competition' },
      { metric: '7', label: 'UI Screens Designed' },
      { metric: '6', label: 'Key User Flows' },
      { metric: '3', label: 'Color Palettes Explored' },
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
    image: bannerCasestudy,
    overview:
      '"Clean near U" is a food ordering application designed during a UX certification course, focusing on creating a smooth, user-centered experience to promote healthy eating and build customer loyalty. The goal was to make it easier for users to discover, customize, and order clean food from nearby restaurants.',
    empathize: {
      intro: 'Through desk research, I explored users\' behaviors and challenges in maintaining a healthy lifestyle. Key insights include:',
      bullets: [
        'A desire to improve eating habits',
        'Interest in health metrics like TDEE, BMR, and BMI',
        'Limited time for regular exercise',
        'Inconsistent hydration and sleep patterns',
        'Busy daily routines make healthy food choices difficult',
      ],
      closing: 'These findings shaped the foundation for designing a user-centered food ordering experience.',
    },
    goalText: 'Allowing groups who want to lose weight or be healthy to choose a variety of foods that are close at hand and clean.',
    problem: '',
    process: [
      {
        phase: '01',
        title: 'Empathize',
        desc: 'Researched the needs and behaviors of health-conscious users to understand what motivates them to eat clean and what barriers they face when searching for healthy food options nearby.',
      },
      {
        phase: '02',
        title: 'Define',
        desc: 'Synthesized research findings to clearly define the core problem: users lack a convenient, trustworthy way to find and order clean food near them that fits their dietary goals.',
      },
      {
        phase: '03',
        title: 'Ideate',
        desc: 'Brainstormed solutions focused on food discovery, customization, and loyalty — ultimately focusing on a simple browsing experience with filters for healthy categories and nearby restaurants.',
      },
      {
        phase: '04',
        title: 'Prototype',
        desc: 'Built interactive wireframes and high-fidelity screens in Figma, covering key flows: onboarding, food discovery, customization, ordering, and loyalty rewards.',
      },
      {
        phase: '05',
        title: 'Test',
        desc: 'Conducted usability testing with target users to validate the design decisions, gather feedback, and iterate on the interface to ensure a smooth and intuitive experience.',
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
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [personaSlide, setPersonaSlide] = useState(0)
  const [uiSlide, setUiSlide] = useState(0)
  const [wfSlide, setWfSlide] = useState(0)
  const [uiWeddingSlide, setUiWeddingSlide] = useState(0)

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
              {project.overviewImage && (
                <img
                  src={project.overviewImage}
                  alt="Project overview"
                  className="ov-overview-img"
                />
              )}
            </FadeUp>
          </div>

          {(project.problem || project.goalText) && <>
          <div className="ov-divider" />

          <div className="ov-two-col">
            <FadeUp className="ov-col-left">
              <p className="label-tag">{project.goalText ? 'GOAL' : 'CHALLENGE'}</p>
              <h2 className="ov-section-heading">{project.goalText ? 'Our Goal' : 'The Problem'}</h2>
            </FadeUp>
            <FadeUp delay={0.1} className="ov-col-right">
              <div className="ov-problem-card">
                <div className="ov-problem-quote">"</div>
                <p className="ov-body-large">{project.goalText ?? project.problem}</p>
              </div>
              {project.problemImage && (
                <img
                  src={project.problemImage}
                  alt="Problem illustration"
                  className="ov-overview-img"
                />
              )}
            </FadeUp>
          </div>
          </>}
        </div>
      </section>

      {/* ── GOALS ── */}
      {project.goals && (
        <section className="ov-section">
          <div className="ov-container">
            <FadeUp>
              <p className="label-tag">GOALS</p>
              <h2 className="ov-section-heading">Goals</h2>
              <p className="ov-body-large" style={{ marginTop: 12 }}>To validate the usability and effectiveness of the design using key UX metrics.</p>
            </FadeUp>
            <div className="ov-goals-grid">
              {project.goals.map((g, i) => (
                <FadeUp key={g.number} delay={i * 0.08} className="ov-goal-card">
                  <span className="ov-goal-num">{g.number}</span>
                  <p className="ov-goal-desc">{g.desc}</p>
                  <div className="ov-goal-objective">
                    <span className="ov-goal-obj-label">Objective</span>
                    <p className="ov-goal-obj-text">{g.objective}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROCESS ── */}
      <section className="ov-process-section">
        <div className="ov-container">
          <FadeUp>
            <p className="label-tag" style={{ color: '#FFDF9A' }}>{project.solution ? 'SOLUTION' : 'MY PROCESS'}</p>
            <h2 className="ov-section-heading" style={{ color: '#FAF9F4' }}>{project.solution ? 'How We Solved It' : 'How I approached it'}</h2>
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

      {/* ── EMPATHIZE ── */}
      {project.empathize && (
        <section className="ov-section">
          <div className="ov-container">
            <div className="ov-two-col">
              <FadeUp className="ov-col-left">
                <p className="label-tag">STEP 01</p>
                <h2 className="ov-section-heading">Empathize</h2>
              </FadeUp>
              <FadeUp delay={0.1} className="ov-col-right">
                <p className="ov-body-large">{project.empathize.intro}</p>
                <ul className="ov-ux-bullets" style={{ marginTop: 16 }}>
                  {project.empathize.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <p className="ov-body-large" style={{ marginTop: 24 }}>{project.empathize.closing}</p>
              </FadeUp>
            </div>
          </div>
        </section>
      )}

      {/* ── KEY FEATURES ── */}
      {project.features && (
        <section className="ov-section">
          <div className="ov-container">
            <FadeUp>
              <p className="label-tag">KEY FEATURES</p>
              <h2 className="ov-section-heading">Key Features I Designed</h2>
            </FadeUp>
            <div className="ov-features-grid">
              {project.features.map((f, i) => (
                <FadeUp key={f.title} delay={i * 0.06} className="ov-feature-card">
                  <span className="ov-feature-num">0{i + 1}</span>
                  <h3 className="ov-feature-title">{f.title}</h3>
                  <p className="ov-feature-desc">{f.desc}</p>
                  {f.image && (
                    <button className="ov-feature-btn" onClick={() => setLightboxImg(f.image!)}>
                      View Design
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 7H13M13 7L8 2M13 7L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LEARNINGS ── */}
      {project.learnings && (
        <section className="ov-section">
          <div className="ov-container">
            <div className="ov-two-col">
              <FadeUp className="ov-col-left">
                <p className="label-tag">REFLECTION</p>
                <h2 className="ov-section-heading">Learnings</h2>
              </FadeUp>
              <FadeUp delay={0.1} className="ov-col-right">
                <div className="ov-learnings-wrap">
                  {project.learnings.map((l, i) => (
                    <p key={i} className="ov-body-large">{l}</p>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </section>
      )}

      {/* ── RESULT ── */}
      {project.result && (
        <section className="ov-section">
          <div className="ov-container">
            <div className="ov-two-col">
              <FadeUp className="ov-col-left">
                <p className="label-tag">RESULT</p>
                <h2 className="ov-section-heading">The Outcome</h2>
              </FadeUp>
              <FadeUp delay={0.1} className="ov-col-right">
                <div className="ov-result-card">
                  <p className="ov-body-large">{project.result}</p>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>
      )}

      {/* ── UX PROCESS ── */}
      {project.uxProcess && (
        <section className="ov-section">
          <div className="ov-container">
            <div className="ov-two-col">
              <FadeUp className="ov-col-left">
                <p className="label-tag">STEP 01</p>
                <h2 className="ov-section-heading">UX Process</h2>
              </FadeUp>
              <FadeUp delay={0.1} className="ov-col-right">
                <p className="ov-body-large">{project.uxProcess.content}</p>
                <ul className="ov-ux-bullets">
                  {project.uxProcess.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
<p className="ov-body-large" style={{ marginTop: 24 }}>{project.uxProcess.afterText}</p>
              </FadeUp>
            </div>
            <FadeUp delay={0.15} className="ov-ux-images">
              <img src={project.uxProcess.workflowImg} alt="User Workflow" className="ov-ux-img" onClick={() => setLightboxImg(project.uxProcess!.workflowImg)} />
              <img src={project.uxProcess.flowImg} alt="Information Architecture Flow" className="ov-ux-img" onClick={() => setLightboxImg(project.uxProcess!.flowImg)} />
            </FadeUp>
          </div>
        </section>
      )}

      {/* ── PERSONAS ── */}
      {project.personas && (
        <section className="ov-section">
          <div className="ov-container">
            <FadeUp>
              <p className="label-tag">PERSONAS</p>
              <h2 className="ov-section-heading">Personas</h2>
              <p className="ov-body-large" style={{ marginTop: 12, maxWidth: 720 }}>
                To ensure the application met the needs of different employee segments, I developed three distinct user personas based on varying life stages and priorities:
              </p>
            </FadeUp>

            <FadeUp delay={0.1} className="ov-persona-wrap">
              {/* Slide image */}
              <div className="ov-persona-slide">
                <img
                  src={project.personas[personaSlide].image}
                  alt={project.personas[personaSlide].title}
                  className="ov-persona-img"
                  onClick={() => setLightboxImg(project.personas![personaSlide].image)}
                />
                {/* Prev / Next */}
                <button
                  className="ov-persona-arrow ov-persona-arrow--prev"
                  onClick={() => setPersonaSlide(i => (i - 1 + project.personas!.length) % project.personas!.length)}
                  aria-label="Previous persona"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  className="ov-persona-arrow ov-persona-arrow--next"
                  onClick={() => setPersonaSlide(i => (i + 1) % project.personas!.length)}
                  aria-label="Next persona"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {/* Dots */}
                <div className="ov-persona-dots">
                  {project.personas.map((_, i) => (
                    <button
                      key={i}
                      className={`ov-persona-dot${i === personaSlide ? ' active' : ''}`}
                      onClick={() => setPersonaSlide(i)}
                      aria-label={`Persona ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Text */}
              <div className="ov-persona-info">
                <span className="ov-persona-num">0{personaSlide + 1}</span>
                <h3 className="ov-persona-title">{project.personas[personaSlide].title}</h3>
                <p className="ov-body-large">{project.personas[personaSlide].desc}</p>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="ov-body-large" style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
                By designing for these three personas, I ensured the system would accommodate users with different motivations, digital habits, and benefit expectations.
              </p>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ── MOCKUP & WIREFRAME ── */}
      {project.mockupSection && (
        <section className="ov-section">
          <div className="ov-container">
            <FadeUp>
              <p className="label-tag">STEP 02</p>
              <h2 className="ov-section-heading">Mockup &amp; Wireframe</h2>
              <p className="ov-body-large" style={{ marginTop: 16, maxWidth: 720 }}>{project.mockupSection.content}</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <img
                src={project.mockupSection.image}
                alt="Wireframe"
                className="ov-full-img"
                onClick={() => setLightboxImg(project.mockupSection!.image)}
              />
            </FadeUp>
          </div>
        </section>
      )}

      {/* ── UI DESIGN & PROTOTYPE ── */}
      {project.uiDesign && (
        <section className="ov-section">
          <div className="ov-container">
            <FadeUp>
              <p className="label-tag">STEP 03</p>
              <h2 className="ov-section-heading">UI Design &amp; Prototype</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16, maxWidth: 720 }}>
                {project.uiDesign.paragraphs.map((p, i) => (
                  <p key={i} className="ov-body-large">{p}</p>
                ))}
              </div>
            </FadeUp>

            {project.uiDesign.slides && (
              <FadeUp delay={0.1} className="ov-ui-slider">
                {/* Main image */}
                <div className="ov-ui-slide-main">
                  <img
                    src={project.uiDesign.slides[uiSlide]}
                    alt={`UI Design ${uiSlide + 1}`}
                    className="ov-ui-slide-img"
                    onClick={() => setLightboxImg(project.uiDesign!.slides[uiSlide])}
                  />
                  <button
                    className="ov-persona-arrow ov-persona-arrow--prev"
                    onClick={() => setUiSlide(i => (i - 1 + project.uiDesign!.slides.length) % project.uiDesign!.slides.length)}
                    aria-label="Previous"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button
                    className="ov-persona-arrow ov-persona-arrow--next"
                    onClick={() => setUiSlide(i => (i + 1) % project.uiDesign!.slides.length)}
                    aria-label="Next"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <div className="ov-ui-slide-counter">{uiSlide + 1} / {project.uiDesign.slides.length}</div>
                </div>

                {/* Thumbnail strip */}
                <div className="ov-ui-thumbs">
                  {project.uiDesign.slides.map((src, i) => (
                    <button
                      key={i}
                      className={`ov-ui-thumb${i === uiSlide ? ' active' : ''}`}
                      onClick={() => setUiSlide(i)}
                    >
                      <img src={src} alt={`UI ${i + 1}`} />
                    </button>
                  ))}
                </div>
              </FadeUp>
            )}
          </div>
        </section>
      )}

      {/* ── USABILITY TESTING ── */}
      {project.usabilityTesting && (
        <section className="ov-section">
          <div className="ov-container">
            <FadeUp>
              <p className="label-tag">STEP 04</p>
              <h2 className="ov-section-heading">Usability Testing</h2>
              <p className="ov-body-large" style={{ marginTop: 16, maxWidth: 720 }}>{project.usabilityTesting.content}</p>
            </FadeUp>
            <div className="ov-ut-grid">
              {project.usabilityTesting.images.map((img, i) => (
                <FadeUp key={img.label} delay={i * 0.08} className="ov-ut-card">
                  <img src={img.src} alt={img.label} className="ov-ut-img" onClick={() => setLightboxImg(img.src)} />
                  <span className="ov-ut-label">{img.label}</span>
                  <p className="ov-ut-desc">{img.desc}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DESIGN SYSTEM ── */}
      {project.designSystem && (
        <section className="ov-section">
          <div className="ov-container">
            <FadeUp>
              <p className="label-tag">DESIGN SYSTEM</p>
              <h2 className="ov-section-heading">Design System</h2>
              <p className="ov-body-large" style={{ marginTop: 16, maxWidth: 720 }}>{project.designSystem.intro}</p>
            </FadeUp>
            <div className="ov-ds-grid">
              {project.designSystem.subsections.map((sub, i) => (
                <FadeUp key={sub.title} delay={i * 0.08} className="ov-ds-card">
                  <h3 className="ov-ds-title">{sub.title}</h3>
                  <p className="ov-ds-content">{sub.content}</p>
                  {sub.bullets && (
                    <ul className="ov-ds-bullets">
                      {sub.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  )}
                </FadeUp>
              ))}
            </div>
            {project.designSystem.subsections.some(s => s.image) && (
              <FadeUp delay={0.1}>
                {project.designSystem.subsections.filter(s => s.image).map(s => (
                  <img
                    key={s.title}
                    src={s.image}
                    alt={s.title}
                    className="ov-full-img"
                    onClick={() => setLightboxImg(s.image!)}
                  />
                ))}
              </FadeUp>
            )}
            <FadeUp delay={0.15}>
              <p className="ov-body-large" style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
                {project.designSystem.closing}
              </p>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ── WIREFRAMES ── */}
      {project.wireframes && (
        <section className="ov-section">
          <div className="ov-container">
            <div className="ov-two-col">
              <FadeUp className="ov-col-left">
                <p className="label-tag">WIREFRAMES</p>
                <h2 className="ov-section-heading">Wireframes</h2>
              </FadeUp>
              <FadeUp delay={0.1} className="ov-col-right">
                <p className="ov-body-large">{project.wireframes.intro}</p>
                <ul className="ov-ux-bullets" style={{ marginTop: 16 }}>
                  {project.wireframes.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <p className="ov-body-large" style={{ marginTop: 24 }}>{project.wireframes.closing}</p>
              </FadeUp>
            </div>
            <FadeUp delay={0.1} className="ov-ui-slider">
              <div className="ov-ui-slide-main">
                <img
                  src={project.wireframes.images[wfSlide]}
                  alt={`Wireframe ${wfSlide + 1}`}
                  className="ov-ui-slide-img"
                  onClick={() => setLightboxImg(project.wireframes!.images[wfSlide])}
                />
                <button
                  className="ov-persona-arrow ov-persona-arrow--prev"
                  onClick={() => setWfSlide(i => (i - 1 + project.wireframes!.images.length) % project.wireframes!.images.length)}
                  aria-label="Previous"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  className="ov-persona-arrow ov-persona-arrow--next"
                  onClick={() => setWfSlide(i => (i + 1) % project.wireframes!.images.length)}
                  aria-label="Next"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className="ov-ui-slide-counter">{wfSlide + 1} / {project.wireframes.images.length}</div>
              </div>
              <div className="ov-ui-thumbs">
                {project.wireframes.images.map((src, i) => (
                  <button key={i} className={`ov-ui-thumb${i === wfSlide ? ' active' : ''}`} onClick={() => setWfSlide(i)}>
                    <img src={src} alt={`Wireframe ${i + 1}`} />
                  </button>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ── UI DESIGN WEDDING ── */}
      {project.uiDesignWedding && (
        <section className="ov-section">
          <div className="ov-container">
            <FadeUp>
              <p className="label-tag">UI DESIGN</p>
              <h2 className="ov-section-heading">UI Design</h2>
              <p className="ov-body-large" style={{ marginTop: 16, maxWidth: 720 }}>{project.uiDesignWedding.content}</p>
            </FadeUp>
            <FadeUp delay={0.1} className="ov-ui-slider">
              <div className="ov-ui-slide-main">
                <img
                  src={project.uiDesignWedding.slides[uiWeddingSlide]}
                  alt={`UI Design ${uiWeddingSlide + 1}`}
                  className="ov-ui-slide-img"
                  onClick={() => setLightboxImg(project.uiDesignWedding!.slides[uiWeddingSlide])}
                />
                <button
                  className="ov-persona-arrow ov-persona-arrow--prev"
                  onClick={() => setUiWeddingSlide(i => (i - 1 + project.uiDesignWedding!.slides.length) % project.uiDesignWedding!.slides.length)}
                  aria-label="Previous"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  className="ov-persona-arrow ov-persona-arrow--next"
                  onClick={() => setUiWeddingSlide(i => (i + 1) % project.uiDesignWedding!.slides.length)}
                  aria-label="Next"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <div className="ov-ui-slide-counter">{uiWeddingSlide + 1} / {project.uiDesignWedding.slides.length}</div>
              </div>
              <div className="ov-ui-thumbs">
                {project.uiDesignWedding.slides.map((src, i) => (
                  <button key={i} className={`ov-ui-thumb${i === uiWeddingSlide ? ' active' : ''}`} onClick={() => setUiWeddingSlide(i)}>
                    <img src={src} alt={`UI ${i + 1}`} />
                  </button>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ── POPULAR VOTE ── */}
      {project.popularVote && (
        <section className="ov-section">
          <div className="ov-container">
            <div className="ov-two-col">
              <FadeUp className="ov-col-left">
                <p className="label-tag">AWARD</p>
                <h2 className="ov-section-heading">Popular Vote</h2>
              </FadeUp>
              <FadeUp delay={0.1} className="ov-col-right">
                <p className="ov-body-large">{project.popularVote.content}</p>
              </FadeUp>
            </div>
            <FadeUp delay={0.15}>
              <img
                src={project.popularVote.image}
                alt="Popular Vote Award"
                className="ov-full-img"
                onClick={() => setLightboxImg(project.popularVote!.image)}
              />
            </FadeUp>
          </div>
        </section>
      )}

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

      {/* ── STORYBOOK LINK ── */}
      {project.storybookUrl && (
        <section className="ov-section">
          <div className="ov-container">
            <FadeUp>
              <div className="ov-storybook-card">
                <div className="ov-storybook-left">
                  <p className="label-tag">DESIGN SYSTEM</p>
                  <h2 className="ov-section-heading" style={{ marginBottom: 8 }}>Explore the Component Library</h2>
                  <p className="ov-body-large" style={{ marginBottom: 24 }}>
                    Browse all 22+ components, design tokens, icons, and assets — documented and interactive on Storybook.
                  </p>
                  <a href={project.storybookUrl} target="_blank" rel="noopener noreferrer" className="ov-storybook-btn">
                    View Storybook
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                      <path d="M1 6H15M15 6L10 1M15 6L10 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
                <div className="ov-storybook-badge">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="12" fill="#FF4785"/>
                    <path d="M27.5 8.5H13C11.067 8.5 9.5 10.067 9.5 12V28C9.5 29.933 11.067 31.5 13 31.5H27C28.933 31.5 30.5 29.933 30.5 28V12.5L27.5 8.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M27.5 8.5V12.5H30.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 18.5H25M15 22.5H22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span className="ov-storybook-label">Storybook</span>
                  <span className="ov-storybook-url">hr-design-system.vercel.app</span>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

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
      {/* ── LIGHTBOX ── */}
      {lightboxImg && (
        <div className="ov-lightbox" onClick={() => setLightboxImg(null)}>
          <button className="ov-lightbox-close" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 2L18 18M18 2L2 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <img
            src={lightboxImg}
            alt="Feature design"
            className="ov-lightbox-img"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
