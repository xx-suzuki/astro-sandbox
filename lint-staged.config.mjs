export default {
  '*.{ts,astro}': [() => 'npm run check'],
  './*.{js,mjs,ts}': [
    'eslint -c eslint.config.ts --fix',
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './scripts/node/**/*.ts': [
    'eslint -c eslint.config.ts --fix',
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './src/**/*.{scss,css}': [
    'stylelint --config .stylelintrc.mjs --fix --aei',
    'prettier --write --no-error-on-unmatched-pattern',
  ],
  './src/**/*.{ts,tsx,astro}': [
    'eslint -c eslint.config.ts --fix',
    'prettier --write --no-error-on-unmatched-pattern',
  ],
};
