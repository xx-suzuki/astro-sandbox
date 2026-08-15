/**
 * Gets the position of an element relative to the document.
 */
export const offset = (element: HTMLElement): { left: number; top: number } => {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.scrollX;
  const scrollTop = window.scrollY;

  const isFixed = globalThis.getComputedStyle(element).position === 'fixed';

  let targetPosLeft = rect.left;
  let targetPosTop = rect.top;

  // Adjust position if the element is not fixed
  if (!isFixed) {
    targetPosLeft += scrollLeft;
    targetPosTop += scrollTop;
  }

  return {
    left: targetPosLeft,
    top: targetPosTop,
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

  return html.replaceAll(/>([\s\S]*?)</g, (_, text) => {
    const decoded = parser.parseFromString(text, 'text/html').documentElement.textContent || '';
    return `>${decoded}<`;
  });
};

/**
 * Splits the text content of an element into individual characters wrapped in <span> tags.
 */
export const splitText = (element: HTMLElement) => {
  const plainText = element.textContent ?? '';
  const textWithTags = element.getHTML().trim();
  const newTextWithTags = decodeHtmlEntities(textWithTags);
  const regex = /(<[^>]+>)|(\s*[^<>\s][^<>]*\s*)|(\s+)/g;
  const matches = [...newTextWithTags.matchAll(regex)];
  let result = '';

  element.replaceChildren();

  for (const match of matches) {
    const chunk = match[0];

    if (chunk.startsWith('<') && chunk.endsWith('>')) {
      result += chunk;
    } else {
      const split = [...chunk];
      for (const char of split) {
        const glyph = char === ' ' ? '&nbsp;' : char;
        result += `<span aria-hidden="true" style="display: inline-block;">${glyph}</span>`;
      }
    }
  }
  result += `<span class="u-sr-only">${plainText}</span>`;

  const parser = new DOMParser().parseFromString(result, 'text/html');

  while (parser.body.firstChild) {
    element.append(parser.body.firstChild);
  }
};
