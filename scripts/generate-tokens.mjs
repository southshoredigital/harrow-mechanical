import { writeFileSync } from 'node:fs'
import { color, fontSize, space, lineHeight, letterSpacing, measure, rail, layout } from '../design/tokens.ts'

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
for (const [k, v] of Object.entries(fontSize)) lines.push(`  --text-${k}: ${v};`)
for (const [k, v] of Object.entries(space)) lines.push(`  --spacing-${k}: ${v};`)
for (const [k, v] of Object.entries(lineHeight)) lines.push(`  --leading-${k}: ${v};`)
for (const [k, v] of Object.entries(letterSpacing)) lines.push(`  --tracking-${k}: ${v};`)

lines.push(`  --font-display: var(--font-cabinet-grotesk);`)
lines.push(`  --font-body: var(--font-switzer);`)
lines.push(`  --font-mono: var(--font-jetbrains-mono);`)
lines.push(`  --radius: 0;`)
lines.push(`  --measure: ${measure};`)
lines.push(`  --rail-width: ${rail.width};`)
lines.push(`  --rail-mobile-height: ${rail.mobileHeight};`)
lines.push(`  --layout-max: ${layout.maxWidth};`)
lines.push('}')

writeFileSync('app/tokens.css', lines.join('\n') + '\n')
console.log('Generated app/tokens.css')