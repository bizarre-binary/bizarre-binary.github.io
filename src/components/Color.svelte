<!-- @component
Visualize True color
-->
<script context="module" lang="ts">
  import { toRGBA, fromRGBA, toHex } from '@lib/convert';
  import { isHexDark, toHsl } from '@lib/color';
  import { debounce } from '@lib/debounce';
  import type { UpdatePixelEvent } from '@components/blend/Pixel.svelte';

  type ColorStorage = {
    pixels: [number, number, number, number, number, number];
    selected: number;
  };

  const pixelsKey = 'color-pixels';

  // for this to work consistently client:only directive is necessary from .astro components
  export const initialPixels = (): ColorStorage => {
    const cached = localStorage.getItem(pixelsKey);
    return cached
      ? JSON.parse(cached)
      : {
          pixels: [0x845ec2ff, 0xd65db1ff, 0xff6f91ff, 0xff9671ff, 0xffc75fff, 0xf9f871ff],
          selected: 0,
        };
  };
</script>

<script lang="ts">
  let { pixels, selected } = initialPixels();

  export const cachePixel = debounce((selected: number) => {
    localStorage.setItem(pixelsKey, JSON.stringify({ pixels, selected }));
  });

  import Pixel from './blend/Pixel.svelte';

  $: selectedPixel = toRGBA(pixels[selected]);
  $: {
    cachePixel(selected);
  }

  function onUpdate({ detail: { position, rgba } }: CustomEvent<UpdatePixelEvent>) {
    pixels[position] = fromRGBA(rgba);
    pixels = pixels;
    cachePixel(position);
  }

  const hex = (pixel: number) => `#${toHex(pixel, 8)}`;

  const hsl = (pixel: number) => {
    const hsl = toHsl(hex(pixel));

    return `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
  };

  const tabTextColor = (pixel: number) => (isHexDark(hex(pixel)) ? 'white' : 'black');

  $: labelStyle = (isSelected: boolean, pixel: number, selectedPixel: number) =>
    !isSelected
      ? `background-color: ${hex(pixel)};--bc: ${hsl(selectedPixel)};`
      : `--tab-border-color: ${hex(pixel)} !important;`;
  $: hexStyle = (isSelected: boolean, pixel: number) =>
    !isSelected
      ? `color: ${tabTextColor(pixel)};`
      : `background-color: ${hex(pixel)}; color: ${tabTextColor(pixel)}`;
</script>

<div class="flex w-screen sm:w-auto">
  <div class="grow" />
  <div class="tabs mb-2 sm:mb-1">
    <!-- uno safelist class="rounded-br rounded-bl tab-active tab-lifted sm:hover:outline hover:cursor-default" -->
    {#each pixels as pixel, idx}
      <label
        class="tab tab-bordered rounded-t !px-1 !sm:px-3 text-xs sm:text-base ![--un-border-opacity:1] border-b-1 outline-gray hover:z-10 [@media(hover:none)]:outline-0"
        class:rounded-br={idx === selected - 1}
        class:rounded-bl={idx === selected + 1}
        class:sm:hover:outline={idx !== selected}
        class:hover:cursor-default={idx == selected}
        class:tab-active={idx === selected}
        class:tab-lifted={idx === selected}
        style={labelStyle(selected === idx, pixel, pixels[selected])}
      >
        <input
          type="radio"
          bind:group={selected}
          name="color-tab"
          class="radio hidden opacity-0"
          value={idx}
        />
        <div
          class="font-mono uppercase rounded px-0.5 sm:px-2"
          style={hexStyle(selected === idx, pixel)}
        >
          {hex(pixel).substring(1, 7)}
        </div>
      </label>
    {/each}
  </div>
  <div class="grow" />
</div>

{#key selected}
  <Pixel pixel={selectedPixel} position={selected} on:update={onUpdate} />
{/key}
