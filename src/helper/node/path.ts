import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Env } from '@/constants/env';
import { tmpDir, outDir } from '@root/project.config';

/**
 * ファイルパス名から拡張子を取得
 * @function
 * @param {string} src パス文字列
 */
export const getExtension = (src: string) => {
  const s = src.split('.');
  return s.at(-1);
};

/**
 * CommonJS '__filename'
 */
export const fileName = fileURLToPath(import.meta.url);

/**
 * CommonJS '__dirname'
 */
export const dirName = path.dirname(fileName);

/**
 * Root path
 */
export const rootPath = process.cwd();

/**
 * ファイルパス名からpublic(.tmp)の画像データを参照する
 * @param {string} src パス文字列
 */
export const assetPath = (src: string) => {
  return Env.isProd ? path.join(rootPath, outDir + src) : path.join(rootPath, tmpDir + src);
};

/**
 * ファイルパス名から各データを取得
 * @param {string} src パス文字列
 */
export const getFileData = (src: string) => {
  const ext = path.extname(src);
  const assetDir = path.dirname(src);
  const name = path.basename(src, ext);

  return {
    ext,
    assetDir,
    name,
  };
};
