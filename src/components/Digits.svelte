<!-- @component
Take an integer and represent that as a series of numbers with a base
-->
<script context="module" lang="ts">
  import Digit from './Digit.svelte';
  import type { UpdateDigitEvent } from './Digit.svelte';
  import { fly } from 'svelte/transition';
  import { genExtractDigits, genConstructInteger, getExponents } from '../lib/digit';
  import { motion } from '../lib/consts';
</script>

<script lang="ts">
  export let bitsToBundle = 4;
  export let integer = 0;
  export let lengthOfBits: number;

  $: widthClass = bitsToBundle === 4 ? 'w-hex' : bitsToBundle === 3 ? 'w-octal' : '';
  $: borderStyle = bitsToBundle === 4 ? 'border-double' : bitsToBundle === 3 ? 'border-dashed' : '';

  $: base = Math.pow(2, bitsToBundle);
  $: extractDigits = genExtractDigits(bitsToBundle);
  $: shouldBeLength = Math.ceil(lengthOfBits / bitsToBundle); // firstly tidy
  $: _digits = extractDigits(integer).slice(shouldBeLength * -1);
  $: paddingLength = lengthOfBits > _digits.length * bitsToBundle ? 1 : 0; // secondly pad
  $: digits = [...Array.from({ length: paddingLength }, () => 0), ..._digits];
  $: sups = getExponents(digits);
  $: constructInteger = genConstructInteger(bitsToBundle);

  let changedPosition = 0;
  $: debug = { len: _digits.length, changedPosition, _digits, digits };

  function onUpdate({ detail: { position, digit } }: CustomEvent<UpdateDigitEvent>) {
    changedPosition = position;
    digits[position] = digit;

    integer = constructInteger(digits);
  }

  const transitionOptions = { duration: motion.duration };
  const reverseIdx = (idx: number) => digits.length - idx;
</script>

<!-- <unocss-safelist class="border-y-0 border-r-0 border-l-2 border-double border-dashed" /> -->

<div class="hidden text-left">
  <pre>{JSON.stringify(debug, null, 2)}</pre>
</div>
<table class="table-auto border-1 border-slate-300 border-collapse">
  <thead>
    <tr>
      {#each sups as sup, idx (reverseIdx(idx))}
        <th
          transition:fly={transitionOptions}
          class={`border-y-0 border-r-0 border-l-2 border-slate-500 text-center ${widthClass} ${borderStyle}`}
        >
          <small>{base}<sup>{sup}</sup></small>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    <tr>
      <!-- (id) is important for transition animation -->
      {#each digits as digit, idx (reverseIdx(idx))}
        <td
          transition:fly={transitionOptions}
          class={`border-y-0 border-r-0 border-l-2 border-slate-500 text-center ${borderStyle}`}
        >
          <Digit {digit} {base} position={idx} on:update={onUpdate} />
        </td>
      {/each}
    </tr>
  </tbody>
</table>
