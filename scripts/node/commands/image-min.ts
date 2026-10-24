import type { Manifest, ManifestEntry, ManifestOutput } from '@scripts-node/helper/asset-cache';
import type {
  AvifOptions,
  FormatEnum,
  GifOptions,
  JpegOptions,
  PngOptions,
  WebpOptions,
} from 'sharp';
import type { Config as SvgOptions } from 'svgo';

import { assetsDir, imageMin as config, tmpDir } from '@root/project.config';
import { isDirectRun, runCommandCli } from '@scripts-node/core/cli';
import {
  hashBuffer,
  hashOptions,
  isCached,
  readManifest,
  removeFromCache,
  restoreFromCache,
  saveToCache,
  writeManifest,
} from '@scripts-node/helper/asset-cache';
import {
  consoleCache,
  consoleExist,
  consoleSize,
  consoleSizeCompare,
} from '@scripts-node/helper/drop-console';
import { resolveTargets } from '@scripts-node/helper/targets';
import { createFolder, isIgnoreFile } from '@scripts-node/helper/utils';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { imageSize } from 'image-size';
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

const mimeTypes: Record<string, string> = {
  avif: 'image/avif',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
};

const toManifestPath = (outFile: string): string => path.relative(config.outDir, outFile);

const toOutput = (outFile: string): ManifestOutput => {
  const extension = path.extname(outFile).slice(1).toLowerCase();

  return {
    bytes: fs.statSync(outFile).size,
    path: path.join(assetsDir.images.outDir, toManifestPath(outFile)),
    type: extension,
  };
};

const imageMin = async (file: string): Promise<ManifestEntry | undefined> => {
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

  const source = fs.readFileSync(file);
  const entry: ManifestEntry = {
    bytes: source.length,
    createdAt: new Date().toISOString(),
    hash: hashBuffer(source),
    outputs: [],
    source: file,
    type: fileExt || '',
  };

  // image-min
  if (fileExt && svgExt.includes(fileExt)) {
    // SVG
    const { data } = optimize(String(source), options.svg);
    await fs.outputFile(outFile, data);
    consoleSizeCompare(file, outFile);
    entry.outputs = [toOutput(outFile)];
  } else if (fileExt && imgExt.includes(fileExt)) {
    // Images
    const ext = fileExt === 'jpg' ? 'jpeg' : fileExt;

    if (!isSharpFormat(ext)) return;

    const src = sharp(file);
    const img = path.join(outDir, fileName + fileExtname);
    // const webp = path.join(outDir, `${fileName}.webp`);
    const avif = path.join(outDir, `${fileName}.avif`);

    await Promise.all([
      src.toFormat(ext, options[ext as SharpKeys]).toFile(img),
      // src.webp(options.webp).toFile(webp),
      src.avif(options.avif).toFile(avif),
    ]);
    consoleSizeCompare(file, img);
    // consoleSizeCompare(file, webp);
    consoleSizeCompare(file, avif);
    entry.outputs = [toOutput(img), toOutput(avif)];
  } else {
    // Other
    await fs.copy(file, outFile);
    consoleSize(outFile);
    entry.outputs = [toOutput(outFile)];
  }

  const { height, width } = imageSize(source);
  entry.width = width;
  entry.height = height;
  entry.mime = mimeTypes[fileExt || ''];

  return entry;
};

const toManifestKey = (file: string): string =>
  path.join(assetsDir.images.outDir, path.relative(config.base, file));

/**
元画像が消えたエントリの生成物とキャッシュ実体を取り除く
*/
const pruneManifest = async (manifest: Manifest): Promise<void> => {
  const removed: ManifestEntry[] = [];

  for (const [key, entry] of Object.entries(manifest.entries)) {
    if (fs.existsSync(entry.source)) continue;

    await Promise.all(entry.outputs.map((output) => fs.remove(path.join(tmpDir, output.path))));
    delete manifest.entries[key];
    removed.push(entry);
  }

  // 内容が同じ画像はハッシュ単位でキャッシュを共有するため、
  // 残ったエントリが参照していないハッシュだけを削除する
  const usedHashes = new Set(Object.values(manifest.entries).map((entry) => entry.hash));

  await Promise.all(
    removed
      .filter((entry) => !usedHashes.has(entry.hash))
      .map((entry) => removeFromCache(config.cacheDir, entry)),
  );
};

export const runImageMin = async (targets?: string | string[]): Promise<void> => {
  const files = targets ? resolveTargets(targets) : fg.sync(config.files);

  if (!targets && files.length === 0) {
    return consoleExist('Image');
  }

  const manifest = readManifest(config.manifest, hashOptions(options));

  const results = await Promise.all(
    files.map(async (file) => {
      if (isIgnoreFile(file)) return;

      const key = toManifestKey(file);
      const cached = manifest.entries[key];

      // 内容が変わっていなければ生成せず、キャッシュから復元する
      if (
        cached &&
        isCached(config.cacheDir, cached) &&
        cached.hash === hashBuffer(fs.readFileSync(file))
      ) {
        await restoreFromCache(config.cacheDir, cached, tmpDir);
        consoleCache(key);
        return { entry: cached, key };
      }

      const entry = await imageMin(file);
      if (!entry) return;

      await Promise.all(
        entry.outputs.map((output) =>
          saveToCache(config.cacheDir, entry.hash, output.path, path.join(tmpDir, output.path)),
        ),
      );

      return { entry, key };
    }),
  );

  for (const result of results) {
    if (result) manifest.entries[result.key] = result.entry;
  }

  // 全件実行時のみ、元画像が消えたエントリを掃除する
  if (!targets) await pruneManifest(manifest);

  await writeManifest(config.manifest, manifest);
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
