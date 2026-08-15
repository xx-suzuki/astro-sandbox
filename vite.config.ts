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
        assetFileNames: (chunkInfo) => resolveAssetFileName(chunkInfo),
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

// rollup / rolldown で PreRenderedAsset の型が異なるため、参照するプロパティのみを構造的に受け取る
const resolveAssetFileName = (chunkInfo: { names?: readonly string[] }) => {
  const imgExtension = ['jpg', 'jpeg', 'gif', 'png', 'webp'];
  const cssExtension = ['css'];
  const name = chunkInfo.names?.[0];
  if (!name) return '';

  const fileExtname = path.extname(name);
  const fileExtension = fileExtname.slice(1);
  const fileName = path.basename(name);

  if (fileExtension && imgExtension.includes(fileExtension)) {
    return `${assetsDir.images.outDir}/${fileName}`;
  }
  if (fileExtension && cssExtension.includes(fileExtension)) {
    return `${assetsDir.styles.outDir}/${assetsDir.styles.outName}.css`;
  }
  return name;
};

function ignoreAssetWarnings(): Plugin {
  return {
    apply: 'build',
    configResolved() {
      const original = console.warn;
      console.warn = (...arguments_: unknown[]) => {
        const message = arguments_[0];
        if (typeof message === 'string' && message.includes("didn't resolve at build time")) {
          return;
        }
        original(...arguments_);
      };
    },
    name: 'intercept-console-warn',
  };
}
