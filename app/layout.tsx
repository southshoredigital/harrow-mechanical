import type { Metadata } from "next"

import { SmoothScroll } from "@/components/providers/SmoothScroll"
import { SpecRail } from "@/components/sections/SpecRail"
import { SITE_SECTIONS } from "@/content/sections"

import { cabinet, switzer, jetbrains } from "./fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: "Harrow Mechanical",
  description:
    "Commercial mechanical services contractor. Concept project by Southshore Digital.",
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cabinet.variable} ${switzer.variable} ${jetbrains.variable}`}
    >
      <body className="bg-surface-page text-text-primary">
        <SmoothScroll />

        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:bg-surface-inverse focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:tracking-label focus:text-text-inverse focus:uppercase"
        >
          Skip to content
        </a>

        <SpecRail identifier="Harrow Mechanical" sections={SITE_SECTIONS} />

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
        </div>
      </body>
    </html>
  )
}
