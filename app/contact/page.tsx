import type { Metadata } from "next"

import { ContactForms } from "@/components/forms/ContactForms"

export const metadata: Metadata = {
  title: "Contact | Harrow Mechanical",
  description:
    "Three ways to reach Harrow Mechanical: a tender enquiry, a service call, or a careers application.",
}

export default function ContactPage() {
  return (
    <div className="pb-[var(--spacing-section-generous)]">
      <header className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 lg:px-[var(--layout-gutter-wide)] lg:pt-24">
        <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
          Contact
        </p>
        <h1 className="mt-4 max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary lg:text-4xl">
          Three reasons to get in touch, three different forms.
        </h1>
        <p className="mt-6 max-w-[var(--measure)] font-body text-base text-text-secondary">
          Choose the one that matches why you&#39;re here. Each goes straight
          to the right team.
        </p>
      </header>

      <div className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]">
        <ContactForms />
      </div>
    </div>
  )
}
