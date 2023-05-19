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
