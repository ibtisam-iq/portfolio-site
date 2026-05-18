import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Critical for GitHub Pages + custom domain
  base: '/',

  // Optional but recommended enhancements
  build: {
    outDir: 'dist',
    sourcemap: true, // Helpful for debugging in production if needed
  },

  // If you're using React Router, this helps with client-side routing on refresh
  server: {
    // Only needed during local development
    // GitHub Pages doesn't support fallback, so we handle it via a 404.html redirect later if needed
  },
});
