<!-- @component
A marker to be used for ./LogRange.svelte
-->

<script lang="ts">
  interface Props {
    base?: number;
    sups?: number[];
  }

  let { base = 2, sups = [] }: Props = $props();
</script>

<div class="flex text-gray-400 overflow-x-clip">
  {#each sups as sup (sup)}
    <div class="flex-1 text-center mb--3.9 translate-x-1/10">
      <div class="mb--2 translate-x-1/4 xs:translate-x-0">
        <small>
          <small>{base}<sup>{sup}</sup></small>
        </small>
      </div>
      <div class="text-gray-300 translate-x-7/20">|</div>
    </div>
  {/each}
</div>
