import { consoleDone, consoleExist, consoleSize } from '@cli/helper/drop-console';
import { removeEmptyDir } from '@cli/helper/utils';
import { relocateAstroFonts as config } from '@root/project.config';
import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

interface Options {
  baseDir: string;
  distDir: string;
  targetFontPath: string;
}

async function init(options: Options) {
  const { baseDir, distDir, targetFontPath } = options;

  const htmlFiles = await fg('**/*.html', { absolute: true, cwd: distDir });

  for (const htmlPath of htmlFiles) {
    const content = await fs.readFile(htmlPath, 'utf8');
    const updatedContent = content.replaceAll(
      /\/_astro\/fonts\/([^"')]+)/g,
      `/${targetFontPath}/$1`,
    );
    if (content !== updatedContent) {
      await fs.writeFile(htmlPath, updatedContent, 'utf8');
    }
  }

  const astroDir = path.join(distDir, baseDir, '_astro');
  const fromDir = path.join(astroDir, 'fonts');
  const outDir = path.join(distDir, baseDir, targetFontPath);

  if (await fs.pathExists(fromDir)) {
    await fs.ensureDir(outDir);
    const fontFiles = await fg('**/*.{woff2,woff,ttf}', { absolute: true, cwd: fromDir });
    for (const file of fontFiles) {
      const relative = path.relative(fromDir, file);
      const dest = path.join(outDir, relative);
      await fs.copy(file, dest);
      consoleSize(dest);
      await fs.remove(file);
    }

    await removeEmptyDir(astroDir);
    consoleDone();
  } else {
    consoleExist(fromDir);
  }
}

export const runRelocateAstroFonts = async (options: Options = config): Promise<void> => {
  await init(options);
};

const isDirectRun =
  typeof process.argv[1] === 'string' && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  try {
    await runRelocateAstroFonts();
  } catch (error) {
    console.trace(error);
    process.exitCode = 1;
  }
}
