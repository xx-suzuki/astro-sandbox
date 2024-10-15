import type { Config } from 'tailwindcss';
import { breakpoints, designSize } from './project.config.ts';

export default {
  prefix: 'u-',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    screens: {
      sp: { raw: `(max-width: ${breakpoints.sp}px)` },
      pc: { raw: `(min-width: ${breakpoints.pc}px)` },
      tab: { raw: `(max-width: ${breakpoints.tab}px)` },
      huge: { raw: `(min-width: ${breakpoints.huge}px)` },
      hover: { raw: `(hover: hover) and (pointer: fine)` },
      valSp: `${breakpoints.sp}`,
      valPc: `${breakpoints.pc}`,
      valTab: `${breakpoints.tab}`,
      valDesktop: `${breakpoints.desktop}`,
      valHuge: `${breakpoints.huge}`,
      designSp: `${designSize.sp}`,
      designPc: `${designSize.pc}`,
    },
    spacing: {
      ...Object.fromEntries([...Array(401)].map((_, i) => i).map((num) => [num, `${num / 10}rem`])),
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
