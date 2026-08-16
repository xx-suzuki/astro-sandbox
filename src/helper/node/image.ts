import type { Manifest, ManifestEntry } from '@scripts-node/helper/asset-cache';

import { baseDir, imageMin } from '@root/project.config';
import fs from 'node:fs';
import path from 'node:path';

import { rootPath } from '@/helper/node/path';

const manifestPath = path.join(rootPath, imageMin.manifest);

const cache: { current?: { manifest: Manifest; mtimeMs: number } } = {};

/**
dev サーバーは起動したままマニフェストが更新されるため、mtime で読み直す
*/
const loadManifest = (): Manifest => {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `画像マニフェストが見つかりません: ${imageMin.manifest} / 先に \`pnpm build:img\` を実行してください`,
    );
  }

  const { mtimeMs } = fs.statSync(manifestPath);
  if (cache.current?.mtimeMs !== mtimeMs) {
    cache.current = {
      manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as Manifest,
      mtimeMs,
    };
  }

  return cache.current.manifest;
};

/**
公開パス（例: /production/assets/images/1.jpg）から画像情報を引く
*/
export const getImageData = (source: string): ManifestEntry => {
  const key = source.startsWith(baseDir) ? source.slice(baseDir.length) : source.replace(/^\//, '');
  const entry = loadManifest().entries[key];

  if (!entry) {
    throw new Error(
      `画像マニフェストに登録がありません: ${key} / src/assets/images 配下に元画像があるか確認してください`,
    );
  }

  return entry;
};
