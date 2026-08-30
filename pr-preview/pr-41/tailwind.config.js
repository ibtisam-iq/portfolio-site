// Tailwind theme for the site: the palette, the two type families, and the keyframes.
// Colours are named here; the accent itself is a CSS variable defined per theme in
// src/index.css, so a single token carries both.

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // True neutrals: R, G and B are equal in every value below, so saturation is zero
        // by construction rather than by eye. Values that merely look neutral are not;
        // an earlier set measured 10 to 13% saturation and dropped `faint` to 4.43:1.
        'surface-0': '#0A0A0A',
        'surface-1': '#121212',
        'surface-2': '#1A1A1A',
        'surface-3': '#222222',
        'border-subtle': '#272727',
        'teal-accent': 'rgb(var(--accent-rgb) / <alpha-value>)',
        'teal-muted': 'rgb(var(--accent-rgb) / 0.7)',
        /*
         * Three text tiers per theme, every one clearing 4.5:1 on every surface it can land
         * on. The measured table is in REFERENCE.md. Lightening any of these, or changing a
         * surface above, invalidates it: rerun `npm run check:contrast`.
         */
        'text-primary': '#FAFAFA',
        'text-muted': '#A3A3A3',
        'text-faint': '#8A8A8A',
        'light-bg': '#FFFFFF',
        'light-surface': '#FAFAFA',
        'light-surface-2': '#F4F4F4',
        'light-border': '#DCDCDC',
        'light-text': '#0A0A0A',
        'light-muted': '#5C5C5C',
        'light-faint': '#6F6F6F',
        // One accent for the site, and these two names are aliases of it.
        primary: 'rgb(var(--accent-rgb) / <alpha-value>)',
        secondary: 'rgb(var(--accent-rgb) / 0.7)',
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.25s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        // The availability dot. It needs no reduced-motion guard: src/index.css forces
        // every animation to a single 0.01ms pass, so the ring never becomes visible.
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
        pulseRing: {
          '0%': { opacity: '0.6', transform: 'scale(1)' },
          '70%, 100%': { opacity: '0', transform: 'scale(2.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
