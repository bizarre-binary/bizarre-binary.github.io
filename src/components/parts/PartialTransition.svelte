<!-- @component
To apply partial fade transition currently for IPv4 Addresses
-->
<script lang="ts">
  import type { TransitionConfig } from 'svelte/transition';
  import { fade } from 'svelte/transition';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let transition: (...args: any[]) => TransitionConfig = fade;
  export let mono = true;

  export let notation = '0.0.0.0/0';
  $: splits = notation.split('/');
  $: address = splits[0];
  $: chunks = address.split('.');
  $: prefix = splits[1];
  $: texts = prefix ? [...chunks, prefix] : chunks;
</script>

<!-- safe list class="font-mono" -->
<div class="flex" class:font-mono={mono}>
  {#each texts as text, idx}
    <div class="first:hidden">{idx < 4 ? '.' : '/'}</div>
    <div class="relative">
      <div class="opacity-0">
        {text}
      </div>
      {#key text}
        <div class="absolute left-0 top-0" transition:transition>
          {text}
        </div>
      {/key}
    </div>
  {/each}
</div>
