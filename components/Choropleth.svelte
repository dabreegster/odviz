<script>
  import { getContext } from "svelte";
  import chroma from "chroma-js";

  const { getMap } = getContext("map");
  let map = getMap();

  // Input
  export let table;
  export let idLookup;
  export let clickId;
  // State
  let category = table.getCategories()[0];
  // Derived state
  let limits = [];
  let colorScale = [];

  // Derived, immutable
  let reverseIdLookup = {};
  for (let [i, id] of idLookup.entries()) {
    reverseIdLookup[id] = i;
  }

  // Update for clickId or category
  $: {
    let source = "zones";
    let layer = "zones-polygons";

    // The source has no properties. There are too many to precalculate (TODO
    // probably? haven't tried it). So set feature state for every single one.
    // There's no way this can be performant...
    // TODO Hack. Don't even initialize this component until other things are ready
    if (clickId != null && map.getLayer(layer)) {
      console.log(
        `fill out data for ${clickId} = ${idLookup[clickId]} and ${category}`
      );
      let data = [];
      let sum = 0;
      for (let [destination, count] of table.getCounts(
        category,
        idLookup[clickId]
      )) {
        let id = reverseIdLookup[destination];
        // TODO In the example data, some people are outside England or work-from-home (OD0000001)
        if (id != undefined) {
          map.setFeatureState({ source, id }, { count });
          data.push(count);
          sum += count;

          if (count > 50) {
            console.log(`for ${id} aka ${idLookup[id]}, count is ${count}`);
          }
        }
      }
      console.log(`got ${data.length} entries, summing to ${sum}`);

      if (data.length > 6) {
        // chroma equidistant scale
        limits = chroma.limits(data, "e", 4);
        colorScale = chroma
          .scale(["rgba(222,235,247,1)", "rgba(49,130,189,1)"])
          .mode("lch")
          .colors(5);

        let fillColor = [
          "case",
          ["!=", ["to-number", ["feature-state", "count"]], 0],
          ["step", ["feature-state", "count"]],
          "rgba(0, 0, 0, 0)",
        ];
        for (let i = 1; i < limits.length; i++) {
          fillColor[2].push(colorScale[i - 1]);
          fillColor[2].push(limits[i]);
        }
        fillColor[2].push(colorScale[limits.length - 1]);
        console.log(`fillColor is ${JSON.stringify(fillColor)}`);

        map.setPaintProperty(layer, "fill-color", fillColor);
      }
    } else if (clickId == null && map.getLayer(layer)) {
      map.setPaintProperty(layer, "fill-color", "red");
    }
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
