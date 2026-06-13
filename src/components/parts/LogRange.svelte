<!-- @component
A logarithmical <input type="range">
-->
<script module lang="ts">
  import { toHsl } from '@lib/color';
  import RangeMarker from './RangeMarker.svelte';
  import { getBaseLog } from '@lib/math';
</script>

<script lang="ts">
  const log = (n: number) => getBaseLog(base, n);

  const onChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    const input = Number(target.value);

    // just to make sure that it can reach to min and skip unnecessary calculations
    // without this the value's minimum could end up at 1 even when min is 0
    if (input === min) {
      value = min;
      return;
    }

    value = Math.floor(Math.pow(2, input / scale));
    if (value < min) value = min;
    if (value > max) value = max;
  };

  interface Props {
    min?: number;
    max?: number;
    value?: number;
    scale?: number; // to control the granularity
    base?: number;
    tint?: string;
  }

  let {
    min = 0,
    max = 42,
    value = $bindable(10),
    scale = 10,
    base = 2,
    tint = '#fff094',
  }: Props = $props();

  const hsl = toHsl(tint);
  const rangeShdw = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;

  const supMin = Math.max(0, log(min));
  const supMax = Math.ceil(log(max));

  const sups = [...Array(supMax - supMin + 1).keys()].map((n: number) => n + supMin).reverse();
  const supsSmall = sups.filter((n: number) => n % 2 === 0);
  const supsXS = supsSmall.filter((n: number) => n % 8 === 0);

  let standardWidth = $state(1); // 1 is just a placeholder and it will be updated
  let minL = $derived(Math.max(0, log(min) * scale));
  let maxL = $derived(Math.ceil(log(max) * scale));
  let valueL = $derived(Math.max(0, log(value) * scale));
</script>

<div class="ml--12 xs:ml-0">
  <div class="mr-1.4 xs:mr-2">
    <div class="lt-sm:hidden">
      <RangeMarker {sups} />
    </div>
    <div class="sm:hidden lt-xs:hidden">
      <RangeMarker sups={supsSmall} />
    </div>
    <div class="hidden lt-xs:block">
      <RangeMarker sups={supsXS} />
    </div>
  </div>
  <!-- mlv-[x] has arbitrary pixel values to adjust the visual details that will be highly intertwined with other values -->
  <!-- mlv-[x] is my own custom rule at unocss to accommodate the highly dynamic values -->
  <!-- this "intensive" calculation is to accommodate the dynamic range markers that are responsive -->
  <div
    class="mr-0.3 mlv-[mlv-xs] xs:mlv-[mlv-small] sm:mlv-[mlv-normal]"
    style:--mlv-normal={`${standardWidth / sups.length - 8}px`}
    style:--mlv-small={`${standardWidth / supsSmall.length - 8}px`}
    style:--mlv-xs={`${standardWidth / supsXS.length + 1}px`}
  >
    <div class="origin-center rotate-180" bind:clientWidth={standardWidth}>
      <input
        type="range"
        min={minL}
        max={maxL}
        value={valueL}
        onchange={onChange}
        class="range range-xs"
        style:--range-progress="hsl({rangeShdw})"
        style:--range-bg="oklch(0.85 0 0)"
      />
    </div>
  </div>
</div>

<style>
  /* DaisyUI v5 caps range width at clamp(3rem, 20rem, 100%); override for this full-width layout */
  input {
    width: 100%;
  }
  /* Thinner, neutral-gray track for the xs range — DaisyUI v5 default is 8px */
  :global(.range-xs::-webkit-slider-runnable-track) {
    background-color: oklch(0.92 0 0);
    height: 2px;
    border-width: 0;
  }
  :global(.range-xs::-moz-range-track) {
    background-color: oklch(0.92 0 0);
    height: 2px;
    border-width: 0;
  }
</style>
