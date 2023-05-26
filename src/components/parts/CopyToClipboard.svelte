<!-- @component
A wrapper for copy to clipboard function
-->
<script context="module" lang="ts">
  import { onMount } from 'svelte';
</script>

<script lang="ts">
  export let textToCopy = '';
  let showFeedback = false;
  let copyStatus = true;

  let actualCopiedText = '';

  const success = 'success';
  const error = 'error';

  $: feedback = copyStatus
    ? { type: success, message: `\`${actualCopiedText}\` copied!`, duration: 2000 }
    : {
        type: error,
        message: 'failed to copy to clipboard',
        duration: 3000,
      };

  let ccElement: HTMLElement;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const giveFeedback = (status: boolean) => {
    copyStatus = status;
    showFeedback = true;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      showFeedback = false;
    }, feedback.duration);
  };

  const validateCopying = (event: Event) => {
    if (event.target !== ccElement) {
      giveFeedback(false);
    } else {
      const valueAttr = ccElement.attributes.getNamedItem('value');
      if (valueAttr && valueAttr.value === textToCopy) {
        actualCopiedText = valueAttr.value;
        giveFeedback(true);
      } else {
        giveFeedback(false);
      }
    }
  };

  const clickEvt = new Event('click');
  const copyText = async () => {
    if (ccElement) {
      ccElement.dispatchEvent(clickEvt);
    } else {
      giveFeedback(false);
    }
  };

  $: tooltipText = showFeedback ? feedback.message : 'click to copy';

  onMount(() => {
    //TODO maybe there is a way to prevent importing again for no good reason
    import('@github/clipboard-copy-element');
  });
</script>

<div
  class="mb-2 tooltip tooltip-bottom tooltip-success tooltip-error before:mt-0.8 after:mt-1 hover:before:opacity-80 hover:after:opacity-80"
  class:tooltip-success={showFeedback && feedback.type === success}
  class:tooltip-error={showFeedback && feedback.type === error}
  class:tooltip-open={showFeedback}
  data-tip={tooltipText}
>
  <clipboard-copy
    class="hidden"
    bind:this={ccElement}
    value={textToCopy}
    on:clipboard-copy={validateCopying}>Copy</clipboard-copy
  >
  <button class="hover:outline outline-gray rounded p-1" on:click={copyText}>
    <slot />
  </button>
</div>
