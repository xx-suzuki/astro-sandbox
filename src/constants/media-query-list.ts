import { breakpoints } from '@root/project.config';

export const MediaQueryList = {
  Sp: window.matchMedia(`(max-width: ${breakpoints.sp}px)`),
  Pc: window.matchMedia(`(min-width: ${breakpoints.pc}px)`),
  Tab: window.matchMedia(
    `(min-width: ${breakpoints.sp}px) and (max-width: ${breakpoints.desktop}px)`,
  ),
  Huge: window.matchMedia(`(min-width: ${breakpoints.huge}px)`),
} as const;
