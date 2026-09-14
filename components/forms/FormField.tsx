import { useId } from "react"
import type { ReactNode } from "react"

import { labelClass } from "./fieldStyles"

/**
 * Label, control and error, wired together with aria-describedby so an
 * error is announced with the field rather than floating disconnected below
 * it. The control itself is passed in as a render prop so this stays usable
 * for an input, a select or a textarea alike.
 */
export function FormField({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: (field: {
    id: string
    "aria-describedby"?: string
    "aria-invalid"?: boolean
  }) => ReactNode
}) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy =
    [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": Boolean(error),
      })}
      {hint && !error ? (
        <p id={hintId} className="mt-2 font-body text-sm text-text-secondary">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 font-mono text-xs tracking-mono text-status-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
