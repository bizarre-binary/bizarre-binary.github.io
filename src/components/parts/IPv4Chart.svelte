<!-- @component
Visualize various IPv4 related info
-->
<script lang="ts">
  export let address = 0;
  export let min = 0;
  export let max = 0;
  export let broadcast = 0;
  export let hosts = 0;
  export let renderedAddress = 'placeholder';
  export let renderedMin = 'placeholder';
  export let renderedMax = 'placeholder';
  export let renderedBroadcast = 'placeholder';
  export let renderedHosts = 'placeholder';

  $: hostsValid = hosts > 0;
</script>

<div class="flex">
  <div class="grow" />
  <ul class="mx-3 my-1 min-w-64">
    <li class="list-disc">
      <pre class="hidden">Address: {address}</pre>
      <pre>Address: {renderedAddress}</pre>
    </li>
    {#if hostsValid}
      <li class="list-disc">
        <pre class="hidden">HostMin: {min}</pre>
        <pre>HostMin: {renderedMin}</pre>
      </li>
      <li class="list-disc">
        <pre class="hidden">HostMax: {max}</pre>
        <pre>HostMax: {renderedMax}</pre>
      </li>
      <li class="list-disc">
        <pre class="hidden">Broadcast: {broadcast}</pre>
        <pre>Broadcast: {renderedBroadcast}</pre>
      </li>
      <li class="list-disc">
        <pre class="hidden">Hosts/Net: {hosts}</pre>
        <pre>Hosts/Net: {renderedHosts}</pre>
      </li>
    {/if}
  </ul>
</div>
