import type { LogoAsset } from "@/lib/brand"

/**
 * The logo as a native image.
 *
 * Not next/image: SVGs are served unoptimised either way, so next/image would
 * add nothing but its client component, 6KB gzipped on every page, since the
 * rail carries the logo everywhere. Width and height come from the asset, so
 * space is reserved before it loads and nothing shifts.
 *
 * The file is used as supplied. Never recolour it with CSS or filters: use
 * LOGO.inverse on dark surfaces.
 */
export function LogoImage({
  asset,
  alt,
  className,
}: {
  asset: LogoAsset
  alt: string
  className?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static SVG, see above
    <img
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={alt}
      decoding="async"
      className={className}
    />
  )
}
