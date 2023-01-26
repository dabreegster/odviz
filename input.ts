import type { FeatureCollection } from "geojson";

enum Config {
  Small,
  Clipped,
}

// Returns GeoJSON and a lookup array from opaque numeric feature ID to the symbolic ID
export async function loadZones(cfg: Config) {
  let json: FeatureCollection;

  if (cfg == Config.Small) {
    let resp = await fetch("data/small/zones_core.geojson");
    json = await resp.json();
  } else if (cfg == Config.Clipped) {
    let resp = await fetch("data/clipped/zones.json");
    json = await resp.json();
  } else {
    throw `Unknown cfg ${cfg}`;
  }

  // Add a sequential numeric ID
  let ids = [];
  for (let feature of json.features) {
    feature.id = ids.length;
    ids.push(feature.properties["geo_code"]);
  }
  return [json, ids];
}

export class Table {
  constructor(rows) {
    if (rows.length == 0) {
      throw `Empty table`;
    }

    // TODO Plumb through
    let originKey = "Area of residence";
    let destinationKey = "Area of workplace";

    // Per category, map each origin to a list of (destination, count)
    // Before TS, something like Map<Category, Map<Origin, List<(Destination, Count)>>>
    this.data = {};

    // Guess which columns are categories
    for (let [key, value] of Object.entries(rows[0])) {
      if (
        key != originKey &&
        key != destinationKey &&
        !isNaN(parseInt(value))
      ) {
        this.data[key] = {};
      }
    }

    // Fill out the data
    for (let row of rows) {
      // Assume rows are unique in (originKey, destinationKey)
      let origin = row[originKey];
      let destination = row[destinationKey];
      for (let [key, value] of Object.entries(row)) {
        let mapping = this.data[key];
        if (!mapping) {
          continue;
        }
        if (!mapping[origin]) {
          mapping[origin] = [];
        }
        mapping[origin].push([destination, parseInt(value)]);
      }
    }
  }

  getCounts(category, origin) {
    return this.data[category][origin] || [];
  }

  getCategories() {
    return Object.keys(this.data);
  }
}

// Parse CSV and return a dictionary per row, using the headers for names.
// All values will be strings.
// TODO This seems way faster than https://www.npmjs.com/package/csv-to-js-parser. What's going on?
function csvToObjects(csvString: string) {
  let rows = csvString.split("\n");
  // Also strip quotes from multi-word headers (breaks on internal commas)
  let headers = rows.shift().replaceAll('"', "").split(",");

  let result = [];
  for (let row of rows) {
    let obj = {};
    let i = 0;
    for (let value of row.split(",")) {
      obj[headers[i]] = value;
      i++;
    }
    result.push(obj);
  }
  return result;
}

export async function loadTable(cfg: Config) {
  let contents;
  if (cfg == Config.Small) {
    console.log(`Fetching CSV data`);
    let resp = await fetch("data/small/wu03ew_v2.csv");
    contents = await resp.text();
  } else if (cfg == Config.Clipped) {
    console.log(`Fetching CSV data`);
    let resp = await fetch("data/clipped/od.csv");
    contents = await resp.text();
  } else {
    throw `Unknown cfg ${cfg}`;
  }

  console.log(`Parsing CSV`);
  let rows = csvToObjects(contents);
  console.log(`Converting into table`);
  let table = new Table(rows);
  console.log(`CSV load done`);
  return table;
}
