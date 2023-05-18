<!-- @component
A combination of bit and hexadecimal together
-->
<script context="module" lang="ts">
  import Bits, { toBits } from '../parts/Bits.svelte';
  import Digits from '../parts/Digits.svelte';
</script>

<script lang="ts">
  export let integer = 42;
  export let minLength = 0;
  export let max = -1;
  export let borderOctal = true;
  // caculate initial value to prevent initial UI glitch
  $: lengthOfBits = Math.max(toBits(integer).length, minLength);
</script>

<div class="flex my-0.5">
  <div class="grow" />
  <Bits bind:integer multipleOf={lengthOfBits} {max} {borderOctal} />
</div>
<div class="flex my-0.5">
  <div class="grow" />
  <Digits bind:integer {lengthOfBits} max={max / 4} />
</div>
