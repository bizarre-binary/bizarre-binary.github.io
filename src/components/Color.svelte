<!-- @component
Visualize True color
-->
<script context="module" lang="ts">
  import SubPixel from './blend/SubPixel.svelte';
  const rgbKey = 'color-pixel';

  type RGB = { r: number; g: number; b: number };
  // for this to work consistently client:only directive is necessary from .astro components
  export const initialPixel = (): RGB => {
    const cached = localStorage.getItem(rgbKey);
    return cached ? JSON.parse(cached) : { r: 254, g: 240, b: 138 };
  };

  export const cachePixel = (rgb: RGB) => {
    localStorage.setItem(rgbKey, JSON.stringify(rgb));
  };
</script>

<script lang="ts">
  let { r, g, b } = initialPixel();

  $: {
    cachePixel({ r, g, b });
  }

  const toSubPixel = (i: number) => {
    const sp = i.toString(16);

    if (sp.length == 1) {
      return `0${sp}`;
    }
    return sp;
  };

  $: sr = toSubPixel(r);
  $: sg = toSubPixel(g);
  $: sb = toSubPixel(b);

  $: colorHex = `#${sr}${sg}${sb}`.toUpperCase();
  $: colorNumbers = `(${r}, ${g}, ${b})`;
</script>

<div class="flex items-center">
  <div class="grow" />
  <div class="w-fit sm:flex sm:w-auto">
    <div class="grow" />
    <div>
      <SubPixel label={{ text: 'R', color: '#C00000' }} bind:integer={r} color={`#${sr}0000`} />
    </div>
    <div class="border border-0 border-t-1 sm:border-t-0 mt-2 sm:mt-0">
      <SubPixel label={{ text: 'G', color: '#00C000' }} bind:integer={g} color={`#00${sg}00`} />
    </div>
    <div class="border border-0 border-t-1 sm:border-t-0 mt-2 sm:mt-0">
      <SubPixel label={{ text: 'B', color: '#0000F0' }} bind:integer={b} color={`#0000${sb}`} />
    </div>
    <div class="grow" />
  </div>
  <div class="grow" />
</div>
<div class="my-5">
  <label
    for={undefined}
    class="block focus-within:outline outline-none rounded flex items-center p-0.5 mx-0.1"
  >
    <div class="grow" />
    <!-- an "hack" for square - https://stackoverflow.com/a/19068538/1570165 -->
    <div
      class="rounded outline outline-gray-200 block w-0 h-0 pr-[8%] pb-[8%] mx-0.3"
      style={`background-color: ${colorHex};`}
    />
    <div class="mx-2">
      <pre class="text-xs text-left">{colorNumbers}</pre>
      <pre class="text-3xl text-center">{colorHex}</pre>
    </div>
    <div class="grow" />
  </label>
</div>
