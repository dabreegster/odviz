<script>
  export let hoverZone;
  export let clickZone;
</script>

{#if hoverZone}
  <h2>Hovering: {hoverZone}</h2>
{:else}
  <p>Hover on something</p>
{/if}
<hr />
{#if clickZone}
  <h2>Selected: {clickZone}</h2>
{:else}
  <p>Click something</p>
{/if}
