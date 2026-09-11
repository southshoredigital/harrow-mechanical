/**
 * Harrow Mechanical, design tokens
 *
 * The single source of truth for every design value on this site.
 * A literal hex code or px value anywhere in a component is a bug.
 * If a value you need is missing, add it here first.
 *
 * Derived from docs/art-direction.md. Do not change a value here
 * without changing the art direction document to match.
 */

/**
 * The palette. Five values, and nothing else may be introduced.
 *
 * `steel` clears 5:1 against paper. It is the floor for secondary text and
 * it was chosen for a phone screen in direct sun, not for the WCAG minimum.
 */
const palette = {
  ink: '#141413',
  paper: '#F5F3EE',
  steel: '#666660',
  mist: '#DDDAD1',
  signal: '#E2521B',
  subtle: '#EDEAE3',
  error: '#9B2C15',
} as const

export const color = {
  ink: palette.ink,
  paper: palette.paper,
  steel: palette.steel,
  mist: palette.mist,
  signal: palette.signal,

  // Semantic aliases. Components use these, never the raw names above.
  // They point at the palette rather than repeating a hex, so a palette
  // change cannot leave a stale copy behind.
  text: {
    primary: palette.ink,
    secondary: palette.steel,
    inverse: palette.paper,
    accent: palette.signal,
  },
  surface: {
    page: palette.paper,
    inverse: palette.ink,
    subtle: palette.subtle,
  },
  border: {
    hairline: palette.mist,
    strong: palette.steel,
    accent: palette.signal,
  },
  /**
   * Form validation and destructive actions only. 6.85:1 on paper.
   * Never used decoratively: it is not a second accent.
   */
  status: {
    error: palette.error,
  },
} as const

/**
 * Signal budget: at most three occurrences per viewport.
 * If a fourth is needed, something else must lose it.
 *
 * Signal is 3.47:1 on paper, which is AA for large text only. It is for
 * headings, rules and active states. It never sets body copy.
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

/**
 * The leading each size carries by default, emitted as
 * `--text-<size>--line-height` so a Tailwind `text-*` utility brings its own
 * leading and cannot silently fall back to a framework default.
 *
 * The pairing follows what each size is for: the small sizes are labels and
 * data, the middle sizes are read in paragraphs, the large sizes are set as
 * headings and the display sizes are set tight enough to read as a mark.
 *
 * Typed against fontSize, so adding a size without a leading fails the build.
 * Override with an explicit `leading-*` only where a specific block needs it.
 */
export const fontLeading: Record<keyof typeof fontSize, number> = {
  xs: lineHeight.data,
  sm: lineHeight.body,
  base: lineHeight.body,
  md: lineHeight.body,
  lg: lineHeight.heading,
  xl: lineHeight.heading,
  '2xl': lineHeight.heading,
  '3xl': lineHeight.tight,
  '4xl': lineHeight.tight,
  hero: lineHeight.tight,
}

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
  /**
   * Smooth scroll. Lenis owns the single rAF loop and ScrollTrigger reads
   * from it, so there is one scroll position, not two.
   * `lerp` is the only tunable: higher is tighter to the input device.
   */
  scroll: {
    lerp: 0.1,
  },
} as const

/**
 * Focus is visible and is never the browser default.
 * Signal is allowed here outside the three-per-viewport budget:
 * only one element is focused at a time.
 */
export const focus = {
  color: color.signal,
  width: '2px',
  offset: '2px',
} as const

/**
 * The specification rail. Fixed left column on desktop,
 * sticky single-line strip on mobile.
 */
/**
 * Below `lg` the rail becomes two sticky lines: the identifier strip, then
 * the scrolling section index. Both are 2.75rem, which is the 44px minimum
 * tap target, not a number picked for looks.
 *
 * The combined height is derived, never written down twice. Anything that has
 * to clear the sticky chrome, such as scroll-margin on an anchor target, uses
 * `mobileTotalHeight` so it cannot drift when one line changes.
 */
const railMobileStripRem = 2.75
const railMobileIndexRem = 2.75

export const rail = {
  width: '13rem',
  widthWide: '16rem',
  mobileHeight: `${railMobileStripRem}rem`,
  mobileIndexHeight: `${railMobileIndexRem}rem`,
  mobileTotalHeight: `${railMobileStripRem + railMobileIndexRem}rem`,
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
 * Riser schematic, the memorable moment.
 * Scroll-linked, not time-linked. Renders complete and static
 * under prefers-reduced-motion.
 */
export const schematic = {
  strokeWidth: 1.5,
  strokeWidthActive: 2.5,
  /**
   * The drawing grid: slab lines and the building outline. Hairline, and
   * deliberately quieter than the services drawn on top of it.
   */
  strokeWidthGrid: 1,
  strokeInactive: color.steel,
  strokeActive: color.signal,
  strokeGrid: color.border.hairline,
  labelDelay: 120,
} as const
