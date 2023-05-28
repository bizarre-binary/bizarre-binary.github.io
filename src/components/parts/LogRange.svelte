<!-- @component
A logarithmical <input type="range">
-->
<script context="module" lang="ts">
  import { toHsl } from '@lib/color';
  import RangeMarker from './RangeMarker.svelte';
</script>

<script lang="ts">
  export let min = 0;
  export let max = 42;
  export let value = 10;
  export let scale = 10; // to control the granularity

  export let base = 2;
  const getBaseLog = (x: number, y: number) => Math.log(y) / Math.log(x);

  const log = (n: number) => getBaseLog(base, n);

  $: minL = Math.max(0, log(min) * scale);
  $: maxL = Math.ceil(log(max) * scale);

  $: valueL = Math.max(0, log(value) * scale);

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

  export let tint = '#fff094';

  const hsl = toHsl(tint);
  const rangeShdw = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;

  const supMin = Math.max(0, log(min));
  const supMax = Math.ceil(log(max));

  $: sups = [...Array(supMax - supMin + 1).keys()].map((n: number) => n + supMin).reverse();
  $: supsSmall = sups.filter((n: number) => n % 2 === 0);
  $: supsXS = supsSmall.filter((n: number) => n % 8 === 0);

  let standardWidth = 1; // 1 is just a placeholder and it will be updated
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
        on:change={onChange}
        class="range range-xs"
        style={`--range-shdw: ${rangeShdw};`}
      />
    </div>
  </div>
</div>
