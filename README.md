# odviz

Goal: One simple web UI to explore a variety of origin/destination datasets.
Coerce different-looking data into one format, to deduplicate effort.

## Example datasets

- [wf02eq](https://www.nomisweb.co.uk/census/2011/wf02ew), UK output area to workplace zone, about 16 million rows
- [wu03ew](https://www.nomisweb.co.uk/census/2011/wu03EW), UK MSOA to MSOA, about 2 million rows
- [Soundcast](https://github.com/psrc/soundcast), completely disaggregated individuals (about 4 million people?)

## Approaches

- [FlowMapBlue](https://flowmap.blue), but this many lines may be overwhelming
- A/B Street's commuter patterns (hover on one zone, see a heatmap of other zones where people go)
  - Generating zones from planar graphs of the street network
- Assign OD to the route network and style edges by volume

## Notes

Here's an absolute hack to clip clip a huge dataset. First use mapshaper to clip the GeoJSON. Then...

`cat london.json | jq '.features[].properties.geo_code' | sort | uniq | sed 's/^"/\\(/' | sed 's/"$/\\)\\|/' > pattern`

Remove newlines using vim

```
grep `cat pattern` od.csv  > clipped.csv
```

Fix the CSV headers manually
