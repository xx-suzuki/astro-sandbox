import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { loadEnv } from 'vite';
import { isDev, siteUrl, baseDir, outDir, tmpDir } from './project.config.ts';
const { DEV_PORT } = loadEnv(import.meta.env.MODE, process.cwd(), '');

export default defineConfig({
  site: siteUrl,
  base: baseDir,
  publicDir: tmpDir,
  outDir: outDir,
  trailingSlash: 'always',
  compressHTML: false,
  integrations: [sitemap()],
  devToolbar: {
    enabled: false,
  },
  server: {
    open: true,
    host: true,
    ...(isDev
      ? {
          port: !isNaN(Number(DEV_PORT)) ? Number(DEV_PORT) : 4321,
        }
      : {}),
  },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Noto Sans JP',
        cssVariable: '--font-main',
      },
    ],
  },
  vite: {
    build: {
      emptyOutDir: false,
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
});
