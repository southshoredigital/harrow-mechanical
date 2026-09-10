/**
 * Harrow Mechanical — design tokens
 *
 * The single source of truth for every design value on this site.
 * A literal hex code or px value anywhere in a component is a bug.
 * If a value you need is missing, add it here first.
 *
 * Derived from docs/art-direction.md. Do not change a value here
 * without changing the art direction document to match.
 */

export const color = {
  ink: '#141413',
  paper: '#F5F3EE',
  steel: '#6E6E68',
  mist: '#DDDAD1',
  signal: '#E2521B',

  // Semantic aliases. Components use these, never the raw names above.
  text: {
    primary: '#141413',
    secondary: '#6E6E68',
    inverse: '#F5F3EE',
    accent: '#E2521B',
  },
  surface: {
    page: '#F5F3EE',
    inverse: '#141413',
    subtle: '#EDEAE3',
  },
  border: {
    hairline: '#DDDAD1',
    strong: '#6E6E68',
    accent: '#E2521B',
  },
} as const

/**
 * Signal budget: at most three occurrences per viewport.
 * If a fourth is needed, something else must lose it.
 */
export const signalBudgetPerViewport = 3

export const font = {
  display: 'var(--font-cabinet-grotesk)',
  body: 'var(--font-switzer)',
  mono: 'var(--font-jetbrains-mono)',
} as const

/**
 * 1.25 ratio from a 16px base.
 * `hero` is used exactly twice on the entire site:
 * the founding year and the project count. Nowhere else.
 */
export const fontSize = {
  xs: '0.8rem',
  sm: '1rem',
  base: '1.125rem',
  md: '1.25rem',
  lg: '1.563rem',
  xl: '1.953rem',
  '2xl': '2.441rem',
  '3xl': '3.052rem',
  '4xl': '3.815rem',
  hero: '7.451rem',
} as const

export const fontWeight = {
  regular: 400,
  medium: 500,
  bold: 700,
} as const

export const lineHeight = {
  tight: 1.05,
  heading: 1.15,
  body: 1.6,
  data: 1.3,
} as const

export const letterSpacing = {
  display: '-0.02em',
  body: '0',
  mono: '0.02em',
  label: '0.08em',
} as const

/** Body copy caps at 68 characters. */
export const measure = '68ch'

/** Base unit 4px. Section spacing is generous, inline spacing is tight. */
export const space = {
  px: '1px',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
  24: '6rem',
  32: '8rem',
  48: '12rem',
} as const

export const sectionSpacing = {
  compact: space[16],
  default: space[24],
  generous: space[48],
} as const

/** Zero. Everywhere. This is not negotiable and has no exceptions. */
export const radius = '0'

/** Hairline rules only. No shadows, no elevation, at any level. */
export const border = {
  hairline: `1px solid ${color.border.hairline}`,
  strong: `1px solid ${color.border.strong}`,
  accent: `1px solid ${color.border.accent}`,
} as const

export const shadow = {} as const

/**
 * Motion: things plot, they do not fade.
 * Reveals are clip-path or mask wipes, left to right.
 * `plotter` starts fast and settles slowly, like a plotter head.
 */
export const motion = {
  duration: {
    instant: 0,
    reveal: 700,
    revealSlow: 900,
  },
  ease: {
    plotter: 'cubic-bezier(0.16, 1, 0.3, 1)',
    linear: 'linear',
  },
  stagger: 80,
  hover: 0,
} as const

/**
 * The specification rail. Fixed left column on desktop,
 * sticky single-line strip on mobile.
 */
export const rail = {
  width: '13rem',
  widthWide: '16rem',
  mobileHeight: '2.75rem',
} as const

export const breakpoint = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
} as const

export const layout = {
  maxWidth: '90rem',
  gutter: space[6],
  gutterWide: space[12],
  gridColumns: 12,
} as const

/**
 * Riser schematic — the memorable moment.
 * Scroll-linked, not time-linked. Renders complete and static
 * under prefers-reduced-motion.
 */
export const schematic = {
  strokeWidth: 1.5,
  strokeWidthActive: 2.5,
  strokeInactive: color.steel,
  strokeActive: color.signal,
  labelDelay: 120,
} as const
