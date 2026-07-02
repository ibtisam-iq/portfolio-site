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
        'surface-0': '#0B0F19',
        'surface-1': '#12182A',
        'surface-2': '#1c2128',
        'surface-3': '#21262d',
        'border-subtle': 'rgba(48,54,61,0.8)',
        'teal-accent': '#00b4d8',
        'teal-muted': '#0077b6',
        'text-primary': '#e6edf3',
        'text-muted': '#848d97',
        'text-faint': '#484f58',
        'light-bg': '#f6f8fa',
        'light-surface': '#ffffff',
        'light-surface-2': '#f0f2f5',
        'light-border': 'rgba(208,215,222,0.8)',
        'light-text': '#1f2328',
        'light-muted': '#656d76',
        primary: '#7C3AED',
        secondary: '#10B981',
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
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
