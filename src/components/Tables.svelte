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
  <table class="border justify-items-end text-right">
    <thead class="border">
      <tr>
        <th>
          <div class="text-gray-400">
            <small>min: {min}, max: {max}</small>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <button on:click={increment}>+1</button>
          <button on:click={decrement}>-1</button>
          <input {min} {max} type="number" bind:value={integer} class="text-right" />
        </td>
      </tr>
      <tr
        ><td>
          <div class="flex">
            <div class="grow" />
            <Bits bind:integer />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
