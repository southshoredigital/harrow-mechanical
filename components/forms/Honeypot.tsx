import type { InputHTMLAttributes } from "react"

/**
 * Spam trap. Positioned off screen rather than `display:none` or
 * `visibility:hidden`, both of which some bots already know to check for,
 * so a real visitor never sees or reaches it but a script filling every
 * field on the page still does.
 */
export function Honeypot(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      aria-hidden="true"
      className="absolute top-auto left-[-9999px] h-px w-px overflow-hidden"
    >
      <label>
        Leave this field blank
        <input type="text" tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  )
}
