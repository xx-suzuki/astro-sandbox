// Linear interpolation (lerp) between start and end based on percentage p
export const lerp = (start: number, end: number, p: number) => {
  return (1 - p) * start + p * end;
};

// Maps a value from one range to another
export const map = (
  val: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
) => {
  return ((val - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) + outputMin;
};

// Normalizes a value to a range between 0 and 1
export const norm = (val: number, min: number, max: number) => {
  return map(val, min, max, 0, 1);
};

// Calculates the hypotenuse using the Pythagorean theorem
export const hypot = (n: number, m: number) => {
  return Math.sqrt(n * n + m * m);
};

// Converts degrees to radians
export const deg2rad = (n: number) => {
  return (n * Math.PI) / 180;
};

// Converts radians to degrees
export const rad2deg = (n: number) => {
  return (180 * n) / Math.PI;
};

// Rounds a value to the nearest multiple of the base
export const orgRound = (val: number, base: number) => {
  return Math.round(val * base) / base;
};

// Rounds up (ceil) a value to the nearest multiple of the base
export const orgCeil = (val: number, base: number) => {
  return Math.ceil(val * base) / base;
};

// Rounds down (floor) a value to the nearest multiple of the base
export const orgFloor = (val: number, base: number) => {
  return Math.floor(val * base) / base;
};

// Rounds a number to a specified number of decimal places
export const decimalPart = (num: number, decDigits: number) => {
  if (decDigits <= 0) {
    return Math.round(num);
  }

  const multiplier = Math.pow(10, decDigits);
  return Math.round(num * multiplier) / multiplier;
};

// Pads a number with leading zeros to match the specified length
export const zeroPad = (num: number, length: number): string => {
  return String(num).padStart(length, '0');
};

// Formats a number with comma separators for readability
export const addCommas = (value: number | string): string => {
  const num = typeof value === 'number' ? value : Number(value);
  return num.toLocaleString('ja-JP');
};
