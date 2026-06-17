<!-- @component
Pixel that contains sub pixels
-->
<script module lang="ts">
  import { untrack } from 'svelte';
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
  interface Props {
    pixel?: { r: number; g: number; b: number };
    position: number;
    onUpdate?: (e: UpdatePixelEvent) => void;
  }

  let { pixel = { r: 254, g: 240, b: 138 }, position, onUpdate }: Props = $props();

  let r = $state(untrack(() => pixel.r));
  let g = $state(untrack(() => pixel.g));
  let b = $state(untrack(() => pixel.b));
  $effect(() => {
    onUpdate?.({ rgba: { r, g, b, a: 255 }, position });
  });

  const toSubPixel = (i: number) => {
    return toHex(i, 2);
  };

  let sr = $derived(toSubPixel(r));
  let sg = $derived(toSubPixel(g));
  let sb = $derived(toSubPixel(b));

  let colorHex = $derived(`#${sr}${sg}${sb}`.toUpperCase());
  let colorNumbers = $derived(`(${r}, ${g}, ${b})`);
</script>

<div class="flex items-center lt-xs:overflow-x-auto">
  <div class="grow"></div>
  <div class="w-fit sm:flex sm:w-auto">
    <div class="grow"></div>
    <div>
      <SubPixel tint={{ text: 'Red', color: '#C00000' }} bind:integer={r} color={`#${sr}0000`} />
    </div>
    <div class="mt-2 sm:mt-0">
      <SubPixel tint={{ text: 'Green', color: '#00A800' }} bind:integer={g} color={`#00${sg}00`} />
    </div>
    <div class="mt-2 sm:mt-0">
      <SubPixel tint={{ text: 'Blue', color: '#0070F0' }} bind:integer={b} color={`#0000${sb}`} />
    </div>
    <div class="grow"></div>
  </div>
  <div class="grow"></div>
</div>
<div class="my-5">
  <div class="focus-within:outline outline-none rounded flex items-center p-0.5 mx-0.1">
    <div class="grow"></div>
    <CopyToClipboard textToCopy={colorHex}>
      <div class="flex">
        <!-- an "hack" for square - https://stackoverflow.com/a/19068538/1570165 -->
        <div
          class="rounded outline outline-gray-200 block w-0 h-0 pr-[3.5rem] pb-[3.5rem] mx-0.3"
          style:background-color={colorHex}
        ></div>
        <div class="mx-2">
          <pre class="text-xs text-left">{colorNumbers}</pre>
          <pre class="text-3xl text-center">{colorHex}</pre>
        </div>
      </div>
    </CopyToClipboard>
    <div class="grow"></div>
  </div>
</div>
