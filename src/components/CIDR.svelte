<!-- @component
Visualize CIDR
-->
<script context="module" lang="ts">
  import type { BitsIntegerUpdateEvent } from './parts/Bits.svelte';
  import Bits from './parts/Bits.svelte';
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
  import { getBaseLog } from '@lib/math';
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

  function onUpdateForNetwork({ detail: { integer } }: CustomEvent<BitsIntegerUpdateEvent>) {
    if ('mask' in calced) {
      address = (address & ~calced.mask) + integer;
    }
  }

  const minExponent = (n: number, mask: number, prefix: number) => {
    // when increasing
    if (n > mask) {
      // handle special case early: flipping the first bit
      if (n === Math.pow(2, 31)) {
        return 1;
      }

      // loop until find the rightMostOn
      let toShift = 0;

      while (toShift < length) {
        const rightMostOn = 1 << toShift;
        const masked = n & rightMostOn;

        if (0 < masked) {
          return length - toShift;
        }

        toShift++;
      }
    }
    // when decreasing
    else if (mask > n) {
      // handle special case early: flipping the first bit
      if (mask - n === Math.pow(2, 31)) {
        return 0;
      }

      const pad = Math.pow(2, length - prefix - 1);
      const toFlip = n + pad;
      const flipped = ~toFlip;

      return length - getBaseLog(2, flipped) - 1;
    }

    // fallback to previous value
    return prefix;
  };

  function onUpdateForMask({ detail: { integer } }: CustomEvent<BitsIntegerUpdateEvent>) {
    if ('mask' in calced) {
      let p = minExponent(integer, calced.mask, prefix);
      prefix = Math.max(0, Math.min(p, 31));
    }
  }
</script>

<div class="sm:mx--6">
  <IPv4 bind:address bind:prefix>
    <div slot="extra-bits">
      <small class="mx-2 text-gray-600">
        <pre class="text-gray-400 inline-block">IP & Netmask = </pre>
        <pre class="inline-block">Network: {network}</pre>
      </small>
      <Bits
        hideHeader={true}
        integer={networkBits}
        multipleOf={length}
        maxLength={length}
        borderOctal={false}
        borderHex={true}
        compact={true}
        octetBorder={true}
        on:update={onUpdateForNetwork}
        disabledBits={Math.max(0, ~maskBits >>> 0)}
      />
      <small>
        <pre class="mx-2 text-gray-400">Netmask: {mask}</pre>
      </small>
      <div class="relative">
        <div class="absolute w-full h-full rounded-t overflow-clip z--10">
          <div class="h-full bg-gray-200" style:width={`${(prefix / 32) * 100}%`} />
        </div>
        <div class="mix-blend-multiply">
          <Bits
            hideHeader={true}
            integer={maskBits}
            multipleOf={length}
            maxLength={length}
            borderOctal={false}
            borderHex={true}
            compact={true}
            octetBorder={true}
            overrideCellBg={'#ffffff00'}
            on:update={onUpdateForMask}
            disabledBits={0b1}
          />
        </div>
      </div>
    </div>
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
