<!-- @component
Take an integer and represent that as a series of numbers with a base
-->
<script lang="ts">
  import Digit from './Digit.svelte';
  import type { UpdateDigitEvent } from './Digit.svelte';
  import { fly } from 'svelte/transition';

  export let bitsToBundle = 4;
  export let integer = 0;
  export let lengthOfBits: number;
  $: widthClass = bitsToBundle === 4 ? 'w-hex' : bitsToBundle === 3 ? 'w-octal' : '';
  $: borderStyle = bitsToBundle === 4 ? 'border-double' : bitsToBundle === 3 ? 'border-dashed' : '';
  $: base = Math.pow(2, bitsToBundle);

  function extractDigits(n: number, bag: number[] = []): number[] {
    if (n < 1) {
      if (bag.length > 0) {
        return [];
      } else {
        return [0];
      }
    }
    const lastBit = n & (base - 1);
    const rightShifted = n >>> bitsToBundle;

    return [...extractDigits(rightShifted, bag), lastBit];
  }

  let changedPosition = 0;

  $: shouldBeLength = Math.ceil(lengthOfBits / bitsToBundle); // firstly tidy
  $: _digits = extractDigits(integer).slice(shouldBeLength * -1);
  $: paddingLength = lengthOfBits > _digits.length * bitsToBundle ? 1 : 0; // secondly pad
  $: digits = [...Array.from({ length: paddingLength }, () => 0), ..._digits];
  $: lengthOfDigits = digits.length;
  $: debug = { len: _digits.length, changedPosition, _digits, digits };
  $: sups = Array.from(digits.keys(), (k) => lengthOfDigits - k - 1);

  function constructInteger(bits: number[]): number {
    return bits
      .map((bit, idx) => {
        const significance = sups[idx];

        return bit * Math.pow(base, significance);
      })
      .reduce((acc, curr) => acc + curr, 0);
  }

  function onUpdate({ detail: { position, digit } }: CustomEvent<UpdateDigitEvent>) {
    changedPosition = position;
    digits[position] = digit;

    integer = constructInteger(digits);
  }

  const transitionOptions = { duration: 500 };
</script>

<!-- <unocss-safelist class="border-y-0 border-r-0 border-l-2 border-double border-dashed" /> -->

<div class="hidden text-left">
  <pre>{JSON.stringify(debug, null, 2)}</pre>
</div>
<table class="table-auto border-1 border-slate-300 border-collapse">
  <thead>
    <tr>
      {#each sups as sup, idx (idx)}
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
      {#each digits as digit, idx (lengthOfDigits - idx)}
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
