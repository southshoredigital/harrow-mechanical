import { accreditations } from "@/content/accreditations"
import { company } from "@/content/company"
import type { Capability } from "@/content/types"

import { SITE, absoluteUrl } from "./site"

/**
 * Structured data builders. Plain objects, rendered by <JsonLd />.
 *
 * Business particulars come from content/company.ts, the same record the
 * footer renders, so the page and its structured data cannot disagree. Those
 * values are fiction-safe by construction (see that file). Opening hours are
 * not in the content, so none are declared.
 */

type Node = Record<string, unknown>

const ORGANIZATION_ID = absoluteUrl("/#organization")
const BUSINESS_ID = absoluteUrl("/#business")

const address = {
  "@type": "PostalAddress",
  streetAddress: company.address.street,
  addressLocality: company.address.locality,
  addressRegion: company.address.region,
  postalCode: company.address.postcode,
  addressCountry: company.address.country,
}

const areaServed = SITE.areaServed.map((name) => ({
  "@type": "AdministrativeArea",
  name,
}))

/** The system-type terms the site is written to rank for. */
const KNOWS_ABOUT = [
  "Chiller plant",
  "Air handling units (AHU)",
  "Building management systems (BMS)",
  "DDC controls",
  "Hydronic heating",
  "Chilled water reticulation",
  "HVAC commissioning",
  "Air and water balancing",
  "HVAC maintenance",
]

export function organization(): Node {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
    foundingDate: String(SITE.founded),
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: SITE.staff,
    },
    address,
    knowsAbout: KNOWS_ABOUT,
    hasCredential: accreditations.map((accreditation) => ({
      "@type": "EducationalOccupationalCredential",
      name: accreditation.name,
      credentialCategory: "certification",
      identifier: accreditation.reference,
      recognizedBy: { "@type": "Organization", name: accreditation.body },
      validUntil: accreditation.currentTo,
    })),
  }
}

/**
 * HVACBusiness is schema.org's LocalBusiness subtype for this trade. Both
 * types are declared so a consumer looking for either finds it.
 */
export function localBusiness(): Node {
  return {
    "@type": ["LocalBusiness", "HVACBusiness"],
    "@id": BUSINESS_ID,
    name: SITE.name,
    url: SITE.url,
    image: absoluteUrl("/opengraph-image"),
    logo: absoluteUrl(SITE.logo),
    address,
    telephone: company.phone.e164,
    email: company.email,
    areaServed,
    parentOrganization: { "@id": ORGANIZATION_ID },
  }
}

export function service(capability: Capability): Node {
  return {
    "@type": "Service",
    "@id": absoluteUrl(`/capabilities/${capability.slug}#service`),
    name: `${capability.title} services`,
    serviceType: capability.title,
    description: capability.summary,
    url: absoluteUrl(`/capabilities/${capability.slug}`),
    provider: { "@id": BUSINESS_ID },
    areaServed,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${capability.title} scope`,
      itemListElement: capability.scope.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item },
      })),
    },
  }
}

export type Crumb = { name: string; path: string }

/** Home is always the first crumb, so callers pass only what sits below it. */
export function breadcrumbList(crumbs: readonly Crumb[]): Node {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs]

  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  }
}

/** Wraps nodes in one graph with a single @context. */
export function graph(...nodes: Node[]) {
  return { "@context": "https://schema.org", "@graph": nodes }
}
