/**
@type {import('prettier').Config}
*/
export default {
  bracketSpacing: true,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
      printWidth: 200,
    },
  ],
  plugins: ['prettier-plugin-astro'],
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
};
