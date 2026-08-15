import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { loadEnv } from 'vite';

import { baseDir, isDev as isDevelopment, outDir, siteUrl, tmpDir } from './project.config.ts';
const { DEV_PORT } = loadEnv(import.meta.env.MODE, process.cwd(), '');

export default defineConfig({
  base: baseDir,
  compressHTML: false,
  devToolbar: {
    enabled: false,
  },
  fonts: [
    {
      cssVariable: '--font-main',
      name: 'Noto Sans JP',
      provider: fontProviders.google(),
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
    css: {
      devSourcemap: true,
    },
  },
});
