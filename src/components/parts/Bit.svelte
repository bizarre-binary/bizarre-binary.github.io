<!-- @component
A bit flipper
-->
<script context="module" lang="ts">
  export interface BitFlipEvent {
    checked: boolean;
    position: number;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ flip: BitFlipEvent }>();

  export let checked = false;
  export let position = 0;
  export let disabled = false;

  // avoid `$: dispatch ...` as I want the dispatch to happen from user interaction only
  const flip = () => {
    dispatch('flip', {
      checked,
      position,
    });
  };
</script>

<label>
  <input type="checkbox" bind:checked on:change={flip} class="peer" {disabled} />
  <span class="bg-white peer-disabled:!cursor-default peer-disabled:text-gray-300" />
</label>

<style>
  /* based on https://codepen.io/bcmdr/pen/oEwqPX */
  input[type='checkbox'] {
    display: none;
  }

  label > input + span {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  label > input + span:after {
    content: '0';
  }

  label > input:checked + span {
    background: var(--blue);
    transform: scale(1.1);
  }

  label > input:checked + span:after {
    content: '1';
  }
</style>
