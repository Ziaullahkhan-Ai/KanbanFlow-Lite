import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [],
  define: {
    // This bridges the environment variable to the browser context
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});