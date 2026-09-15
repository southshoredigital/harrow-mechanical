import localFont from 'next/font/local'

export const cabinet = localFont({
    src: '../public/fonts/CabinetGrotesk-Variable.woff2',
    variable: '--font-cabinet-grotesk',
    display: 'swap',
    weight: '100 800',
    adjustFontFallback: 'Arial',
})

export const switzer = localFont({
    src: '../public/fonts/Switzer-Variable.woff2',
    variable: '--font-switzer',
    display: 'swap',
    weight: '100 900',
    adjustFontFallback: 'Arial',
})

/**
 * Every figure on the site is set in this face, often inside a line of
 * Cabinet Grotesk or Switzer, and the filter controls wrap on its widths. Its
 * fallback is therefore a monospace with the same 0.6em advance, not a size
 * adjusted Arial: when the web font arrives no line changes width, so nothing
 * rewraps and nothing shifts. Liberation Mono is Courier New's metric twin on
 * Linux; the generic comes last, never alone, so it keeps the page font size.
 */
export const jetbrains = localFont({
    src: '../public/fonts/JetBrainsMono-Variable.woff2',
    variable: '--font-jetbrains-mono',
    display: 'swap',
    weight: '100 800',
    adjustFontFallback: false,
    fallback: ['Courier New', 'Liberation Mono', 'monospace'],
})