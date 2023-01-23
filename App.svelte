<script>
  import Map from "./components/Map.svelte";
  import Layout from "./components/Layout.svelte";
  import Sidebar from "./components/Sidebar.svelte";

  import { onMount } from "svelte";

  let data;

  // When using 'npm run dev', auto-load a file for quicker development
  if (import.meta.env.DEV) {
    onMount(async () => {
      let resp = await fetch("rutland.pb");
    });
  }
</script>

{#if data}
  <Layout>
    <div slot="left">
      <h1>odviz</h1>
      <Sidebar />
    </div>
    <div slot="main">
      <Map />
    </div>
  </Layout>
{:else}
  <p>Loading</p>
{/if}
