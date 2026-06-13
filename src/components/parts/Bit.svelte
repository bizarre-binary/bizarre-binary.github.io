<!-- @component
A bit flipper
-->
<script module lang="ts">
  export interface BitFlipEvent {
    checked: boolean;
    position: number;
  }

  type Adjust = 'add' | 'focus';
  type KeyToAction = Record<string, Partial<Record<Adjust, number>>>;

  const keyMapToAction: KeyToAction = {
    ArrowRight: { focus: 1 },
    ArrowLeft: { focus: -1 },
    ArrowDown: { add: -1 },
    ArrowUp: { add: 1 },
  };
</script>

<script lang="ts">
  import { focusIt } from '@lib/dom';

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ flip: BitFlipEvent }>();

  interface Props {
    checked?: boolean;
    position?: number;
    disabled?: boolean;
  }

  let { checked = $bindable(false), position = 0, disabled = false }: Props = $props();

  // avoid `$: dispatch ...` as I want the dispatch to happen from user interaction only
  const flip = () => {
    dispatch('flip', {
      checked,
      position,
    });
  };

  const focusNeighbour = (target: EventTarget | null, adjust: number) => {
    focusIt(target, `input[data-position="${position + adjust}"]`, 'table');
  };

  const onKeydown = (e: KeyboardEvent) => {
    const action = keyMapToAction[e.key];

    if (action) {
      e.preventDefault();
      if ('add' in action) {
        checked = (action['add'] as number) > 0 ? true : false;
        flip();
      } else if ('focus' in action) {
        focusNeighbour(e.target, action['focus'] as number);
      }
    }
  };
</script>

<label class="relative block">
  <input
    data-position={position}
    class={[
      'absolute block w-full h-full appearance-none z-10',
      'peer cursor-pointer disabled:!cursor-default',
    ].join(' ')}
    type="checkbox"
    bind:checked
    onchange={flip}
    onkeydown={onKeydown}
    {disabled}
  />
  <span
    class={[
      'flex justify-center items-center',
      'peer-disabled:text-gray-300',
      "after:content-['0'] after:peer-checked:content-['1']",
    ].join(' ')}
  ></span>
</label>
<!-- styling was originally based on https://codepen.io/bcmdr/pen/oEwqPX -->
