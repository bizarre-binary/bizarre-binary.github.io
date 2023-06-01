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
</script>

<script lang="ts">
  import IPv4 from './blend/IPv4.svelte';
  import { calcIP } from '@lib/ipv4';
  let { address, prefix } = initialNotation();
  $: {
    cacheNotation(address, prefix);
  }

  $: calced = calcIP(address, prefix);

  $: ({
    address: formattedAddress,
    network,
    mask,
    broadcast,
    min,
    max,
    hosts,
  } = (() => {
    if ('network' in calced) {
      return calced;
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
  })());

  $: hostsValid = hosts !== undefined && hosts !== '0';
</script>

<div class="flex items-end">
  <ul class="mx-3 my-1">
    <li class="list-disc">
      <pre>Network: {network}</pre>
    </li>
    <li class="list-disc">
      <pre>Netmask: {mask}</pre>
    </li>
  </ul>
  <div class="grow" />
  <ul class="mx-3 my-1 min-w-64">
    {#if hostsValid}
      <li class="list-disc">
        <pre>Broadcast: {broadcast}</pre>
      </li>
      <li class="list-disc">
        <pre>Hosts/Net: {hosts}</pre>
      </li>
    {/if}
  </ul>
</div>
<div class="sm:mx--6">
  <IPv4 bind:address bind:prefix />
</div>

<div class="flex">
  <div class="grow" />
  <ul class="mx-3 my-1 min-w-58">
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
    {/if}
  </ul>
</div>
