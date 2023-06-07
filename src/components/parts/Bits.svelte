<!-- @component
Take an integer and represent that as a series of bits
-->
<script context="module" lang="ts">
  export interface BitsIntegerUpdateEvent {
    integer: number;
  }

  import Bit from './Bit.svelte';
  import type { BitFlipEvent } from './Bit.svelte';
  import { fly } from 'svelte/transition';
  import { genExtractDigits, genConstructInteger, getExponents } from '../../lib/digit';
  import { motion } from '../../lib/defaults';
  import { toHex, fromHex } from '../../lib/convert';
  import { createEventDispatcher } from 'svelte';

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
  export let hideHeader = false;
  export let disabledBits = 0b0;
  export let compact = false;
  export let powered = false;
  export let integer = 42;
  export let multipleOf = defaultMultipleOf;
  export let maxLength = -1;
  export let borderOctal = true;
  export let borderHex = true;
  export let octetBorder = false;
  export let overrideCellBg: string | null = null;

  let changedPosition = 0;

  $: untrimmedBits = toBits(integer, multipleOf);
  $: bits = maxLength > 0 ? untrimmedBits.slice(maxLength * -1) : untrimmedBits;
  $: lengthOfBits = bits.length;

  $: sups = getExponents(bits);
  $: constructInteger = genConstructInteger();
  $: debug = { changedPosition, bits };

  function onFlip({ detail: { position, checked } }: CustomEvent<BitFlipEvent>) {
    changedPosition = position;
    bits[position] = checked ? 1 : 0;

    integer = constructInteger(bits);
  }

  const border = {
    common: 'digit-border-common',
    hex: 'digit-border-hex',
    octal: 'digit-border-octal',
    hidden: 'border-l-hidden',
  };

  const borderExtra = (idx: number) => {
    if (idx % 4 == 0 && borderHex) return border.hex;
    else if (idx % 3 == 0 && borderOctal) return border.octal;
    return border.hidden;
  };

  $: borderStyle = (idx: number) => [border.common, borderExtra(idx)].join(' ');

  const maxAlpha = overrideCellBg ? fromHex(overrideCellBg.substring(7, 7 + 2)) : 255;
  const getOpacityHex = (n: number) =>
    toHex(Math.max(0, Math.min(maxAlpha, Math.round(n * maxAlpha))), 2);

  const bgOpacity = (bit: boolean) => `--un-bg-opacity: ${bit ? 1 : 0};`;
  const customBg = (bit: boolean) =>
    overrideCellBg
      ? `background-color: ${overrideCellBg.substring(0, 7)}${getOpacityHex(bit ? 1 : 0)};`
      : '';
  const style = (bit: number) => (overrideCellBg ? customBg(!!bit) : bgOpacity(!!bit));

  const transitionOptions = { duration: motion.duration };
  const reverseIdx = (idx: number) => lengthOfBits - idx;

  const dispatch = createEventDispatcher<{ update: BitsIntegerUpdateEvent }>();

  $: {
    dispatch('update', {
      integer,
    });
  }

  // just using disabledBits without parameter causes the lazy drawing which is not optimal in this case
  // hence send disabledBits as param with toLA
  function isDisabled(idx: number, toLA: number) {
    const operated = ((1 << (31 - idx)) >>> 0) & toLA;
    return operated >>> 0 > 0;
  }
</script>

<div class="hidden text-left">
  <pre>{JSON.stringify(debug, null, 2)}</pre>
</div>

<!-- safelist class="text-lg text-xs py-0.5 [&:nth-child(8n+5)]:border-l-0 hover:outline" -->
<table class="table-auto border-collapse">
  <thead class="bg-slate-50">
    <tr class:hidden={hideHeader}>
      {#each sups as sup, idx (reverseIdx(idx))}
        <th
          in:fly|local={transitionOptions}
          class={`text-center ${borderStyle(lengthOfBits - idx)}`}
          class:w-bit={!compact}
          class:w-bit-sm={compact}
          class:text-xs={compact}
          class:[&:nth-child(8n+5)]:border-l-0={octetBorder}
        >
          <small>
            {#if powered}
              {Math.pow(2, sup)}
            {:else}
              2<sup>{sup}</sup>
            {/if}
          </small>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    <tr class="border-0">
      <!-- (idx) is important for transition animation -->
      {#each bits as bit, idx (reverseIdx(idx))}
        {@const disabled = isDisabled(idx, disabledBits)}
        <td
          in:fly|local={transitionOptions}
          class={`relative hover:z-10 bg-yellow-200 outline-gray-300 text-center ${borderStyle(
            lengthOfBits - idx
          )}`}
          class:[&:nth-child(8n+5)]:border-l-0={octetBorder}
          class:w-bit={!compact}
          class:py-0.5={!compact}
          class:w-bit-sm={compact}
          class:text-lg={!compact}
          class:hover:outline={!disabled}
          style={style(bit)}
        >
          <Bit checked={!!bit} position={idx} on:flip={onFlip} {disabled} />
        </td>
      {/each}
    </tr>
  </tbody>
</table>
