/**
 * The logo files in public/. Width and height are the SVGs' own viewBox
 * dimensions, which next/image needs to reserve space without layout shift.
 * Rendered size comes from the `logo` tokens.
 *
 * The logo is a fixed asset: never recolour it with CSS or filters. Use the
 * inverse file on dark surfaces.
 */
export const LOGO = {
  lockup: { src: "/logo.svg", width: 466, height: 76 },
  inverse: { src: "/logo-inverse.svg", width: 466, height: 76 },
  mark: { src: "/logo-mark.svg", width: 54, height: 76 },
  markInverse: { src: "/logo-mark-inverse.svg", width: 54, height: 76 },
} as const

export type LogoAsset = (typeof LOGO)[keyof typeof LOGO]
