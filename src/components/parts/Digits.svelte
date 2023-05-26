<!-- @component
Take an integer and represent that as a series of numbers with a base
-->
<script context="module" lang="ts">
  import Digit from './Digit.svelte';
  import type { UpdateDigitEvent } from './Digit.svelte';
  import { fly } from 'svelte/transition';
  import { genExtractDigits, genConstructInteger, getExponents } from '../../lib/digit';
  import { motion } from '../../lib/defaults';
  import { fromHex, toHex } from '../../lib/convert';
</script>

<script lang="ts">
  export let bitsToBundle = 4;
  export let integer = 42;

  export let lengthOfBits: number;
  export let max = -1;
  export let drawBorder = true;
  export let overrideCellBg: string | null = null;

  const border = {
    common: 'border-0 border-l-2 first:border-l-0',
    hex: 'border-slate-200 border-solid',
    octal: 'border-slate-300 border-dashed',
    none: '',
  };

  const borderExtra = () => {
    if (bitsToBundle % 4) return border.hex;
    else if (bitsToBundle % 3 == 0) return border.octal;
    return border.none;
  };

  $: widthClass = bitsToBundle === 4 ? 'w-hex' : bitsToBundle === 3 ? 'w-octal' : '';
  $: borderStyle = [
    'border-0 first:border-l-0',
    borderExtra(),
    drawBorder ? 'border-l-2' : 'border-l-0',
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

  const ratioToBase = (digit: number) => (digit + 1) / base;

  const maxAlpha = overrideCellBg ? fromHex(overrideCellBg.substring(7, 7 + 2)) : 255;

  const getOpacityHex = (n: number) =>
    toHex(Math.max(0, Math.min(maxAlpha, Math.round(n * maxAlpha))), 2);

  const bgOpacity = (digit: number) => `--un-bg-opacity: ${ratioToBase(digit)};`;
  const customBg = (digit: number) =>
    overrideCellBg
      ? `background-color: ${overrideCellBg.substring(0, 7)}${getOpacityHex(ratioToBase(digit))};`
      : '';
  const style = (digit: number) => (overrideCellBg ? customBg(digit) : bgOpacity(digit));

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
      <!-- (idx) is important for transition animation -->
      {#each digits as digit, idx (reverseIdx(idx))}
        <td
          in:fly|local={transitionOptions}
          class={`relative hover:z-10 focus-within:z-10 outline-gray-300 hover:outline ${cellClasses} ${cellBg}`}
          style={style(digit)}
        >
          <Digit {digit} {base} position={idx} on:update={onUpdate} />
        </td>
      {/each}
    </tr>
  </tbody>
</table>
