import { breakpoints } from '@root/project.config';

export const MediaQueryList = {
  Sp: window.matchMedia(`screen and (max-width: ${breakpoints.sp}px)`),
  Pc: window.matchMedia(`screen and (min-width: ${breakpoints.pc}px)`),
  Tab: window.matchMedia(`screen and (max-width: ${breakpoints.tab}px)`),
  Huge: window.matchMedia(`screen and (min-width: ${breakpoints.huge}px)`),
} as const;
