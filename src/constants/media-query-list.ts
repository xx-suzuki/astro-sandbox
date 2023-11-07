import { Env } from '@/constants/env';

export const MediaQueryList = {
  Sp: window.matchMedia(`screen and ${Env.twConf.theme.screens.sp.raw}`),
  Pc: window.matchMedia(`screen and ${Env.twConf.theme.screens.pc.raw}`),
  Tab: window.matchMedia(`screen and ${Env.twConf.theme.screens.tab.raw}`),
  Huge: window.matchMedia(`screen and ${Env.twConf.theme.screens.huge.raw}`),
} as const;
