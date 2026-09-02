// Vite build configuration: the React plugin, the base path, and the output directory.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Unset in production, so the site is served from the domain root. A pull-request
  // preview sets it to the sub-path it is served from; .github/workflows/pages.yml is
  // where that value comes from, and it has to match the deploy step's umbrella directory.
  base: process.env.VITE_BASE_PATH ?? '/',

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
