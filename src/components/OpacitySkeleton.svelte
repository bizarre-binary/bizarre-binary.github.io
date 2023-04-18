<!-- @component
A component that glues between Svelte and Astro
Useful assuming the height of pre-rendered with "dummy" data and hydrated with "correct" data
to prevent UI "glitch" of "folding" and "unfolding"
-->
<script lang="ts">
  import { onMount } from 'svelte';
  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

<!-- flipping direction twice and adding flex here and there to overflow on left not right - thanks to https://stackoverflow.com/a/39874526/1570165 -->
<div class="opacity-0 transition-opacity transition-duration-300" class:opacity-100={mounted}>
  <slot />
</div>
