import { defineConfig } from 'astro/config';
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
