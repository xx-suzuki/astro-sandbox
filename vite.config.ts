import type { PreRenderedAsset } from 'rollup';
import type { Plugin, PluginOption, UserConfigExport } from 'vite';

import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { assetsDir, outDir, tmpDir } from './project.config.ts';
const isInit = process.env.BUILD_BY === 'vite';

const viteConfig: UserConfigExport = {
  base: '/',
  build: {
    chunkSizeWarningLimit: 3000,
    cssCodeSplit: false,
    emptyOutDir: false,
    minify: 'terser',
    outDir,
    rollupOptions: {
      input: {
        main: './src/main.ts',
      },
      output: {
        assetFileNames: (chunkInfo: PreRenderedAsset) => resolveAssetFileName(chunkInfo),
        chunkFileNames: `${assetsDir.javascript.outDir}/[name].js`,
        entryFileNames: `${assetsDir.javascript.outDir}/${assetsDir.javascript.outName}.js`,
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          return;
        },
      },
    },
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
      },
      mangle: true,
      toplevel: true,
    },
  },
  plugins: [tsconfigPaths(), visualizer() as unknown as PluginOption, ignoreAssetWarnings()],
  publicDir: tmpDir,
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

function ignoreAssetWarnings(): Plugin {
  return {
    apply: 'build',
    configResolved() {
      const original = console.warn;
      console.warn = (...args: unknown[]) => {
        const msg = args[0];
        if (typeof msg === 'string' && msg.includes("didn't resolve at build time")) {
          return;
        }
        original(...args);
      };
    },
    name: 'intercept-console-warn',
  };
}
