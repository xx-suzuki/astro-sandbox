// ----------------------------------
// Utility
export const isDev = process.env.NODE_ENV === 'development';

export const isProd = process.env.NODE_ENV === 'production';

// ----------------------------------
// Project settings
export const siteUrl = 'https://example.com';

// 読み込んでいるhtmlのパスがズレるため、開発時はルートに設定
export const baseDir = isDev ? '/' : '/production/';

export const distDir = `dist`;

export const outDir = `${distDir}${baseDir}`;

export const tmpDir = '.tmp';

export const assetsDir = {
  javascript: {
    outDir: `assets/js`,
    outName: 'bundle',
  },
  styles: {
    outDir: 'assets/css',
    outName: 'styles',
  },
  images: {
    outDir: 'assets/images',
    outName: '[name]',
  },
  sprite: {
    outDir: 'assets/images',
    outName: 'sprite',
  },
};

export const imgDir = `${baseDir}${assetsDir.images.outDir}`;

export const breakpoints = {
  sp: 768 - 0.02,
  pc: 768,
  tab: 1024,
  desktop: 1440,
  huge: 1920,
};

export const designSize = {
  sp: 375,
  pc: 1440,
};

// ----------------------------------
// clean-up.mjs
export const cleanUp = isDev ? [tmpDir] : [tmpDir, distDir];

// ----------------------------------
// image-min.mjs
export const imageMin = {
  base: 'src/assets/images',
  outDir: `${tmpDir}/${assetsDir.images.outDir}`,
  files: 'src/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}',
};

// ----------------------------------
// svg-sprite.mjs
export const svgSprite = {
  base: 'src/assets/svg-sprite',
  outDir: `${tmpDir}/${assetsDir.sprite.outDir}`,
  outName: assetsDir.sprite.outName,
  files: 'src/assets/svg-sprite/*.svg',
};

// ----------------------------------
// font-awesome
export const fontAwesome = {
  file: 'tasks/font-awesome/icon-families.json',
  outDir: 'src/assets/svg-sprite',
};

// ----------------------------------
// html-prettify.mjs
export const htmlPrettify = {
  files: 'dist/**/*.html',
  ignore: ['**/assets/**'],
};

// ----------------------------------
// validate-html.mjs
export const validateHtml = {
  files: 'dist/**/*.html',
  ignore: ['**/assets/**'],
};

// ----------------------------------
// static-copy.mjs
export const staticCopy = [
  {
    base: 'static/assets',
    outDir: `${tmpDir}/assets`,
    useProduction: true,
  },
  {
    base: 'static/root',
    outDir: tmpDir,
    useProduction: true,
  },
];
