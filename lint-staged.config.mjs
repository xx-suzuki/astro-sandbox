export default {
  './*.{js,cjs,mjs,ts}': [
    "eslint -c .eslintrc.cjs --fix --ignore-pattern '!.*rc.cjs'",
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './src/**/*.{ts,tsx,astro,vue}': [
    'eslint -c .eslintrc.cjs --fix',
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './src/**/*.{scss,css,ts,tsx,astro,vue}': [
    'stylelint --config .stylelintrc.cjs --fix --aei',
    'prettier --write --no-error-on-unmatched-pattern',
  ],
};
