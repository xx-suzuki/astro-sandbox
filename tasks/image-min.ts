import path from 'node:path';
import fg from 'fast-glob';
import fs from 'fs-extra';
import sharp from 'sharp';
import type { PngOptions, JpegOptions, GifOptions, WebpOptions, AvifOptions } from 'sharp';
import { optimize } from 'svgo';
import type { Config as SvgOptions } from 'svgo';
import { imageMin as config } from '../project.config.mjs';
import { consoleSizeCompare, consoleSize, consoleExist } from './helper/drop-console';
import { isIgnoreFile, createFolder } from './helper/utils';

/**
 * Options
 * @see https://sharp.pixelplumbing.com/api-output
 * @see https://github.com/svg/svgo
 */

type Options = {
  png: PngOptions;
  jpeg: JpegOptions;
  gif: GifOptions;
  webp: WebpOptions;
  avif: AvifOptions;
  svg: SvgOptions;
};

const options: Options = {
  // ----------------------------------
  // Sharp settings
  png: {
    compressionLevel: 9,
    adaptiveFiltering: true,
    progressive: true,
  },
  jpeg: {
    quality: 85,
  },
  gif: {},
  webp: {},
  avif: {
    quality: 70,
  },
  // ----------------------------------
  // SVGO settings
  svg: {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
          },
        },
      },
    ],
  },
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
      src.toFormat(ext, options[ext]).toFile(img),
      // src.webp(options.webp[ext]).toFile(webp),
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

  if (!process.argv[2] && !fs.existsSync(files[0])) {
    return consoleExist('Image');
  }

  await Promise.all(files.map(imageMin));
};

/** init */
init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
