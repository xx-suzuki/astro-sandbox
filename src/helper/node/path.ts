import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
 * ファイルパス名からpublic(.tmp)の画像データを参照する
 * @param {string} src パス文字列
 */
export const assetPath = (src: string) => {
  return import.meta.env.PROD
    ? path.join(path.resolve(dirName, '../../'), src.replace(import.meta.env.BASE_URL, ''))
    : path.join(path.resolve(dirName, '../../../'), src.replace(import.meta.env.BASE_URL, '.tmp/'));
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
