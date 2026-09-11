import { writeFileSync } from 'node:fs'
import {
    color,
    fontSize,
    fontLeading,
    fontWeight,
    space,
    sectionSpacing,
    lineHeight,
    letterSpacing,
    measure,
    motion,
    focus,
    rail,
    breakpoint,
    layout,
} from '../design/tokens.ts'

const lines = ['@theme {']

for (const [k, v] of Object.entries(color)) {
    if (typeof v === 'string') lines.push(`  --color-${k}: ${v};`)
}
for (const [group, values] of Object.entries(color)) {
    if (typeof values === 'object') {
        for (const [k, v] of Object.entries(values)) {
            lines.push(`  --color-${group}-${k}: ${v};`)
        }
    }
}
// Each size ships with its leading, so a bare `text-*` utility never falls
// back to a framework default that nobody chose.
for (const [k, v] of Object.entries(fontSize)) {
    lines.push(`  --text-${k}: ${v};`)
    lines.push(`  --text-${k}--line-height: ${fontLeading[k]};`)
}
for (const [k, v] of Object.entries(fontWeight)) lines.push(`  --font-weight-${k}: ${v};`)
for (const [k, v] of Object.entries(space)) lines.push(`  --spacing-${k}: ${v};`)
for (const [k, v] of Object.entries(sectionSpacing)) lines.push(`  --spacing-section-${k}: ${v};`)
for (const [k, v] of Object.entries(lineHeight)) lines.push(`  --leading-${k}: ${v};`)
for (const [k, v] of Object.entries(letterSpacing)) lines.push(`  --tracking-${k}: ${v};`)

// Motion. Durations are stored as numbers in the token file so they can be
// handed to GSAP; CSS needs the unit.
for (const [k, v] of Object.entries(motion.ease)) lines.push(`  --ease-${kebab(k)}: ${v};`)
for (const [k, v] of Object.entries(motion.duration)) lines.push(`  --duration-${kebab(k)}: ${v}ms;`)
lines.push(`  --duration-hover: ${motion.hover}ms;`)
lines.push(`  --stagger-reveal: ${motion.stagger}ms;`)

lines.push(`  --focus-color: ${focus.color};`)
lines.push(`  --focus-width: ${focus.width};`)
lines.push(`  --focus-offset: ${focus.offset};`)

for (const [k, v] of Object.entries(breakpoint)) lines.push(`  --breakpoint-${k}: ${v};`)

lines.push(`  --font-display: var(--font-cabinet-grotesk);`)
lines.push(`  --font-body: var(--font-switzer);`)
lines.push(`  --font-mono: var(--font-jetbrains-mono);`)
lines.push(`  --radius: 0;`)
lines.push(`  --measure: ${measure};`)
lines.push(`  --rail-width: ${rail.width};`)
lines.push(`  --rail-width-wide: ${rail.widthWide};`)
lines.push(`  --rail-mobile-height: ${rail.mobileHeight};`)
lines.push(`  --rail-mobile-index-height: ${rail.mobileIndexHeight};`)
lines.push(`  --rail-mobile-total-height: ${rail.mobileTotalHeight};`)
lines.push(`  --layout-max: ${layout.maxWidth};`)
lines.push(`  --layout-gutter: ${layout.gutter};`)
lines.push(`  --layout-gutter-wide: ${layout.gutterWide};`)
lines.push('}')

writeFileSync('app/tokens.css', lines.join('\n') + '\n')
console.log('Generated app/tokens.css')

function kebab(key) {
    return key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
}
