import { ContactForms } from "@/components/forms/ContactForms"
import { Figures } from "@/components/typography/Figures"
import { JsonLd, breadcrumbList, contactMetadata } from "@/lib/seo"

export const metadata = contactMetadata

export default function ContactPage() {
  return (
    <div className="pb-[var(--spacing-section-generous)]">
      <JsonLd data={breadcrumbList([{ name: "Contact", path: "/contact" }])} />
      <header className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 lg:px-[var(--layout-gutter-wide)] lg:pt-24">
        <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
          Contact
        </p>
        <h1 className="mt-4 max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary lg:text-4xl">
          Three reasons to get in touch, three different forms.
        </h1>
        <p className="mt-6 max-w-[var(--measure)] font-body text-base text-text-secondary">
          <Figures text="Tender enquiries go to estimating and get a reply within 1 business day. Emergency service calls are actioned the same day, routine and urgent within 1 business day. Every application gets a reply within 7 days." />
        </p>
      </header>

      <div className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]">
        <ContactForms />
      </div>
    </div>
  )
}
