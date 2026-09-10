import type { Accreditation } from './types'

/**
 * Six accreditations. These appear as a strip on the homepage and
 * as data on /compliance.
 *
 * Every one carries a reference number and a currency date, because
 * the art direction says every claim carries a number, a date, a
 * certification reference or a project name.
 */
export const accreditations: Accreditation[] = [
  {
    name: 'ISO 9001:2015 Quality Management',
    body: 'JAS-ANZ accredited certification body',
    reference: 'QMS-41827',
    currentTo: '2028-04-30',
  },

  // Suggested remaining five:
  //  - ISO 45001 Occupational Health and Safety
  //  - Registered Building Practitioner, Mechanical Services
  //  - Plumbing Industry Commission, Mechanical Services endorsement
  //  - ARC Refrigerant Trading Authorisation
  //  - AMCA member
]
