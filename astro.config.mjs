// https://astro.build/config

import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import UnoCSS from 'unocss/astro';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeMathjax from 'rehype-mathjax';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const markdown = {
  remarkPlugins: [remarkMath],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behaviour: 'append',
      },
    ],
    rehypeMathjax,
  ],
  gfm: false,
};

// https://astro.build/config
export default defineConfig({
  // this should apply to mdx as well
  markdown,
  integrations: [UnoCSS(), svelte(), mdx()],
});
