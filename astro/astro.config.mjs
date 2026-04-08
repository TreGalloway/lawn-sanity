import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
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
