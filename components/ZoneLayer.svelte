<script>
  import { getContext, onMount, onDestroy } from "svelte";
  import bbox from "@turf/bbox";

  const { getMap, setCamera } = getContext("map");
  let map = getMap();

  // Input
  export let zonesGj;
  export let zoneIdKey;
  // Output
  export let hoverZone;
  export let clickZone;

  let source = "zones";
  let layer = "zones-polygons";

  let hoverId;
  function unhover() {
    if (hoverId != null) {
      map.setFeatureState({ source, id: hoverId }, { hover: false });
    }
  }

  onMount(() => {
    if (setCamera) {
      map.fitBounds(bbox(zonesGj), {
        padding: 20,
        animate: false,
      });
    }

    // TODO If we pass the ID as feature.id, it gets dropped?
    map.addSource(source, { type: "geojson", data: zonesGj, generateId: true });

    map.addLayer({
      id: "zones-lines",
      source,
      type: "line",
      paint: {
        "line-color": "black",
        "line-width": 3,
        "line-width": [
          "case",
          // TODO This feels backwards, but before the feature state is defined at all, it's unclear
          ["boolean", ["feature-state", "focused"], false],
          10,
          3,
        ],
      },
    });

    setLayer();

    map.on("mousemove", layer, (e) => {
      if (e.features.length > 0 && hoverId != e.features[0].id) {
        unhover();
        hoverZone = e.features[0].properties[zoneIdKey];
        hoverId = e.features[0].id;
        map.setFeatureState({ source, id: hoverId }, { hover: true });
      }
    });
    map.on("mouseleave", layer, () => {
      unhover();
      hoverZone = null;
      hoverId = null;
    });

    // TODO These two IDs are getting really annoying
    let clickedId = null;
    map.on("click", (e) => {
      if (clickedId != null) {
        map.setFeatureState({ source, id: clickedId }, { focused: false });
      }

      let features = map.queryRenderedFeatures(e.point, { layers: [layer] });
      if (features.length == 1) {
        clickZone = features[0].properties[zoneIdKey];
        clickedId = features[0].id;
        map.setFeatureState({ source, id: clickedId }, { focused: true });
      } else {
        clickZone = null;
        clickedId = null;
      }
    });
  });

  function setLayer() {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }

    map.addLayer({
      id: layer,
      source,
      type: "fill",
      paint: {
        // A neutral baseline
        "fill-color": "red",
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.8,
          0.4,
        ],
      },
    });
  }

  onDestroy(() => {
    unhover();
    if (map.getLayer("zones-lines")) {
      map.removeLayer("zones-lines");
    }
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }
    map.removeSource(source);
  });
</script>
