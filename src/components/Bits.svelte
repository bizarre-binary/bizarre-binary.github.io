<!-- @component
Take an integer and represent that as a series of bits
-->
<script lang="ts">
  import Bit from './Bit.svelte';
  import type { BitFlipEvent } from './Bit.svelte';
  import { fly } from 'svelte/transition';

  export let integer = 0;
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
  $: lengthOfBits = bits.length;
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

  const transitionOptions = { duration: 500 };
</script>

<table class="table-auto border border-slate-500 border-collapse">
  <thead>
    <tr>
      {#each sups as sup, idx (idx)}
        <th transition:fly={transitionOptions} class="border">
          <small>2<sup>{sup}</sup></small>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    <tr>
      <!-- (id) is important for transition animation -->
      {#each bits as bit, idx (lengthOfBits - idx)}
        <td
          transition:fly={transitionOptions}
          class="border hover:border-slate-500 text-center"
          class:bg-yellow-200={!!bit}
          class:text-gray-800={!!bit}
        >
          <Bit checked={!!bit} position={idx} on:flip={onFlip} />
        </td>
      {/each}
    </tr>
    <tr>
      <td class="hidden" colspan={lengthOfBits}>
        {JSON.stringify(debug)}
      </td>
    </tr>
  </tbody>
</table>
