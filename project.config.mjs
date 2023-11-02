// ----------------------------------
// Utility
export const siteUrl = 'https://example.com';

export const isDev = process.env.NODE_ENV === 'development';

export const isProd = process.env.NODE_ENV === 'production';

export const assetsDir = 'src/assets';

export const baseDir = '';

export const outDir = `dist/${baseDir}`;

export const tmpDir = '.tmp';

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
  outDir: `${tmpDir}/assets/images`,
  outName: 'sprite',
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
