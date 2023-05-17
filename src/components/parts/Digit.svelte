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

  function flip() {
    digit = digit == 0 ? base - 1 : 0;

    dispatch('update', {
      digit,
      position,
    });
  }
</script>

<input
  type="button"
  bind:value={render}
  class="w-full text-center cursor-pointer"
  on:click={flip}
/>
