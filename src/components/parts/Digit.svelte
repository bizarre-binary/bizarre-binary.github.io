<!-- @component
A digit that represent any number up to hexadecimal
-->
<script module lang="ts">
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
  import { focusIt } from '@lib/dom';

  const dispatch = createEventDispatcher<{ update: UpdateDigitEvent }>();

  interface Props {
    base?: number;
    digit?: number;
    position?: number;
  }

  let { base = 16, digit = $bindable(0), position = 0 }: Props = $props();

  const safeUpdate = (newDigit: number, position: number) => {
    const safeDigit = Math.min(base - 1, Math.max(0, newDigit));
    dispatch('update', {
      digit: safeDigit,
      position,
    });
  };

  const focusNeighbour = (target: EventTarget | null, adjust: number) => {
    focusIt(target, `select[data-position="${position + adjust}"]`, 'table');
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
  let render = $derived((n: number) => n.toString(base).toUpperCase());
  let digits = $derived([...Array(base).keys()]);
  $effect(() => {
    safeUpdate(digit, position);
  });
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
    onkeydown={superChargeKeyDown}
  >
    {#each [...digits].reverse() as d, i (i)}
      <!-- styling option is necessary on Edge browser if not Windows in general -->
      <!-- to reset the trick above for Safari -->
      <option value={d} class="text-center text-black">
        {render(d)}
      </option>
    {/each}
  </select>
</div>
