export const remove = (element: Element) => {
  const parent = element.parentNode;

  parent?.removeChild(element);
};

export const offset = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.scrollX;
  const scrollTop = window.scrollY;

  const isFixed = window.getComputedStyle(element).position === 'fixed';

  let targetPosLeft = rect.left;
  let targetPosTop = rect.top;

  if (!isFixed) {
    targetPosLeft += scrollLeft;
    targetPosTop += scrollTop;
  }

  return {
    top: targetPosTop,
    left: targetPosLeft,
  };
};
