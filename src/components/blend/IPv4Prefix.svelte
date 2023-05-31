<!-- @component
for CIDR network prefix
-->
<script context="module" lang="ts">
  import Bits from '../parts/Bits.svelte';

  const length = 5;
</script>

<script lang="ts">
  export let integer = 16;
</script>

<div>
  <Bits
    bind:integer
    multipleOf={length}
    maxLength={length}
    borderOctal={false}
    borderHex={false}
    compact={true}
    powered={true}
  />
</div>
