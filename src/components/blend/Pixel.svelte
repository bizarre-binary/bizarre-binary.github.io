<!-- @component
Pixel that contains sub pixels
-->
<script context="module" lang="ts">
  import { createEventDispatcher } from 'svelte';
  import SubPixel from './SubPixel.svelte';
  import CopyToClipboard from '@components/parts/CopyToClipboard.svelte';
  import { toHex } from '@lib/convert';
  import type { RGBA } from '@lib/convert';

  export interface UpdatePixelEvent {
    rgba: RGBA;
    position: number;
  }
</script>

<script lang="ts">
  const dispatch = createEventDispatcher<{ update: UpdatePixelEvent }>();

  export let pixel = { r: 254, g: 240, b: 138 };
  export let position: number;

  export const updatePixel = (rgba: RGBA) => {
    dispatch('update', {
      rgba,
      position,
    });
  };

  let { r, g, b } = pixel;
  $: {
    updatePixel({ r, g, b, a: 255 });
  }

  const toSubPixel = (i: number) => {
    return toHex(i, 2);
  };

  $: sr = toSubPixel(r);
  $: sg = toSubPixel(g);
  $: sb = toSubPixel(b);

  $: colorHex = `#${sr}${sg}${sb}`.toUpperCase();
  $: colorNumbers = `(${r}, ${g}, ${b})`;
</script>

<div class="flex items-center lt-xs:overflow-x-auto">
  <div class="grow" />
  <div class="w-fit sm:flex sm:w-auto">
    <div class="grow" />
    <div>
      <SubPixel tint={{ text: 'Red', color: '#C00000' }} bind:integer={r} color={`#${sr}0000`} />
    </div>
    <div class="mt-2 sm:mt-0">
      <SubPixel tint={{ text: 'Green', color: '#00A800' }} bind:integer={g} color={`#00${sg}00`} />
    </div>
    <div class="mt-2 sm:mt-0">
      <SubPixel tint={{ text: 'Blue', color: '#0070F0' }} bind:integer={b} color={`#0000${sb}`} />
    </div>
    <div class="grow" />
  </div>
  <div class="grow" />
</div>
<div class="my-5">
  <div class="focus-within:outline outline-none rounded flex items-center p-0.5 mx-0.1">
    <div class="grow" />
    <CopyToClipboard textToCopy={colorHex}>
      <div class="flex">
        <!-- an "hack" for square - https://stackoverflow.com/a/19068538/1570165 -->
        <div
          class="rounded outline outline-gray-200 block w-0 h-0 pr-[3.5rem] pb-[3.5rem] mx-0.3"
          style:background-color={colorHex}
        />
        <div class="mx-2">
          <pre class="text-xs text-left">{colorNumbers}</pre>
          <pre class="text-3xl text-center">{colorHex}</pre>
        </div>
      </div>
    </CopyToClipboard>
    <div class="grow" />
  </div>
</div>
