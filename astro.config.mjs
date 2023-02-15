// https://astro.build/config

import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import UnoCSS from 'unocss/astro';

export default defineConfig({
  integrations: [
    svelte(),
    UnoCSS({
      /* options */
    }),
  ],
});
