/**
 * Represents a generic object with string keys and any values.
 */
type PlainObject = Record<string, any>;

/**
 * Checks if a value is an object (excluding arrays).
 * @function
 * @param {any} obj - The value to check
 * @returns {boolean} - True if the value is an object, false otherwise
 */
function isObject(obj: any): obj is PlainObject {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

/**
 * Merges multiple source objects into a target object recursively.
 * @function
 * @param {T} target - The target object to be merged into
 * @param {...U[]} sources - One or more source objects to merge
 * @returns {T & U} - The merged object
 */
export const objectMerge = <T extends PlainObject, U extends PlainObject>(
  target: T,
  ...sources: U[]
): T & U => {
  sources.forEach((source) => {
    if (!isObject(source)) return;

    Object.keys(source).forEach((key) => {
      const targetValue = target[key as keyof T];
      const sourceValue = source[key as keyof U];

      // If both values are objects, merge them recursively
      if (isObject(targetValue) && isObject(sourceValue)) {
        target[key as keyof T] = objectMerge({ ...targetValue }, sourceValue) as any;
      } else {
        target[key as keyof T] = sourceValue as any;
      }
    });
  });

  return target as T & U;
};

/**
 * Locks or unlocks scrolling on the body.
 * @function
 * @param {boolean} bool - If true, scrolling is disabled; if false, scrolling is enabled
 */
export const ScrollLock = (bool: boolean) => {
  const scrollbarWidth = window.innerWidth - document.body.clientWidth;

  if (bool) {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  } else {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
};

/**
 * Creates a debounced version of a function that delays its execution.
 * @function
 * @template T - A function type
 * @param {T} func - The function to debounce
 * @param {number} delay - The delay in milliseconds before executing the function
 * @returns {(...args: Parameters<T>) => void} - A debounced function
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
