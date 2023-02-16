<!-- @component
A demo that helps develop components
-->
<script lang="ts">
  import Bits from './Bits.svelte';
  import Digits from './Digits.svelte';

  let lengthOfBits: number;
  let integer = 42;

  const min = 0;
  const max = 999999999;

  $: if (integer < min) integer = min;
  $: if (integer > max) integer = max;

  const objectMap = <V, R>(
    obj: { [key: string]: V },
    fn: (value: V, key: string, index: number) => R
  ) => Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

  $: formatted = objectMap({ max, min }, (n: number) =>
    new Intl.NumberFormat('en-US', {}).format(n)
  );

  function increment() {
    integer++;
  }

  function decrement() {
    integer--;
  }
</script>

<div>
  <table class="border-0 justify-items-end text-right">
    <thead class="border-0">
      <tr>
        <th>
          <div class="text-gray-400">
            <small>min: {formatted.min}, max: {formatted.max}</small>
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
      <tr class="hidden">
        <td>
          <div class="flex">
            <div class="grow" />
            <Bits bind:integer bind:lengthOfBits />
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="flex">
            <div class="grow" />
            <Digits bind:integer bind:lengthOfBits bitsToBundle={3} />
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="flex">
            <div class="grow" />
            <Bits bind:integer bind:lengthOfBits />
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="flex">
            <div class="grow" />
            <Digits bind:integer bind:lengthOfBits />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
