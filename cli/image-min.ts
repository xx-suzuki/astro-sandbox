import type { AvifOptions, GifOptions, JpegOptions, PngOptions, WebpOptions } from 'sharp';
import type { Config as SvgOptions } from 'svgo';

import { consoleExist, consoleSize, consoleSizeCompare } from '@root/cli/helper/drop-console';
import { createFolder, isIgnoreFile } from '@root/cli/helper/utils';
import { imageMin as config } from '@root/project.config';
import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'node:path';
import sharp from 'sharp';
import { optimize } from 'svgo';

/**
 * Options
 * @see https://sharp.pixelplumbing.com/api-output
 * @see https://github.com/svg/svgo
 */

interface Options {
  avif: AvifOptions;
  gif: GifOptions;
  jpeg: JpegOptions;
  png: PngOptions;
  svg: SvgOptions;
  webp: WebpOptions;
}

type SharpKeys = Exclude<keyof Options, 'svg'>;

const options: Options = {
  avif: {
    quality: 70,
  },
  gif: {},
  jpeg: {
    quality: 85,
  },
  // ----------------------------------
  // Sharp settings
  png: {
    adaptiveFiltering: true,
    compressionLevel: 9,
    effort: 10,
    palette: true,
    quality: 80,
  },
  // ----------------------------------
  // SVGO settings
  svg: {
    multipass: true,
    plugins: ['preset-default'],
  },
  webp: {},
};

const targets = process.argv[2] || config.files;

/** functions */
const isSharpFormat = (format: string): format is keyof sharp.FormatEnum => {
  return Object.keys(sharp.format).includes(format);
};

const imageMin = async (file: string): Promise<void> => {
  // ----------------------------------
  // ignore
  if (isIgnoreFile(file)) return;

  // ----------------------------------
  // files
  const imgExt = ['jpg', 'jpeg', 'png', 'gif'];
  const svgExt = ['svg'];
  const fileExtname = path.extname(file);
  const fileExt = fileExtname && fileExtname.slice(1);
  const fileName = path.basename(file, fileExtname);

  // ----------------------------------
  // dir
  const outFile = file.replace(config.base, config.outDir);
  const outDir = path.dirname(outFile);
  createFolder(outDir);

  // ----------------------------------
  // image-min
  if (fileExt && svgExt.includes(fileExt)) {
    // SVG
    const binaryData = fs.readFileSync(file);
    const { data } = optimize(String(binaryData), options.svg);
    await fs.outputFile(outFile, data);
    consoleSizeCompare(file, outFile);
  } else if (imgExt.includes(fileExt)) {
    // Images
    const ext = fileExt === 'jpg' ? 'jpeg' : fileExt;
    const src = sharp(file);
    const img = path.join(outDir, fileName + fileExtname);
    // const webp = path.join(outDir, `${fileName}.webp`);
    const avif = path.join(outDir, `${fileName}.avif`);

    if (!isSharpFormat(ext)) return;

    await Promise.all([
      src.toFormat(ext, options[ext as SharpKeys]).toFile(img),
      // src.webp(options.webp).toFile(webp),
      src.avif(options.avif).toFile(avif),
    ]);
    consoleSizeCompare(file, img);
    // consoleSizeCompare(file, webp);
    consoleSizeCompare(file, avif);
  } else {
    // Other
    await fs.copy(file, outFile);
    consoleSize(outFile);
  }
};

const init = async (): Promise<void> => {
  const files = fg.sync(targets);

  if (!process.argv[2] && files.length === 0) {
    return consoleExist('Image');
  }

  await Promise.all(files.map((f) => imageMin(f)));
};

/** init */
try {
  await init();
} catch (error) {
  console.trace(error);
  process.exitCode = 1;
}
