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

  {
    name: 'ISO 45001:2018 Occupational Health and Safety',
    body: 'JAS-ANZ accredited certification body',
    reference: 'OHS-22913',
    currentTo: '2028-04-30',
  },

  {
    name: 'Registered Building Practitioner: Mechanical Services',
    body: 'Victorian Building Authority',
    reference: 'DP-AM 33481',
    currentTo: '2027-09-30',
  },

  {
    name: 'Plumbing Industry Commission: Mechanical Services Endorsement',
    body: 'Victorian Building Authority',
    reference: 'PL-11724',
    currentTo: '2027-03-18',
  },

  {
    name: 'Refrigerant Trading Authorisation',
    body: 'Australian Refrigeration Council (ARCtick)',
    reference: 'AU2019-06842',
    currentTo: '2029-11-04',
  },

  {
    name: 'AMCA Member',
    body: 'Air Conditioning and Mechanical Contractors Association',
    reference: 'M-4417',
    currentTo: '2027-06-30',
  },
]
