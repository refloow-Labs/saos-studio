/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light, high-contrast editorial palette. Accent = black.
        bg: '#ffffff',
        surface: '#f5f5f4',
        'surface-2': '#efefed',
        'surface-3': '#e7e7e4',
        'surface-4': '#dedede',
        ink: '#0a0a0a',
        text: '#0a0a0a',
        muted: '#6b7280',
        'muted-2': '#9ca3af',
        accent: '#0a0a0a',
        'accent-dim': '#3f3f46',
        border: 'rgba(0,0,0,0.08)',
        'border-hover': 'rgba(0,0,0,0.16)',
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
