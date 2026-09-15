import localFont from 'next/font/local'

/**
 * Cabinet Grotesk and Switzer fall back to metric matched faces declared from
 * `fontFallback` in design/tokens.ts, measured against the text the site
 * actually sets, instead of next/font's estimate. The family names here must
 * match the tokens; next/font only accepts literal options.
 */
export const cabinet = localFont({
    src: '../public/fonts/CabinetGrotesk-Variable.woff2',
    variable: '--font-cabinet-grotesk',
    display: 'swap',
    weight: '100 800',
    adjustFontFallback: false,
    fallback: ['Cabinet Grotesk Fallback', 'Arial', 'sans-serif'],
})

export const switzer = localFont({
    src: '../public/fonts/Switzer-Variable.woff2',
    variable: '--font-switzer',
    display: 'swap',
    weight: '100 900',
    adjustFontFallback: false,
    fallback: ['Switzer Fallback', 'Arial', 'sans-serif'],
})

/**
 * Every figure on the site is set in this face, often inside a line of
 * Cabinet Grotesk or Switzer, and the filter controls wrap on its widths. Its
 * fallback is therefore a monospace with the same 0.6em advance, not a size
 * adjusted Arial, so no line changes width when the web font arrives. The
 * fallback face, from `fontFallback.mono` in design/tokens.ts, also matches
 * its ascent and descent, so lines mixing figures and text keep their height.
 * The generic comes last, never alone, so it keeps the page font size.
 */
export const jetbrains = localFont({
    src: '../public/fonts/JetBrainsMono-Variable.woff2',
    variable: '--font-jetbrains-mono',
    display: 'swap',
    weight: '100 800',
    adjustFontFallback: false,
    fallback: ['JetBrains Mono Fallback', 'Courier New', 'monospace'],
})