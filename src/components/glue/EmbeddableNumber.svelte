<!-- @component
Wrap Number to work better with astro mdx files
-->

<script lang="ts">
  import Number from '../Number.svelte';
  import OpacitySkeleton from '../parts/OpacitySkeleton.svelte';
</script>

<div class="not-prose">
  <OpacitySkeleton>
    <Number />
  </OpacitySkeleton>
</div>
