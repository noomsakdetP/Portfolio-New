/**
 * The collection on /projects (Figma: Projects v2 / Desktop, 441:2696), newest first,
 * in the order the works hang on the wall. Case studies live in src/pages/Overview.tsx.
 */
import imgHrSystem from '../assets/project-banner.webp'
import imgImpactWedding from '../assets/12.webp'
import imgFlexibleBenefits from '../assets/flexible-benefit.webp'
import imgImpactHireHub from '../assets/banner-impact.webp'
import imgCleanNearU from '../assets/banner-casestudy.webp'
import imgMonaSakdidet from '../assets/gallery/mona-sakdidet.webp'

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
 * The case study that follows `id` in the "Next project" card: the next open work in wall
 * order (newest first), skipping "Under restoration" works, wrapping around after the last.
 * Uncovering a work (giving it a caseStudyId) adds it to the chain automatically.
 * Returns null when `id` isn't an open work.
 */
export function nextCaseStudyId(id: string): string | null {
  const open = WORKS.flatMap((w) => (w.caseStudyId ? [w.caseStudyId] : []))
  const i = open.indexOf(id)
  return i < 0 ? null : open[(i + 1) % open.length]
}

/** The feature portrait in the header (null would show a neutral placeholder). */
export const FEATURE_PORTRAIT: { src: string | null; alt: string } = {
  src: imgMonaSakdidet,
  alt: "Mona Lisa parody with Sakdidet's face",
}
