<!-- @component
A digit that represent any number up to hexadecimal
-->
<script context="module" lang="ts">
  export interface UpdateDigitEvent {
    digit: number;
    position: number;
  }

  type Adjust = 'add' | 'absolute' | 'focus';
  type KeyToAction = Record<string, Partial<Record<Adjust, number>>>;

  const keyMapToAction: KeyToAction = {
    ArrowRight: { focus: 1 },
    ArrowLeft: { focus: -1 },
    ArrowDown: { add: -1 },
    ArrowUp: { add: 1 },
    '0': { absolute: 0 },
    '1': { absolute: 1 },
    '2': { absolute: 2 },
    '3': { absolute: 3 },
    '4': { absolute: 4 },
    '5': { absolute: 5 },
    '6': { absolute: 6 },
    '7': { absolute: 7 },
    '8': { absolute: 8 },
    '9': { absolute: 9 },
    a: { absolute: 10 },
    b: { absolute: 11 },
    c: { absolute: 12 },
    d: { absolute: 13 },
    e: { absolute: 14 },
    f: { absolute: 15 },
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ update: UpdateDigitEvent }>();

  export let base = 16;
  export let digit = 0;

  $: render = (n: number) => n.toString(base).toUpperCase();

  export let position = 0;

  const safeUpdate = (newDigit: number, position: number) => {
    const safeDigit = Math.min(base - 1, Math.max(0, newDigit));
    dispatch('update', {
      digit: safeDigit,
      position,
    });
  };

  $: digits = [...Array(base).keys()];
  $: {
    safeUpdate(digit, position);
  }

  const focusNeighbour = (target: EventTarget | null, adjust: number) => {
    const from = target as HTMLElement;
    if (from) {
      // assuming `table` is a good common root to query
      const closestTable = from.closest('table');

      if (closestTable) {
        const next = closestTable.querySelector(
          `select[data-position="${position + adjust}"]`
        ) as HTMLElement;

        if (next) {
          next.focus();
        }
      }
    }
  };

  const superChargeKeyDown = (e: KeyboardEvent) => {
    const action = keyMapToAction[e.key];

    if (action) {
      e.preventDefault();
      if ('add' in action) {
        safeUpdate(digit + (action['add'] as number), position);
      } else if ('absolute' in action) {
        safeUpdate(action['absolute'] as number, position);
      } else if ('focus' in action) {
        focusNeighbour(e.target, action['focus'] as number);
      }
    }
  };
</script>

<div class="relative">
  <!-- `text-center` for `select` element doesn't work in safari -->
  <!-- so working around with placing a `div` element just before `select` -->
  <div class="absolute left-0 bottom-0 text-center w-full">
    {render(digit)}
  </div>
  <!-- `text-transparent` so that we rely on the `div` above -->
  <!-- `relative` is important to stay on top of the `div` that is `absolute` -->
  <select
    data-position={position}
    class="relative w-full text-transparent bg-transparent appearance-none"
    bind:value={digit}
    on:keydown={superChargeKeyDown}
  >
    {#each [...digits].reverse() as d}
      <option value={d}>
        {render(d)}
      </option>
    {/each}
  </select>
</div>
