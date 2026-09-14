/**
 * Boilerplate detector: the measurable half. See SKILL.md for the judgment
 * half and the report format.
 *
 *   node .claude/skills/boilerplate-detector/scan.mjs [baseUrl]
 *
 * Needs a production server running. Routes are found by crawling the
 * site's own links from the homepage, so nothing is scanned from a stale
 * list, and it works while the sitemap is empty for a noindex concept.
 */

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { chromium } from "@playwright/test"

const BASE = process.argv[2] ?? "http://localhost:3100"
const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "390", width: 390, height: 844, isMobile: true, hasTouch: true },
]
const SHOTS = "boilerplate-shots"

const flags = []
const flag = (severity, page, viewport, check, detail) =>
  flags.push({ severity, page, viewport, check, detail: String(detail).slice(0, 160) })

/* ---------------------------------------------------------------- routes */

/** Every same origin page reachable by link from the homepage. */
async function crawl() {
  const found = new Set(["/"])
  const queue = ["/"]
  while (queue.length > 0) {
    const path = queue.shift()
    let html
    try {
      const response = await fetch(BASE + path)
      if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) continue
      html = await response.text()
    } catch {
      console.error(`Could not reach ${BASE}${path}. Is the server running?`)
      process.exit(2)
    }
    for (const [, href] of html.matchAll(/<a[^>]+href="([^"#?]+)/g)) {
      if (!href.startsWith("/") || href.startsWith("//")) continue
      if (href.startsWith("/api/") || /\.[a-z0-9]+$/i.test(href)) continue
      if (!found.has(href)) {
        found.add(href)
        queue.push(href)
      }
    }
  }
  return [...found].sort()
}

const ROUTES = await crawl()

/* ------------------------------------------------------- source checks */

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

const SOURCE = ["app", "components", "lib"]
  .flatMap(walk)
  .filter((file) => /\.(tsx?|css)$/.test(file) && !file.endsWith("tokens.css"))

