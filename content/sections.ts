/**
 * Harrow Mechanical, top level section index.
 *
 * The site structure, in the order the rail lists it. Ordering is commercial:
 * projects first because an estimator checking whether to invite Harrow to
 * tender is looking for relevant work at similar scale before anything else.
 *
 * The homepage is not in this list. It sits on the rail masthead.
 */

import type { RailSection } from '@/components/sections/SpecRail'

export const SITE_SECTIONS: readonly RailSection[] = [
  { label: 'Projects', href: '/projects' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Compliance', href: '/compliance' },
  { label: 'Careers', href: '/careers' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const
