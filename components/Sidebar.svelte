<script>
  export let msoas;
  export let hoveredMsoa;
</script>

{#if hoveredMsoa}
  <h2>{hoveredMsoa}</h2>
{:else}
  <h2>{Object.keys(msoas).length} MSOAs</h2>
{/if}
