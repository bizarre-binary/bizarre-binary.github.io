// https://astro.build/config

import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import UnoCSSConfigured from './my.unocss.config';

export default defineConfig({
  integrations: [UnoCSSConfigured, svelte()],
});
