<!-- @component
Represent IPv4 address including prefix notation
-->
<script context="module" lang="ts">
  import BitHex from './BitHex.svelte';
  import IPv4Prefix from './IPv4Prefix.svelte';
  import InputNumberLocaled from '../parts/InputNumberLocaled.svelte';
  import { assemble, disassemble, calcHosts } from '@lib/ipv4';

  const min = 0;
  const max = 255;
  const length = 32;
</script>

<script lang="ts">
  export let address = 0xc0a80000;
  export let prefix = 16;

  // break down into 4 octets
  $: octets = disassemble(address);

  const onChange = (position: number, e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = Math.min(max, Math.max(0, target.value ? Number(target.value) : min));

    octets[position] = value;

    address = assemble(octets);
  };

  $: addresses = calcHosts(prefix) + 2;
</script>

<!-- for xs only -->
<div class="sm:hidden items-end mb-2 flex">
  <div class="grow" />
  <div class="flex text-2xl lt-xs:text-lg mr-2 items-center">
    <div>
      <div class="flex">
        {#each octets as octet, idx}
          <div class="flex-1 flex group mt-1">
            <div class="group-first:hidden font-bold z-10">.</div>
            <InputNumberLocaled
              {min}
              {max}
              strictRangeOnInput={true}
              class="text-center w-12 lt-xs:w-8 input-number-hide-arrows bg-gray-100 rounded font-mono"
              value={octet}
              on:change={(e) => onChange(idx, e)}
            />
          </div>
        {/each}
      </div>
    </div>
    <div class="mx-3 lt-xs:mx-1 text-base">/</div>
    <div>
      <InputNumberLocaled
        min={0}
        max={31}
        strictRangeOnInput={true}
        class="text-center w-8 mt-1 bg-gray-100 rounded input-number-hide-arrows font-mono"
        bind:value={prefix}
      />
    </div>
  </div>
  <IPv4Prefix bind:integer={prefix} hideHeader={false} />
  <div class="grow" />
</div>
<!-- main -->
<div class="flex lt-sm:overflow-x-auto px-2 mx--2">
  <div class="grow" />
  <div>
    <div class="flex lt-sm:hidden">
      {#each octets as octet, idx}
        <div class="flex-1 flex group text-2xl mb-2 relative">
          <!-- adding max-w-[[n]rem] for Firefox -->
          <InputNumberLocaled
            {min}
            {max}
            strictRangeOnInput={true}
            class="text-center w-full max-w-[7.4rem] input-number-hide-arrows bg-gray-50 rounded mx-1 font-mono"
            value={octet}
            on:change={(e) => onChange(idx, e)}
          />
          <div class="absolute bottom-0 right-0 group-last:hidden translate-x-0.8 font-bold z-10">
            .
          </div>
        </div>
      {/each}
    </div>
    <div class="relative">
      <div class="absolute w-full h-full rounded-t overflow-clip z--10">
        <div class="h-full bg-gray-200" style:width={`${(prefix / 32) * 100}%`} />
      </div>
      <div class="mix-blend-multiply">
        <div class="text-gray-600">
          <BitHex
            bind:integer={address}
            noMargin={true}
            minLength={length}
            maxLength={length}
            borderOctal={false}
            borderHex={true}
            compact={true}
            octetBorder={true}
          />
        </div>
      </div>
    </div>
    <slot name="extra-bits" />
  </div>
  <div class="flex flex-col mx-2 text-2xl lt-sm:hidden">
    <div class="lt-sm:text-base sm:translate-x--0.8 lt-sm:mb-1 lt-sm:font-bold">/</div>
    <div class="grow" />
  </div>
  <div class="flex flex-col lt-sm:hidden">
    <div class="lt-sm:hidden mb-2">
      <InputNumberLocaled
        min={0}
        max={31}
        strictRangeOnInput={true}
        class="text-center text-2xl w-20 bg-gray-50 rounded input-number-hide-arrows font-mono"
        bind:value={prefix}
      />
    </div>
    <div class="flex flex-col grow text-gray-600">
      <div class="grow text-center flex flex-col">
        <IPv4Prefix bind:integer={prefix} />
        <!-- safe list class="text-sm text-xs ![font-size:0.6rem]" -->
        <div
          class="leading-3 mt-1.5"
          class:text-sm={addresses > 99999}
          class:text-xs={addresses > 99999999}
          class:![font-size:0.6rem]={addresses > 999999999}
        >
          {addresses.toLocaleString()}
        </div>
        <div><small>addresses</small></div>
      </div>
    </div>
  </div>
  <div class="grow" />
</div>
