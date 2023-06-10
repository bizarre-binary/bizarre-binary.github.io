<!-- @component
to augment IPv4 with Network and Netmask visualization
-->

<script lang="ts">
  import type { BitsIntegerUpdateEvent } from '../parts/Bits.svelte';
  import Bits from '../parts/Bits.svelte';
  import { getBaseLog } from '@lib/math';
  import { newAddressFrom } from '@lib/ipv4';
  import PartialTransition from '@components/parts/PartialTransition.svelte';
  export let length = 32;
  export let address = 0xffffffff;
  export let prefix = 0xffffffff;
  export let network = 0xffffffff;
  export let mask = 0xffffffff;
  export let renderedNetwork = 'placeholder';
  export let renderedMask = 'placeholder';

  function onUpdateForNetwork({ detail: { integer } }: CustomEvent<BitsIntegerUpdateEvent>) {
    address = newAddressFrom(address, mask, integer);
  }

  const minExponent = (n: number, mask: number, prefix: number) => {
    // when increasing
    if (n > mask) {
      // loop until find the rightMostOn
      let toShift = 0;

      while (toShift < length) {
        const rightMostOn = 1 << toShift;
        const masked = (n & rightMostOn) >>> 0;

        if (0 < masked) {
          return length - toShift;
        }

        toShift++;
      }
    }
    // when decreasing
    else if (mask > n) {
      const pad = Math.pow(2, length - prefix - 1);
      const toFlip = n + pad;
      const flipped = ~toFlip >>> 0;

      return length - getBaseLog(2, flipped) - 1;
    }

    // fallback to previous value
    return prefix;
  };

  function onUpdateForMask({ detail: { integer } }: CustomEvent<BitsIntegerUpdateEvent>) {
    let p = minExponent(integer, mask, prefix);
    prefix = Math.max(0, Math.min(p, 31));
  }
</script>

<small class="absolute mt-0.6">
  <pre class="mx-2 text-gray-400">Netmask: {renderedMask}</pre>
</small>
<small class="opacity-0">placeholder</small>
<div class="relative">
  <div class="absolute w-full h-full rounded-b overflow-clip z--10">
    <div class="h-full bg-gray-200" style:width={`${(prefix / 32) * 100}%`} />
  </div>
  <div class="mix-blend-multiply">
    <Bits
      hideHeader={true}
      integer={mask}
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
<small class="mx-2 text-gray-600 absolute mt-0.6">
  <pre class="inline-block text-cyan">Network:</pre>
  <div class="inline-block text-cyan">
    <PartialTransition notation={renderedNetwork} />
  </div>
  <pre class="text-gray-400 inline-block lt-xs:hidden">= Address & Netmask</pre>
</small>
<small class="opacity-0">placeholder</small>
<Bits
  hideHeader={true}
  integer={network}
  multipleOf={length}
  maxLength={length}
  borderOctal={false}
  borderHex={true}
  compact={true}
  octetBorder={true}
  on:update={onUpdateForNetwork}
  disabledBits={~mask >>> 0}
/>
