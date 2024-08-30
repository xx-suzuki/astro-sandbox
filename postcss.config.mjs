import autoprefixer from 'autoprefixer';
import postcssSortMediaQueries from 'postcss-sort-media-queries';
import tailwindcss from 'tailwindcss';

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [tailwindcss, postcssSortMediaQueries, autoprefixer],
};
