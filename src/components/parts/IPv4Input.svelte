<!-- @component
A convenient addition to allow pasting/editing as whole
-->
<script lang="ts">
  import { pattern, parseFrom } from '@lib/ipv4';
  import Toast from './Toast.svelte';

  export let address = 0xc0a80000;
  export let renderedAddress = 'placeholder';
  export let prefix = 16;
  export let show = false;

  $: placeholder = `${renderedAddress}/${prefix}`;
  $: inputAsWhole = placeholder;

  let input: HTMLInputElement;
  let button: HTMLButtonElement;

  const selectText = (e: Event) => {
    // on mobile Safari (Webkit), keyboard will not show up unlike other "normal" browsers - https://github.com/jquery-archive/jquery-mobile/issues/3016
    const elm = e.target as HTMLInputElement;
    elm.select();
  };

  let toast: string | null = null;

  const evaluate = () => {
    const { address: addr, prefix: pref, msg } = parseFrom(inputAsWhole);
    const isValid = addr > -1 && pref > -1;

    if (!isValid) {
      return;
    }

    address = addr;
    prefix = pref;

    // give feedback on changes from actual input
    if (msg) {
      inputAsWhole = placeholder; // also update the input itself
      toast = msg;
    }
  };

  const onBtnClick = () => {
    show = true;
    setTimeout(() => {
      if (input) input.focus();
    }, 0);
  };

  const onInputBlur = (e: Event) => {
    // to ignore when window itself get blurred
    if (document.activeElement === e.target) {
      return;
    }

    show = false;
    setTimeout(() => {
      if (button) button.focus();
      inputAsWhole = placeholder;
    }, 0);
  };
</script>

<Toast bind:text={toast} type="warning" />
<div class="relative">
  <div class="absolute text-gray-600 left-5 top-2 lt-sm:top-5 lt-sm:left-0 lt-xs:top--1 z-30">
    <button
      class="i-bi-pencil ml-1"
      on:click={onBtnClick}
      bind:this={button}
      class:invisible={show}
    />
  </div>
  <div
    class="absolute font-mono text-xl lt-sm:text-2xl lt-xs:text-lg text-gray-600 left-11 top-1 lt-sm:top-3 lt-xs:top-4 lt-sm:left-9 lt-xs:left-6 z-30 w-[88%]"
    class:hidden={!show}
  >
    <div
      class="tooltip before:text-xs before:mb-1 after:mb-1 tooltip-open mb-20 tooltip-accent w-full"
      data-tip={'select/copy/paste/edit'}
    >
      <input
        class="invalid:bg-yellow-100 w-full px-1 text-center rounded border border-gray sm:tracking-widest"
        type="text"
        bind:this={input}
        bind:value={inputAsWhole}
        {placeholder}
        {pattern}
        on:focus={selectText}
        on:change={evaluate}
        on:blur={onInputBlur}
      />
    </div>
  </div>
</div>
