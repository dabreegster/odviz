import { csvToObj } from "csv-to-js-parser";

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
        mapping[origin].push((destination, parseInt(value)));
      }
    }
  }

  getCounts(category, origin) {
    return this.data[category][origin];
  }

  getCategories() {
    return Object.keys(this.data);
  }
}

export async function loadTable(cfg) {
  if (cfg == "small") {
    let resp = await fetch("data/small/wu03ew_v2.csv");
    let contents = await resp.text();
    return new Table(csvToObj(contents));
  } else {
    throw `Unknown cfg ${small}`;
  }
}
