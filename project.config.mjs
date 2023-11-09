// ----------------------------------
// Utility
export const isDev = process.env.NODE_ENV === 'development';

export const isProd = process.env.NODE_ENV === 'production';

// ----------------------------------
// Project settings
export const siteUrl = 'https://example.com';

export const baseDir = '';

export const outDir = `dist/${baseDir}`;

export const tmpDir = '.tmp';

export const assetsDir = {
  javascript: {
    outDir: 'assets/js',
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
export const cleanUp = [tmpDir, outDir];

// ----------------------------------
// image-min.mjs
export const imageMin = {
  base: 'src/assets/images',
  outDir: `${tmpDir}/assets/images`,
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
