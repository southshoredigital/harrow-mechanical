import { SiteRail } from "../SiteRail"

/** The rail on /about: the same founding facts the page itself is built from. */

const ABOUT_FACTS = [
  { label: "Founded", value: "1994" },
  { label: "Staff", value: "58" },
  { label: "Headquarters", value: "Dandenong South, Victoria" },
] as const

export default function AboutRail() {
  return <SiteRail data={ABOUT_FACTS} />
}
