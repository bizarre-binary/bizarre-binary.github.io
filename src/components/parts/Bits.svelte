<!-- @component
Take an integer and represent that as a series of bits
-->
<script context="module" lang="ts">
  import Bit from './Bit.svelte';
  import type { BitFlipEvent } from './Bit.svelte';
  import { fly } from 'svelte/transition';
  import { genExtractDigits, genConstructInteger, getExponents } from '../../lib/digit';
  import { motion } from '../../lib/defaults';

  const defaultMultipleOf = 4;
  const extractBit = genExtractDigits(1);

  export function toBits(integer: number, multipleOf = defaultMultipleOf) {
    const _bits = extractBit(integer);
    const remainder = _bits.length % multipleOf;
    const paddingLength = remainder === 0 ? 0 : multipleOf - remainder;
    return [...Array.from({ length: paddingLength }, () => 0), ..._bits];
  }
</script>

<script lang="ts">
  export let integer = 42;
  export let lengthOfBits: number;
  export let multipleOf = defaultMultipleOf;

  let changedPosition = 0;

  $: bits = toBits(integer, multipleOf);
  $: {
    lengthOfBits = bits.length;
  }
  $: sups = getExponents(bits);
  $: constructInteger = genConstructInteger();
  $: debug = { changedPosition, bits };

  function onFlip({ detail: { position, checked } }: CustomEvent<BitFlipEvent>) {
    changedPosition = position;
    bits[position] = checked ? 1 : 0;

    integer = constructInteger(bits);
  }

  $: borderStyle = (idx: number) =>
    [
      'border-0 border-l-2 border-r-0',
      idx % 4 == 0
        ? 'border-l-slate-200 border-solid'
        : idx % 3 == 0
        ? 'border-l-slate-300 border-dashed'
        : 'border-l-2 border-l-hidden',
    ].join(' ');

  const transitionOptions = { duration: motion.duration };
  const reverseIdx = (idx: number) => lengthOfBits - idx;
</script>

<div class="hidden text-left">
  <pre>{JSON.stringify(debug, null, 2)}</pre>
</div>
<table class="table-auto border-collapse">
  <thead class="bg-slate-50">
    <tr>
      {#each sups as sup, idx (reverseIdx(idx))}
        <th
          in:fly|local={transitionOptions}
          class={`w-bit text-center ${borderStyle(lengthOfBits - idx)}`}
        >
          <small>2<sup>{sup}</sup></small>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    <tr class="border-0">
      <!-- (id) is important for transition animation -->
      {#each bits as bit, idx (reverseIdx(idx))}
        <td
          in:fly|local={transitionOptions}
          class={`w-bit text-center ${borderStyle(lengthOfBits - idx)}`}
          class:bg-yellow-200={!!bit}
          class:text-gray-800={!!bit}
        >
          <Bit checked={!!bit} position={idx} on:flip={onFlip} />
        </td>
      {/each}
    </tr>
  </tbody>
</table>
