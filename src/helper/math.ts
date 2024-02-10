export const lerp = (start: number, end: number, p: number) => {
  return (1 - p) * start + p * end;
};

export const map = (
  val: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
) => {
  return ((val - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) + outputMin;
};

export const norm = (val: number, min: number, max: number) => {
  return map(val, min, max, 0, 1);
};

export const hypot = (n: number, m: number) => {
  return Math.sqrt(n * n + m * m);
};

export const deg2rad = (n: number) => {
  return (n * Math.PI) / 180;
};

export const rad2deg = (n: number) => {
  return (180 * n) / Math.PI;
};

export const orgRound = (val: number, base: number) => {
  return Math.round(val * base) / base;
};

export const orgCeil = (val: number, base: number) => {
  return Math.ceil(val * base) / base;
};

export const orgFloor = (val: number, base: number) => {
  return Math.floor(val * base) / base;
};

export const decimalPart = (num: number, decDigits: number) => {
  if (decDigits <= 0) {
    return Math.round(num);
  }

  const multiplier = Math.pow(10, decDigits);
  return Math.round(num * multiplier) / multiplier;
};
