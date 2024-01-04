import { Env } from '@/constants/env';

export const MediaQueryList = {
  Sp: window.matchMedia(`screen and (max-width: ${Env.breakpoints.sp}px)`),
  Pc: window.matchMedia(`screen and (min-width: ${Env.breakpoints.pc}px)`),
  Tab: window.matchMedia(`screen and (max-width: ${Env.breakpoints.tab}px)`),
  Huge: window.matchMedia(`screen and (min-width: ${Env.breakpoints.huge}px)`),
} as const;
