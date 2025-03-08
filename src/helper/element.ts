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
