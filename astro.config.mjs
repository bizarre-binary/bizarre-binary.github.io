// https://astro.build/config

import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import UnoCSS from 'unocss/astro';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [UnoCSS(), svelte(), mdx()],
});
