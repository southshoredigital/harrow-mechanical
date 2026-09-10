import type { SVGProps } from "react"

/** Isolation valve: two triangles point to point, pipe stub each side. */
export function Maintenance({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      strokeLinejoin="miter"
      fill="none"
      role="img"
      className={className}
      {...props}
    >
      <title>Maintenance: isolation valve</title>
      <line x1={4} y1={24} x2={12} y2={24} />
      <line x1={36} y1={24} x2={44} y2={24} />
      <polygon points="12,16 12,32 24,24" />
      <polygon points="36,16 36,32 24,24" />
    </svg>
  )
}
