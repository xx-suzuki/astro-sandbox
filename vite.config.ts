import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import type { UserConfigExport } from 'vite';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { outDir } from './project.config.mjs';
const isInit = process.env.BUILD_BY === 'vite';

const viteConfig: UserConfigExport = {
  base: '',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/'),
    },
  },
  plugins: [splitVendorChunkPlugin(), visualizer()],
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
        manualChunks: undefined,
        entryFileNames: 'JS/bundle.js',
        chunkFileNames: `JS/[name].js`,
        assetFileNames(info) {
          if (info.name === 'style.css') {
            return `CSS/app.css`;
          }
          return info.name ?? '';
        },
      },
    },
    chunkSizeWarningLimit: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use 'sass:map';
          @use 'sass:math';
          @use 'src/styles/additional/variable' as var;
          @use 'src/styles/additional/function' as func;
          @use 'src/styles/additional/mixin' as mixin;
        `,
      },
    },
  },
};

export default defineConfig(isInit ? viteConfig : {});
