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

export const jetbrains = localFont({
    src: '../public/fonts/JetBrainsMono-Variable.woff2',
    variable: '--font-jetbrains-mono',
    display: 'swap',
    weight: '100 800',
})