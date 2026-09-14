import { SiteRail } from "../SiteRail"

/**
 * Every route without rail data of its own.
 *
 * default.tsx alone is not enough: on a client side navigation a slot with no
 * matching page keeps whatever it last rendered, so leaving a project for the
 * index would carry that project's contract value along with it. Matching
 * every path here resets the rail on every navigation.
 */
export default function RailCatchAll() {
  return <SiteRail />
}
