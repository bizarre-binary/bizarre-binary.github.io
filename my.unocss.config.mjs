// for ./astro.config.mjs

import UnoCSS from 'unocss/astro';

const bitWidth = 1.5;

export default UnoCSS({
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
});
