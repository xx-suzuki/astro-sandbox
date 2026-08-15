import fg from 'fast-glob';
import fs from 'fs-extra';

/**
実ファイルパスと glob が混在した targets を、重複のないファイル一覧へ解決する
*/
export const resolveTargets = (targets: string | string[]): string[] => {
  const targetList = Array.isArray(targets) ? targets : [targets];
  const resolved = targetList.flatMap((target) => {
    if (fs.existsSync(target)) return [target];
    return fg.sync(target);
  });

  return [...new Set(resolved)];
};
