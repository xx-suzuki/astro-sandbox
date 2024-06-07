import path from 'node:path';
import type { PreRenderedAsset } from 'rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import type { UserConfigExport } from 'vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { outDir, assetsDir } from './project.config.mjs';
const isInit = process.env.BUILD_BY === 'vite';

const viteConfig: UserConfigExport = {
  base: '',
  plugins: [tsconfigPaths(), visualizer()],
  build: {
    outDir,
    cssCodeSplit: false,
    sourcemap: false,
    emptyOutDir: false,
    minify: 'terser',
    terserOptions: {
      mangle: true,
      toplevel: true,
      compress: {
        drop_console: false,
      },
    },
    rollupOptions: {
      input: {
        main: './src/main.ts',
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        entryFileNames: `${assetsDir.javascript.outDir}/${assetsDir.javascript.outName}.js`,
        chunkFileNames: `${assetsDir.javascript.outDir}/[name].js`,
        assetFileNames: (chunkInfo: PreRenderedAsset) => resolveAssetFileName(chunkInfo),
      },
    },
    chunkSizeWarningLimit: 3000,
  },
};

export default defineConfig(isInit ? viteConfig : {});

const resolveAssetFileName = (chunkInfo: PreRenderedAsset) => {
  const imgExt = ['jpg', 'jpeg', 'gif', 'png', 'webp'];
  const cssExt = ['css'];
  const fileExtname = chunkInfo.name && path.extname(chunkInfo.name);
  const fileExt = fileExtname && fileExtname.slice(1);
  const fileName = chunkInfo.name && path.basename(chunkInfo.name);

  if (fileExt && imgExt.includes(fileExt)) {
    return `${assetsDir.images.outDir}/${fileName}`;
  } else if (fileExt && cssExt.includes(fileExt)) {
    return `${assetsDir.styles.outDir}/${assetsDir.styles.outName}.css`;
  } else {
    return `${chunkInfo.name}`;
  }
};
