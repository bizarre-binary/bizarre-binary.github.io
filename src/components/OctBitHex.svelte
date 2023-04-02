<!-- @component
A combination of octal and bit and hexadecimal together
-->
<script context="module" lang="ts">
  import Bits, { toBits } from './Bits.svelte';
  import Digits from './Digits.svelte';
</script>

<script lang="ts">
  export let integer = 42;
  // caculate initial value to prevent initial UI glitch
  let lengthOfBits = toBits(integer).length;
</script>

<div>
  <div class="flex my-0.5">
    <div class="grow" />
    <Digits bind:integer bind:lengthOfBits bitsToBundle={3} />
  </div>
  <div class="flex my-0.5">
    <div class="grow" />
    <Bits bind:integer bind:lengthOfBits />
  </div>
  <div class="flex my-0.5">
    <div class="grow" />
    <Digits bind:integer bind:lengthOfBits />
  </div>
</div>
