import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Names deliberately contain no banned characters, so this file
// cannot be mangled by a find-and-replace on its own subject matter.
const BANNED = [
    { char: '\u2014', code: 'U+2014', name: 'em dash' },
    { char: '\u2013', code: 'U+2013', name: 'en dash' },
    { char: '\u2018', code: 'U+2018', name: 'curly single quote' },
    { char: '\u2019', code: 'U+2019', name: 'curly apostrophe' },
    { char: '\u201C', code: 'U+201C', name: 'curly double quote, open' },
    { char: '\u201D', code: 'U+201D', name: 'curly double quote, close' },
]

const dir = 'content'
let failed = false

for (const file of readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
    const path = join(dir, file)
    const lines = readFileSync(path, 'utf8').split('\n')

    let inBlockComment = false

    lines.forEach((line, i) => {
        const trimmed = line.trim()

        if (inBlockComment) {
            if (trimmed.includes('*/')) inBlockComment = false
            return
        }
        if (trimmed.startsWith('/*')) {
            if (!trimmed.includes('*/')) inBlockComment = true
            return
        }
        if (trimmed.startsWith('//') || trimmed.startsWith('*')) return

        for (const { char, code, name } of BANNED) {
            if (line.includes(char)) {
                console.error(`${path}:${i + 1}  banned character: ${name} (${code})`)
                console.error(`  ${line.trim()}`)
                failed = true
            }
        }
    })
}

if (failed) {
    console.error('\nContent check failed. Use a comma, a colon, a full stop, or restructure.')
    process.exit(1)
}

console.log('Content check passed.')