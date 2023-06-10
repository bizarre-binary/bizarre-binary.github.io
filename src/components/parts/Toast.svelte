<!-- @component
A toast
-->

<script lang="ts">
  export let text: string | null = null;
  export let durationInSec = 1;
  export let type = 'info';

  const clearToast = (toast: string | null) => {
    if (toast) {
      setTimeout(() => {
        text = null;
      }, 1000 * durationInSec);
    }
  };

  $: {
    clearToast(text);
  }
</script>

<!-- safe list class="alert alert-info alert-success alert-warning alert-error" -->

<div class="toast toast-top toast-end z-50" class:hidden={!text}>
  <div class={`alert alert-${type}`}>
    <span>{text}</span>
  </div>
</div>
