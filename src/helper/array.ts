/**
 * PHPライクな配列を作成
 * @function
 * @param {number} start 開始
 * @param {number} end 終了
 */
export const range = (start: number, end: number) => {
  return [...Array(end - start + 1)].map((_, i) => start + i);
};
