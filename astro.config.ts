import path from 'node:path';
import { defineConfig } from 'astro/config';
import type { PreRenderedAsset } from 'rollup';
import { siteUrl, baseDir, outDir, tmpDir } from './project.config.mjs';

export default defineConfig({
  site: siteUrl,
  base: baseDir,
  publicDir: tmpDir,
  outDir: outDir,
  trailingSlash: 'always',
  compressHTML: false,
  server: {
    open: true,
    host: true,
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
          assetFileNames: (chunkInfo: PreRenderedAsset) => resolveAssetFileName(chunkInfo),
        },
      },
      cssCodeSplit: false,
    },
    css: {
      devSourcemap: true,
    },
    plugins: [],
  },
});

const resolveAssetFileName = (chunkInfo: PreRenderedAsset) => {
  const imgExt = ['jpg', 'jpeg', 'gif', 'png', 'svg', 'webp', 'avif'];
  const cssExt = ['css'];
  const fileExtname = chunkInfo.name && path.extname(chunkInfo.name);
  const fileExt = fileExtname && fileExtname.slice(1);

  if (fileExt && imgExt.includes(fileExt)) {
    return `IMAGES/[name][extname]`;
  } else if (fileExt && cssExt.includes(fileExt)) {
    return `CSS/[name][extname]`;
  } else {
    return `[name][extname]`;
  }
};
