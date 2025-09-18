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
  images: {
    outDir: 'assets/images',
    outName: '[name]',
  },
  javascript: {
    outDir: `assets/js`,
    outName: 'bundle',
  },
  sprite: {
    outDir: 'assets/images',
    outName: 'sprite',
  },
  styles: {
    outDir: 'assets/css',
    outName: 'styles',
  },
};

export const imgDir = `${baseDir}${assetsDir.images.outDir}`;

export const svgSpritePath = `${baseDir}${assetsDir.sprite.outDir}/${assetsDir.sprite.outName}.svg`;

export const breakpoints = {
  desktop: 1440,
  huge: 1920,
  pc: 768,
  sp: 768 - 0.02,
  tab: 1024,
};

export const designSize = {
  pc: 1440,
  sp: 375,
};

// ----------------------------------
// clean-up.ts
export const cleanUp = isDev ? [tmpDir] : [tmpDir, distDir];

// ----------------------------------
// image-min.ts
export const imageMin = {
  base: 'src/assets/images',
  files: 'src/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}',
  outDir: `${tmpDir}/${assetsDir.images.outDir}`,
};

// ----------------------------------
// svg-sprite.ts
export const svgSprite = {
  base: 'src/assets/svg-sprite',
  files: 'src/assets/svg-sprite/*.svg',
  outDir: `${tmpDir}/${assetsDir.sprite.outDir}`,
  outName: assetsDir.sprite.outName,
};

// ----------------------------------
// font-awesome.ts
export const fontAwesome = {
  file: 'cli/font-awesome/icon-families.json',
  outDir: 'src/assets/svg-sprite',
};

// ----------------------------------
// html-prettify.ts
export const htmlPrettify = {
  files: 'dist/**/*.html',
  ignore: ['**/assets/**'],
};

// ----------------------------------
// validate-html.ts
export const validateHtml = {
  files: 'dist/**/*.html',
  ignore: ['**/assets/**'],
};

// ----------------------------------
// static-copy.ts
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

// ----------------------------------
// relocate-astro-fonts.ts
export const relocateAstroFonts = {
  baseDir,
  distDir,
  targetFontPath: 'assets/fonts',
};
