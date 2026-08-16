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
  fonts: {
    outDir: 'assets/fonts',
  },
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
// image-min.ts
export const imageMin = {
  base: 'src/assets/images',
  // 生成物のキャッシュ。.tmp の外に置き、clean-up の対象にしない
  cacheDir: '.cache/images',
  files: 'src/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}',
  manifest: '.cache/images/manifest.json',
  outDir: `${tmpDir}/${assetsDir.images.outDir}`,
};

// ----------------------------------
// svg-sprite.ts
export const svgSprite = {
  base: 'src/assets/svg-sprite',
  files: 'src/assets/svg-sprite/*.svg',
  outDir: `${tmpDir}/${assetsDir.sprite.outDir}`,
  outName: assetsDir.sprite.outName,
  // 生成物。直接編集しない
  scssPath: 'src/styles/setting/variable/_svg.scss',
  typesPath: 'src/types/svg-sprite.ts',
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
// html-prettify.ts
export const htmlPrettify = {
  files: `${distDir}/**/*.html`,
  ignore: ['**/assets/**'],
};

// ----------------------------------
// validate-html.ts
export const validateHtml = {
  files: `${distDir}/**/*.html`,
  ignore: ['**/assets/**'],
  report: 'report-w3c.txt',
};

// ----------------------------------
// relocate-astro-fonts.ts
export const relocateAstroFonts = {
  baseDir,
  distDir,
  targetFontPath: assetsDir.fonts.outDir,
};

// ----------------------------------
// font-awesome.ts
export const fontAwesome = {
  file: 'scripts/node/data/icon-families.json',
  outDir: svgSprite.base,
};
