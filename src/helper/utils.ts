/**
 * Represents a generic object with string keys and any values.
 */
type PlainObject = Record<string, unknown>;

/**
 * Checks if a value is an object (excluding arrays).
 */
function isObject(object: unknown): object is PlainObject {
  return Boolean(object) && typeof object === 'object' && !Array.isArray(object);
}

/**
 * Merges multiple source objects into a target object recursively.
 */
export const objectMerge = <T extends PlainObject, U extends PlainObject>(
  target: T,
  ...sources: U[]
): T & U => {
  for (const source of sources) {
    if (!isObject(source)) continue;

    for (const key of Object.keys(source) as (keyof U)[]) {
      const targetValue = target[key as keyof T];
      const sourceValue = source[key];

      // If both values are objects, merge them recursively
      target[key as keyof T] =
        isObject(targetValue) && isObject(sourceValue)
          ? (objectMerge(
              { ...targetValue } as PlainObject,
              sourceValue as PlainObject,
            ) as T[keyof T])
          : (sourceValue as unknown as T[keyof T]);
    }
  }

  return target as T & U;
};

/**
 * Locks or unlocks scrolling on the body.
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
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  function_: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      function_(...args);
    }, delay);
  };
};

// https://largeapps.dev/case-studies/advanced/
export const yieldToMain = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};
