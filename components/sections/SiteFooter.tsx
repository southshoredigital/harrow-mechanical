import Link from "next/link"

import { company } from "@/content/company"
import { SITE_SECTIONS } from "@/content/sections"

/**
 * The site footer, on every page from the root layout.
 *
 * Read as the foot of a drawing sheet: business particulars, the section
 * index, and the concept disclosure. Every figure is mono, separation is a
 * single hairline rule, there is no background fill and no social links.
 *
 * Below lg the rail is two sticky lines at the top of the viewport; the
 * scroll margin keeps an anchor jump or a focus scroll to the footer from
 * landing underneath them. From lg the footer sits in the padded content
 * column, clear of the fixed rail.
 *
 * Section links set prefetch={false} for the same reason the rail's do: the
 * same six routes, fetched speculatively on every page, cost 55KB on mobile
 * data for navigation most readers never make.
 */

const label = "font-mono text-xs tracking-label uppercase text-text-secondary"
const value = "mt-1 font-mono text-xs tracking-mono text-text-primary"
const tapLink =
  "focus-ring inline-flex min-h-[var(--tap-target)] items-center hover:underline lg:min-h-0"

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export function SiteFooter() {
  const { address, phone } = company

  return (
    <footer className="mx-auto w-full max-w-[var(--layout-max)] scroll-mt-[var(--rail-mobile-total-height)] px-[var(--layout-gutter)] lg:scroll-mt-0 lg:px-[var(--layout-gutter-wide)]">
      <div className="grid gap-8 border-t border-border-hairline py-12 lg:grid-cols-12 lg:gap-12">
        <address className="not-italic lg:col-span-5">
          <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
            <div>
              <dt className={label}>Business</dt>
              <dd className={value}>{company.name}</dd>
            </div>
            <div>
              <dt className={label}>ABN</dt>
              <dd className={value}>{company.abn}</dd>
            </div>
            <div>
              <dt className={label}>Address</dt>
              <dd className={value}>
                {address.street}
                <br />
                {address.locality} {address.region} {address.postcode}
              </dd>
            </div>
            <div>
              <dt className={label}>Phone</dt>
              <dd className={value}>
                <a href={`tel:${phone.e164}`} className={tapLink}>
                  {phone.display}
                </a>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className={label}>Email</dt>
              <dd className={`${value} break-all`}>
                <a href={`mailto:${company.email}`} className={tapLink}>
                  {company.email}
                </a>
              </dd>
            </div>
          </dl>
        </address>

        <nav aria-label="Footer" className="lg:col-span-3">
          <p className={label}>Sections</p>
          <ol className="mt-1">
            {SITE_SECTIONS.map((section, index) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  prefetch={false}
                  className={`${tapLink} gap-3 font-mono text-xs tracking-label uppercase text-text-primary lg:py-1`}
                >
                  <span aria-hidden="true" className="text-text-secondary">
                    {pad(index + 1)}
                  </span>
                  {section.label}
                </Link>
              </li>
            ))}
          </ol>
          <p className={`${label} mt-4`}>Compliance record</p>
          <Link
            href="/compliance/documents"
            prefetch={false}
            className={`${tapLink} font-mono text-xs tracking-mono text-text-primary lg:mt-1`}
          >
            Certificates, licences and insurance
          </Link>
        </nav>

        <div className="lg:col-span-4">
          <p className={label}>Concept project</p>
          <p className="mt-1 max-w-[var(--measure)] font-body text-sm text-text-secondary">
            Harrow Mechanical is a fictional business created by{" "}
            <a
              href={company.concept.url}
              className="focus-ring text-text-primary underline"
            >
              {company.concept.studio}
            </a>
            . Its ABN, address, phone number and email are invented and belong
            to no real firm.
          </p>
        </div>
      </div>
    </footer>
  )
}
