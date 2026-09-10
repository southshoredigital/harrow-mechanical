import type { SVGProps } from "react"

/** Air handling unit: casing, internal coil, duct stub each side. */
export function Mechanical({ className, ...props }: SVGProps<SVGSVGElement>) {
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
      <title>Mechanical: air handling unit</title>
      <rect x={16} y={12} width={16} height={24} />
      <line x1={4} y1={24} x2={16} y2={24} />
      <line x1={32} y1={24} x2={44} y2={24} />
      <line x1={20} y1={16} x2={20} y2={32} />
      <line x1={24} y1={16} x2={24} y2={32} />
      <line x1={28} y1={16} x2={28} y2={32} />
    </svg>
  )
}
