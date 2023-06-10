<!-- @component
To apply partial fade transition currently for IPv4 Addresses
-->
<script lang="ts">
  import type { TransitionConfig } from 'svelte/transition';
  import { fade } from 'svelte/transition';

  export let fstDelimiter = '/';
  export let sndDelimiter = '.';

  // this is a bit of involved workaround to show wrapped spaces properly in the fstDelimiter
  $: isFstDelimiterWrappedBySpaces =
    fstDelimiter.at(0) === fstDelimiter.at(-1) && fstDelimiter.at(0) === ' ';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let transition: (...args: any[]) => TransitionConfig = fade;
  export let mono = true;

  export let notation = '0.0.0.0/0';
  $: splits = notation.split(fstDelimiter);
  $: address = splits[0];
  $: chunks = address.split(sndDelimiter);
  $: prefix = splits[1];
  $: texts = prefix ? [...chunks, prefix] : chunks;
</script>

<!-- \00A0 = &nbsp; - https://github.com/sveltejs/svelte/issues/3014#issuecomment-501143936 -->
<!-- safe list class="font-mono first:hidden before:content-['\00A0'] after:content-['\00A0']" -->
<div class="flex" class:font-mono={mono}>
  {#each texts as text, idx}
    <div
      class={["before:content-['\\00A0'] after:content-['\\00A0']", 'first:hidden']
        .slice(idx > 3 && isFstDelimiterWrappedBySpaces ? 0 : 1)
        .join(' ')}
    >
      {idx < 4 ? sndDelimiter : fstDelimiter.trim()}
    </div>
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
