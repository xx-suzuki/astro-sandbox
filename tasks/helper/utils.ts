import fs from 'fs-extra';
import path from 'node:path';

/** check ignore file */
export const isIgnoreFile = (src: string): boolean => {
  const base = path.basename(src).toLowerCase();
  return (
    ['.ds_store', '.gitkeep', 'ehthumbs.db', 'thumbs.db'].includes(base) || base.startsWith('._')
  );
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
  data: Buffer | string,
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

export const removeEmptyDir = async (dir: string): Promise<boolean> => {
  if (!(await fs.pathExists(dir))) return false;

  const entries = await fs.readdir(dir);
  let isEmpty = true;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const childEmpty = await removeEmptyDir(fullPath);
      if (!childEmpty) isEmpty = false;
    } else if (!isIgnoreFile(entry)) {
      isEmpty = false;
    }
  }

  if (isEmpty) {
    await fs.remove(dir);
    return true;
  }

  return false;
};
