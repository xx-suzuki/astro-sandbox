import type { AvifOptions, GifOptions, JpegOptions, PngOptions, WebpOptions } from 'sharp';
import type { Config as SvgOptions } from 'svgo';

import { applyMode } from '@scripts-node/core/context';
import { startWatch } from '@scripts-node/core/watch';
import { parseCommandCliArgs } from '@scripts-node/helper/cli-args';
import { consoleExist, consoleSize, consoleSizeCompare } from '@scripts-node/helper/drop-console';
import { createFolder, isIgnoreFile } from '@scripts-node/helper/utils';
import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
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
const config = {
  base: 'src/assets/images',
  files: 'src/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}',
  outDir: '.tmp/assets/images',
};

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
const isSharpFormat = (format: string): format is keyof sharp.FormatEnum => {
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
  const outFile = file.replace(config.base, config.outDir);
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
  const files = (() => {
    if (!targets) return fg.sync(config.files);

    const targetList = Array.isArray(targets) ? targets : [targets];
    const resolved = targetList.flatMap((target) => {
      if (fs.existsSync(target)) return [target];
      return fg.sync(target);
    });

    return [...new Set(resolved)];
  })();

  if (!targets && files.length === 0) {
    return consoleExist('Image');
  }

  await Promise.all(files.map((f) => imageMin(f)));
};

/* c8 ignore start */
const isDirectRun =
  typeof process.argv[1] === 'string' && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  try {
    const cliArgs = parseCommandCliArgs(process.argv.slice(2), {
      allowWatch: true,
      fallbackMode: 'production',
    });
    applyMode(cliArgs.mode);

    await (cliArgs.watch
      ? startWatch({
          initialRun: cliArgs.initialRun,
          patterns: [config.base],
          run: async (changedFile) => {
            if (changedFile && !imageTargetPattern.test(changedFile)) {
              return;
            }
            await runImageMin(changedFile || undefined);
          },
          watchOptions: {
            usePolling: true,
          },
        })
      : runImageMin(cliArgs.targets.length > 0 ? cliArgs.targets : undefined));
  } catch (error) {
    console.trace(error);
    process.exitCode = 1;
  }
}
/* c8 ignore end */
