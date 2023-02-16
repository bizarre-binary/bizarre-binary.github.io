<!-- @component
A digit that represent any number up to hexadecimal
-->
<script context="module" lang="ts">
  export interface UpdateDigitEvent {
    digit: number;
    position: number;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ update: UpdateDigitEvent }>();

  export let base = 16;
  export let digit = 0;

  $: render = digit.toString(base).toUpperCase();

  export let position = 0;
  $: {
    dispatch('update', {
      digit,
      position,
    });
  }
  function update() {
    digit = digit == 0 ? base - 1 : 0;
  }
</script>

<input
  type="button"
  bind:value={render}
  class="w-full text-center cursor-pointer bg-white"
  on:click={update}
/>
