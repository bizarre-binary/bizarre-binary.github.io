<!-- @component
A combination of octal and bit and hexadecimal together
-->
<script module lang="ts">
  import { toBits } from '../parts/Bits.svelte';
  import Digits from '../parts/Digits.svelte';
  import BitHex from './BitHex.svelte';
</script>

<script lang="ts">
  interface Props {
    integer?: number;
  }

  let { integer = $bindable(42) }: Props = $props();
  // caculate initial value to prevent initial UI glitch
  let lengthOfBits = $derived(toBits(integer).length);
</script>

<div>
  <div class="flex my-0.5">
    <div class="grow"></div>
    <Digits bind:integer {lengthOfBits} bitsToBundle={3} />
  </div>
  <BitHex bind:integer />
</div>
