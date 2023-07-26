export const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "&copy; OpenStreetMap Contributors",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
};

export const INITIAL_MAP = {
  lat: -1.217506,
  lon: 116.827447,
  zoom: 4.5,
};

export const LAYER_SRC = {
  ADMIN: "src-admin",
  ADMIN_CENTROID: "src-admin-centroid",
};

export const LAYER_ID = {
  ADMIN_PL: "layer-admin-pl",
  ADMIN_LN: "layer-admin-ln",
  ADMIN_SYMBOL: "layer-admin-symbol",
  ADMIN_PT: "layer-admin-pt",
};
