<!-- @component
Take an integer and represent that as a series of numbers with a base
-->
<script module lang="ts">
  import Digit from './Digit.svelte';
  import type { UpdateDigitEvent } from './Digit.svelte';
  import { genExtractDigits, genConstructInteger, getExponents } from '../../lib/digit';
  import { motion } from '../../lib/defaults';
  import { fromHex, toHex } from '../../lib/convert';
</script>

<script lang="ts">
  import { fly } from 'svelte/transition';

  interface Props {
    compact?: boolean;
    bitsToBundle?: number;
    integer?: number;
    lengthOfBits: number;
    maxLength?: number;
    drawBorder?: boolean;
    octetBorder?: boolean;
    overrideCellBg?: string | null;
  }

  let {
    compact = false,
    bitsToBundle = 4,
    integer = $bindable(42),
    lengthOfBits,
    maxLength = -1,
    drawBorder = true,
    octetBorder = false,
    overrideCellBg = null,
  }: Props = $props();

  const border = {
    common: 'digit-border-common',
    hex: 'digit-border-hex',
    octal: 'digit-border-octal',
    none: '',
  };

  const borderExtra = () => {
    if (bitsToBundle % 4 === 0) return border.hex;
    else if (bitsToBundle % 3 === 0) return border.octal;
    return border.none;
  };

  let widthClass = $derived(
    bitsToBundle === 4 ? (compact ? 'w-hex-sm' : 'w-hex') : bitsToBundle === 3 ? 'w-octal' : ''
  );
  let borderStyle = $derived(
    [borderExtra(), drawBorder ? 'border-l-2 first:border-l-0' : 'border-l-0'].join(' ')
  );

  let cellBg = $derived(bitsToBundle === 3 ? 'bg-sky-200' : 'bg-purple-200');

  let cellClasses = $derived(`text-center ${widthClass} ${borderStyle}`);

  let base = $derived(Math.pow(2, bitsToBundle));
  let extractDigits = $derived(genExtractDigits(bitsToBundle));
  let shouldBeLength = $derived(Math.ceil(lengthOfBits / bitsToBundle)); // firstly tidy
  let _digits = $derived(extractDigits(integer).slice(shouldBeLength * -1));
  let paddingLength = $derived(
    Math.max(lengthOfBits > _digits.length * bitsToBundle ? 1 : 0, shouldBeLength - _digits.length)
  ); // secondly pad
  let untrimmedDigits = $derived([...Array.from({ length: paddingLength }, () => 0), ..._digits]);
  let digits = $derived(maxLength > 0 ? untrimmedDigits.slice(maxLength * -1) : untrimmedDigits);
  let sups = $derived(getExponents(digits));
  let constructInteger = $derived(genConstructInteger(bitsToBundle));

  let changedPosition = $state(0);
  let debug = $derived({ len: _digits.length, changedPosition, _digits, digits });

  function onUpdate({ detail: { position, digit } }: CustomEvent<UpdateDigitEvent>) {
    changedPosition = position;
    digits[position] = digit;

    integer = constructInteger(digits);
  }

  const ratioToBase = (digit: number) => (digit + 1) / base;

  let maxAlpha = $derived(overrideCellBg ? fromHex(overrideCellBg.substring(7, 7 + 2)) : 255);

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
<!-- safe list class="text-sm even:border-l-0" -->
<table class="table-auto border-collapse" class:text-sm={compact}>
  <thead class="bg-slate-100/50">
    <tr>
      {#each sups as sup, idx (reverseIdx(idx))}
        <th in:fly={transitionOptions} class={cellClasses} class:even:border-l-0={octetBorder}>
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
          in:fly={transitionOptions}
          class={`relative hover:z-10 focus-within:z-10 outline-gray-300 hover:outline ${cellClasses} ${cellBg}`}
          class:even:border-l-0={octetBorder}
          style={style(digit)}
        >
          <Digit {digit} {base} position={idx} on:update={onUpdate} />
        </td>
      {/each}
    </tr>
  </tbody>
</table>
