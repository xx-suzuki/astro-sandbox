import { breakpoints } from '@root/project.config';

export const MediaQueryList = {
  Huge: globalThis.matchMedia(`(min-width: ${breakpoints.huge}px)`),
  Pc: globalThis.matchMedia(`(min-width: ${breakpoints.pc}px)`),
  Sp: globalThis.matchMedia(`(max-width: ${breakpoints.sp}px)`),
  Tab: globalThis.matchMedia(
    `(min-width: ${breakpoints.sp}px) and (max-width: ${breakpoints.desktop}px)`,
  ),
} as const;
