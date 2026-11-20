/**
 * The collection on /projects (Figma: Projects v2 / Desktop, 441:2696), newest first,
 * in the order the works hang on the wall. Case studies live in src/pages/Overview.tsx.
 */
import imgHrSystem from '../assets/project-banner.webp'
import imgImpactWedding from '../assets/12.webp'
import imgFlexibleBenefits from '../assets/flexible-benefit.webp'
import imgImpactHireHub from '../assets/banner-impact.webp'
import imgCleanNearU from '../assets/banner-casestudy.webp'

export type Work = {
  no: string             // wall label number, "01"
  title: string
  year: string           // "2026", "2025 to present"
  role: string
  tools: string
  /** Case study id (/projects/:id). null = "Under restoration": covered, not a link. */
  caseStudyId: string | null
  /** Artwork shown in the frame; null shows the neutral placeholder. */
  image: string | null
}

export const WORKS: Work[] = [
  { no: '01', title: 'Grant Management System', year: '2026', role: 'Design Technologist', tools: 'Figma, Angular, PrimeNG', caseStudyId: null, image: null },
  { no: '02', title: 'Student Activity System', year: '2026', role: 'Full-Stack Designer', tools: 'Figma, React', caseStudyId: null, image: null },
  { no: '03', title: 'HR System', year: '2025 to present', role: 'Junior UX/UI Designer', tools: 'Figma, Angular, PrimeNG', caseStudyId: 'hr-system', image: imgHrSystem },
  { no: '04', title: 'IMPACT Wedding', year: '2024', role: 'UX/UI Intern', tools: 'Figma', caseStudyId: 'impact-wedding', image: imgImpactWedding },
  { no: '05', title: 'Flexible Benefits Awareness', year: '2024', role: 'UX/UI Design Intern', tools: 'Figma, Usability testing', caseStudyId: 'flexible-benefits', image: imgFlexibleBenefits },
  { no: '06', title: 'IMPACT Hire Hub', year: '2024', role: 'UX/UI Design Intern', tools: 'Figma, Usability testing', caseStudyId: 'impact-hire-hub', image: imgImpactHireHub },
  { no: '07', title: 'Clean near U', year: '2023', role: 'UX/UI Designer', tools: 'Figma, Prototyping', caseStudyId: 'clean-near-u', image: imgCleanNearU },
]

/**
 * The feature portrait in the header. Set to the imported mona-sakdidet.webp once the file
 * exists (src/assets/gallery/mona-sakdidet.webp); null shows a neutral placeholder.
 */
export const FEATURE_PORTRAIT: { src: string | null; alt: string } = {
  src: null,
  alt: "Mona Lisa parody with Sakdidet's face",
}
