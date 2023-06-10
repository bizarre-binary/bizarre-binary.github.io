<!-- @component
Visualize various IPv4 related info
-->
<script lang="ts" context="module">
  const totalNetworkSize = Math.pow(2, 32);
</script>

<script lang="ts">
  import { newAddressFrom } from '@lib/ipv4';
  import { fade } from 'svelte/transition';
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

  $: showCursorAtTheEnd = startInPercent > 84;
  $: showCursorAtTheEndForXS = startInPercent > 74;
  $: showCursorInTheMiddle = startInPercent > 69;
  $: showCursorInTheMiddleForSM = startInPercent > 59;
  $: showCursorInTheMiddleForXS = startInPercent > 49;
</script>

<div class="flex">
  <div class="grow" />
  <div class="w-full sm:w-[94%]">
    <div class="text-gray-400 mt-1 mb-3">
      <span class="i-bi-bar-chart-fill inline-block text-gray-300 translate-y-0.5 -scale-x-100" />
      <span class="text-gray-200">
        <span class="text-gray-300"> IPv4 </span>
        /
        <small>
          <span class="text-cyan"> Network </span>

          /
          <small>
            <span class="text-lime-600"> Address </span>
          </small>
        </small>
      </span>
    </div>
    <!-- overview -->
    <div>
      <div class="flex text-center text-gray items-end text-xs lt-xs:text-[0.5rem]">
        <div class="flex-1 text-left ml--2 mr-2">0.0.0.0</div>
        <div class="flex-1 text-left">64.0.0.0</div>
        <div class="flex-1">128.0.0.0</div>
        <div class="flex-1 text-right">192.0.0.0</div>
        <div class="flex-1 text-right ml-2 mr--2">255.255.255.255</div>
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
      {#key network}
        <div
          in:fade
          class="h-full bg-cyan rounded"
          style:width={`${sizeInPercentWithMin}%`}
          style:--un-bg-opacity={`${opacityInPercent}%`}
        />
      {/key}
      <div class="h-full grow" />
    </div>
    <!-- detail -->
    <div class="w-full flex text-cyan items-center mt-2">
      <div class="min-w-8" style:width={`${startInPercent}%`}>
        <button
          class="btn btn-xs btn-outline btn-square rounded-lg pb-0.5 text-cyan mx-1 my-0.5 hover:bg-cyan hover:color:white hover:border-white"
          on:click={() => {
            address = newAddressFrom(address, mask, network - networkUnit);
          }}
        >
          &#60;
        </button>
      </div>
      <!-- safe list class="order-2 mr-1 lt-sm:order-2 lt-sm:mr-1 lt-xs:order-2 lt-xs:mr-1 !order-4 !mx-0 lt-xs:!order-4 lt-xs:!mx-0" -->
      <div class="flex items-center">
        <div
          class="flex items-center mx--2 text-gray"
          class:order-2={showCursorInTheMiddle}
          class:mr-1={showCursorInTheMiddle}
          class:lt-sm:order-2={showCursorInTheMiddleForSM}
          class:lt-sm:mr-1={showCursorInTheMiddleForSM}
          class:lt-xs:order-2={showCursorInTheMiddleForXS}
          class:lt-xs:mr-1={showCursorInTheMiddleForXS}
          class:!order-4={showCursorAtTheEnd}
          class:!mx-0={showCursorAtTheEnd}
          class:lt-xs:!order-4={showCursorAtTheEndForXS}
          class:lt-xs:!mx-0={showCursorAtTheEndForXS}
        >
          <div class="i-bi-arrow-down ml-1" />
          <div class="i-bi-zoom-in mr-1" />
        </div>
        <div class="order-1 mx-2 text-sm flex lt-xs:text-xs">
          <PartialTransition notation={renderedNetwork} />
        </div>
        <small class="order-3 lt-xs:text-[0.5rem] before:content-['('] after:content-[')'] flex">
          <PartialTransition notation={addressCount.toLocaleString()} />
        </small>
      </div>
      <div class="grow flex min-w-10">
        <div class="grow" />
        <button
          class="btn btn-xs btn-outline btn-square rounded-lg pb-0.5 text-cyan mx-1 my-0.5 hover:bg-cyan hover:color:white hover:border-white"
          on:click={() => {
            address = newAddressFrom(address, mask, network + networkUnit);
          }}
        >
          &#62;
        </button>
      </div>
    </div>
    <div
      class="mt-3 h-2 w-full rounded-sm bg-cyan flex"
      style:--un-bg-opacity={`${opacityForDetailInPercent}%`}
    >
      <div class="h-full" style:width={`${beforeIP}%`} />
      {#key address}
        <div
          in:fade
          class="mix-blend-hard-light h-full bg-lime-900 rounded"
          style:width={`${relativeIPSizeWithMin}%`}
        />
      {/key}
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
        <div class="flex-1 text-center flex text-lime-600 items-center mt-1">
          <div class="grow" />
          <button
            class="btn btn-xs btn-outline btn-square rounded-lg pb-0.5 text-lime-600 mx-1 my-0.5 hover:bg-lime-600 hover:color:white hover:border-white"
            on:click={() => {
              address = address - 1;
            }}
          >
            &#60;
          </button>
          <div class="xs:w-32 flex text-sm lt-xs:text-[0.5rem]">
            <div class="grow" />
            <PartialTransition notation={renderedAddress} />
            <div class="grow" />
          </div>
          <button
            class="btn btn-xs btn-outline btn-square rounded-lg pb-0.5 text-lime-600 mx-1 my-0.5 hover:bg-lime-600 hover:color:white hover:border-white"
            on:click={() => {
              address = address + 1;
            }}
          >
            &#62;
          </button>
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
