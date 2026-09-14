import type { Company } from './types'

/**
 * Business details for the footer and the LocalBusiness structured data.
 *
 * Harrow Mechanical is fictional, and every value here is chosen so it
 * cannot point at a real business or person:
 *
 * - The ABN deliberately fails the ATO checksum, so it can never match a
 *   registered entity.
 * - The phone number is from the (03) 5550 range ACMA reserves for use in
 *   fiction and creative works.
 * - The street is made up. The locality and postcode are real, because the
 *   brief places the business in Dandenong South.
 * - The email is on the concept's own domain, which has no mailbox.
 */
export const company: Company = {
  name: 'Harrow Mechanical',
  abn: '41 827 339 460',
  address: {
    street: '14 Ferrule Court',
    locality: 'Dandenong South',
    region: 'VIC',
    postcode: '3175',
    country: 'AU',
  },
  phone: {
    display: '(03) 5550 4417',
    e164: '+61355504417',
  },
  email: 'office@harrow.southshoredigital.com.au',
  concept: {
    studio: 'Southshore Digital',
    url: 'https://southshoredigital.com.au',
  },
}
