import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Production: VITE_BASE_PATH is unset → defaults to '/'
  // PR preview: VITE_BASE_PATH = '/pr-preview/pr-N/' (injected by deploy.yml)
  base: process.env.VITE_BASE_PATH ?? '/',

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
