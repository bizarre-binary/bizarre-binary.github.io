<!-- @component
Visualize a sub pixel with 8 bits
-->
<script context="module" lang="ts">
  import BitHex from './BitHex.svelte';
  import InputNumberLocaled from '../parts/InputNumberLocaled.svelte';
  import { toHsl } from '@lib/color';
  import { debounce } from '../../lib/debounce';

  const min = 0;
  const max = 255;
</script>

<script lang="ts">
  export let integer = 42;
  export let color = '#50d71e';
  export let tint = { text: 'label', color: '#000' };

  $: hsl = toHsl(color);
  $: rangeShdw = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;

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

<div class="mx-0.5 flex flex-row-reverse sm:flex-col">
  <div class="hidden sm:block text-lg text-center m-0.5" style={`color: ${tint.color};`}>
    {tint.text}
  </div>
  <div class="rounded" style={`background-color: ${tint.color}0F`}>
    <div class="mix-blend-multiply">
      <BitHex
        bind:integer
        minLength={8}
        max={8}
        borderOctal={false}
        borderHex={false}
        overrideCellBg={`${tint.color}50`}
      />
    </div>
  </div>
  <div class="flex flex-col mr-5 sm:mr-0">
    <div class="grow" />
    <div class="px-6 sm:hidden text-xl" style={`color: ${tint.color};`}>
      {tint.text}
    </div>
    <label
      for={undefined}
      class="block rounded flex items-center p-0.5 mx-0.1 hover:outline hover:outline-gray-300 focus-within:outline focus-within:outline-blue-500 focus-within:hover:outline-blue-500 min-w-[8rem]"
    >
      <div class="grow" />
      <div class="grow" />
      <!-- an "hack" for square - https://stackoverflow.com/a/19068538/1570165 -->
      <div
        class="rounded outline outline-gray-50 block w-0 h-0 pr-[1.3rem] pb-[1.3rem] mx-0.3"
        style={`background-color: ${color};`}
      />
      <div class="text-xl sm:text-base">
        <InputNumberLocaled
          {min}
          {max}
          bind:value={integerInput}
          class="focus:outline-none w-17 px-2 bg-transparent"
        />
      </div>
      <div class="grow" />
    </label>
    <div class="origin-center rotate-180 my-3">
      <!-- using different range per "breakpoint" for now due to variation doesn't work with daisy ui yet -->
      <!-- https://github.com/kidonng/unocss-preset-daisy/issues/14 -->
      <!-- non touch screen -->
      <input
        type="range"
        {min}
        {max}
        bind:value={integer}
        class="block [@media(pointer:coarse)]:hidden range range-sm"
        style={`--range-shdw: ${rangeShdw};`}
      />
      <!-- touch screen -->
      <input
        type="range"
        {min}
        {max}
        bind:value={integer}
        class="hidden [@media(pointer:coarse)]:block range range-lg"
        style={`--range-shdw: ${rangeShdw};`}
      />
    </div>
  </div>
</div>
