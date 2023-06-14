<!-- @component
Wrap Number to work better with astro mdx files
-->

<script lang="ts">
  import Number from '../Number.svelte';
  import OpacitySkeleton from '../parts/OpacitySkeleton.svelte';
</script>

<div class="not-prose my-7">
  <OpacitySkeleton>
    <Number />
  </OpacitySkeleton>
</div>
