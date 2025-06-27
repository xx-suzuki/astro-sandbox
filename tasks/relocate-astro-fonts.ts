import path from 'node:path';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { relocateAstroFonts as config } from '@root/project.config';
import { consoleDone, consoleSize, consoleExist } from '@root/tasks/helper/drop-console';
import { removeEmptyDir } from '@root/tasks/helper/utils';

interface Options {
  distDir: string;
  baseDir: string;
  targetFontPath: string;
}

async function init(options: Options) {
  const { distDir, baseDir, targetFontPath } = options;

  const htmlFiles = await fg('**/*.html', { cwd: distDir, absolute: true });

  for (const htmlPath of htmlFiles) {
    const content = await fs.readFile(htmlPath, 'utf-8');
    const updatedContent = content.replace(/\/_astro\/fonts\/([^"')]+)/g, `/${targetFontPath}/$1`);
    if (content !== updatedContent) {
      await fs.writeFile(htmlPath, updatedContent, 'utf-8');
    }
  }

  const astroDir = path.join(distDir, baseDir, '_astro');
  const fromDir = path.join(astroDir, 'fonts');
  const outDir = path.join(distDir, baseDir, targetFontPath);

  if (await fs.pathExists(fromDir)) {
    await fs.ensureDir(outDir);
    const fontFiles = await fg('**/*.{woff2,woff,ttf}', { cwd: fromDir, absolute: true });
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

/** init */
init(config).catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
