import type { SVGProps } from "react"

/** Pump: circle housing, impeller triangle, pipe stub each side. */
export function Hydraulic({ className, ...props }: SVGProps<SVGSVGElement>) {
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
      <title>Hydraulic: pump</title>
      <circle cx={24} cy={24} r={12} />
      <polygon points="20,16 20,32 32,24" />
      <line x1={4} y1={24} x2={12} y2={24} />
      <line x1={36} y1={24} x2={44} y2={24} />
    </svg>
  )
}
