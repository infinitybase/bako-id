import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

console.log(`Vercel ENV: ${process.env.VERCEL_ENV}`);

export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  mode: process.env.VERCEL_ENV,
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        define: {
          global: {},
        },
      }
    : {}),
});
