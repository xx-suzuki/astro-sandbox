import resolveConfig from 'tailwindcss/resolveConfig';
import { assetsDir } from '@root/project.config.mjs';
import tailwindConfig from '@root/tailwind.config';

export const Env = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.Mode,
  assets: assetsDir,
  twConf: resolveConfig(tailwindConfig),
} as const;
