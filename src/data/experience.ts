/**
 * Work Experience content. Figma: Home v2 / Desktop › Experience (364:2659).
 * Strings are English source text; Thai lives in src/i18n/th.ts under the same keys.
 */
export type Job = {
  period: string
  company: [string, string]   // two lines, as in Figma
  role: string
  /** a paragraph, or a list of lines */
  body: string | string[]
  current?: boolean           // double-ring dot (Figma: "Current = active job")
}

export const JOBS: Job[] = [
  {
    period: '2025 - Present',
    company: ['Advance Research', 'Group (ARSoft)'],
    role: 'Junior UX/UI Designer',
    body: 'Designing UI/UX and building a Design System for the HR internal platform, from Figma tokens to Angular component library.',
    current: true,
  },
  {
    period: 'May 2024 - Feb 2025',
    company: ['IMPACT EXHIBITION', 'MANAGEMENT CO.,LTD'],
    role: 'Skills gained',
    body: [
      'Delivered 2 projects: IMPACT Hire Hub and Flexible Benefit platform.',
      'Design System Beginner, Prototyping',
      'Design for 3 Devices (Tablet, Mobile and Desktop)',
      'Usability Testing',
    ],
  },
]

export type ResponsibleProject = { emoji: string; title: string; desc: string }

export const RESPONSIBLE_PROJECTS: ResponsibleProject[] = [
  {
    // 🏗 without U+FE0F: that selector forces colour emoji; Figma uses mono Noto Emoji
    emoji: '\u{1F3D7}',
    title: 'Design System for HR System and UX/UI Design',
    desc: 'Built a full Design System with tokens, components, and Storybook documentation for an HR platform.',
  },
  {
    emoji: '🔬',
    title: 'Support Design in SWU Research & SWU HUB',
    // TODO(content): Figma repeats the first card's description here; write the SWU one
    desc: 'Built a full Design System with tokens, components, and Storybook documentation for an HR platform.',
  },
  {
    emoji: '🚔',
    title: 'Do project SMART POLICE',
    desc: 'Designed wireframes, interactive prototype, and a foundational Design System for a police management platform (Desktop).',
  },
]
