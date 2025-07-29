import fs from 'node:fs';
import path from 'node:path';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

console.log(`Vercel ENV: ${process.env.VERCEL_ENV}`);

const configs = {
  garage: {
    favicon: '/garage-favicon.svg',
    title: 'Garage',
  },
  bako: {
    favicon: '/logo.svg',
    title: 'Bako Identity',
  },
};

function multiDomainPlugin() {
  return {
    name: 'multi-domain',
    generateBundle() {
      const templatePath = path.resolve('index-prod.html');

      if (!fs.existsSync(templatePath)) {
        console.error('index-prod.html not found');
        return;
      }

      const template = fs.readFileSync(templatePath, 'utf-8');

      // biome-ignore lint/complexity/noForEach: <explanation>
      Object.entries(configs).forEach(([key, config]) => {
        const html = template
          .replace(/{LOGO}/g, config.favicon)
          .replace(/{TITLE}/g, config.title);

        this.emitFile({
          type: 'asset',
          fileName: `${key}.html`,
          source: html,
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), TanStackRouterVite(), multiDomainPlugin()],
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
