import type { Role } from './types'

/**
 * Four roles. Written for a tradesperson reading it on a phone,
 * not for a recruiter. No "fast paced dynamic team", no
 * "we're passionate about excellence".
 *
 * Say what the work actually is, where it is, and what ticket
 * they need. The brief identifies this audience as third by
 * commercial value but the trade shortage makes it matter.
 */
export const roles: Role[] = [
  {
    slug: 'refrigeration-mechanic',
    title: 'Refrigeration Mechanic',
    type: 'Full time',
    location: 'Dandenong South, with sites across metropolitan Melbourne',
    description: [
      'Service and breakdown work across commercial chiller plant, mostly health and data centre sites. Roughly 70 percent planned maintenance, 30 percent reactive.',
      'You would be on a two week rotating on call roster with four other mechanics. On call is paid whether you get called or not.',
      'Vehicle, phone, and tools provided. Start times are 7am from the yard or direct to site, your choice.',
    ],
    requirements: [
      'Trade qualified, Certificate III in Refrigeration and Air Conditioning',
      'Experience on commercial plant rather than residential split systems',
      'Comfortable working in occupied buildings including hospitals',
      'Current driver licence',
    ],
    ticket: 'ARC Refrigerant Handling Licence, full',
  },

  // Suggested remaining three:
  //  - Controls Technician        (Full time)
  //  - Project Manager, Mechanical (Full time)
  //  - Apprentice, 1st year        (Apprenticeship)
]
