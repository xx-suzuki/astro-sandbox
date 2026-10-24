import { distDir, tmpDir } from '@root/project.config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
Retrieves the file extension from a given file path.
@function
@param {string} src - The file path string
@returns {string | undefined} - The file extension or undefined if not found
*/
export const getExtension = (source: string): string | undefined => {
  const s = source.split('.');
  return s.at(-1);
};

/**
CommonJS equivalent of '__filename'
*/
export const fileName = fileURLToPath(import.meta.url);

/**
CommonJS equivalent of '__dirname'
*/
export const dirName = path.dirname(fileName);

/**
Retrieves the root path of the project.
*/
export const rootPath = process.cwd();

/**
Resolves the asset path for images stored in public (.tmp) or dist directories.
@param {string} src - The file path string
@returns {string} - The resolved asset path
*/
export const assetPath = (source: string): string => {
  return path.join(rootPath, (import.meta.env.PROD ? distDir : tmpDir) + source);
};

/**
Extracts various details from a file path.
@param {string} src - The file path string
@returns {{ ext: string, assetDir: string, name: string }} - Object containing file extension, directory, and name
*/
export const getFileData = (source: string): { assetDir: string; ext: string; name: string } => {
  const extension = path.extname(source);
  const assetDir = path.dirname(source);
  const name = path.basename(source, extension);

  return {
    assetDir,
    ext: extension,
    name,
  };
};
