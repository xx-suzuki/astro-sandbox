import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { siteUrl, baseDir, outDir, tmpDir } from './project.config.mjs';

export default defineConfig({
  site: siteUrl,
  base: baseDir,
  publicDir: tmpDir,
  outDir: outDir,
  trailingSlash: 'always',
  compressHTML: false,
  integrations: [tailwind()],
  server: {
    open: true,
    host: true,
  },
  vite: {
    css: {
      devSourcemap: true,
    },
  },
});
