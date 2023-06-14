<!-- @component
Wrap CIDR to work better with astro mdx files
-->

<script lang="ts">
  import CIDR from '../CIDR.svelte';
  import OpacitySkeleton from '../parts/OpacitySkeleton.svelte';
</script>

<div class="not-prose my-7">
  <OpacitySkeleton>
    <CIDR />
  </OpacitySkeleton>
</div>
