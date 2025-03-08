/**
 * Splits a text string into individual characters wrapped in <span> tags while preserving HTML tags.
 * @function
 * @param {string} text - The input text string
 * @returns {string} - The processed HTML string with each character wrapped in a <span>
 */
export const splitText = (text: string): string => {
  const regex = new RegExp(/<[^>]*>/);
  const word = text.split(/(<[^>]*>)/gi);
  const ary: string[] = [];

  word.forEach((text) => {
    if (!regex.test(text)) {
      text.split('').forEach((t) => {
        t = t === ' ' ? '&nbsp;' : t;
        ary.push(`<span aria-hidden="true">${t}</span>`);
      });
    } else {
      ary.push(text);
    }
  });
  ary.push(`<span class="u-sr-only">${text}</span>`);

  return ary.join('');
};

/**
 * Returns an object with target="_blank" if the boolean value is true, otherwise returns an empty object.
 * @function
 * @param {boolean} bool - Determines whether to return a target attribute
 * @returns {object} - An object with { target: '_blank' } if true, otherwise an empty object
 */
export const isBlank = (bool: boolean): { target?: string } => {
  return bool ? { target: '_blank' } : {};
};
