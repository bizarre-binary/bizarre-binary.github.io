<!-- @component
A combination of octal and bit and hexadecimal together
-->
<script context="module" lang="ts">
  import { toBits } from '../parts/Bits.svelte';
  import Digits from '../parts/Digits.svelte';
  import BitHex from './BitHex.svelte';
</script>

<script lang="ts">
  export let integer = 42;
  // caculate initial value to prevent initial UI glitch
  $: lengthOfBits = toBits(integer).length;
</script>

<div>
  <div class="flex my-0.5">
    <div class="grow" />
    <Digits bind:integer {lengthOfBits} bitsToBundle={3} />
  </div>
  <BitHex bind:integer />
</div>
