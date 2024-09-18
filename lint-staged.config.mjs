export default {
  './*.{js,cjs,mjs,ts}': [
    "eslint -c eslint.config.mjs --fix --ignore-pattern '!.*rc.cjs'",
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './task/**/*.{js,cjs,mjs,ts}': [
    "eslint -c eslint.config.mjs --fix --ignore-pattern '!.*rc.cjs'",
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './src/**/*.{ts,tsx,astro}': [
    'eslint -c eslint.config.mjs --fix',
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './src/**/*.{scss,css}': [
    'stylelint --config .stylelintrc.mjs --fix --aei',
    'prettier --write --no-error-on-unmatched-pattern',
  ],
};
