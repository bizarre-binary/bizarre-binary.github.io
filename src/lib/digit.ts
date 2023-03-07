export function genExtractDigits(bitsToBundle = 1) {
  const base = Math.pow(2, bitsToBundle);

  return function extractDigits(n: number, bag: number[] = []): number[] {
    if (n < 1) {
      if (bag.length > 0) {
        return [];
      } else {
        return [0];
      }
    }
    const lastBit = n & (base - 1);
    const rightShifted = n >>> bitsToBundle;

    return [...extractDigits(rightShifted, bag), lastBit];
  };
}

export function genConstructInteger(bitsToBundle = 1) {
  const base = Math.pow(2, bitsToBundle);

  return function constructInteger(digits: number[]): number {
    const exponents = getExponents(digits);
    return digits
      .map((digit, idx) => {
        const significance = exponents[idx];

        return digit * Math.pow(base, significance);
      })
      .reduce((acc, curr) => acc + curr, 0);
  };
}

export const getExponents = (digits: number[]) =>
  Array.from(digits.keys(), (k) => digits.length - k - 1);
