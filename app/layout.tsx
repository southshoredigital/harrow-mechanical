import type { Metadata } from "next"

import { SmoothScroll } from "@/components/providers/SmoothScroll"
import { SiteFooter } from "@/components/sections/SiteFooter"
import { LOGO } from "@/lib/brand"
import {
  JsonLd,
  SITE,
  graph,
  homeMetadata,
  localBusiness,
  organization,
} from "@/lib/seo"

import { cabinet, switzer, jetbrains } from "./fonts"
import "./globals.css"

/**
 * Site wide defaults. Every page sets its own title, description and
 * canonical through lib/seo; these apply only where a route has none, such
 * as the 404.
 *
 * `index: false` holds for the whole site: this is a concept for a fictional
 * business and must not be indexed.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: homeMetadata.title,
  description: homeMetadata.description,
  openGraph: { siteName: SITE.name, locale: SITE.locale, type: "website" },
  robots: { index: false, follow: false },
  // The mark alone, straight from public/, so there is one copy of each file.
  // The paper version is listed second: browsers take the last icon whose
  // media matches, so a dark tab bar gets the mark it can show.
  icons: {
    icon: [
      { url: LOGO.mark.src, type: "image/svg+xml" },
      {
        url: LOGO.markInverse.src,
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
}

export default function RootLayout({
  children,
  rail,
}: {
  children: React.ReactNode
  /** The specification rail, from the @rail slot so pages can give it data. */
  rail: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cabinet.variable} ${switzer.variable} ${jetbrains.variable}`}
    >
      <body className="bg-surface-page text-text-primary">
        <JsonLd data={graph(organization(), localBusiness())} />
        <SmoothScroll />

        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:bg-surface-inverse focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:tracking-label focus:text-text-inverse focus:uppercase"
        >
          Skip to content
        </a>

        {rail}

        <div className="lg:pl-[var(--rail-width)]">
          {/*
            tabIndex allows the skip link to move focus here. outline-none is
            safe on a container that is only ever focused programmatically,
            and every real control keeps its focus ring.

            Below lg the scroll margin clears both sticky rail lines, so an
            anchor jump does not land underneath them. The rail is fixed to the
            left at lg and up and covers nothing vertically, so the margin goes.
          */}
          <main
            id="main"
            tabIndex={-1}
            className="scroll-mt-[var(--rail-mobile-total-height)] focus:outline-none lg:scroll-mt-0"
          >
            {children}
          </main>

          {/*
            Inside the padded column, so from lg it sits clear of the fixed
            rail rather than underneath it.
          */}
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
