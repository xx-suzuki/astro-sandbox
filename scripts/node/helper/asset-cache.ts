import fs from 'fs-extra';
import crypto from 'node:crypto';
import path from 'node:path';

export interface Manifest {
  entries: Record<string, ManifestEntry>;
  optionsHash: string;
  version: number;
}

export interface ManifestEntry {
  bytes: number;
  createdAt: string;
  hash: string;
  height?: number | undefined;
  mime?: string | undefined;
  outputs: ManifestOutput[];
  source: string;
  type: string;
  width?: number | undefined;
}

export interface ManifestOutput {
  bytes: number;
  path: string;
  type: string;
}

const MANIFEST_VERSION = 1;

export const hashBuffer = (data: Buffer | string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
生成オプションのハッシュ。値が変われば全エントリを作り直す
*/
export const hashOptions = (options: unknown): string => {
  return hashBuffer(JSON.stringify(options));
};

export const createManifest = (optionsHash: string): Manifest => ({
  entries: {},
  optionsHash,
  version: MANIFEST_VERSION,
});

/**
マニフェストを読み込む。形式・オプションが変わっている場合は空で作り直す
*/
export const readManifest = (manifestPath: string, optionsHash: string): Manifest => {
  if (!fs.existsSync(manifestPath)) return createManifest(optionsHash);

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as Manifest;

    if (manifest.version !== MANIFEST_VERSION || manifest.optionsHash !== optionsHash) {
      return createManifest(optionsHash);
    }

    return manifest;
  } catch {
    return createManifest(optionsHash);
  }
};

export const writeManifest = async (manifestPath: string, manifest: Manifest): Promise<void> => {
  await fs.outputFile(manifestPath, `${JSON.stringify(manifest, undefined, 2)}\n`, 'utf8');
};

export const cacheFilePath = (cacheDir: string, hash: string, outputPath: string): string => {
  return path.join(cacheDir, 'files', hash, outputPath);
};

/**
エントリの生成物がすべてキャッシュに揃っているか
*/
export const isCached = (cacheDir: string, entry: ManifestEntry): boolean => {
  return entry.outputs.every((output) =>
    fs.existsSync(cacheFilePath(cacheDir, entry.hash, output.path)),
  );
};

export const saveToCache = async (
  cacheDir: string,
  hash: string,
  outputPath: string,
  file: string,
): Promise<void> => {
  await fs.copy(file, cacheFilePath(cacheDir, hash, outputPath));
};

export const restoreFromCache = async (
  cacheDir: string,
  entry: ManifestEntry,
  outDir: string,
): Promise<void> => {
  await Promise.all(
    entry.outputs.map((output) =>
      fs.copy(cacheFilePath(cacheDir, entry.hash, output.path), path.join(outDir, output.path)),
    ),
  );
};

export const removeFromCache = async (cacheDir: string, entry: ManifestEntry): Promise<void> => {
  await fs.remove(path.join(cacheDir, 'files', entry.hash));
};
