import type { Capability } from './types'

/**
 * Five capabilities, one per System. The order here is the order
 * they appear in the spec rail on /capabilities.
 *
 * The first is a worked example. Fill the rest to the same depth.
 */
export const capabilities: Capability[] = [
  {
    slug: 'mechanical',
    title: 'Mechanical',
    summary:
      'Central plant, air handling and distribution for buildings from 2,000 to 40,000 square metres.',
    detail: [
      'Design and construct, or construct to a consultant specification. Most work comes through head contractors on competitive tender, and a smaller share direct from asset owners who have worked with us before.',
      'Plant selection is done against whole of life cost rather than capital cost alone, because most of the buildings we work in will still be running this equipment in twenty years.',
    ],
    scope: [
      'Water and air cooled chiller plant to 2MW',
      'Air handling units, fan coil units, VAV and CAV systems',
      'Ductwork fabrication and installation to DW/144',
      'Kitchen and carpark ventilation to AS 1668.2',
      'Theatre and cleanroom ventilation with HEPA filtration',
      'Plant room construction and staged changeover in live buildings',
    ],
    relatedProjects: ['northfield-private-hospital-plant-upgrade'],
  },

  // Hydraulic
  // Controls
  // Commissioning
  // Maintenance
  //
  // Keep `title` exactly matching a System value from types.ts.
  // Aim for 5 to 7 scope lines each, written in the language a
  // specification uses rather than marketing language.
]
