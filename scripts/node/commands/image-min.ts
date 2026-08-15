import type {
  AvifOptions,
  FormatEnum,
  GifOptions,
  JpegOptions,
  PngOptions,
  WebpOptions,
} from 'sharp';
import type { Config as SvgOptions } from 'svgo';

import { imageMin as config } from '@root/project.config';
import { isDirectRun, runCommandCli } from '@scripts-node/core/cli';
import { consoleExist, consoleSize, consoleSizeCompare } from '@scripts-node/helper/drop-console';
import { resolveTargets } from '@scripts-node/helper/targets';
import { createFolder, isIgnoreFile } from '@scripts-node/helper/utils';
import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'node:path';
import sharp from 'sharp';
import { optimize } from 'svgo';

interface Options {
  avif: AvifOptions;
  gif: GifOptions;
  jpeg: JpegOptions;
  png: PngOptions;
  svg: SvgOptions;
  webp: WebpOptions;
}

type SharpKeys = Exclude<keyof Options, 'svg'>;

// ----------------------------------
// config
const imageTargetPattern = /\.(jpg|jpeg|png|gif|svg|webp)$/i;

// https://sharp.pixelplumbing.com/api-output
// https://github.com/svg/svgo
const options: Options = {
  avif: {
    quality: 70,
  },
  gif: {},
  jpeg: {
    quality: 85,
  },
  png: {
    adaptiveFiltering: true,
    compressionLevel: 9,
    effort: 10,
    palette: true,
    quality: 80,
  },
  svg: {
    multipass: true,
    plugins: ['preset-default'],
  },
  webp: {},
};

// ----------------------------------
// functions
const isSharpFormat = (format: string): format is Extract<keyof FormatEnum, string> => {
  return Object.keys(sharp.format).includes(format);
};

const imageMin = async (file: string): Promise<void> => {
  // ignore
  if (isIgnoreFile(file)) return;

  // files
  const imgExt = ['jpg', 'jpeg', 'png', 'gif'];
  const svgExt = ['svg'];
  const fileExtname = path.extname(file);
  const fileExt = fileExtname && fileExtname.slice(1).toLowerCase();
  const fileName = path.basename(file, fileExtname);

  // dir
  // 置換文字列に `$&` 等が含まれても解釈されないよう関数形式で渡す
  const outFile = file.replace(config.base, () => config.outDir);
  const outDir = path.dirname(outFile);
  createFolder(outDir);

  // image-min
  if (fileExt && svgExt.includes(fileExt)) {
    // SVG
    const binaryData = fs.readFileSync(file);
    const { data } = optimize(String(binaryData), options.svg);
    await fs.outputFile(outFile, data);
    consoleSizeCompare(file, outFile);
  } else if (fileExt && imgExt.includes(fileExt)) {
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

export const runImageMin = async (targets?: string | string[]): Promise<void> => {
  const files = targets ? resolveTargets(targets) : fg.sync(config.files);

  if (!targets && files.length === 0) {
    return consoleExist('Image');
  }

  await Promise.all(files.map((f) => imageMin(f)));
};

if (isDirectRun(import.meta.url)) {
  await runCommandCli({
    moduleUrl: import.meta.url,
    run: async ({ changedFile, targets }) => {
      if (changedFile) return runImageMin(changedFile);
      await runImageMin(targets.length > 0 ? targets : undefined);
    },
    watch: {
      patterns: [config.base],
      shouldRun: (changedFile) => imageTargetPattern.test(changedFile),
    },
  });
}
