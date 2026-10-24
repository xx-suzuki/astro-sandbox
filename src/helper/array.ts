/**
Creates an array similar to PHP's range function
@function
@param {number} start - Start value
@param {number} end - End value
@returns {number[]} - Array of numbers from start to end
*/
export const range = (start: number, end: number): number[] => {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};