/** Checks on whole lines of code. */
const SOURCE_CHECKS = [
  { check: "lucide import", re: /from ["']lucide-react["']/ },
  { check: "CSS gradient", re: /(linear|radial|conic)-gradient\(/ },
  { check: "CSS shadow", re: /\b(box-shadow|text-shadow)\s*:|drop-shadow\(/ },
  { check: "fade or opacity motion", re: /\b(autoAlpha|opacity:\s*0\b)/ },
  { check: "hex colour in component", re: /["'`]#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?["'`]/, only: /^(app|components)[\\/]/ },
  { check: "px value in component", re: /\[\d+(\.\d+)?px\]|["'`]\d+px["'`]/, only: /^(app|components)[\\/]/ },
]

/**
 * Checks on utility classes. Applied only to string literals that read as a
 * class list (lowercase, whitespace separated, at least one hyphenated
 * token), so prose that mentions "shadow" or "rounded" is not flagged.
 */
const UTILITY_CHECKS = [
  { check: "gradient utility", re: /^(?:[\w-[\]&]+:)*(bg-gradient|bg-linear|bg-radial|bg-conic|from-|via-)/ },
  { check: "shadow utility", re: /^(?:[\w-[\]&]+:)*(shadow|drop-shadow)(-.+)?$/ },
  { check: "radius utility", re: /^(?:[\w-[\]&()=]+:)*rounded(?!-none$)(-.+)?$/ },
  { check: "fade utility", re: /^(?:[\w-[\]&]+:)*(transition-opacity|fade-in|fade-out|animate-in|animate-out)(-.+)?$/ },
  { check: "hover transition utility", re: /^(?:[\w-[\]&]+:)*(transition|transition-all|transition-colors|duration-\d+)$/ },
]

// Double quoted and template strings first, so a class list holding an
// attribute selector like [class*='size-'] is read whole.
const STRING_LITERAL = /"([^"\n]*)"|`([^`\n]*)`|'([^'\n]*)'/g
const isClassList = (value) => {
  const tokens = value.trim().split(/\s+/)
  return tokens.length > 0 && tokens.some((t) => t.includes("-")) && tokens.every((t) => /^[a-z0-9:\-[\]()/.%_&>*=~,#@!'*]+$/.test(t))
}

for (const file of SOURCE) {
  const lines = readFileSync(file, "utf8").split("\n")
  let inBlockComment = false
  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (inBlockComment) {
      if (trimmed.includes("*/")) inBlockComment = false
      return
    }
    if (trimmed.startsWith("/*")) {
      inBlockComment = !trimmed.includes("*/")
      return
    }
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return

    for (const { check, re, only } of SOURCE_CHECKS) {
      if (only && !only.test(file)) continue
      if (re.test(line)) flag("violation", file, "source", check, `${file}:${index + 1}  ${trimmed}`)
    }

    for (const match of line.matchAll(STRING_LITERAL)) {
      const value = match[1] ?? match[2] ?? match[3]
      if (!isClassList(value)) continue
      for (const token of value.trim().split(/\s+/)) {
        for (const { check, re } of UTILITY_CHECKS) {
          if (re.test(token)) flag("violation", file, "source", check, `${file}:${index + 1}  ${token}`)
        }
      }
    }
  })
}

/* ---------------------------------------------------- rendered checks */

const BANNED_PHRASES = [
  "empower", "trusted partner", "your partner", "solutions", "innovative", "innovation",
  "excellence", "world-class", "world class", "cutting-edge", "cutting edge", "seamless",
  "state-of-the-art", "one-stop", "leading provider", "passionate", "best-in-class",
  "tailored", "committed to", "dedicated team", "peace of mind", "look no further",
  "testimonial", "trusted by", "our clients", "what our clients", "carousel",
]

const ABSTRACT_HEADINGS = [
  "solutions", "innovation", "excellence", "services", "expertise", "quality", "overview",
  "values", "mission", "vision", "welcome", "features", "benefits", "about", "approach",
  "commitment", "experience", "capabilities", "figures", "detail", "integrity", "partnership",
]

mkdirSync(SHOTS, { recursive: true })
const browser = await chromium.launch()
const heroUses = []

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile ?? false,
    hasTouch: viewport.hasTouch ?? false,
  })

  for (const route of ROUTES) {
    const page = await context.newPage()
    const response = await page.goto(BASE + route, { waitUntil: "networkidle" })
    if (!response || response.status() >= 400) {
      flag("violation", route, viewport.name, "route did not load", response?.status() ?? "no response")
      await page.close()
      continue
    }
    await page.evaluate(() => document.fonts.ready)

    const safeName = route === "/" ? "home" : route.slice(1).replace(/\//g, "__")
    await page.screenshot({ path: join(SHOTS, `${safeName}-${viewport.name}.png`), fullPage: true })

    const result = await page.evaluate(
      ({ bannedPhrases, abstractHeadings }) => {
        const out = []
        const add = (severity, check, detail) => out.push({ severity, check, detail })
        const SIGNAL = "rgb(226, 82, 27)"
        const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize)
        const heroPx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--text-hero")) * rootPx

        const visible = (el) => {
          const box = el.getBoundingClientRect()
          const style = getComputedStyle(el)
          return box.width > 1 && box.height > 1 && style.visibility !== "hidden" && !el.closest(".sr-only, [hidden]")
        }

        /* Punctuation, across everything a reader or a crawler sees. */
        const surfaces = [
          ["title", document.title],
          ["meta description", document.querySelector('meta[name="description"]')?.content ?? ""],
          ["body text", document.body.innerText],
          ...[...document.querySelectorAll("[alt]")].map((el) => ["alt", el.getAttribute("alt")]),
          ...[...document.querySelectorAll("[aria-label]")].map((el) => ["aria-label", el.getAttribute("aria-label")]),
          ...[...document.querySelectorAll('script[type="application/ld+json"]')].map((el) => ["JSON-LD", el.textContent]),
        ]
        const PUNCTUATION = /[–—‘’“”]/
        for (const [where, text] of surfaces) {
          const match = text?.match(new RegExp(`.{0,30}${PUNCTUATION.source}.{0,30}`))
          if (match) add("violation", "dash or curly quote", `${where}: ${match[0]}`)
        }

        const lowered = document.body.innerText.toLowerCase()
        for (const phrase of bannedPhrases) {
          const at = lowered.indexOf(phrase)
          if (at >= 0) add("violation", "banned phrase", `"${phrase}": ${document.body.innerText.slice(Math.max(0, at - 30), at + 40)}`)
        }

        /* Headings. */
        for (const heading of document.querySelectorAll("h1, h2, h3")) {
          const text = heading.textContent.trim().replace(/\s+/g, " ")
          const words = text.replace(/^\d+\s*/, "").split(" ").filter(Boolean)
          if (words.length === 1) {
            const abstract = abstractHeadings.includes(words[0].toLowerCase())
            add(abstract ? "violation" : "review", "single word heading", `${heading.tagName} "${text}"${visible(heading) ? "" : " (visually hidden)"}`)
          }
        }

        /* Computed style checks over every element. */
        let signalBody = 0
        for (const el of document.querySelectorAll("body *")) {
          if (el.closest("svg") && el.tagName !== "svg") continue
          const style = getComputedStyle(el)

          if (/gradient\(/.test(style.backgroundImage)) add("violation", "gradient", el.outerHTML.slice(0, 100))
          if (style.boxShadow !== "none") add("violation", "box shadow", el.outerHTML.slice(0, 100))
          if (style.textShadow !== "none") add("violation", "text shadow", el.outerHTML.slice(0, 100))
          if (/drop-shadow/.test(style.filter)) add("violation", "drop shadow", el.outerHTML.slice(0, 100))
          if (["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"].some((k) => parseFloat(style[k]) > 0)) {
            add("violation", "border radius", el.outerHTML.slice(0, 100))
          }
          if (/opacity|all/.test(style.transitionProperty) && parseFloat(style.transitionDuration) > 0) {
            add("violation", "opacity transition", el.outerHTML.slice(0, 100))
          }
          if (/fade/i.test(style.animationName)) add("violation", "fade animation", el.outerHTML.slice(0, 100))
          if (style.opacity === "0" && !el.closest("[aria-hidden='true']") && el.getBoundingClientRect().width > 1) {
            add("violation", "element at opacity 0 on load", el.outerHTML.slice(0, 100))
          }
          if (parseFloat(style.transitionDuration) > 0 && !/clip-path|transform/.test(style.transitionProperty)) {
            add("violation", "non-instant transition", `${style.transitionProperty} ${style.transitionDuration}: ${el.outerHTML.slice(0, 80)}`)
          }

          // Signal as the colour of running text in the body face.
          const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
          if (ownText && style.color === SIGNAL && /switzer/i.test(style.fontFamily)) signalBody++

          // Hero size.
          if (ownText && Math.abs(parseFloat(style.fontSize) - heroPx) < 0.5) {
            out.push({ severity: "hero", check: "hero", detail: el.textContent.trim() })
          }
        }
        if (signalBody) add("violation", "signal as body text colour", `${signalBody} element(s)`)

        /* Numbers not in mono: any text node with a digit, judged by its parent's face. */
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        const seen = new Set()
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const el = node.parentElement
          if (!el || !/\d/.test(node.textContent) || el.closest("script, style, svg, noscript")) continue
          if (!visible(el)) continue
          const face = getComputedStyle(el).fontFamily
          // The one exception in CLAUDE.md: hero size numbers are display
          // statements set in the display face. Where they are allowed to
          // appear at all is checked separately by the hero size count.
          const heroDisplay =
            Math.abs(parseFloat(getComputedStyle(el).fontSize) - heroPx) < 0.5 && /cabinet/i.test(face)
          if (!/jetbrains/i.test(face) && !heroDisplay) {
            const text = node.textContent.trim()
            // Keyed by element and text: the same figure can be right in one
            // place and wrong in another on the same page.
            if (seen.has(el)) continue
            seen.add(el)
            add("violation", "number not in mono", `"${text.slice(0, 60)}" in ${face.split(",")[0]}`)
          }
        }

        /* Claims without evidence. */
        const EVIDENCE = /\d|AS\/?NZS|AS \d|AIRAH|ISO|DW\/|BACnet|Modbus|NABERS|ARCtick|VBA|AusHFG/
        for (const p of document.querySelectorAll("main p, main li")) {
          const text = p.textContent.trim().replace(/\s+/g, " ")
          if (text.length >= 60 && !EVIDENCE.test(text) && !p.querySelector("p, li") && visible(p)) {
            add("review", "claim with no number or reference", text.slice(0, 120))
          }
        }

        /* Imagery. */
        for (const img of document.querySelectorAll("img")) {
          const hay = `${img.getAttribute("src")} ${img.getAttribute("alt")}`.toLowerCase()
          if (/logo/.test(hay) && !/harrow/.test(hay)) add("violation", "logo image", hay)
          if (/stock|unsplash|shutterstock|pexels|handshake|hard ?hat|laptop|team|people|smiling/.test(hay)) {
            add("violation", "stock or banned subject", hay)
          }
        }

        return out
      },
      { bannedPhrases: BANNED_PHRASES, abstractHeadings: ABSTRACT_HEADINGS }
    )

    for (const item of result) {
      if (item.severity === "hero") heroUses.push({ route, viewport: viewport.name, text: item.detail })
      else flag(item.severity, route, viewport.name, item.check, item.detail)
    }

    /* Signal per viewport, stepping down the page one screen at a time. */
    await page.emulateMedia({ reducedMotion: "reduce" })
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    let worst = { count: 0, at: 0, items: [] }
    for (let y = 0; y < height; y += viewport.height) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await page.waitForTimeout(80)
      const { count, items } = await page.evaluate(() => {
        const SIGNAL = "rgb(226, 82, 27)"
        const items = []
        for (const el of document.querySelectorAll("body *")) {
          const box = el.getBoundingClientRect()
          if (box.bottom <= 0 || box.top >= innerHeight || box.width < 1 || box.height < 1) continue
          if (el.closest(".sr-only, [hidden]")) continue
          const s = getComputedStyle(el)
          if (s.visibility === "hidden" || s.display === "none") continue
          const ownText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
          // SVG paint inherits down the tree, so an element counts only where
          // it sets signal itself, not where it inherits it from a group.
          const parent = el.parentElement ? getComputedStyle(el.parentElement) : null
          const svgPaint =
            el instanceof SVGElement &&
            ((s.stroke === SIGNAL && parent?.stroke !== SIGNAL) || (s.fill === SIGNAL && parent?.fill !== SIGNAL))
          const painted =
            (ownText && s.color === SIGNAL && !(el instanceof SVGElement)) ||
            s.backgroundColor === SIGNAL ||
            ["Top", "Right", "Bottom", "Left"].some((side) => s[`border${side}Color`] === SIGNAL && parseFloat(s[`border${side}Width`]) > 0) ||
            (s.textDecorationLine.includes("underline") && s.textDecorationColor === SIGNAL) ||
            svgPaint
          if (painted) {
            const label = el.getAttribute("data-branch") ?? el.textContent.trim().slice(0, 24)
            items.push(el.tagName.toLowerCase() + (label ? ` "${label}"` : ""))
          }
        }
        return { count: items.length, items }
      })
      if (count > worst.count) worst = { count, at: y, items }
    }
    if (worst.count > 3) {
      flag("violation", route, viewport.name, "signal more than 3 times in a viewport", `${worst.count} at scroll ${worst.at}px: ${worst.items.join(", ")}`)
    }

    await page.close()
  }
  await context.close()
}
await browser.close()

/* Hero size: exactly the two sanctioned uses, per viewport. */
for (const viewport of VIEWPORTS) {
  const uses = heroUses.filter((use) => use.viewport === viewport.name)
  const onHome = uses.filter((use) => use.route === "/")
  const onAbout = uses.filter((use) => use.route === "/about")
  const elsewhere = uses.filter((use) => use.route !== "/" && use.route !== "/about")
  if (onHome.length !== 1) flag("violation", "/", viewport.name, "hero size count", `${onHome.length} uses on the homepage, expected 1`)
  if (onAbout.length !== 1) flag("violation", "/about", viewport.name, "hero size count", `${onAbout.length} uses on /about, expected 1`)
  for (const use of elsewhere) flag("violation", use.route, viewport.name, "hero size outside its two uses", use.text)
}

/* ---------------------------------------------------------------- report */

// Collapse identical flags seen at both viewports.
const merged = new Map()
for (const f of flags) {
  const key = `${f.severity}|${f.page}|${f.check}|${f.detail}`
  const existing = merged.get(key)
  if (existing) existing.viewport = `${existing.viewport}, ${f.viewport}`
  else merged.set(key, { ...f })
}
const report = [...merged.values()].sort(
  (a, b) => a.severity.localeCompare(b.severity) || a.page.localeCompare(b.page)
)

writeFileSync("boilerplate-report.json", JSON.stringify(report, null, 2))
const violations = report.filter((f) => f.severity === "violation").length
const reviews = report.filter((f) => f.severity === "review").length
const flagged = new Set(report.map((f) => f.page))
const clean = ROUTES.filter((route) => !flagged.has(route))

console.table(report)
console.log(`\n${violations} violations, ${reviews} review items across ${ROUTES.length} routes at 2 viewports.`)
console.log(`Routes with no flags: ${clean.length ? clean.join(", ") : "none"}`)
console.log(`Screenshots for the judgment pass: ${SHOTS}/`)
process.exit(violations > 0 ? 1 : 0)
