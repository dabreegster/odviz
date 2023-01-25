<script>
  export let idLookup;
  export let hoverId;
  export let clickId;
</script>

{#if hoverId != null}
  <h2>Hovering: {idLookup[hoverId]} ({hoverId})</h2>
{:else}
  <p>Hover on something</p>
{/if}
<hr />
{#if clickId != null}
  <h2>Selected: {idLookup[clickId]} ({clickId})</h2>
{:else}
  <p>Click something</p>
{/if}
