<!-- @component
A convenient addition to allow pasting/editing as whole
-->
<script lang="ts">
  import { pattern, parseFrom } from '@lib/ipv4';
  import Toast from './Toast.svelte';

  interface Props {
    address?: number;
    renderedAddress?: string;
    prefix?: number;
    show?: boolean;
  }

  let {
    // eslint-disable-next-line no-useless-assignment
    address = $bindable(0xc0a80000),
    renderedAddress = 'placeholder',
    prefix = $bindable(16),
    show = $bindable(false),
  }: Props = $props();

  let placeholder = $derived(`${renderedAddress}/${prefix}`);
  let inputAsWhole = $derived(placeholder);

  let input: HTMLInputElement = $state();
  let button: HTMLButtonElement = $state();

  const selectText = (e: Event) => {
    // on mobile Safari (Webkit), keyboard will not show up unlike other "normal" browsers - https://github.com/jquery-archive/jquery-mobile/issues/3016
    const elm = e.target as HTMLInputElement;
    elm.select();
  };

  let toast: string | null = $state(null);

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
      aria-label="Edit IPv4 address"
      onclick={onBtnClick}
      bind:this={button}
      class:invisible={show}
    ></button>
  </div>
  <div
    class="absolute font-mono text-xl lt-sm:text-2xl lt-xs:text-lg text-gray-600 left-11 top-1 lt-sm:top-3 lt-xs:top-4 lt-sm:left-9 lt-xs:left-6 z-30 w-[88%]"
    class:hidden={!show}
  >
    <div
      class="tooltip before:text-xs before:mb-1 after:mb-1 tooltip-open mb-20 tooltip-accent w-full"
      data-tip="select/copy/paste/edit"
    >
      <input
        class="invalid:bg-yellow-100 w-full px-1 text-center rounded border border-gray sm:tracking-widest"
        type="text"
        bind:this={input}
        bind:value={inputAsWhole}
        {placeholder}
        {pattern}
        onfocus={selectText}
        onchange={evaluate}
        onblur={onInputBlur}
      />
    </div>
  </div>
</div>
