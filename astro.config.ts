import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { isDev, siteUrl, baseDir, outDir, tmpDir } from './project.config.mjs';

const integrations = isDev ? [tailwind({ applyBaseStyles: false })] : [];
const { DEV_PORT } = loadEnv(import.meta.env.MODE, process.cwd(), '');

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
    port: Number(DEV_PORT) ?? undefined,
  },
  vite: {
    css: {
      devSourcemap: true,
    },
  },
});
