// https://astro.build/config

import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import UnoCSS from 'unocss/astro';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import remarkCollapse from 'remark-collapse';
import rehypeSlug from 'rehype-slug';
import rehypeMathjax from 'rehype-mathjax';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import partytown from '@astrojs/partytown';
import AstroPWA from '@vite-pwa/astro';

const markdown = {
  remarkPlugins: [
    // not using at the moment
    [remarkCollapse, { test: 'collapsed' }],
    remarkMath,
  ],
  rehypePlugins: [
    // needed for rehypeAutolinkHeadings
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behaviour: 'append',
      },
    ],
    rehypeMathjax,
  ],
};

// https://astro.build/config
export default defineConfig({
  // this should apply to mdx as well
  markdown,
  integrations: [
    UnoCSS(),
    svelte(),
    mdx(),
    AstroPWA({
      workbox: {
        navigateFallback: '/404',
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      },
      devOptions: {
        enabled: true,
        navigateFallbackAllowlist: [/^\/404$/],
      },
      registerType: 'autoUpdate',
      manifest: {
        short_name: 'Bizarre Binary',
        name: 'Bizarre Binary',
        icons: [
          {
            src: '/favicon.svg',
            type: 'image/svg+xml',
            sizes: '512x512',
          },
          {
            src: '/icon.png',
            type: 'image/png',
            sizes: '192x192',
          },
        ],
        id: '/?source=pwa',
        start_url: '/?source=pwa',
        background_color: '#FACC15',
        display_override: ['minimal-ui'],
        display: 'standalone',
        scope: '/',
        theme_color: '#FACC15',
        shortcuts: [
          {
            name: 'About Bit Visualizer',
            short_name: 'About Bit Visualizer',
            description: 'View weather information for today',
            url: '/posts/about-bit-visualizer?source=pwa',
            icons: [
              {
                src: '/icon.png',
                sizes: '192x192',
              },
            ],
          },
          {
            name: 'Bit Visualizer',
            short_name: 'Bit Visualizer',
            description: 'View weather information for tomorrow',
            url: '/toys/bit-visualizer?source=pwa',
            icons: [
              {
                src: '/icon.png',
                sizes: '192x192',
              },
            ],
          },
        ],
        description: 'A place that you can play with binary numbers',
        screenshots: [
          {
            src: '/narrow-screenshot-2023-05-15.png',
            type: 'image/png',
            sizes: '724x832',
            form_factor: 'narrow',
          },
          {
            src: '/wide-screenshot-2023-05-15.png',
            type: 'image/png',
            sizes: '1504x912',
            form_factor: 'wide',
          },
        ],
      },
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
});
