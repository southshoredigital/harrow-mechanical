/** The designed success and error states shared by all three forms. */

export function ConfirmationPanel({
  heading,
  body,
}: {
  heading: string
  body: string
}) {
  return (
    <div
      role="status"
      className="border-t border-border-accent bg-surface-inverse px-6 py-12 lg:px-12 lg:py-16"
    >
      <p className="font-mono text-xs tracking-label uppercase text-text-accent">
        Received
      </p>
      <h3 className="mt-4 max-w-[var(--measure)] font-display text-2xl tracking-display text-text-inverse">
        {heading}
      </h3>
      <p className="mt-4 max-w-[var(--measure)] font-body text-base text-text-inverse">
        {body}
      </p>
    </div>
  )
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="mt-6 border border-status-error px-4 py-3 font-mono text-xs tracking-mono text-status-error"
    >
      {message}
    </p>
  )
}

export function SubmitButton({
  submitting,
  children,
}: {
  submitting: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="focus-ring mt-8 inline-flex min-h-[var(--tap-target)] items-center gap-3 border border-border-strong px-6 font-mono text-xs tracking-label uppercase text-text-primary hover:bg-surface-inverse hover:text-text-inverse disabled:cursor-not-allowed disabled:opacity-50"
    >
      {submitting ? "Sending" : children}
    </button>
  )
}
