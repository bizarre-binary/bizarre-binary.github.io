<!-- @component
Take an integer and represent that as a series of bits
-->
<script lang="ts">
  import Bit from './Bit.svelte';
  import type { BitFlipEvent } from './Bit.svelte';
  import { fly } from 'svelte/transition';

  export let integer = 0;
  export let lengthOfBits: number;
  export let multipleOf = 4;

  function extractBit(n: number, bag: number[] = []): number[] {
    if (n < 1) {
      if (bag.length > 0) {
        return [];
      } else {
        return [0];
      }
    }
    const lastBit = n & 0x1;
    const rightShifted = n >>> 1;

    return [...extractBit(rightShifted, bag), lastBit];
  }

  let changedPosition = 0;

  $: _bits = extractBit(integer);
  $: remainder = _bits.length % multipleOf;
  $: paddingLength = remainder === 0 ? 0 : multipleOf - remainder;
  $: bits = [...Array.from({ length: paddingLength }, () => 0), ..._bits];
  $: {
    lengthOfBits = bits.length;
  }
  $: debug = { paddingLength, len: _bits.length, changedPosition, _bits, bits };
  $: sups = Array.from(bits.keys(), (k) => lengthOfBits - k - 1);

  function constructInteger(bits: number[]): number {
    return bits
      .map((bit, idx) => {
        const significance = sups[idx];

        return bit * Math.pow(2, significance);
      })
      .reduce((acc, curr) => acc + curr, 0);
  }

  function onFlip({ detail: { position, checked } }: CustomEvent<BitFlipEvent>) {
    changedPosition = position;
    bits[position] = checked ? 1 : 0;

    integer = constructInteger(bits);
  }

  $: borderStyle = (idx: number) =>
    idx % 4 == 0
      ? 'border-double border-slate-500'
      : idx % 3 == 0
      ? 'border-dashed border-slate-500'
      : 'border-l-1 border-solid border-slate-300';

  const transitionOptions = { duration: 500 };
</script>

<!-- <unocss-safelist class="bg-yellow-200 text-gray-800" /> -->
<!-- <unocss-safelist class="border-double border-dashed border-x-2 border-r-0 border-slate-300 border-slate-500" /> -->

<div class="hidden text-left">
  <pre>{JSON.stringify(debug, null, 2)}</pre>
</div>
<table class="table-auto border-0 border-r-1 border-slate-300 border-collapse">
  <thead>
    <tr>
      {#each sups as sup, idx (idx)}
        <th
          transition:fly={transitionOptions}
          class={`border w-bit text-center border-0 border-x-2 border-r-0 ${borderStyle(
            lengthOfBits - idx
          )}`}
        >
          <small>2<sup>{sup}</sup></small>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    <tr class="border-0">
      <!-- (id) is important for transition animation -->
      {#each bits as bit, idx (lengthOfBits - idx)}
        <td
          transition:fly={transitionOptions}
          class={`border-0 border-x-2 border-r-0 border-/slate-500 text-center ${borderStyle(
            lengthOfBits - idx
          )}`}
          class:bg-yellow-200={!!bit}
          class:text-gray-800={!!bit}
        >
          <Bit checked={!!bit} position={idx} on:flip={onFlip} />
        </td>
      {/each}
    </tr>
  </tbody>
</table>
