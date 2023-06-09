<!-- @component
Visualize various IPv4 related info
-->
<script lang="ts" context="module">
  const totalNetworkSize = Math.pow(2, 32);
</script>

<script lang="ts">
  import { newAddressFrom } from '@lib/ipv4';
  import PartialTransition from './PartialTransition.svelte';

  export let length = 32;
  export let prefix = 0;
  export let address = 0;
  export let network = 0;
  export let mask = 0;
  export let min = 0;
  export let max = 0;
  export let broadcast = 0;
  export let hosts = 0;
  export let renderedAddress = 'placeholder';
  export let renderedMin = 'placeholder';
  export let renderedMax = 'placeholder';
  export let renderedBroadcast = 'placeholder';
  export let renderedHosts = 'placeholder';
  export let renderedNetwork = 'placeholder';
  $: renderedNetworkWithouPrefix = renderedNetwork.split('/')[0];

  $: addressCount = hosts + 2;
  $: networkStart = min - 1;

  /* for overview */
  const pointOfTooSmall = 7;
  $: levels = length - 1 - pointOfTooSmall;
  $: level = prefix - pointOfTooSmall;
  $: opacity = prefix < pointOfTooSmall + 1 ? 1 : ((levels - level) / levels) * 0.5 + 0.5;
  $: opacityInPercent = Math.round(opacity * 100);

  $: startInPercent = Math.ceil((networkStart / totalNetworkSize) * 10000) / 100;
  $: sizeInPercent = (addressCount / totalNetworkSize) * 100;
  $: sizeInPercentWithMin = Math.floor(Math.max(1, sizeInPercent) * 100) / 100;
  /* end of overview */

  /* for detail */
  $: opacityForDetail = ((length - prefix) / length) * 0.75 + 0.25;
  $: opacityForDetailInPercent = Math.round(opacityForDetail * 100);

  $: beforeIP = Math.ceil(((address - networkStart) / addressCount) * 10000) / 100;
  $: relativeIPSize = (1 / addressCount) * 100;
  $: relativeIPSizeWithMin = Math.floor(Math.max(1, relativeIPSize) * 100) / 100;
  /* end of detail */

  $: hostsValid = hosts > 0;

  $: networkUnit = Math.pow(2, length - prefix);

  $: isAddressNetwork = network === address;
  $: isAddressBroadcast = broadcast === address;
  $: isAddressHost = !isAddressNetwork && !isAddressBroadcast;
</script>

