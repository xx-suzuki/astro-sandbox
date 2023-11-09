/**
 * アッパーキャメルケース
 * @function
 * @param {string | undefined} inputString 対象文字列
 */
export const toUpperCamelCase = (inputString: string | undefined) => {
  if (inputString === undefined) {
    return '';
  }

  const words = inputString.split(/[\s-_]+/);
  const upperCamelCase = words
    .map((word) => {
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join('');

  return upperCamelCase;
};
