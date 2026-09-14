"use client"

import { useEffect, useId, useRef, useState } from "react"

import { subscribeLenis } from "@/components/providers/lenis-store"
import { Figures } from "@/components/typography/Figures"
import { breakpoint, motion, schematic } from "@/design/tokens"

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

/** The concept bar's height in pixels, read from its token at refresh. */
function conceptBarPx() {
  const root = document.documentElement
  const rem = parseFloat(getComputedStyle(root).getPropertyValue("--concept-bar-height"))
  return rem * parseFloat(getComputedStyle(root).fontSize)
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
 * three service branches drawn into it. Scroll linked rather than time linked
 * at every size; each branch label wipes in `schematic.labelDelay` after its
 * last line lands.
 *
 * From lg the figure is sticky and the branch text scrolls past it: each
 * branch plots as its own section passes, and only the branch whose section
 * is in view carries `schematic.strokeActive`.
 *
 * Below lg a phone cannot show a legible drawing and readable text at once,
 * so the two are not asked to share the screen. The figure sits in the flow
 * at full width and plots as it scrolls into view, the branch being drawn
 * carrying the active stroke, then settles as a finished monochrome drawing.
 * The drawing eases towards the scroll position over
 * `schematic.catchUpNarrow` rather than jumping with each fling. The three
 * sections follow it as ordinary text.
 *
 * Under prefers-reduced-motion the complete diagram is what renders, with no
 * timeline built at all. From lg, active branch tracking still runs: that is
 * a state change, not an animation, and it is instant.
 */
export function RiserSchematic({ title, branches }: RiserSchematicProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  /**
   * Wraps only the stacked branch sections and the pinned figure, not the
   * heading above them. From lg the whole scroll sequence is scrubbed against
   * this element's own top and bottom, so it starts and ends at the same
   * points regardless of how much content sits above it on the page: at the
   * top of the document there is no scroll position at which this element's
   * top can already have passed the top of the viewport, so the sequence can
   * never be pre-elapsed the way it was when each branch scrubbed against its
   * own "top bottom" to "top 20%" window against the viewport instead.
   */
  const sequenceRef = useRef<HTMLDivElement>(null)
  /** The figure itself. Below lg the plot is scrubbed against its passage. */
  const figureRef = useRef<HTMLDivElement>(null)
  const uid = useId().replace(/:/g, "")

  /**
   * Null when no branch is live. Starts null at every size: the server
   * rendered drawing is a finished monochrome drawing, and GSAP, which loads
   * only as the figure comes into view, sets the live branch from lg once it
   * is there. Below lg, where the figure starts off screen, no branch is ever
   * marked before the plot reaches it.
   */
  const [active, setActive] = useState<RiserBranchKey | null>(null)
  const [landed, setLanded] = useState<LandedState>(ALL_LANDED)

  /**
   * True until the first real sync against scroll position. The label wipe
   * runs on a CSS transition so `schematic.labelDelay` reads as a pause
   * after motion rather than a scroll-scrubbed value, but that same
   * transition must not fire for the very first correction from the
   * optimistic `ALL_LANDED` default down to whatever is actually true at
   * the current scroll position, or the labels visibly wipe out on load.
   * State, not a ref: the value has to affect this render's styles, and a
   * ref read during render is exactly what React warns against.
   */
  const [skipInitialTransition, setSkipInitialTransition] = useState(true)

  /**
   * GSAP and ScrollTrigger, 47KB gzipped with their evaluation, load only when
   * the figure reaches the viewport. On a phone that is never during the
   * initial load, so none of it competes with the first paint; on a desktop
   * the figure is usually in view at once and it loads straight after
   * hydration, as it did when it was bundled.
   */
  useEffect(() => {
    const root = rootRef.current
    const figure = figureRef.current
    if (!root || !figure) return

    let cancelled = false
    let revert: (() => void) | null = null

    /**
     * Where motion is allowed, the branches are held invisible from hydration
     * until GSAP has loaded and hidden the lines it is about to plot, so a
     * drawing that has not started plotting never shows complete and then
     * disappears. Not under reduced motion, where the complete drawing is the
     * design, and always released, so if GSAP fails to load the fallback is
     * the finished drawing rather than an empty frame. Set on the DOM rather
     * than through state: it is held only while an external script loads,
     * and React never manages this property.
     */
    const branchGroups = Array.from(root.querySelectorAll<SVGGElement>("[data-branch]"))
    const holdLines = (hold: boolean) =>
      branchGroups.forEach((group) => {
        group.style.visibility = hold ? "hidden" : ""
      })
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      holdLines(true)
    }

    const load = async () => {
      try {
        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ])
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)

        // A context scoped to the root, so every tween, trigger and inline
        // style it creates is reverted together when the component unmounts.
        const ctx = gsap.context(() => {
            // One scroll position: when Lenis is running, every scroll it applies
            // is forwarded to ScrollTrigger in the same frame. The wiring lives
            // here rather than in SmoothScroll so GSAP only loads on this route.
            let offLenisScroll: (() => void) | null = null
            let subscribed = false
            const unsubscribeLenis = subscribeLenis((lenis) => {
              offLenisScroll?.()
              offLenisScroll = lenis ? lenis.on("scroll", ScrollTrigger.update) : null
              // Lenis starting or stopping mid session changes who moves the page,
              // so positions are measured again. Not on the first call: nothing
              // has been created to measure yet.
              if (subscribed) ScrollTrigger.refresh()
              subscribed = true
            })

            const paths = (branch: RiserBranchKey, part: string) =>
              gsap.utils.toArray<SVGPathElement>(
                `[data-branch="${branch}"] [data-part="${part}"] path`,
                root,
              )

            const mm = gsap.matchMedia()

            // Re-runs whenever a condition changes: crossing lg rebuilds the
            // behaviour for that layout, after the previous one has been reverted.
            // GSAP only calls this when at least one condition matches, so `always`
            // is there for a phone with reduced motion, where neither of the others
            // does and the initial active branch would otherwise never be cleared.
            mm.add(
              {
                always: "all",
                wide: `(min-width: ${breakpoint.lg})`,
                allowMotion: "(prefers-reduced-motion: no-preference)",
              },
              (context) => {
                const { wide, allowMotion } = context.conditions as {
                  wide: boolean
                  allowMotion: boolean
                }

                // Which branch is live, from lg where text and figure share the
                // screen. Not motion, so it runs at every preference.
                const activeTriggers = wide
                  ? BRANCH_ORDER.map((key, index) =>
                      ScrollTrigger.create({
                        trigger: sectionRefs.current[index] ?? undefined,
                        start: "top center",
                        end: "bottom center",
                        onToggle: (self) => {
                          if (self.isActive) setActive(key)
                        },
                      }),
                    )
                  : []
                setActive(wide ? BRANCH_ORDER[0] : null)

                const killActive = () => activeTriggers.forEach((trigger) => trigger.kill())
                if (!allowMotion) return killActive

                // Hide every line behind the gap of a single dash longer than the
                // path itself. Butt caps, so nothing pokes out at zero progress.
                const hiddenLength = (_i: number, el: SVGPathElement) =>
                  Math.ceil(screenLength(el)) + DASH_OVERRUN
                const hideEls = (els: SVGPathElement[]) =>
                  gsap.set(els, { strokeDasharray: hiddenLength, strokeDashoffset: hiddenLength })

                /**
                 * One continuous timeline for all three branches, played
                 * sequentially and driven by a single ScrollTrigger, rather than
                 * one scrub trigger per branch against the viewport.
                 *
                 * From lg it scrubs against `sequenceRef`, and each branch's share
                 * of the timeline is its section's share of the sequence height, so
                 * a branch plots while its own text is passing. Sections are sized
                 * by their content with fixed spacing between them, so the shares
                 * differ and are measured, not assumed equal.
                 *
                 * Below lg it scrubs against the figure's own passage into view and
                 * the branches take equal shares: there is no text beside the
                 * drawing to keep in step with.
                 */
                const master = gsap.timeline({ paused: true, defaults: { ease: "none" } })
                const allPathsByBranch: Record<RiserBranchKey, SVGPathElement[]> = {
                  mechanical: [],
                  hydraulic: [],
                  controls: [],
                }
                const branchEnd: Record<RiserBranchKey, number> = {
                  mechanical: 0,
                  hydraulic: 0,
                  controls: 0,
                }
                const branchTimelines: gsap.core.Timeline[] = []

                /**
                 * Lays the branch timelines end to end, each stretched to its share.
                 * Runs again on every refresh, since a resize rewraps the scope
                 * lists and changes the section heights.
                 */
                const layoutBranches = () => {
                  let start = 0
                  BRANCH_ORDER.forEach((key, index) => {
                    const share = wide
                      ? Math.max(1, sectionRefs.current[index]?.offsetHeight ?? 1)
                      : 1
                    const tl = branchTimelines[index]
                    tl.startTime(start)
                    tl.duration(share)
                    start += share
                    branchEnd[key] = start
                  })
                }

                BRANCH_ORDER.forEach((key) => {
                  const plant = paths(key, "plant")
                  const risers = paths(key, "risers")
                  const takeoffs = LEVELS.map((_, level) =>
                    paths(key, `takeoff-${level}`),
                  )
                  const all = [...plant, ...risers, ...takeoffs.flat()]
                  allPathsByBranch[key] = all
                  hideEls(all)

                  // Not paused: it is nested inside the paused `master` timeline, and
                  // a paused nested timeline does not contribute its duration to the
                  // parent's, which left `master.duration()` at zero.
                  const tl = gsap.timeline({
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

                  master.add(tl)
                  branchTimelines.push(tl)
                })
                layoutBranches()

                const hasLanded = { ...NONE_LANDED }
                let drawing: RiserBranchKey | null = null
                let initialSynced = false

                const sync = () => {
                  const time = master.time()
                  const next: LandedState = {
                    mechanical: time >= branchEnd.mechanical,
                    hydraulic: time >= branchEnd.hydraulic,
                    controls: time >= branchEnd.controls,
                  }

                  // Below lg the live branch is the one being drawn, and none before
                  // the plot starts or once the drawing is finished.
                  if (!wide) {
                    const now = time > 0 ? (BRANCH_ORDER.find((key) => !next[key]) ?? null) : null
                    if (now !== drawing) {
                      drawing = now
                      setActive(now)
                    }
                  }

                  const changed = BRANCH_ORDER.some((key) => next[key] !== hasLanded[key])
                  if (!changed && initialSynced) return

                  Object.assign(hasLanded, next)
                  const first = !initialSynced
                  initialSynced = true
                  setLanded(next)

                  // Let the corrected, untransitioned frame paint before allowing
                  // the CSS transition to apply to any later, genuinely scrolled change.
                  if (first) requestAnimationFrame(() => setSkipInitialTransition(false))
                }

                const scrubTrigger = ScrollTrigger.create({
                  ...(wide
                    ? {
                        trigger: sequenceRef.current,
                        // The pinned figure sits below the fixed concept bar, so the
                        // sequence starts when it reaches the bar, not the viewport top.
                        start: () => `top ${conceptBarPx()}px`,
                        end: "bottom bottom",
                      }
                    : {
                        // From the figure's top entering the viewport to its bottom
                        // arriving there: the drawing completes as it comes fully
                        // into view.
                        trigger: figureRef.current,
                        start: "top bottom",
                        end: "bottom bottom",
                      }),
                  // From lg the drawing tracks the scroll exactly. Below lg it eases
                  // towards it, so a fling on a phone draws rather than jumps.
                  scrub: wide ? true : schematic.catchUpNarrow / 1000,
                  animation: master,
                  onRefresh: sync,
                  // A resize rescales the drawing, so the dash lengths have to be
                  // measured again before the timeline re-reads its start values.
                  onRefreshInit: () => {
                    BRANCH_ORDER.forEach((key) => hideEls(allPathsByBranch[key]))
                    layoutBranches()
                    master.invalidate()
                  },
                })

                // Landing and the live branch follow the drawing itself, not the
                // scroll: with the eased scrub below lg the timeline is still moving
                // after the last scroll update, and a label must land when its line
                // does, not when the finger stopped.
                master.eventCallback("onUpdate", sync)

                // ScrollTrigger.create seeds the animation from the current scroll
                // position synchronously, so this reflects real progress immediately,
                // including on a reload part way down the page.
                sync()

                // Reverting to the reduced preference, or across lg, must leave the
                // drawing whole.
                return () => {
                  setLanded(ALL_LANDED)
                  setSkipInitialTransition(true)
                  scrubTrigger.kill()
                  killActive()
                }
              },
            )

            return () => {
              unsubscribeLenis()
              offLenisScroll?.()
              mm.revert()
            }
        }, root)
        revert = () => ctx.revert()
      } catch {
        // Offline or blocked: the complete drawing is the fallback.
      } finally {
        if (!cancelled) holdLines(false)
      }
    }

    // No margin: on a phone the plot starts as the figure's top enters the
    // viewport, which is exactly when this fires, and the eased scrub below
    // lg catches the drawing up once GSAP arrives.
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()
      void load()
    })
    observer.observe(figure)

    return () => {
      cancelled = true
      observer.disconnect()
      revert?.()
      holdLines(false)
    }
  }, [])

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

        <div ref={sequenceRef} className="xl:grid xl:grid-cols-[22rem_1fr] xl:gap-12">
          {/*
            Below lg the figure is in the flow at full width, its height set
            by the drawing's own proportions, and the text follows it.
            From lg to xl it pins to the top and the text passes beneath it,
            so it carries the page background and a closing rule. At xl it
            sits in its own column and nothing passes behind it.
          */}
          <div
            ref={figureRef}
            className="-mx-[var(--layout-gutter)] border-b border-border-hairline bg-surface-page py-4 lg:sticky lg:top-[var(--concept-bar-height)] lg:z-10 lg:h-[58svh] xl:col-start-2 xl:row-start-1 xl:mx-0 xl:h-[calc(100svh-var(--concept-bar-height))] xl:border-b-0 xl:py-12"
          >
            <svg
              viewBox={VIEW_BOX}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              // Title is the name, desc is the description: a screen reader
              // announces the short name first and the full account after,
              // rather than one paragraph-long name.
              aria-labelledby={titleId}
              aria-describedby={descId}
              fill="none"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              /*
                SVG font sizes resolve into user units, so the type scale
                still applies here: the size set on the root is what the
                branch labels take. Below xl the drawing is scaled down hard,
                so it steps up a size to stay readable outdoors.
              */
              className="h-auto w-full font-mono text-md tracking-label lg:h-full xl:text-sm"
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
                        // The very first correction from the optimistic,
                        // pre-hydration `landed` default to whatever is
                        // actually true at the current scroll position must
                        // be instant: only a genuine, later scroll-driven
                        // change should carry the wipe and its delay.
                        transitionDuration: skipInitialTransition
                          ? "0ms"
                          : `${motion.duration.reveal}ms`,
                        transitionTimingFunction: motion.ease.plotter,
                        transitionDelay: skipInitialTransition
                          ? "0ms"
                          : `${schematic.labelDelay}ms`,
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

          <div className="pt-[var(--spacing-section-compact)] xl:col-start-1 xl:row-start-1 xl:pt-0">
            {BRANCH_ORDER.map((key, index) => {
              const branch = branches[key]

              return (
                <section
                  key={key}
                  ref={(el) => {
                    sectionRefs.current[index] = el
                  }}
                  aria-labelledby={`${uid}-${key}`}
                  // Spacing is one token between sections, never leftover
                  // height: a min-height with centred or bottom-aligned
                  // content made the gap depend on how long the scope list
                  // was, down to nothing when it outgrew the viewport.
                  className="pt-[var(--spacing-section-default)] first:pt-0"
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
                    <Figures text={branch.summary} />
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
                          <Figures text={item} />
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
