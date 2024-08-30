import path from 'node:path';
import fs from 'fs-extra';

/** check ignore file */
const defaultIgnoreFiles: string[] = ['.gitkeep', '.DS_Store', 'Thumbs.db', 'ehthumbs.db'];

export const isIgnoreFile = (src: string): boolean => {
  return defaultIgnoreFiles.includes(path.basename(src));
};

/** Creating Folders */
export const createFolder = (dir: string): void => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/** Creating Files */
export const createFile = (
  outputDir: string,
  data: string | Buffer,
  filename: string,
): Promise<boolean> => {
  const filePath = path.join(outputDir, filename);
  createFolder(outputDir);

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
