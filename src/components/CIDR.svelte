<!-- @component
Visualize CIDR
-->
<script context="module" lang="ts">
  import { debounce } from '@lib/debounce';
  const cacheKey = 'ip-notation';

  export const initialNotation = () => {
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : { address: 0xc0a80000, prefix: 16 };
  };

  export const cacheNotation = debounce((address: number, prefix: number) => {
    localStorage.setItem(cacheKey, JSON.stringify({ address, prefix }));
  });

  const length = 32;
</script>

<script lang="ts">
  import IPv4 from './blend/IPv4.svelte';
  import { calcIP, render as renderIPs } from '@lib/ipv4';
  import IPv4Network from './blend/IPv4Network.svelte';
  import IPv4Chart from './parts/IPv4Chart.svelte';
  let { address, prefix } = initialNotation();
  $: {
    cacheNotation(address, prefix);
  }

  $: calced = calcIP(address, prefix);

  $: mask = 'mask' in calced ? calced.mask : 0;
  $: network = 'network' in calced ? calced.network : 0;
  $: min = 'min' in calced ? calced.min : 0;
  $: max = 'max' in calced ? calced.max : 0;
  $: broadcast = 'broadcast' in calced ? calced.broadcast : 0;
  $: hosts = 'hosts' in calced ? calced.hosts : 0;

  $: ({
    address: renderedAddress,
    network: renderedNetwork,
    mask: renderedMask,
    broadcast: renderedBroadcast,
    min: renderedMin,
    max: renderedMax,
    hosts: renderedHosts,
  } = renderIPs(calced));
</script>

<div class="sm:mx--6">
  <IPv4 bind:address bind:prefix>
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

<IPv4Chart
  {min}
  {max}
  {address}
  {broadcast}
  {hosts}
  {renderedHosts}
  {renderedAddress}
  {renderedMin}
  {renderedMax}
  {renderedBroadcast}
/>
