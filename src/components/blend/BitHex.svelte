<!-- @component
A combination of bit and hexadecimal together
-->
<script module lang="ts">
  import Bits, { toBits } from '../parts/Bits.svelte';
  import Digits from '../parts/Digits.svelte';
</script>

<script lang="ts">
  interface Props {
    colReverse?: boolean;
    noMargin?: boolean;
    compact?: boolean;
    integer?: number;
    minLength?: number;
    maxLength?: number;
    borderHex?: boolean;
    borderOctal?: boolean;
    octetBorder?: boolean;
    overrideCellBg?: string | null;
  }

  let {
    colReverse = false,
    noMargin = false,
    compact = false,
    integer = $bindable(42),
    minLength = 0,
    maxLength = -1,
    borderHex = true,
    borderOctal = true,
    octetBorder = false,
    overrideCellBg = null,
  }: Props = $props();
  // caculate initial value to prevent initial UI glitch
  let lengthOfBits = $derived(Math.max(toBits(integer).length, minLength));
</script>

<!-- safe list class="flex flex-col-reverse my-0.5" -->
<div class:flex={colReverse} class:flex-col-reverse={colReverse}>
  <div class="flex" class:my-0.5={!noMargin}>
    <div class="grow"></div>
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
    <div class="grow"></div>
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
