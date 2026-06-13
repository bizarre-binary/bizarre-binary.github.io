<!-- @component
for CIDR network prefix
-->
<script module lang="ts">
  import Bits from '../parts/Bits.svelte';

  const length = 5;
</script>

<script lang="ts">
  interface Props {
    integer?: number;
    hideHeader?: boolean;
  }

  let { integer = $bindable(16), hideHeader = false }: Props = $props();
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
    {hideHeader}
  />
</div>
