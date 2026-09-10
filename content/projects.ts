import type { Project } from './types'

/**
 * Twelve projects, spread across all five sectors.
 * Six marked `featured: true` for the homepage selection.
 *
 * The first entry is a worked example showing the level of detail expected.
 * `constraints` is the field estimators actually read — make it specific.
 */
export const projects: Project[] = [
  {
    slug: 'northfield-private-hospital-plant-upgrade',
    title: 'Northfield Private Hospital plant upgrade',
    client: 'Head contractor, health sector',
    location: 'Berwick, Victoria',
    sector: 'Health',
    systems: ['Mechanical', 'Controls', 'Commissioning'],
    contractValue: 3_180_000,
    durationMonths: 14,
    completionYear: 2025,
    brief:
      'Staged replacement of central plant serving four theatres and a 60 bed ward block, carried out with the hospital fully operational throughout.',
    systemsInstalled: [
      '2 × 850kW water cooled chillers with N+1 redundancy',
      'Theatre AHUs with HEPA filtration to AS 1668.2',
      'Hydronic distribution, 620m primary and secondary pipework',
      'BMS head end replacement, 1,400 points',
      'Emergency power changeover and load testing',
    ],
    constraints:
      'No theatre could be offline for more than 72 hours, and no works were permitted within 20m of the ward block between 7pm and 7am. Plant was craned in over three night shifts with the adjoining road closed under permit.',
    outcome:
      'Delivered across fourteen months with no unplanned theatre downtime. Commissioning witnessed by the hospital engineering team and independent commissioning agent. Handed over with full O&M documentation and twelve months defects liability.',
    images: [
      {
        src: '/images/projects/northfield-plant-room.jpg',
        alt: 'Chiller plant room with primary hydronic pipework and pumps',
        width: 2400,
        height: 1600,
      },
    ],
    featured: true,
  },

  // Add eleven more. Suggested spread so all filters have results:
  //  - 2 more Health
  //  - 2 Education
  //  - 2 Data centre
  //  - 3 Industrial
  //  - 2 Commercial office
  // Vary contract values across all three scale bands, and completion years
  // across 2021 to 2026 so the index doesn't look like one busy year.
]
