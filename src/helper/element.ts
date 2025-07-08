/**
 * Removes an element from the DOM
 * @function
 * @param {Element} element - The element to be removed
 */
export const remove = (element: Element) => {
  const parent = element.parentNode;
  parent?.removeChild(element);
};

/**
 * Gets the position of an element relative to the document.
 */
export const offset = (element: HTMLElement): { top: number; left: number } => {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.scrollX;
  const scrollTop = window.scrollY;

  const isFixed = window.getComputedStyle(element).position === 'fixed';

  let targetPosLeft = rect.left;
  let targetPosTop = rect.top;

  // Adjust position if the element is not fixed
  if (!isFixed) {
    targetPosLeft += scrollLeft;
    targetPosTop += scrollTop;
  }

  return {
    top: targetPosTop,
    left: targetPosLeft,
  };
};

/**
 * Decodes HTML entities in a given string.
 */
export const decodeHtmlEntities = (html: string): string => {
  const parser = new DOMParser();

  if (!/<\s*\/?\s*\w+[^>]*>/.test(html)) {
    return parser.parseFromString(html, 'text/html').documentElement.textContent || '';
  }

  return html.replace(/>([\s\S]*?)</g, (_, text) => {
    const decoded = parser.parseFromString(text, 'text/html').documentElement.textContent || '';
    return `>${decoded}<`;
  });
};

/**
 * Splits the text content of an element into individual characters wrapped in <span> tags.
 */
export const splitText = (element: HTMLElement) => {
  const plainText = element.innerText;
  const textWithTags = element.innerHTML.trim();
  const newTextWithTags = decodeHtmlEntities(textWithTags);
  const regex = /(<[^>]+>)|(\s*[^<>\s][^<>]*\s*)|(\s+)/g;
  const matches = Array.from(newTextWithTags.matchAll(regex));
  let result = '';

  element.innerHTML = '';

  matches.forEach((match) => {
    if (match[0].startsWith('<') && match[0].endsWith('>')) {
      result += match[0];
    } else {
      match[0].split('').forEach((char) => {
        const glyph = char === ' ' ? '&nbsp;' : char;
        result += `<span aria-hidden="true" style="display: inline-block;">${glyph}</span>`;
      });
    }
  });
  result += `<span class="u-sr-only">${plainText}</span>`;

  const parser = new DOMParser().parseFromString(result, 'text/html');

  while (parser.body.firstChild) {
    element.appendChild(parser.body.firstChild);
  }
};
