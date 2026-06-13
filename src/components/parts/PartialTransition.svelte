<!-- @component
To apply partial fade transition currently for IPv4 Addresses
-->
<script lang="ts">
  import type { TransitionConfig } from 'svelte/transition';
  import { fade } from 'svelte/transition';

  interface Props {
    fstDelimiter?: string;
    sndDelimiter?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition?: (...args: any[]) => TransitionConfig;
    mono?: boolean;
    notation?: string;
  }

  let {
    fstDelimiter = '/',
    sndDelimiter = '.',
    transition = fade,
    mono = true,
    notation = '0.0.0.0/0',
  }: Props = $props();
  // this is a bit of involved workaround to show wrapped spaces properly in the fstDelimiter
  let isFstDelimiterWrappedBySpaces = $derived(
    fstDelimiter.at(0) === fstDelimiter.at(-1) && fstDelimiter.at(0) === ' '
  );
  let splits = $derived(notation.split(fstDelimiter));
  let address = $derived(splits[0]);
  let chunks = $derived(address.split(sndDelimiter));
  let prefix = $derived(splits[1]);
  let texts = $derived(prefix ? [...chunks, prefix] : chunks);
</script>

<!-- \00A0 = &nbsp; - https://github.com/sveltejs/svelte/issues/3014#issuecomment-501143936 -->
<!-- safe list class="font-mono first:hidden before:content-['\00A0'] after:content-['\00A0']" -->
<div class="flex" class:font-mono={mono}>
  {#each texts as text, idx (idx)}
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
