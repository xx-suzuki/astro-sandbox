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
