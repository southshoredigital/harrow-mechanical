import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

import {
  border,
  color,
  fontLeading,
  fontSize,
  letterSpacing,
  rail,
  space,
} from "@/design/tokens"

import { OG_SIZE } from "./og-shared"

/**
 * The social image, drawn as a title block: the specification rail on the
 * left carrying the figures, the heading on the right under a signal rule.
 *
 * Every value is a token. The composition is laid out at half the output
 * size and scaled up 2x, so the type scale reads at the size it does on a
 * screen instead of shrinking to nothing when a platform shows the card at
 * 500px wide.
 *
 * Satori cannot read woff2, so the faces load from static cuts of the same
 * families in assets/fonts/og.
 */

export { OG_CONTENT_TYPE, OG_SIZE } from "./og-shared"

const SCALE = 2

const FONT_DIR = join(process.cwd(), "assets/fonts/og")

async function fonts() {
  const [display, mono] = await Promise.all([
    readFile(join(FONT_DIR, "CabinetGrotesk-Regular.otf")),
    readFile(join(FONT_DIR, "JetBrainsMono-Regular.ttf")),
  ])

  return [
    { name: "Cabinet Grotesk", data: display, weight: 400 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ]
}

const label = {
  fontFamily: "JetBrains Mono",
  fontSize: fontSize.xs,
  lineHeight: fontLeading.xs,
  letterSpacing: letterSpacing.label,
  textTransform: "uppercase",
} as const

export type OgFact = { label: string; value: string }

export async function renderOgImage({
  eyebrow,
  heading,
  headingSize,
  facts,
}: {
  /** Mono line above the heading: location, section. */
  eyebrow: string
  heading: string
  headingSize: "lg" | "xl"
  /** Carried in the rail, the way the site carries them. */
  facts: readonly OgFact[]
}) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: color.surface.page,
        }}
      >
        <div
          style={{
            display: "flex",
            width: OG_SIZE.width / SCALE,
            height: OG_SIZE.height / SCALE,
            transform: `scale(${SCALE})`,
            background: color.surface.page,
            color: color.text.primary,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: rail.width,
              padding: space[4],
              borderRight: border.hairline,
              ...label,
            }}
          >
            <div style={{ display: "flex" }}>Harrow Mechanical</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: space[4],
                paddingTop: space[3],
                borderTop: border.hairline,
              }}
            >
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  style={{ display: "flex", flexDirection: "column", marginBottom: space[2] }}
                >
                  <div style={{ display: "flex", color: color.text.secondary }}>
                    {fact.label}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      textTransform: "none",
                      letterSpacing: letterSpacing.mono,
                    }}
                  >
                    {fact.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: space[6],
            }}
          >
            <div style={{ display: "flex", color: color.text.secondary, ...label }}>
              {eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: space[4],
                paddingTop: space[4],
                borderTop: border.accent,
                fontFamily: "Cabinet Grotesk",
                fontSize: fontSize[headingSize],
                lineHeight: fontLeading[headingSize],
                letterSpacing: letterSpacing.display,
              }}
            >
              {heading}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "auto",
                color: color.text.secondary,
                ...label,
                textTransform: "none",
                letterSpacing: letterSpacing.mono,
              }}
            >
              Concept project by Southshore Digital. Harrow Mechanical is a
              fictional business.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() }
  )
}
