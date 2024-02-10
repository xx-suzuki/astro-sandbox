// import resolveConfig from 'tailwindcss/resolveConfig';
// import tailwindConfig from '@root/tailwind.config';
import { assetsDir, breakpoints, tmpDir } from '@root/project.config.mjs';

export const Env = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.Mode,
  assets: assetsDir,
  breakpoints,
  tmpDir,
  // twConf: resolveConfig(tailwindConfig),
} as const;
