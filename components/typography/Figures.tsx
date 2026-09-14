import { Fragment } from "react"

/**
 * Sets every figure in a run of prose in mono.
 *
 * The rule is "every number on this site is set in mono", and project prose is
 * dense with them: 72 hours, 7pm, AS 1668.2, DN250, N+1. A token is any
 * whitespace separated word containing a digit, so a pipe size or a standard
 * reference goes mono whole rather than switching face mid word. Leading and
 * trailing punctuation stays in the body face.
 */

const TOKEN = /^([("']*)(.*?)([.,;:)"']*)$/

export function Figures({ text }: { text: string }) {
  return text.split(/(\s+)/).map((part, index) => {
    if (!/\d/.test(part)) return <Fragment key={index}>{part}</Fragment>

    const [, lead, core, trail] = part.match(TOKEN) ?? ["", "", part, ""]

    return (
      <Fragment key={index}>
        {lead}
        <span className="font-mono tracking-mono">{core}</span>
        {trail}
      </Fragment>
    )
  })
}
