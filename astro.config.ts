import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { loadEnv } from 'vite';

import { baseDir, isDev as isDevelopment, outDir, siteUrl, tmpDir } from './project.config.ts';
const { DEV_PORT } = loadEnv(import.meta.env.MODE, process.cwd(), '');

export default defineConfig({
  base: baseDir,
  build: {
    inlineStylesheets: 'never',
  },
  cacheDir: '.cache/astro',
  compressHTML: false,
  devToolbar: {
    enabled: false,
  },
  fonts: [
    {
      cssVariable: '--font-main',
      display: 'swap',
      name: 'Noto Sans JP',
      provider: fontProviders.google(),
      styles: ['normal'],
      weights: [300, 500, 700],
    },
  ],
  integrations: [sitemap()],
  outDir: outDir,
  publicDir: tmpDir,
  server: {
    host: true,
    open: true,
    ...(isDevelopment && {
      port: Number.isNaN(Number(DEV_PORT)) ? 4321 : Number(DEV_PORT),
    }),
  },
  site: siteUrl,
  trailingSlash: 'always',
  vite: {
    build: {
      emptyOutDir: false,
    },
    cacheDir: '.cache/vite-astro',
    css: {
      devSourcemap: true,
    },
  },
});
