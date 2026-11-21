import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/lucide-react')) return 'icons-vendor';
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/scheduler') ||
            id.includes('node_modules/@remix-run')
          ) {
            return 'react-vendor';
          }
          if (id.includes('/src/data/jobs.js') || id.includes('\\src\\data\\jobs.js')) {
            return 'jobs-data';
          }
        },
      },
    },
  },
});
