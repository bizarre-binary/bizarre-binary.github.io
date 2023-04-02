<!-- @component
A demo that helps develop components
-->
<script context="module" lang="ts">
  import OctBitHex from './OctBitHex.svelte';
  import NumberControls from './NumberControls.svelte';
  import { NCClickEvent } from './NumberControls.svelte';
  import { debounce } from '../lib/debounce';

  const min = 0;
  const max = 9_192_631_770;
</script>

<script lang="ts">
  let integer = 42;

  // use `integerInput` to bridge the input and real value
  $: integerInput = integer;

  // throttle integer input update to be out of the way of with svelte transitions
  const reconsile = debounce((newValue) => {
    integer = newValue;
  });

  $: {
    reconsile(integerInput);
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

<!-- flipping direction twice and adding flex here and there to overflow on left not right - thanks to https://stackoverflow.com/a/39874526/1570165 -->
<div dir="rtl" class="flex">
  <div dir="ltr">
    <div class="flex">
      <div class="grow" />
      <OctBitHex bind:integer />
    </div>
    <div class="text-right">
      <NumberControls bind:integer={integerInput} {max} {min} on:click={onControl} />
    </div>
  </div>
  <div class="grow" />
</div>
