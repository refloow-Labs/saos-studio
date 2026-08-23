/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm-biased editorial palette. Structural colour is still near-black;
        // what changed is that the neutrals now share the accent's hue instead
        // of ignoring it. #6b7280 and #9ca3af are Tailwind's *blue* greys, and
        // sitting them beside an amber accent read as two unrelated systems on
        // one page. Token names are unchanged on purpose, so re-tinting the
        // whole site is this block and nothing else.
        bg: '#FBFAF7',
        surface: '#F3F0EA',
        'surface-2': '#EAE5DB',
        'surface-3': '#E0DACD',
        'surface-4': '#D5CDBD',
        ink: '#14110C',
        text: '#14110C',
        muted: '#6B6257',
        // Decoration only. Measured against the grounds it can sit on, muted-2
        // is 3.05:1 on `bg`, 2.89:1 on `wash`, 2.73:1 on `surface` -- under AA
        // (4.5:1) everywhere, and under the 3:1 large-text floor on two of the
        // three. Safe for hairlines, icons and dividers; never for text.
        // Use `muted` (5.26:1 on surface) for anything a person has to read.
        'muted-2': '#9A9186',
        accent: '#14110C',
        'accent-dim': '#3F382E',
        border: 'rgba(20,17,12,0.11)',
        'border-hover': 'rgba(20,17,12,0.20)',
        // Full-bleed dark "colour break" sections — the device that stops a long
        // light page reading as one undifferentiated scroll.
        break: '#14110C',
        'break-2': '#1E1A14',
        // The single warm accent. Black stays the structural colour; `warm` is the
        // page's one non-monochrome signal, reserved for conversion CTAs, emphasis
        // words inside dark breaks, and the hand-drawn doodles. Changing this one
        // value re-tints every accent on the site — that is the point.
        warm: '#FDB226',
        'warm-dim': '#E89F14',
        // Accent as TEXT. warm-dim is a hover/fill tone: measured as text it is
        // 2.23:1 on white, 2.05:1 on warm-soft, 1.96:1 on surface -- it fails AA
        // on every ground the site has. warm-ink is the same hue darkened until
        // it clears 4.5:1 everywhere (5.70 / 5.22 / 5.01). Use it for badges,
        // labels, form errors and accent hover states; keep warm-dim for fills,
        // borders and decorative icons.
        'warm-ink': '#8A5E09',
        'warm-soft': '#FFF4DC',
        // Ground ladder. `warm` at full chroma cannot carry running text --
        // muted text on it measures 3.3:1 -- so the grounds that whole sections
        // sit on are separate, lighter steps of the same hue. See Ground.tsx.
        wash: '#FDF6E9',
        'wash-2': '#FBEDD3',
        'amber-soft': '#FCD68A',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        headline: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1.5rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
    },
  },
  plugins: [],
}
