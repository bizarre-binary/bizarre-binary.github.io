<!-- @component
Represent IPv4 address including prefix notation
-->
<script context="module" lang="ts">
  import BitHex from './BitHex.svelte';
  import IPv4Prefix from './IPv4Prefix.svelte';
  import InputNumberLocaled from '../parts/InputNumberLocaled.svelte';

  const min = 0;
  const max = 255;
  const length = 32;

  const shifts = [3, 2, 1, 0].map((n) => n * 8);
</script>

<script lang="ts">
  export let integer = 0xc0a80000;
  export let prefix = 16;

  // break down into 4 octets
  $: octets = shifts.map((n) => (integer >>> n) & 0xff);

  const onChange = (position: number, e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = Math.min(max, Math.max(0, target.value ? Number(target.value) : min));

    octets[position] = value;

    let newInteger = 0;
    octets.forEach((octet, idx) => {
      newInteger += (octet << shifts[idx]) >>> 0;
    });

    integer = newInteger;
  };
</script>

<div class="flex">
  <div>
    <div class=" text-gray-600">
      <BitHex
        bind:integer
        colReverse={true}
        minLength={length}
        maxLength={length}
        borderOctal={false}
        borderHex={true}
        compact={true}
        octetBorder={true}
      />
    </div>
    <div class="flex">
      {#each octets as octet, idx}
        <div class="flex-1 flex group text-2xl mt-1">
          <div class="group-first:hidden translate-x--0.6 font-bold">.</div>
          <InputNumberLocaled
            {min}
            {max}
            strictRangeOnInput={true}
            class="text-center w-full"
            value={octet}
            on:change={(e) => onChange(idx, e)}
          />
        </div>
      {/each}
    </div>
  </div>
  <div class="flex flex-col mx-2 text-2xl">
    <div class="grow" />
    <div>/</div>
  </div>
  <div class="flex flex-col">
    <div class="py-0.5 flex flex-col grow text-gray-600">
      <div class="grow" />
      <div>
        <IPv4Prefix bind:integer={prefix} />
      </div>
    </div>
    <InputNumberLocaled
      min={0}
      max={31}
      strictRangeOnInput={true}
      class="text-center text-2xl w-20 mt-1"
      bind:value={prefix}
    />
  </div>
</div>
