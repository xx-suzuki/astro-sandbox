export const splitText = (text: string) => {
  const regex = new RegExp(/<[^>]*>/);
  const word = text.split(/(<[^>]*>)/gi);
  const ary: string[] = [];

  word.forEach((text) => {
    if (!regex.test(text)) {
      text.split('').forEach((t) => {
        t = t === ' ' ? '&nbsp;' : t;
        ary.push(`<span>${t}</span>`);
      });
    } else {
      ary.push(text);
    }
  });

  const rtn = ary.join('');

  return rtn;
};

/**
 * Parses an array of data attribute strings and returns an object with the parsed key-value pairs.
 *
 * @param {string[]} str - An array of strings representing data attributes in the format 'data-<name>="<value>"'.
 * @returns {Object} An object with the parsed data attributes as key-value pairs. If the input array is empty, returns an empty object.
 */
export const parseDataAttributes = (str: string[]) => {
  if (str.length === 0) return {};

  return str
    .map((s) => {
      const match = s.match(/^(data-\w+)="(.+)"$/);
      if (match) {
        return { [`${match[1]}`]: match[2] };
      } else {
        return {};
      }
    })
    .reduce((acc, item) => {
      const key = Object.keys(item)[0];
      if (key) {
        acc[key] = item[key];
      }
      return acc;
    }, {});
};
