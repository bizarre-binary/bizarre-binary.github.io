<!-- @component
An upgraded of <input type="number" />
Two things are enhanced:
1. show numbers with `toLocaleString()` when not being edited
  - by swapping two inputs - dependency with tailwind
    - editing only input and viewing only input
2. prevent invalid number value to leak out
  - and communicate that via the background color of the input box
-->
<script lang="ts">
  let clazz: string;
  export { clazz as class };

  export let min = 0;
  export let max = 999999999;

  let actualInputUI: HTMLElement;

  let integer = 42;
  export { integer as value };
  $: integerInput = integer;

  let unsanitary = false;
  const sanitizeInput = (toSanitize: number) => {
    // purpose of this sanitization is to prevent the value end up being null
    // e.g.:
    // 1. when it's empty
    // 2. when it ends with `e` without any number
    if (toSanitize === null || isNaN(toSanitize)) {
      unsanitary = true;
      return;
    }

    integer = toSanitize;
    unsanitary = false;
  };

  $: {
    sanitizeInput(integerInput);
  }

  $: localed = integer.toLocaleString();

  function focusInput() {
    if (actualInputUI) actualInputUI.focus();
  }
</script>

<!-- inspired by https://github.com/yairEO/react-number-input but with a different approach of using two input tags instead of manipulating the text -->
<div class="relative inline-block w-full">
  <!-- position: absolute being slightly tricky to deal with the case of aligning things to the right but it's possible to control that from outer level -->
  <!-- the cleanest solution is using `dir="rtl"` and it allow you to avoid using `flex`, `flex-grow` and there to achieve the similar things  -->
  <!-- an example for that can be found at ./NumberControls.svelte -->
  <div class="absolute">
    <input
      value={localed}
      class={clazz}
      on:focus={focusInput}
      aria-label="number in base 10 (to show)"
    />
  </div>
  <div class="opacity-0 focus-within:opacity-[100] z-10 relative">
    <input
      {min}
      {max}
      type="number"
      bind:this={actualInputUI}
      bind:value={integerInput}
      class={clazz}
      class:bg-yellow-200={unsanitary}
      aria-label="number in base 10 (to edit)"
    />
  </div>
</div>
