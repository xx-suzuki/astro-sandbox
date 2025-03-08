import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Env } from '@/constants/env';
import { tmpDir, distDir } from '@root/project.config';

/**
 * Retrieves the file extension from a given file path.
 * @function
 * @param {string} src - The file path string
 * @returns {string | undefined} - The file extension or undefined if not found
 */
export const getExtension = (src: string): string | undefined => {
  const s = src.split('.');
  return s.at(-1);
};

/**
 * CommonJS equivalent of '__filename'
 */
export const fileName = fileURLToPath(import.meta.url);

/**
 * CommonJS equivalent of '__dirname'
 */
export const dirName = path.dirname(fileName);

/**
 * Retrieves the root path of the project.
 */
export const rootPath = process.cwd();

/**
 * Resolves the asset path for images stored in public (.tmp) or dist directories.
 * @param {string} src - The file path string
 * @returns {string} - The resolved asset path
 */
export const assetPath = (src: string): string => {
  return Env.isProd ? path.join(rootPath, distDir + src) : path.join(rootPath, tmpDir + src);
};

/**
 * Extracts various details from a file path.
 * @param {string} src - The file path string
 * @returns {{ ext: string, assetDir: string, name: string }} - Object containing file extension, directory, and name
 */
export const getFileData = (src: string): { ext: string; assetDir: string; name: string } => {
  const ext = path.extname(src);
  const assetDir = path.dirname(src);
  const name = path.basename(src, ext);

  return {
    ext,
    assetDir,
    name,
  };
};
