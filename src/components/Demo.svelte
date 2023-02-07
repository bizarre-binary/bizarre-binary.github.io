<!-- @component
A demo that helps develop components
-->
<script lang="ts">
  import Bits from './Bits.svelte';

  let integer = 100;
  const min = 0;
  const max = 999999999;

  $: if (integer < min) integer = min;
  $: if (integer > max) integer = max;

  function increment() {
    integer++;
  }

  function decrement() {
    integer--;
  }
</script>

<div>
  <div class="text-gray-400">
    <small>min: {min}, max: {max}</small>
  </div>
  <input {min} {max} type="number" bind:value={integer} />
  <button on:click={increment}>+1</button>
  <button on:click={decrement}>-1</button>
  <Bits bind:integer />
</div>
