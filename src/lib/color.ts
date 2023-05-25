import { colord } from 'colord';

export const isHexDark = (hex: string) => {
  return colord(hex).isDark();
};

export const toHsl = (color: string) => colord(color).toHsl();
