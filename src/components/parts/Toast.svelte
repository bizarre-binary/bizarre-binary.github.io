<!-- @component
A toast
-->

<script lang="ts">
  interface Props {
    text?: string | null;
    durationInSec?: number;
    type?: string;
  }

  let { text = $bindable<string | null>(null), durationInSec = 1, type = 'info' }: Props = $props();

  let lastText: string | null = $state(null);

  $effect(() => {
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
