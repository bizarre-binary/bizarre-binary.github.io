<!-- @component
Visualize CIDR
-->
<script module lang="ts">
  import { debounce } from '@lib/debounce';
  const cacheKey = 'ip-notation';

  export const initialNotation = () => {
    const cached = typeof localStorage !== 'undefined' ? localStorage.getItem(cacheKey) : null;
    return cached ? JSON.parse(cached) : { address: 0xc0a80000, prefix: 16 };
  };

  export const cacheNotation = debounce((address: number, prefix: number) => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(cacheKey, JSON.stringify({ address, prefix }));
  });

  const length = 32;
</script>

<script lang="ts">
  import IPv4 from './blend/IPv4.svelte';
  import { calcIP, render as renderIPs } from '@lib/ipv4';
  import IPv4Network from './blend/IPv4Network.svelte';
  import IPv4Chart from './parts/IPv4Chart.svelte';
  let { address, prefix } = $state(initialNotation());
  $effect(() => {
    cacheNotation(address, prefix);
  });

  let calced = $derived(calcIP(address, prefix));

  let mask = $derived('mask' in calced ? calced.mask : 0);
  let network = $derived('network' in calced ? calced.network : 0);
  let min = $derived('min' in calced ? calced.min : 0);
  let max = $derived('max' in calced ? calced.max : 0);
  let broadcast = $derived('broadcast' in calced ? calced.broadcast : 0);
  let hosts = $derived('hosts' in calced ? calced.hosts : 0);

  let {
    address: renderedAddress,
    network: renderedNetwork,
    mask: renderedMask,
    broadcast: renderedBroadcast,
    min: renderedMin,
    max: renderedMax,
    hosts: renderedHosts,
  } = $derived(renderIPs(calced));
</script>

<div class="sm:mx--6">
  <IPv4 bind:address bind:prefix {renderedAddress}>
    <!-- @migration-task: migrate this slot by hand, `extra-bits` is an invalid identifier -->
    <IPv4Network
      slot="extra-bits"
      bind:address
      bind:prefix
      {length}
      {mask}
      {network}
      {renderedMask}
      {renderedNetwork}
    />
  </IPv4>
</div>

<div class="lt-sm:px-1 mt-2">
  <IPv4Chart
    {min}
    {max}
    {length}
    {prefix}
    bind:address
    {network}
    {mask}
    {broadcast}
    {hosts}
    {renderedHosts}
    {renderedAddress}
    {renderedMin}
    {renderedMax}
    {renderedBroadcast}
    {renderedNetwork}
  />
</div>
