// Returns GeoJSON and the name of the ID property
export async function loadZones(cfg) {
  if (cfg == "small") {
    let resp = await fetch("data/small/zones_core.geojson");
    let json = await resp.json();
    return [json, "geo_code"];
  } else {
    throw `Unknown cfg ${small}`;
  }
}
