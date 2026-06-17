<!-- @component
A auxiliary controls that supports changing numbers using buttons and input box
-->
<script module lang="ts">
  const objectMap = <V, R>(
    obj: { [key: string]: V },
    fn: (value: V, key: string, index: number) => R
  ) => Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));

  export const NCClickEvent = {
    increment: 0,
    decrement: 1,
    setToMax: 2,
    setToMin: 3,
  } as const;
  export type NCClickEvent = (typeof NCClickEvent)[keyof typeof NCClickEvent];
</script>

<script lang="ts">
  import InputNumberLocaled from './InputNumberLocaled.svelte';

  interface Props {
    min?: number;
    max?: number;
    integer?: number;
    onClick?: (e: NCClickEvent) => void;
  }

  let { min = 0, max = 999999999, integer = $bindable(42), onClick }: Props = $props();

  let formatted = $derived(
    objectMap({ max, min }, (n: number) => new Intl.NumberFormat('en-US', {}).format(n))
  );

  function increment() {
    onClick?.(NCClickEvent.increment);
  }
  function decrement() {
    onClick?.(NCClickEvent.decrement);
  }
  function setToMax() {
    onClick?.(NCClickEvent.setToMax);
  }
  function setToMin() {
    onClick?.(NCClickEvent.setToMin);
  }
</script>

<!-- `dir="rtl"` allowed to avoid inserting `text-right w-full` to `<InputNumberLocaled />` and wrapping the component with `flex` and `flex-grow` -->
<!-- actually above is not true with chrome so wrapped it with `dir="ltr"` and inserted `w-full text-right` as well -->
<div class="py-1" dir="rtl">
  <div dir="ltr" class="max-w-[9rem]">
    <InputNumberLocaled
      {min}
      {max}
      bind:value={integer}
      class="w-full text-right rounded-md px-1.5 border border-solid border-gray-200 max-w-[9rem] input-number-hide-arrows font-mono"
    />
  </div>
</div>
<div>
  <!-- safe list class="btn-disabled" -->
  <button
    class="btn btn-outline btn-xs btn-info min-w-12 uppercase"
    onclick={setToMax}
    disabled={integer == max}
    class:btn-disabled={integer === max}
  >
    max
  </button>
  <small class="text-gray-400">{formatted.max}</small>
  <button
    class="btn btn-outline btn-xs btn-primary min-w-12 uppercase"
    onclick={setToMin}
    disabled={integer === min}
    class:btn-disabled={integer === min}
  >
    min
  </button>
  <small class="text-gray-400">{formatted.min}</small>
  <button class="btn btn-outline btn-xs btn-success min-w-12" onclick={increment}>
    {integer === max ? 'min' : '+1'}
  </button>
  <button class="btn btn-outline btn-xs btn-warning min-w-12" onclick={decrement}>
    {integer === min ? 'max' : '-1'}
  </button>
</div>
