/**
 * Converts a string to Upper Camel Case (Pascal Case)
 * @function
 * @param {string | undefined} inputString - The input string to be converted
 * @returns {string} - The converted string in Upper Camel Case
 */
export const toUpperCamelCase = (inputString: string | undefined): string => {
  if (inputString === undefined) {
    return '';
  }

  // Split the string by spaces, hyphens, or underscores
  const words = inputString.split(/[\s-_]+/);
  const upperCamelCase = words
    .map((word) => {
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join('');

  return upperCamelCase;
};
