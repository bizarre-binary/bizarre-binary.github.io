<!-- @component
Wrap Color to work better with astro mdx files
-->

<script lang="ts">
  import Color from '../Color.svelte';
  import OpacitySkeleton from '../parts/OpacitySkeleton.svelte';
</script>

<div class="not-prose">
  <OpacitySkeleton>
    <Color />
  </OpacitySkeleton>
</div>
