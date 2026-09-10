import type { SVGProps } from "react"

/** Controller to sensor: controller square, line branching to two sensor points. */
export function Controls({ className, ...props }: SVGProps<SVGSVGElement>) {
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
      <title>Controls: controller to sensor</title>
      <rect x={4} y={18} width={12} height={12} />
      <line x1={16} y1={24} x2={24} y2={24} />
      <line x1={24} y1={16} x2={24} y2={32} />
      <line x1={24} y1={16} x2={28} y2={16} />
      <line x1={24} y1={32} x2={28} y2={32} />
      <circle cx={36} cy={16} r={6} />
      <circle cx={36} cy={32} r={6} />
    </svg>
  )
}
