<!-- @component
A toast
-->

<script lang="ts">
  import { afterUpdate } from 'svelte';

  export let text: string | null = null;
  export let durationInSec = 1;
  export let type = 'info';

  let lastText: string | null = null;

  afterUpdate(() => {
    if (text !== null && text !== lastText) {
      lastText = text;
      setTimeout(() => {
        text = null;
        lastText = null;
      }, 1000 * durationInSec);
    }
  });
</script>

<!-- safe list class="alert alert-info alert-success alert-warning alert-error" -->

<div class="toast toast-top toast-end z-50" class:hidden={!text}>
  <div class={`alert alert-${type}`}>
    <span>{text}</span>
  </div>
</div>
