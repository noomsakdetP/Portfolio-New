/**
 * Impact stats ("What the Design System changed"), Figma: Home v2 / Desktop › Results.
 * Swap the real values in here; nothing else needs to change.
 *
 * `value` is shown as written. If it starts with a number ("22+", "35%", "1,200"),
 * it counts up from 0 when the yarn reaches its knot; placeholders like "XX%" are
 * shown as-is.
 */
export type ImpactStat = { value: string; label: string; desc: string }

export const IMPACT_STATS: ImpactStat[] = [
  // TODO(content): real figure, e.g. "% less dev rework" or hours saved per sprint
  { value: 'XX%', label: 'Less dev rework', desc: 'Fewer UI fix rounds after handoff' },
  // TODO(content): confirm the count (Figma: "22+ components is from the HR case study")
  { value: '22+', label: 'Components', desc: 'Built in Figma and Angular, documented in Storybook' },
  // TODO(content): real number of design tokens
  { value: 'XXX', label: 'Design tokens', desc: 'Primitive to semantic: color, spacing, type' },
  // TODO(content): real number of devs & PMs
  { value: 'X+', label: 'Devs & PMs', desc: 'People I shipped the system with' },
]

/** Avatars under "Devs & PMs". `tone` picks the Figma fill. */
export type ImpactAvatar = { initial: string; name?: string; tone: 'inverse' | 'madder' | 'raised' | 'ochre' | 'stone' }

// TODO(content): placeholder initials from Figma; use real initials (or photos) and names
export const IMPACT_TEAM: ImpactAvatar[] = [
  { initial: 'D', tone: 'inverse' },
  { initial: 'D', tone: 'madder' },
  { initial: 'D', tone: 'raised' },
  { initial: 'P', tone: 'ochre' },
  { initial: '+', tone: 'stone' },
]
