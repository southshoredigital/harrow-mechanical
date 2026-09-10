import {
  Mechanical,
  Hydraulic,
  Controls,
  Commissioning,
  Maintenance,
} from "@/components/icons"

/**
 * Temporary route. Checks optical weight of the five capability symbols
 * across the sizes they'll actually run at. Not part of the content plan,
 * remove before launch.
 */

const icons = [
  { name: "Mechanical", Icon: Mechanical },
  { name: "Hydraulic", Icon: Hydraulic },
  { name: "Controls", Icon: Controls },
  { name: "Commissioning", Icon: Commissioning },
  { name: "Maintenance", Icon: Maintenance },
] as const

const sizes = [32, 48, 96] as const

export default function IconsCheckPage() {
  return (
    <main className="min-h-screen bg-paper p-16">
      <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
        Icon check / temporary
      </p>
      <h1 className="font-display text-2xl leading-heading tracking-display mt-4 text-text-primary">
        Capability symbols
      </h1>

      <div className="mt-16 flex flex-col gap-16">
        {sizes.map((size) => (
          <section key={size}>
            <p className="font-mono text-xs tracking-label uppercase text-text-secondary mb-6">
              {size}px
            </p>
            <div className="flex items-end gap-12">
              {icons.map(({ name, Icon }) => (
                <div key={name} className="flex flex-col items-center gap-3">
                  <Icon
                    className="text-ink"
                    style={{ width: size, height: size }}
                  />
                  <span className="font-mono text-xs text-text-secondary">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
