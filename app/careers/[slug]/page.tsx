import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Figures } from "@/components/typography/Figures"
import { roles } from "@/content/roles"
import { getRole } from "@/lib/roles"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return roles.map((role) => ({ slug: role.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const role = getRole((await params).slug)
  if (!role) return {}

  return {
    title: `${role.title} | Harrow Mechanical`,
    description: role.description[0],
  }
}

export default async function RolePage({ params }: Props) {
  const role = getRole((await params).slug)
  if (!role) notFound()

  return (
    <article className="pb-[var(--spacing-section-generous)]">
      <header className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 lg:px-[var(--layout-gutter-wide)] lg:pt-24">
        <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
          <Link href="/careers" className="focus-ring hover:text-text-primary">
            Careers
          </Link>{" "}
          / {role.location}
        </p>
        <h1 className="mt-4 max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary lg:text-4xl">
          {role.title}
        </h1>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border-hairline pt-6 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-xs tracking-label uppercase text-text-secondary">
              Type
            </dt>
            <dd className="mt-1 font-mono text-sm tracking-mono text-text-primary">
              {role.type}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs tracking-label uppercase text-text-secondary">
              Location
            </dt>
            <dd className="mt-1 font-mono text-sm tracking-mono text-text-primary">
              {role.location}
            </dd>
          </div>
          {role.ticket ? (
            <div>
              <dt className="font-mono text-xs tracking-label uppercase text-text-secondary">
                Ticket required
              </dt>
              <dd className="mt-1 font-mono text-sm tracking-mono text-text-primary">
                {role.ticket}
              </dd>
            </div>
          ) : null}
        </dl>
      </header>

      <div className="mx-auto mt-[var(--spacing-section-compact)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]">
        <section aria-labelledby="role-description-heading" className="border-t border-border-strong pt-6">
          <h2 id="role-description-heading" className="sr-only">
            The work
          </h2>
          {role.description.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-6 max-w-[var(--measure)] font-body text-base text-text-primary first:mt-0"
            >
              <Figures text={paragraph} />
            </p>
          ))}
        </section>

        <section
          aria-labelledby="role-requirements-heading"
          className="mt-[var(--spacing-section-compact)] border-t border-border-strong pt-6"
        >
          <h2
            id="role-requirements-heading"
            className="font-display text-xl tracking-display text-text-primary"
          >
            What you need
          </h2>
          <ul className="mt-8 max-w-[var(--measure)] border-t border-border-hairline">
            {role.requirements.map((item, index) => (
              <li key={item} className="flex gap-4 border-b border-border-hairline py-3">
                <span className="font-mono text-xs tracking-mono text-text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-text-primary">
                  <Figures text={item} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-[var(--spacing-section-compact)] border-t border-border-accent pt-6">
          <p className="max-w-[var(--measure)] font-body text-base text-text-primary">
            To apply, use the careers path on the{" "}
            <Link href="/contact" className="focus-ring text-text-accent underline">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  )
}
