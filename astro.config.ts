import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { isDev, siteUrl, baseDir, outDir, tmpDir } from './project.config.mjs';

const integrations = isDev ? [tailwind({ applyBaseStyles: false })] : [];

export default defineConfig({
  site: siteUrl,
  base: baseDir,
  publicDir: tmpDir,
  outDir: outDir,
  trailingSlash: 'always',
  compressHTML: false,
  devToolbar: {
    enabled: false,
  },
  integrations,
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
