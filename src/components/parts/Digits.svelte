<!-- @component
Take an integer and represent that as a series of numbers with a base
-->
<script context="module" lang="ts">
  import Digit from './Digit.svelte';
  import type { UpdateDigitEvent } from './Digit.svelte';
  import { fly } from 'svelte/transition';
  import { genExtractDigits, genConstructInteger, getExponents } from '../../lib/digit';
  import { motion } from '../../lib/defaults';
</script>

<script lang="ts">
  export let bitsToBundle = 4;
  export let integer = 42;

  export let lengthOfBits: number;
  export let max = -1;

  $: widthClass = bitsToBundle === 4 ? 'w-hex' : bitsToBundle === 3 ? 'w-octal' : '';
  $: borderStyle = [
    'border-0 border-l-2',
    bitsToBundle === 4
      ? 'border-slate-200 border-solid'
      : bitsToBundle === 3
      ? 'border-slate-300 border-dashed'
      : '',
  ].join(' ');

  $: cellBg = bitsToBundle === 3 ? 'bg-sky-200' : 'bg-purple-200';

  $: cellClasses = `text-center ${widthClass} ${borderStyle}`;

  $: base = Math.pow(2, bitsToBundle);
  $: extractDigits = genExtractDigits(bitsToBundle);
  $: shouldBeLength = Math.ceil(lengthOfBits / bitsToBundle); // firstly tidy
  $: _digits = extractDigits(integer).slice(shouldBeLength * -1);
  $: paddingLength = lengthOfBits > _digits.length * bitsToBundle ? 1 : 0; // secondly pad
  $: untrimmedDigits = [...Array.from({ length: paddingLength }, () => 0), ..._digits];
  $: digits = max > 0 ? untrimmedDigits.slice(max * -1) : untrimmedDigits;
  $: sups = getExponents(digits);
  $: constructInteger = genConstructInteger(bitsToBundle);

  let changedPosition = 0;
  $: debug = { len: _digits.length, changedPosition, _digits, digits };

  function onUpdate({ detail: { position, digit } }: CustomEvent<UpdateDigitEvent>) {
    changedPosition = position;
    digits[position] = digit;

    integer = constructInteger(digits);
  }

  const bgOpacity = (digit: number) => `--un-bg-opacity: ${digit / base};`;

  const transitionOptions = { duration: motion.duration };
  const reverseIdx = (idx: number) => digits.length - idx;
</script>

<div class="hidden text-left">
  <pre>{JSON.stringify(debug, null, 2)}</pre>
</div>
<table class="table-auto border-collapse">
  <thead class="bg-slate-50">
    <tr>
      {#each sups as sup, idx (reverseIdx(idx))}
        <th in:fly|local={transitionOptions} class={cellClasses}>
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
          in:fly|local={transitionOptions}
          class={`outline-gray-300 hover:outline ${cellClasses} ${cellBg}`}
          style={bgOpacity(digit)}
        >
          <Digit {digit} {base} position={idx} on:update={onUpdate} />
        </td>
      {/each}
    </tr>
  </tbody>
</table>
