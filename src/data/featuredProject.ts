/**
 * The one featured project on Home. Figma: Home v2 / Desktop › My Project (single).
 * The full list lives on /projects (src/pages/Detail.tsx).
 */
import projectBanner from '../assets/project-banner.webp'

export type FeaturedProject = {
  caseStudyId: string        // /projects/:id
  title: string
  tags: string
  image: { src: string; width: number; height: number } | null   // null → Figma "IMAGE SLOT"
  strategy: string
  results: string
}

export const FEATURED_PROJECT: FeaturedProject = {
  caseStudyId: 'hr-system',
  title: 'HR Design System',
  tags: 'FIGMA, ANGULAR',
  // The image Figma's slot names (src/assets/project-banner.png, as WebP). It's 1895 × 906,
  // much wider than the 731 × 600 slot, so object-fit: cover crops the sides.
  image: { src: projectBanner, width: 1895, height: 906 },
  strategy: 'Building a unified Design System to standardize UI across the HR platform, from design tokens in Figma to production-ready components in Angular.',
  // TODO(content): Figma repeats the Strategy text here; write the real Results copy.
  results: 'Building a unified Design System to standardize UI across the HR platform, from design tokens in Figma to production-ready components in Angular.',
}
