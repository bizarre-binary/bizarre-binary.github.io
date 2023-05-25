export const toHex = (n: number, minLength = -1) => {
  const int = Math.round(n);
  const hex = int.toString(16);

  if (minLength < 0 || hex.length >= minLength) {
    return hex;
  }

  const diff = minLength - hex.length;
  return [...Array(diff)].reduce((a) => a + '0', '') + hex;
};

export const fromHex = (h: string) => {
  return parseInt(h, 16);
};

export type RGBA = { r: number; g: number; b: number; a: number };

// assume number is like 0xffeeddcc
export const toRGBA = (n: number): RGBA => {
  const hex = toHex(n, 8);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const a = parseInt(hex.substring(6, 8), 16);
  return { r, g, b, a };
};

export const fromRGBA = ({ r, g, b, a }: RGBA): number =>
  fromHex(`${toHex(r, 2)}${toHex(g, 2)}${toHex(b, 2)}${toHex(a, 2)}`);
