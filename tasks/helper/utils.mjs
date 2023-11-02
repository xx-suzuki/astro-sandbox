import path from 'node:path';
import fs from 'fs-extra';

/** check ignore file */
const defaultIgnoreFiles = ['.gitkeep', '.DS_Store', 'Thumbs.db', 'ehthumbs.db'];
export const isIgnoreFile = (src) => defaultIgnoreFiles.includes(path.basename(src));

/** Creating Folders */
export const createFolder = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/** check ignore file */
export const createFile = (data, filename, outputDir) => {
  const filePath = outputDir + filename;
  createFolder(outputDir);

  return new Promise((resolve) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) throw err;
      resolve(true);
    });
  });
};
