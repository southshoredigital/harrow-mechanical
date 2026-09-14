import { company } from "@/content/company"

/**
 * The concept disclosure, fixed across the top of every page from lg up.
 *
 * One mono line over a hairline rule. It carries the page ground rather than
 * a fill of its own: the bar is fixed, so without it the content scrolling
 * underneath would show through the text.
 *
 * Hidden below lg, where the footer already carries the same disclosure and
 * the rail is two sticky lines: a third would leave too little screen.
 *
 * Everything fixed or pinned from lg up offsets by `conceptBar.height`: the
 * rail, the content column, scroll margins and the riser schematic.
 */
export function ConceptBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 hidden h-[var(--concept-bar-height)] items-center border-b border-border-hairline bg-surface-page px-4 font-mono text-xs tracking-mono text-text-secondary lg:flex">
      <p className="truncate">
        Concept project by{" "}
        <a
          href={company.concept.url}
          className="focus-ring text-text-primary underline"
        >
          {company.concept.studio}
        </a>
        . Harrow Mechanical is a fictional business.
      </p>
    </div>
  )
}