<div class="flex">
  <div class="grow" />
  <div class="w-full sm:w-[94%]">
    <!-- overview -->
    <div>
      <div class="flex text-center text-gray items-end text-xs lt-xs:text-[0.5rem]">
        <div class="flex-1 text-left">0.0.0.0</div>
        <div class="flex-1 text-left">64.0.0.0</div>
        <div class="flex-1">128.0.0.0</div>
        <div class="flex-1 text-right">192.0.0.0</div>
        <div class="flex-1 text-right">255.255.255.255</div>
      </div>
      <table class="h-2 w-full">
        <tr>
          {#each [1, 2, 3, 4] as idx}
            <td data-position={idx} class="border-x-1 border-gray-300" />
          {/each}
        </tr>
      </table>
    </div>
    <div class="h-2 w-full flex bg-gray-100">
      <div class="h-full" style:width={`${startInPercent}%`} />
      <div
        class="h-full bg-cyan rounded"
        style:width={`${sizeInPercentWithMin}%`}
        style:--un-bg-opacity={`${opacityInPercent}%`}
      />
      <div class="h-full grow" />
    </div>
    <!-- detail -->
    <div class="w-full flex text-cyan items-center mt-2">
      <div class="min-w-6" style:width={`${startInPercent}%`}>
        <button
          class="i-bi-arrow-bar-left"
          on:click={() => {
            address = newAddressFrom(address, mask, network - networkUnit);
          }}
        />
      </div>

      <div
        class="flex items-center"
        class:flex-row-reverse={startInPercent > (prefix < 3 ? 74 : 85)}
      >
        <div class="flex items-center mx--2">
          <div class="i-bi-arrow-down ml-1" />
          <div class="i-bi-zoom-in mr-1" />
        </div>
        <div class="mx-2 text-sm flex">
          <PartialTransition notation={addressCount.toLocaleString()} />
        </div>
      </div>
      <div class="grow flex ml-2">
        <div class="grow" />
        <button
          class="i-bi-arrow-bar-right"
          on:click={() => {
            address = newAddressFrom(address, mask, network + networkUnit);
          }}
        />
      </div>
    </div>
    <div
      class="mt-2 h-2 w-full rounded-sm bg-cyan flex"
      style:--un-bg-opacity={`${opacityForDetailInPercent}%`}
    >
      <div class="h-full" style:width={`${beforeIP}%`} />
      <div class="h-full bg-lime-800 rounded" style:width={`${relativeIPSizeWithMin}%`} />
      <div class="h-full grow" />
    </div>
    <div>
      <table class="min-h-3 w-full">
        <tr>
          {#each [1] as idx}
            <!-- safe list class="!hidden" -->
            <td
              data-position={idx}
              class="px-1 text-[0.6rem]/1 text-gray border-x-1 border-gray-300"
            >
              <div class="flex">
                <div
                  class="flex-1"
                  class:!hidden={!hostsValid}
                  class:font-bold={isAddressNetwork}
                  class:text-black={isAddressNetwork}
                >
                  Network
                </div>
                <div class="grow" />
                <!-- safe list class="text-gray-700" -->
                <div class:text-gray-700={isAddressHost}>
                  <span class:hidden={!hostsValid} class="lt-xs:hidden">
                    {renderedMin} - {renderedMax} =</span
                  >
                  {prefix < 31 ? renderedHosts : addressCount.toLocaleString()} hosts
                </div>
                <div class="grow" />
                <div
                  class="flex-1 text-right"
                  class:!hidden={!hostsValid}
                  class:font-bold={isAddressBroadcast}
                  class:text-black={isAddressBroadcast}
                >
                  Broadcast
                </div>
              </div>
            </td>
          {/each}
        </tr>
      </table>
      <div class="flex text-center">
        <div class="flex-1 text-left text-gray text-xs lt-xs:text-[0.5rem]">
          <PartialTransition notation={renderedNetworkWithouPrefix} />
        </div>
        <div class="flex-1 text-center flex text-lime-800 items-center">
          <div class="grow" />
          <button
            class="i-bi-arrow-bar-left mx-1"
            on:click={() => {
              address = address - 1;
            }}
          />
          <div class="xs:w-32 flex text-sm lt-xs:text-[0.5rem]">
            <div class="grow" />
            <PartialTransition notation={renderedAddress} />
            <div class="grow" />
          </div>
          <button
            class="i-bi-arrow-bar-right mx-1"
            on:click={() => {
              address = address + 1;
            }}
          />
          <div class="grow" />
        </div>
        <div class="flex-1 text-right text-gray flex text-xs lt-xs:text-[0.5rem]">
          <div class="grow" />
          <PartialTransition notation={renderedBroadcast} />
        </div>
      </div>
    </div>
  </div>
  <div class="grow" />
</div>

<!-- TODO: remove this -->
<div class="flex !hidden">
  <div class="grow" />
  <ul class="mx-3 my-1 min-w-64">
    <li class="list-disc">
      <pre class="hidden">Address: {address}</pre>
      <pre>Address: {renderedAddress}</pre>
    </li>
    {#if hostsValid}
      <li class="list-disc">
        <pre class="hidden">HostMin: {min}</pre>
        <pre>HostMin: {renderedMin}</pre>
      </li>
      <li class="list-disc">
        <pre class="hidden">HostMax: {max}</pre>
        <pre>HostMax: {renderedMax}</pre>
      </li>
      <li class="list-disc">
        <pre class="hidden">Broadcast: {broadcast}</pre>
        <pre>Broadcast: {renderedBroadcast}</pre>
      </li>
      <li class="list-disc">
        <pre class="hidden">Hosts/Net: {hosts}</pre>
        <pre>Hosts/Net: {renderedHosts}</pre>
      </li>
    {/if}
  </ul>
</div>
