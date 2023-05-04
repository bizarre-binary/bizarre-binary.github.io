<!-- @component
A auxiliary controls that supports changing numbers using buttons and input box
-->
<script context="module" lang="ts">
  import { createEventDispatcher } from 'svelte';

  const objectMap = <V, R>(
    obj: { [key: string]: V },
    fn: (value: V, key: string, index: number) => R
  ) => Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

  export enum NCClickEvent {
    increment,
    decrement,
    setToMax,
    setToMin,
  }
</script>

<script lang="ts">
  import InputNumberLocaled from './InputNumberLocaled.svelte';
  export let min = 0;
  export let max = 999999999;

  export let integer = 42;

  $: formatted = objectMap({ max, min }, (n: number) =>
    new Intl.NumberFormat('en-US', {}).format(n)
  );

  const dispatch = createEventDispatcher<{ click: NCClickEvent }>();

  function increment() {
    dispatch('click', NCClickEvent.increment);
  }
  function decrement() {
    dispatch('click', NCClickEvent.decrement);
  }
  function setToMax() {
    dispatch('click', NCClickEvent.setToMax);
  }
  function setToMin() {
    dispatch('click', NCClickEvent.setToMin);
  }
</script>

<!-- `dir="rtl"` allowed to avoid inserting `text-right w-full` to `<InputNumberLocaled />` and wrapping the component with `flex` and `flex-grow` -->
<div class="pb-0.5" dir="rtl">
  <InputNumberLocaled
    {min}
    {max}
    bind:value={integer}
    class="rounded-md px-1.5 border border-solid max-w-[9rem] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  />
</div>
<div>
  <button class="btn btn-outline btn-xs btn-info" on:click={setToMax} disabled={integer == max}>
    max
  </button>
  <small class="text-gray-400">{formatted.max}</small>
  <button class="btn btn-outline btn-xs btn-primary" on:click={setToMin} disabled={integer == min}>
    min
  </button>
  <small class="text-gray-400">{formatted.min}</small>
  <button class="btn btn-outline btn-xs btn-success" on:click={increment}>
    {integer === max ? 'min' : '+1'}
  </button>
  <button class="btn btn-outline btn-xs btn-warning" on:click={decrement}>
    {integer === min ? 'max' : '-1'}
  </button>
</div>
