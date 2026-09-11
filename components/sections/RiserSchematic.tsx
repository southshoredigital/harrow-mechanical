"use client"

import { useId, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

import { motion, schematic } from "@/design/tokens"

gsap.registerPlugin(ScrollTrigger)

/* -------------------------------------------------------------------------
 * Drawing geometry
 *
 * These are drawing coordinates, not design values: they describe what the
 * diagram depicts, the way the coordinates in components/icons describe a
 * pump or an air handling unit. Every colour, stroke weight, duration, ease
 * and delay below comes from design/tokens.ts.
 *
 * Discipline, matching the icon set: every coordinate lands on a 10 unit
 * grid, one stroke weight across the whole drawing, miter joins, butt caps.
 * Strokes are non-scaling, so a line is 1.5px whether the figure renders at
 * 300px or 700px wide. That is what keeps it legible on a phone outdoors.
 * ---------------------------------------------------------------------- */

/** Left margin is negative so the level markers sit outside the building. */
const VIEW_BOX = "-40 0 640 780"

const WALL_L = 80
const WALL_R = 580
const ROOF_Y = 40
const LEVEL_H = 100
const LEVEL_COUNT = 6
const PLANT_TOP = ROOF_Y + LEVEL_COUNT * LEVEL_H
const GROUND_Y = PLANT_TOP + LEVEL_H
/** Plant items sit inside the plant deck, clear of the slabs above and below. */
const PLANT_BOX_Y = PLANT_TOP + 20
const PLANT_BOX_H = 60
/** Risers stop one level below the roof: they serve level six, not the sky. */
const RISER_TOP = 50

/** Index 0 is level one, at the bottom. Levels are drawn bottom up. */
const LEVELS = Array.from({ length: LEVEL_COUNT }, (_, i) => ({
  id: `L0${i + 1}`,
  cy: ROOF_Y + (LEVEL_COUNT - 1 - i) * LEVEL_H + LEVEL_H / 2,
}))

const PLANT_CY = PLANT_TOP + LEVEL_H / 2

/** Closed rectangle as a path, so every drawn element measures the same way. */
function box(x: number, y: number, w: number, h: number) {
  return `M${x} ${y} H${x + w} V${y + h} H${x} Z`
}

/** Circle as two arcs. Same reason: getTotalLength on a uniform element type. */
function ring(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`
}

const FRAME = [
  ...Array.from(
    { length: LEVEL_COUNT + 2 },
    (_, k) => `M${WALL_L} ${ROOF_Y + k * LEVEL_H} H${WALL_R}`,
  ),
  `M${WALL_L} ${ROOF_Y} V${GROUND_Y}`,
  `M${WALL_R} ${ROOF_Y} V${GROUND_Y}`,
]

export type RiserBranchKey = "mechanical" | "hydraulic" | "controls"

type BranchGeometry = {
  /** Where the branch label and its leader tick sit, above the roof line. */
  labelX: number
  /** Source plant on the plant deck. Plotted first. */
  plant: string[]
  /** Vertical risers. Plotted second, bottom to top. */
  risers: string[]
  /** Per level take off, index 0 is level one. Plotted as the riser passes. */
  takeoff: (cy: number) => string[]
}

const GEOMETRY: Record<RiserBranchKey, BranchGeometry> = {
  /* Air handling unit on the plant deck, supply and return risers, a VAV box
     and diffuser on supply and a grille on return at every level. */
  mechanical: {
    labelX: 120,
    plant: [
      box(90, PLANT_BOX_Y, 100, PLANT_BOX_H),
      `M${WALL_L} ${PLANT_CY} H90`,
      ring(120, PLANT_CY, 20),
      `M160 670 V710 M170 670 V710 M180 670 V710`,
    ],
    risers: [
      `M120 ${PLANT_BOX_Y} V${RISER_TOP}`,
      `M150 ${PLANT_BOX_Y} V${RISER_TOP}`,
    ],
    takeoff: (cy) => [
      `M120 ${cy - 20} H200`,
      box(200, cy - 30, 40, 20),
      `M240 ${cy - 20} H260 M260 ${cy - 30} V${cy - 10}`,
      `M150 ${cy + 20} H260 M260 ${cy + 10} V${cy + 30}`,
    ],
  },

  /* Chiller and pump on the plant deck, flow and return risers, a fan coil
     unit with coil and fan at every level. */
  hydraulic: {
    labelX: 290,
    plant: [
      box(320, PLANT_BOX_Y, 100, PLANT_BOX_H),
      `M330 680 H410 M330 700 H410`,
      ring(290, PLANT_CY, 20),
      `M280 700 H300 L290 680 Z`,
      `M370 720 V730 H290 V710`,
    ],
    risers: [`M290 670 V${RISER_TOP}`, `M340 ${PLANT_BOX_Y} V${RISER_TOP}`],
    takeoff: (cy) => [
      `M290 ${cy - 20} H380`,
      box(380, cy - 30, 70, 60),
      `M340 ${cy + 20} H380`,
      `M390 ${cy - 20} V${cy + 20} M400 ${cy - 20} V${cy + 20} M410 ${cy - 20} V${cy + 20}`,
      ring(430, cy, 10),
    ],
  },

  /* Head end panel on the plant deck, a single trunk, a floor controller and
     space sensor at every level, and a field line to that level's fan coil. */
  controls: {
    labelX: 470,
    plant: [
      box(440, PLANT_BOX_Y, 80, PLANT_BOX_H),
      box(450, 670, 60, 20),
      `M450 710 H510`,
    ],
    risers: [`M470 ${PLANT_BOX_Y} V${RISER_TOP}`],
    takeoff: (cy) => [
      `M470 ${cy} H490`,
      box(490, cy - 20, 40, 40),
      `M530 ${cy} H550`,
      ring(560, cy, 10),
      // Field cable, controller to that level's fan coil. It drops below the
      // unit and crosses the trunk rather than running level with the
      // hydraulic return, which would read as more pipework.
      `M510 ${cy + 20} V${cy + 40} H420 V${cy + 30}`,
    ],
  },
}

const BRANCH_ORDER: readonly RiserBranchKey[] = [
  "mechanical",
  "hydraulic",
  "controls",
]

/* -------------------------------------------------------------------------
 * Plot timing
 *
 * Units, not seconds. The whole timeline is scrubbed against its section's
 * scroll position, so these only set the proportions: the plant draws, then
 * the risers climb, and each level's take off leaves the riser at the point
 * the riser physically reaches that level.
 * ---------------------------------------------------------------------- */
const PLANT_UNITS = 1
const PLANT_STAGGER = 0.12
const RISER_UNITS = 6
const TAKEOFF_UNITS = 0.5
const TAKEOFF_STAGGER = 0.08

/**
 * Screen pixels the hiding dash runs past the end of a path.
 *
 * Guards two rounding problems at once. GSAP writes stroke-dashoffset rounded
 * to whole pixels but leaves stroke-dasharray at full precision, so on a
 * curved path the offset can land a fraction past the array; and a dash
 * boundary sitting exactly on the end of a path paints a sub pixel sliver
 * there. A few pixels of overrun puts both well inside the gap.
 */
const DASH_OVERRUN = 4

/**
 * How long a path is on screen, in the units stroke-dasharray is measured in.
 *
 * The drawing uses vector-effect: non-scaling-stroke, which also moves the
 * dash pattern into screen space, while getTotalLength reports drawing units.
 * Multiplying by the element's own screen scale is what reconciles the two:
 * without it the hiding gap is short by the scale factor and the tail of
 * every path shows through before its branch has plotted.
 */
function screenLength(el: SVGPathElement) {
  const matrix = el.getScreenCTM()
  const scale = matrix ? Math.hypot(matrix.a, matrix.b) : 1
  return el.getTotalLength() * scale
}

/** How far up the riser a level sits, 0 at the plant deck and 1 at the top. */
function riserFraction(cy: number) {
  return (PLANT_BOX_Y - cy) / (PLANT_BOX_Y - RISER_TOP)
}

export type RiserBranchContent = {
  /** Matches a System in content/types.ts. */
  label: string
  summary: string
  scope: readonly string[]
}

export type RiserSchematicProps = {
  /** Rendered as the h2 for the block. Branch headings sit under it as h3. */
  title: string
  branches: Readonly<Record<RiserBranchKey, RiserBranchContent>>
}

type LandedState = Record<RiserBranchKey, boolean>

/** Complete, so the diagram is whole before hydration and without motion. */
const ALL_LANDED: LandedState = {
  mechanical: true,
  hydraulic: true,
  controls: true,
}
const NONE_LANDED: LandedState = {
  mechanical: false,
  hydraulic: false,
  controls: false,
}

/**
 * The riser schematic.
 *
 * A sectional line diagram of a six level building with a plant deck, with
 * three service branches drawn into it. Each branch plots itself as its own
 * text section scrolls in, scroll linked rather than time linked, and its
 * label wipes in `schematic.labelDelay` after the last line lands. Only the
 * branch whose section is in view carries `schematic.strokeActive`.
 *
 * Under prefers-reduced-motion the complete diagram is what renders, with no
 * timeline built at all. Active branch tracking still runs: that is a state
 * change, not an animation, and it is instant.
 */
export function RiserSchematic({ title, branches }: RiserSchematicProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const uid = useId().replace(/:/g, "")

  const [active, setActive] = useState<RiserBranchKey>(BRANCH_ORDER[0])
  const [landed, setLanded] = useState<LandedState>(ALL_LANDED)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const paths = (branch: RiserBranchKey, part: string) =>
        gsap.utils.toArray<SVGPathElement>(
          `[data-branch="${branch}"] [data-part="${part}"] path`,
          root,
        )

      // Which branch is live. Not motion, so it runs at every preference.
      const activeTriggers = BRANCH_ORDER.map((key, index) =>
        ScrollTrigger.create({
          trigger: sectionRefs.current[index] ?? undefined,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActive(key)
          },
        }),
      )

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        setLanded(NONE_LANDED)

        BRANCH_ORDER.forEach((key, index) => {
          const plant = paths(key, "plant")
          const risers = paths(key, "risers")
          const takeoffs = LEVELS.map((_, level) =>
            paths(key, `takeoff-${level}`),
          )
          const all = [...plant, ...risers, ...takeoffs.flat()]

          // Hide every line behind the gap of a single dash longer than the
          // path itself. Butt caps, so nothing pokes out at zero progress.
          const hidden = (_i: number, el: SVGPathElement) =>
            Math.ceil(screenLength(el)) + DASH_OVERRUN

          const hide = () =>
            gsap.set(all, {
              strokeDasharray: hidden,
              strokeDashoffset: hidden,
            })

          hide()

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "none", strokeDashoffset: 0 },
          })

          tl.to(plant, { duration: PLANT_UNITS, stagger: PLANT_STAGGER }, 0)
          tl.to(risers, { duration: RISER_UNITS }, PLANT_UNITS)

          takeoffs.forEach((els, level) => {
            tl.to(
              els,
              { duration: TAKEOFF_UNITS, stagger: TAKEOFF_STAGGER },
              PLANT_UNITS + RISER_UNITS * riserFraction(LEVELS[level].cy),
            )
          })

          // The branch completes as its section comes to rest in the
          // viewport, leaving the remaining scroll for reading it.
          let hasLanded = false
          const syncLabel = (self: ScrollTrigger) => {
            const next = self.progress >= 1
            if (next === hasLanded) return
            hasLanded = next
            setLanded((prev) => ({ ...prev, [key]: next }))
          }

          ScrollTrigger.create({
            trigger: sectionRefs.current[index] ?? undefined,
            start: "top bottom",
            end: "top 20%",
            scrub: true,
            animation: tl,
            onUpdate: syncLabel,
            onRefresh: syncLabel,
            // A resize rescales the drawing, so the dash lengths have to be
            // measured again before the timeline re-reads its start values.
            onRefreshInit: () => {
              hide()
              tl.invalidate()
            },
          })
        })

        // Reverting to the reduced preference must leave the drawing whole.
        return () => setLanded(ALL_LANDED)
      })

      return () => {
        mm.revert()
        activeTriggers.forEach((trigger) => trigger.kill())
      }
    },
    { scope: rootRef },
  )

  const titleId = `${uid}-title`
  const descId = `${uid}-desc`

  return (
    <section
      ref={rootRef}
      aria-labelledby={`${uid}-heading`}
      className="border-t border-border-hairline"
    >
      <div className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] xl:px-[var(--layout-gutter-wide)]">
        <h2
          id={`${uid}-heading`}
          className="max-w-[var(--measure)] py-16 font-display text-2xl tracking-display text-text-primary"
        >
          {title}
        </h2>

        <div className="xl:grid xl:grid-cols-[22rem_1fr] xl:gap-12">
          {/*
            Below xl the figure pins to the top and the text passes beneath
            it, so it carries the page background and a closing rule. At xl
            it sits in its own column and nothing passes behind it.
          */}
          <div className="sticky top-[var(--rail-mobile-total-height)] z-10 -mx-[var(--layout-gutter)] h-[58svh] border-b border-border-hairline bg-surface-page py-4 lg:top-0 xl:col-start-2 xl:row-start-1 xl:mx-0 xl:h-svh xl:border-b-0 xl:py-12">
            <svg
              viewBox={VIEW_BOX}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-labelledby={`${titleId} ${descId}`}
              fill="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              /*
                SVG font sizes resolve into user units, so the type scale
                still applies here: the size set on the root is what the
                branch labels take. Below xl the drawing is scaled down hard,
                so it steps up a size to stay readable outdoors.
              */
              className="h-full w-full font-mono text-md tracking-label xl:text-sm"
            >
              <title id={titleId}>
                Riser schematic: mechanical, hydraulic and controls services
                through a six level building
              </title>
              <desc id={descId}>
                A sectional riser diagram. Six levels, L01 at the bottom to L06
                at the top, sit above a plant deck. Three service branches rise
                from the plant deck to level six. The mechanical branch leaves
                an air handling unit as a supply riser and a return riser, and
                serves a variable air volume box, a supply diffuser and a return
                grille on every level. The hydraulic branch leaves a chiller and
                pump set as a flow riser and a return riser, and serves a fan
                coil unit with a coil and a fan on every level. The controls
                branch leaves a building management head end panel as a single
                trunk, and serves a floor controller, a space sensor and a
                control line to the fan coil unit on every level.
              </desc>

              <defs>
                {BRANCH_ORDER.map((key) => (
                  <clipPath
                    key={key}
                    id={`${uid}-label-${key}`}
                    clipPathUnits="userSpaceOnUse"
                  >
                    {/*
                      The label wipe. A clip rect scaled from its left edge,
                      never an opacity change. Nothing on this site fades.
                    */}
                    <rect
                      x={GEOMETRY[key].labelX}
                      y={0}
                      width={180}
                      height={54}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "left center",
                        transform: landed[key] ? "scaleX(1)" : "scaleX(0)",
                        transitionProperty: "transform",
                        transitionDuration: `${motion.duration.reveal}ms`,
                        transitionTimingFunction: motion.ease.plotter,
                        transitionDelay: `${schematic.labelDelay}ms`,
                      }}
                    />
                  </clipPath>
                ))}
              </defs>

              {/* The building. Drawn, never animated: the services plot into it. */}
              <g
                style={{
                  stroke: schematic.strokeGrid,
                  strokeWidth: schematic.strokeWidthGrid,
                }}
              >
                {FRAME.map((d) => (
                  <path key={d} d={d} vectorEffect="non-scaling-stroke" />
                ))}
              </g>

              {/*
                Level markers. Mono, like every other number on the site, and
                a size up from the branch labels: these are the wayfinding.
              */}
              <g
                className="text-lg xl:text-sm"
                style={{ fill: schematic.strokeInactive }}
              >
                {LEVELS.map((level) => (
                  <text
                    key={level.id}
                    x={60}
                    y={level.cy}
                    textAnchor="end"
                    dominantBaseline="central"
                  >
                    {level.id}
                  </text>
                ))}
                <text
                  x={60}
                  y={PLANT_CY}
                  textAnchor="end"
                  dominantBaseline="central"
                >
                  PLANT
                </text>
              </g>

              {BRANCH_ORDER.map((key) => {
                const geometry = GEOMETRY[key]
                const isActive = active === key

                return (
                  <g
                    key={key}
                    data-branch={key}
                    style={{
                      stroke: isActive
                        ? schematic.strokeActive
                        : schematic.strokeInactive,
                      strokeWidth: isActive
                        ? schematic.strokeWidthActive
                        : schematic.strokeWidth,
                    }}
                  >
                    <g data-part="plant">
                      {geometry.plant.map((d) => (
                        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
                      ))}
                    </g>

                    <g data-part="risers">
                      {geometry.risers.map((d) => (
                        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
                      ))}
                    </g>

                    {LEVELS.map((level, index) => (
                      <g key={level.id} data-part={`takeoff-${index}`}>
                        {geometry.takeoff(level.cy).map((d) => (
                          <path
                            key={d}
                            d={d}
                            vectorEffect="non-scaling-stroke"
                          />
                        ))}
                      </g>
                    ))}

                    {/*
                      The label and its leader down to the top of the riser.
                      Clipped, so it wipes in once the branch has landed.
                    */}
                    <g clipPath={`url(#${uid}-label-${key})`}>
                      <path
                        d={`M${geometry.labelX} 30 V${RISER_TOP}`}
                        vectorEffect="non-scaling-stroke"
                      />
                      <text
                        x={geometry.labelX}
                        y={22}
                        style={{
                          fill: isActive
                            ? schematic.strokeActive
                            : "var(--color-text-primary)",
                          stroke: "none",
                        }}
                      >
                        {branches[key].label.toUpperCase()}
                      </text>
                    </g>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="xl:col-start-1 xl:row-start-1">
            {BRANCH_ORDER.map((key, index) => {
              const branch = branches[key]

              return (
                <section
                  key={key}
                  ref={(el) => {
                    sectionRefs.current[index] = el
                  }}
                  aria-labelledby={`${uid}-${key}`}
                  className="flex min-h-svh flex-col justify-end pb-12 xl:justify-center xl:pb-0"
                >
                  <p className="font-mono text-xs tracking-label text-text-secondary">
                    {`0${index + 1}`}
                  </p>

                  <h3
                    id={`${uid}-${key}`}
                    className="mt-3 font-display text-xl tracking-display text-text-primary"
                  >
                    {branch.label}
                  </h3>

                  <p className="mt-4 max-w-[var(--measure)] text-base text-text-secondary">
                    {branch.summary}
                  </p>

                  <ul className="mt-8 max-w-[var(--measure)] border-t border-border-hairline">
                    {branch.scope.map((item, scopeIndex) => (
                      <li
                        key={item}
                        className="flex gap-4 border-b border-border-hairline py-3"
                      >
                        <span className="font-mono text-xs tracking-mono text-text-secondary">
                          {String(scopeIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-text-primary">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
