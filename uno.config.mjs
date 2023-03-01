// why this file? - https://github.com/unocss/unocss/discussions/2280

import { defineConfig, presetUno, presetTypography, transformerDirectives } from 'unocss';
import presetIcons from '@unocss/preset-icons';
import presetDaisy from 'unocss-preset-daisy';

const bitWidth = 1.5;

export default defineConfig({
  transformers: [transformerDirectives()],
  presets: [
    presetIcons({
      /* options */
    }),
    presetUno(),
    presetDaisy(),
    presetTypography(),
  ],
  // use `safelist` to include ones that are not scanned from static analysis
  safelist: 'w-bit w-hex w-octal'.split(' '),
  // or include something like this in individual component so it can be scanned <!-- <unocss-safelist class="bg-yellow-200 text-gray-800" /> -->
  shortcuts: [
    // somehow without `safelist`, shortcuts are not being recognized at the moment
    {
      'w-bit': `w-${bitWidth}rem`,
      'w-octal': `w-${bitWidth * 3}rem`,
      'w-hex': `w-${bitWidth * 4}rem`,
    },
  ],
  rules: [
    [
      // e.g. `w-1.5rem`
      /^w-(\d+(\.\d+)?)rem$/,
      ([, n]) => ({
        width: `${n}rem`,
        'min-width': `${n}rem`,
        'max-width': `${n}rem`,
      }),
    ],
  ],
  preflights: [
    {
      getCSS: () => `
        h1 {
          font-size: 1.25rem; /* 18px */
          line-height: 1.75rem; /* 28px */
        }
      `,
    },
  ],
});
