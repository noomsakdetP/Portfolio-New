/**
 * Skill cards. Figma: Home v2 / Desktop › Skills (card decks).
 * `slug` matches the fresco illustration in src/assets/skills/<slug>.webp.
 */
export type Skill = { slug: string; title: string; desc: string }

export const HARD_SKILLS: Skill[] = [
  { slug: 'design-thinking', title: 'Design Thinking', desc: 'Visual hierarchy, typography, and user flow optimization.' },
  { slug: 'wireframe-prototype', title: 'Wireframe / Prototype', desc: 'Low to high-fidelity interactive prototypes for user testing.' },
  { slug: 'responsive-design', title: 'Responsive Design', desc: 'Fluid layouts that adapt seamlessly across all device sizes.' },
  { slug: 'design-system', title: 'Design System', desc: 'Scalable component libraries and documentation for consistency.' },
  { slug: 'figma-advance', title: 'Figma Advance', desc: 'Master of components, variables, and advanced prototyping.' },
  { slug: 'design-tokens', title: 'Design Tokens', desc: 'Token architecture from primitive to semantic, CSS custom properties, and Figma Variables.' },
  { slug: 'data-driven-ux', title: 'Data-Driven UX', desc: 'User behavior analysis with Google Analytics and Hotjar to inform design decisions.' },
  { slug: 'handoff-dev-collaboration', title: 'Handoff & Dev Collaboration', desc: 'Structured handoffs with Figma specs, Storybook, and dev-ready documentation.' },
]

export const SOFT_SKILLS: Skill[] = [
  { slug: 'critical-thinking', title: 'Critical Thinking', desc: 'Analyzing complex problems to find efficient design solutions.' },
  { slug: 'teamwork', title: 'Teamwork', desc: 'Collaborating effectively with cross-functional teams to achieve shared goals.' },
  { slug: 'calm-mindset', title: 'Calm Mindset', desc: 'Maintaining focus and composure in high-pressure environments.' },
  { slug: 'open-feedback', title: 'Open Feedback', desc: 'Actively seeking and incorporating constructive feedback to improve design quality.' },
  { slug: 'empathy', title: 'Empathy', desc: 'Understanding user needs and emotions to create meaningful experiences.' },
  { slug: 'problem-solving', title: 'Problem-Solving', desc: 'Translating complex requirements into clear, user-centered design solutions.' },
]
