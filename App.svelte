<script>
  import Map from "./components/Map.svelte";
  import Layout from "./components/Layout.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import ZoneLayer from "./components/ZoneLayer.svelte";
  import Choropleth from "./components/Choropleth.svelte";
  import { onMount } from "svelte";
  import { loadZones, loadTable } from "./input.js";

  // Input
  let zonesGj;
  let table;
  let idLookup;
  // Mutable state
  let hoverId = null;
  let clickId = null;

  // When using 'npm run dev', auto-load a file for quicker development
  if (import.meta.env.DEV) {
    onMount(async () => {
      try {
        [zonesGj, idLookup] = await loadZones("small");
        table = await loadTable("small");
      } catch (err) {
        window.alert(`Loading failed: ${err}`);
      }
    });
  }
</script>

{#if zonesGj}
  <Layout>
    <div slot="left">
      <h1>odviz</h1>
      <Sidebar {idLookup} {hoverId} {clickId} />
    </div>
    <div slot="main">
      <Map>
        <ZoneLayer {zonesGj} bind:hoverId bind:clickId />
        <Choropleth {table} {idLookup} {hoverId} />
      </Map>
    </div>
  </Layout>
{:else}
  <p>Loading</p>
{/if}
