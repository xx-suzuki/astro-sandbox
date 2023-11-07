import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@root/tailwind.config';

export const Env = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.Mode,
  twConf: resolveConfig(tailwindConfig),
} as const;
