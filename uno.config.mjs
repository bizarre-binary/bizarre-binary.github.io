// why this file? - https://github.com/unocss/unocss/discussions/2280

import { defineConfig, presetUno, presetTypography } from 'unocss';
import presetIcons from '@unocss/preset-icons';
import { presetDaisy } from 'unocss-preset-daisy';

const bitWidth = 1.5;

export default defineConfig({
  presets: [
    presetIcons({
      /* options */
    }),
    presetUno(),
    presetDaisy(),
    presetTypography(),
  ],
  // use `safelist` to include ones that are not scanned from static analysis
  safelist: [
    'w-bit',
    'w-hex',
    'w-octal',
    'w-bit-sm',
    'w-hex-sm',
    'bg-yellow-200',
    'opacity-0',
    'opacity-50',
    'opacity-100',
  ],
  // or include something like this in individual component so it can be scanned <!-- <unocss-safelist class="bg-yellow-200 text-gray-800" /> -->
  shortcuts: [
    // somehow without `safelist`, shortcuts are not being recognized at the moment
    {
      'w-bit': `w-${bitWidth}rem`,
      'w-octal': `w-${bitWidth * 3}rem`,
      'w-hex': `w-${bitWidth * 4}rem`,
      'w-bit-sm': `w-${bitWidth / 1.5}rem`,
      'w-hex-sm': `w-${(bitWidth * 4) / 1.5}rem`,
      'math-inline': 'inline-block text-sm',
      'icon-link': 'i-bi-link-45deg inline-block align-middle text-slate-300',
      'digit-border-common': 'border-0 border-l-2 first:border-l-0',
      'digit-border-hex': 'border-slate-200 border-solid',
      'digit-border-octal': 'border-slate-300 border-dashed',
      'input-number-hide-arrows':
        '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
    },
  ],
  rules: [
    [
      // e.g. `mlv-[my-var]`
      /^mlv-\[([a-z|-]+)\]$/,
      ([, v]) => ({
        'margin-left': `var(--${v})`,
      }),
    ],
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
  theme: {
    // based on https://tailwindcss.com/docs/responsive-design
    // and basically adding my custom `xs`
    breakpoints: {
      xs: '384px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
});
