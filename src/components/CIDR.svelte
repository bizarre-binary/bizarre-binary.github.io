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
  import type { IPInfo } from '@lib/ipv4';
  import IPv4Network from './blend/IPv4Network.svelte';
  let { address, prefix } = initialNotation();
  $: {
    cacheNotation(address, prefix);
  }

  $: calced = calcIP(address, prefix);
  $: rendered = (() => {
    if ('network' in calced) {
      return renderIPs(calced as IPInfo);
    }
    return {
      network: undefined,
      broadcast: undefined,
      min: undefined,
      mask: undefined,
      max: undefined,
      hosts: undefined,
      ...calced,
    };
  })();

  $: ({ address: formattedAddress, network, mask, broadcast, min, max, hosts } = rendered);

  $: hostsValid = hosts !== undefined && hosts !== '0';

  $: maskBits = 'mask' in calced ? calced.mask : 0;
  $: networkBits = 'network' in calced ? calced.network : 0;
</script>

<div class="sm:mx--6">
  <IPv4 bind:address bind:prefix>
    <IPv4Network
      slot="extra-bits"
      {length}
      {maskBits}
      {networkBits}
      bind:address
      bind:prefix
      renderedMask={mask}
      renderedNetwork={network}
    />
  </IPv4>
</div>

<div class="flex">
  <div class="grow" />
  <ul class="mx-3 my-1 min-w-64">
    <li class="list-disc">
      <pre>Address: {formattedAddress}</pre>
    </li>
    {#if hostsValid}
      <li class="list-disc">
        <pre>HostMin: {min}</pre>
      </li>
      <li class="list-disc">
        <pre>HostMax: {max}</pre>
      </li>
      <li class="list-disc">
        <pre>Broadcast: {broadcast}</pre>
      </li>
      <li class="list-disc">
        <pre>Hosts/Net: {hosts}</pre>
      </li>
    {/if}
  </ul>
</div>
