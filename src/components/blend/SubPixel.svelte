<!-- @component
Visualize a sub pixel with 8 bits
-->
<script context="module" lang="ts">
  import BitHex from './BitHex.svelte';
  import InputNumberLocaled from '../parts/InputNumberLocaled.svelte';
  import { debounce } from '../../lib/debounce';

  const min = 0;
  const max = 255;
</script>

<script lang="ts">
  export let integer = 42;
  export let color = '#50d71e';
  export let label = { text: 'label', color: '#000' };

  // use `integerInput` to bridge the input and real value
  $: integerInput = integer;

  // throttle integer input update to be out of the way of with svelte transitions
  const reconsile = debounce((newValue) => {
    integer = newValue || 0; // in case the input has empty string
  });

  $: {
    reconsile(integerInput);
  }

  $: {
    if (integerInput < min) integerInput = min;
    if (integerInput > max) integerInput = max;
  }
</script>

<div class="mx-0.5">
  <div class="text-lg text-center m-0.5" style={`color: ${label.color};`}>
    {label.text}
  </div>
  <div>
    <BitHex bind:integer minLength={8} max={8} borderOctal={false} />
  </div>
  <label
    for={undefined}
    class="block rounded flex items-center p-0.5 mx-0.1 hover:outline hover:outline-gray-300 focus-within:outline focus-within:outline-blue-500 focus-within:hover:outline-blue-500"
  >
    <div class="grow" />
    <div class="grow" />
    <!-- an "hack" for square - https://stackoverflow.com/a/19068538/1570165 -->
    <div
      class="rounded outline outline-gray-50 block w-0 h-0 pr-[12%] pb-[12%] mx-0.3"
      style={`background-color: ${color};`}
    />
    <div>
      <InputNumberLocaled
        {min}
        {max}
        bind:value={integerInput}
        class="focus:outline-none w-17 px-2"
      />
    </div>
    <div class="grow" />
  </label>
</div>
