// Linear interpolation (lerp) between start and end based on percentage p
export const lerp = (start: number, end: number, p: number) => {
  return (1 - p) * start + p * end;
};

// Maps a value from one range to another
export const map = (
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
) => {
  return ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) + outputMin;
};

// Normalizes a value to a range between 0 and 1
export const norm = (value: number, min: number, max: number) => {
  return map(value, min, max, 0, 1);
};

// Calculates the hypotenuse using the Pythagorean theorem
export const hypot = (n: number, m: number) => {
  return Math.hypot(n, m);
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
export const orgRound = (value: number, base: number) => {
  return Math.round(value * base) / base;
};

// Rounds up (ceil) a value to the nearest multiple of the base
export const orgCeil = (value: number, base: number) => {
  return Math.ceil(value * base) / base;
};

// Rounds down (floor) a value to the nearest multiple of the base
export const orgFloor = (value: number, base: number) => {
  return Math.floor(value * base) / base;
};

// Rounds a number to a specified number of decimal places
export const decimalPart = (number_: number, decDigits: number) => {
  if (decDigits <= 0) {
    return Math.round(number_);
  }

  const multiplier = Math.pow(10, decDigits);
  return Math.round(number_ * multiplier) / multiplier;
};

// Pads a number with leading zeros to match the specified length
export const zeroPad = (number_: number, length: number): string => {
  return String(number_).padStart(length, '0');
};

// Formats a number with comma separators for readability
export const addCommas = (value: number | string): string => {
  const number_ = typeof value === 'number' ? value : Number(value);
  return number_.toLocaleString('ja-JP');
};
