import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind(), react()],
  output: 'static',
  build: {
    assets: '_assets',
  },
  vite: {
    optimizeDeps: {
      exclude: ['@sanity/client'],
    },
  },
  site: 'https://mipremierlawncare.com',
});
