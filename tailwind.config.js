/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F19",
        card: "#12182A",
        primary: "#7C3AED",
        secondary: "#10B981",
        muted: "#9CA3AF",
     },
   },
 },
  plugins: [],
}


