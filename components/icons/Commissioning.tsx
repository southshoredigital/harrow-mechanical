import type { SVGProps } from "react"

/** Test point: base line, stem, gauge circle at the top. */
export function Commissioning({ className, ...props }: SVGProps<SVGSVGElement>) {
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
      <title>Commissioning: test point</title>
      <line x1={8} y1={36} x2={40} y2={36} />
      <line x1={24} y1={36} x2={24} y2={26} />
      <circle cx={24} cy={18} r={8} />
    </svg>
  )
}