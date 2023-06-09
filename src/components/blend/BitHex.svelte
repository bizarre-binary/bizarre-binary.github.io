<!-- @component
A combination of bit and hexadecimal together
-->
<script context="module" lang="ts">
  import Bits, { toBits } from '../parts/Bits.svelte';
  import Digits from '../parts/Digits.svelte';
</script>

<script lang="ts">
  export let colReverse = false;
  export let noMargin = false;
  export let compact = false;
  export let integer = 42;
  export let minLength = 0;
  export let maxLength = -1;
  export let borderHex = true;
  export let borderOctal = true;
  export let octetBorder = false;
  export let overrideCellBg: string | null = null;
  // caculate initial value to prevent initial UI glitch
  $: lengthOfBits = Math.max(toBits(integer).length, minLength);
</script>

<!-- safe list class="flex flex-col-reverse my-0.5" -->
<div class:flex={colReverse} class:flex-col-reverse={colReverse}>
  <div class="flex" class:my-0.5={!noMargin}>
    <div class="grow" />
    <Bits
      bind:integer
      multipleOf={lengthOfBits}
      {maxLength}
      {borderOctal}
      {borderHex}
      {overrideCellBg}
      {compact}
      {octetBorder}
    />
  </div>
  <div class="flex" class:my-0.5={!colReverse && !noMargin}>
    <div class="grow" />
    <Digits
      bind:integer
      {lengthOfBits}
      maxLength={maxLength / 4}
      drawBorder={borderHex}
      {overrideCellBg}
      {compact}
      {octetBorder}
    />
  </div>
</div>
