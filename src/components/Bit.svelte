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
  $: {
    dispatch('flip', {
      checked,
      position,
    });
  }
</script>

<label>
  <input type="checkbox" bind:checked />
  <span class="bg-blue-300" />
</label>

<style>
  /* based on https://codepen.io/bcmdr/pen/oEwqPX */
  input[type='checkbox'] {
    display: none;
  }

  label > input + span {
    font-size: 1.2rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0.1rem solid var(--blue);
    border-radius: 50%;
    background: var(--darkblue);
    transition: 0.1s all;
    cursor: pointer;
    z-index: 999 !important;
  }

  label > input + span:hover {
    transform: scale(0.95);
  }

  label > input + span:after {
    content: '0';
  }

  label > input:checked + span {
    background: var(--blue);
    transform: scale(1.1);
  }

  label > input:checked + span:hover {
    background: var(--blue);
    transform: scale(1.05);
  }

  label > input:checked + span:after {
    content: '1';
  }
</style>
