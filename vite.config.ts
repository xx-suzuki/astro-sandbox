import path from 'node:path';
import type { PreRenderedAsset } from 'rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import type { UserConfigExport } from 'vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { outDir, assetsDir } from './project.config.ts';
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
        drop_console: true,
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
          return;
        },
        entryFileNames: `${assetsDir.javascript.outDir}/${assetsDir.javascript.outName}.js`,
        chunkFileNames: `${assetsDir.javascript.outDir}/[name].js`,
        assetFileNames: (chunkInfo: PreRenderedAsset) => resolveAssetFileName(chunkInfo),
      },
    },
    chunkSizeWarningLimit: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
};

export default defineConfig(isInit ? viteConfig : {});

const resolveAssetFileName = (chunkInfo: PreRenderedAsset) => {
  const imgExt = ['jpg', 'jpeg', 'gif', 'png', 'webp'];
  const cssExt = ['css'];
  const name = chunkInfo.names?.[0];
  if (!name) return '';

  const fileExtname = path.extname(name);
  const fileExt = fileExtname.slice(1);
  const fileName = path.basename(name);

  if (fileExt && imgExt.includes(fileExt)) {
    return `${assetsDir.images.outDir}/${fileName}`;
  } else if (fileExt && cssExt.includes(fileExt)) {
    return `${assetsDir.styles.outDir}/${assetsDir.styles.outName}.css`;
  } else {
    return `${name}`;
  }
};
