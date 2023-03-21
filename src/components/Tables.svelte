<!-- @component
A demo that helps develop components
-->
<script context="module" lang="ts">
  import Bits, { toBits } from './Bits.svelte';
  import Digits from './Digits.svelte';
  import { debounce } from '../lib/debounce';

  const min = 0;
  const max = 999999999;

  const objectMap = <V, R>(
    obj: { [key: string]: V },
    fn: (value: V, key: string, index: number) => R
  ) => Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
</script>

<script lang="ts">
  let integer = 42;
  // caculate initial value to prevent initial UI glitch
  let lengthOfBits = toBits(integer).length;

  $: _integer = integer;

  // throttle integer input update to be out of the way of with svelte transitions
  const reconsile = debounce((newValue) => {
    integer = newValue;
  });

  $: {
    reconsile(_integer);
  }

  $: {
    if (_integer < min) _integer = min;
    if (_integer > max) _integer = max;
  }

  $: formatted = objectMap({ max, min }, (n: number) =>
    new Intl.NumberFormat('en-US', {}).format(n)
  );

  function increment() {
    _integer++;
  }

  function decrement() {
    _integer--;
  }
</script>

<div>
  <table class="border-0 justify-items-end text-right border-collapse">
    <thead>
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
          <input {min} {max} type="number" bind:value={_integer} class="text-right" />
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
