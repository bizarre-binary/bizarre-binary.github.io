<!-- @component
A demo that helps develop components
-->
<script context="module" lang="ts">
  import OctBitHex from './blend/OctBitHex.svelte';
  import LogRange from './parts/LogRange.svelte';
  import NumberControls from './parts/NumberControls.svelte';
  import { NCClickEvent } from './parts/NumberControls.svelte';
  import { debounce } from '@lib/debounce';

  const min = 0;
  // const max = 9_192_631_770; good bye my first choice, you just overflow...
  const max = 4_294_967_295; // under the limit of 32 bits
  const integerKey = 'number-integer';

  // for this to work consistently client:only directive is necessary from .astro components
  export const initialInteger = () => {
    const cached = localStorage.getItem(integerKey);
    return cached ? parseInt(cached) : 42;
  };

  export const cacheInteger = debounce((integer: number) => {
    localStorage.setItem(integerKey, integer.toString());
  });
</script>

<script lang="ts">
  let integer = initialInteger();

  // use `integerInput` to bridge the input and real value
  $: integerInput = integer;

  // throttle integer input update to be out of the way of with svelte transitions
  const reconsile = debounce((newValue) => {
    integer = newValue || 0; // in case the input has empty string
  });

  $: {
    reconsile(integerInput);
    cacheInteger(integer);
  }

  $: {
    if (integerInput < min) integerInput = min;
    if (integerInput > max) integerInput = max;
  }

  function onControl(e: CustomEvent<NCClickEvent>) {
    const fn = {
      [NCClickEvent.increment]: () => {
        integerInput = integerInput == max ? min : integerInput + 1;
      },
      [NCClickEvent.decrement]: () => {
        integerInput = integerInput == min ? max : integerInput - 1;
      },
      [NCClickEvent.setToMax]: () => {
        integerInput = max;
      },
      [NCClickEvent.setToMin]: () => {
        integerInput = min;
      },
    }[e.detail];

    fn();
  }
</script>

<LogRange {min} {max} bind:value={integerInput} />
<!-- flipping direction twice and adding flex here and there to overflow on left not right - thanks to https://stackoverflow.com/a/39874526/1570165 -->
<!-- <div dir="rtl" class="flex [view-transition-name:bb-number]"> -->
<!-- currently above causes an infinite loop on chrome ~113.0.5672.92 -->
<!-- so refrain from using it until it's resolved -->
<div dir="rtl" class="flex">
  <!-- using tricks of `p-n` and `m--n` to unclip the overflow of the edges -->
  <div class="overflow-hidden xl:overflow-visible p-2 m--2 lt-xl:min-w-full">
    <!-- use overflow-x-scroll over overflow-x-auto due to the nature of dynamic value -->
    <!-- but use overflow-x-auto on xl screen since there is no possibility of scrolling there -->
    <div class="flex overflow-x-scroll xl:overflow-x-auto p-1 m--1">
      <div dir="ltr">
        <OctBitHex bind:integer />
      </div>
      <div class="grow" />
    </div>
    <div dir="ltr" class="text-right">
      <NumberControls bind:integer={integerInput} {max} {min} on:click={onControl} />
    </div>
  </div>
</div>
