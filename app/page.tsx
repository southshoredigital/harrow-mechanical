export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
        Harrow Mechanical / 001
      </p>
      <h1 className="font-display text-4xl leading-tight tracking-display mt-8">
        Mechanical services
      </h1>
      <p className="font-body text-base leading-body max-w-[var(--measure)] mt-6">
        Testing the token system. This paragraph is Switzer at base size with
        body leading, capped at the measure defined in tokens.
      </p>
      <div className="mt-12 border-t border-border-hairline pt-6">
        <span className="font-mono text-sm text-text-accent">$4,200,000</span>
      </div>
    </main>
  )
}