import autoprefixer from 'autoprefixer';
import postcssSortMediaQueries from 'postcss-sort-media-queries';

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [postcssSortMediaQueries, autoprefixer],
};
