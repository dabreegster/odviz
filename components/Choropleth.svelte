<script>
  import { getContext } from "svelte";
  import chroma from "chroma-js";

  const { getMap } = getContext("map");
  let map = getMap();

  // Input
  export let table;
  export let hoverZone;
  // State
  let category = table.getCategories()[0];
  // Derived state
  let limits = [];
  let colorScale = [];

  // Update for hoverZone or category
  $: {
    let layer = "zones-polygons";

    // TODO The data isn't in the map. Should we use feature state for this?

    /*
    // Get the numeric data we're displaying
    let data = table.Object.values(msoas).reduce((agg, msoa) => {
      agg.push(msoa.properties[colorBy]);
      return agg;
    }, []);
    // chroma equidistant scale
    limits = chroma.limits(data, "e", 4);
    colorScale = chroma
      .scale(["rgba(222,235,247,1)", "rgba(49,130,189,1)"])
      .mode("lch")
      .colors(5);

    let fillColor = [
      "case",
      ["!=", ["to-number", ["get", colorBy]], 0],
      ["step", ["get", colorBy]],
      "rgba(0, 0, 0, 0)",
    ];
    for (let i = 1; i < limits.length; i++) {
      fillColor[2].push(colorScale[i - 1]);
      fillColor[2].push(limits[i]);
    }
    fillColor[2].push(colorScale[limits.length - 1]);

    map.setPaintProperty(layer, "fill-color", fillColor);
    */
  }
</script>

<div class="legend">
  <select bind:value={category}>
    {#each table.getCategories() as cat}
      <option value={cat}>{cat}</option>
    {/each}
  </select>
  <ul>
    {#each colorScale as color, i}
      <li>
        <div class="square" style="background-color: {color}" />
        {#if i < colorScale.length - 1}
          {limits[i]} &mdash; {limits[i + 1]}
        {:else}
          &gt; {limits[i]}
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .legend {
    z-index: 1;
    position: absolute;
    bottom: 250px;
    right: 10px;
    background: white;
    padding: 10px;
  }

  select {
    font-size: 16px;
    padding: 4px 8px;
  }

  ul {
    list-style-type: none;
  }

  li {
    display: flex;
  }

  .square {
    width: 50px;
    height: 50px;
  }
</style>
