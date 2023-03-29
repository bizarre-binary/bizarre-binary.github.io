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
    _integer = _integer == max ? min : _integer + 1;
  }

  function decrement() {
    _integer = _integer == min ? max : _integer - 1;
  }

  function setToMin() {
    _integer = min;
  }

  function setToMax() {
    _integer = max;
  }
</script>

<div>
  <table class="border-0 justify-items-end text-right border-collapse">
    <thead />
    <tbody>
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
      <tr>
        <td>
          <input
            {min}
            {max}
            type="number"
            bind:value={_integer}
            class="rounded-md px-1.5 border border-solid w-full max-w-[9rem] text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </td>
      </tr>
      <tr>
        <td>
          <button
            class="btn btn-outline btn-xs btn-info"
            on:click={setToMax}
            disabled={_integer == max}
          >
            max
          </button>
          <small class="text-gray-400">{formatted.max}</small>
          <button
            class="btn btn-outline btn-xs btn-primary"
            on:click={setToMin}
            disabled={_integer == min}
          >
            min
          </button>
          <small class="text-gray-400">{formatted.min}</small>
          <button class="btn btn-outline btn-xs btn-success" on:click={increment}>
            {_integer === max ? 'min' : '+1'}
          </button>
          <button class="btn btn-outline btn-xs btn-warning" on:click={decrement}>
            {_integer === min ? 'max' : '-1'}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
