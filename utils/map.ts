import { FEATURE_TYPE, getValObject } from "@/pages/api/utils";
import {
  GeometryPolygon,
  ObjectLiteral,
} from "@/pages/api/utils/geojson.interface";
import maplibregl, { LngLatLike } from "maplibre-gl";
import { parse as WKTParse } from "wellknown";
// @ts-ignore
import shpwrite from "shp-write";
// @ts-ignore
import tokml from "tokml";
import { downloadFile } from ".";

export const getPolygonBoundingBox = (polygon: GeometryPolygon) => {
  const coordinates: [LngLatLike, LngLatLike][] = polygon[0];
  const bounds = coordinates.reduce(function (bounds, coord) {
    return bounds.extend(coord);
    // @ts-ignore
  }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
  return bounds;
};

export function propertiesTableDiv(props: ObjectLiteral) {
  const listRow: string[] = [
    `<tr style='background-color: #dddddd; font-weight: bold'>
      <td>NAMA</td>
      <td>${props?.nama}</td>
    </tr>`,
  ];

  for (const key in props) {
    if (key === "WKT_GEOMETRY" || key === "ogc_fid" || key === "nama") continue;
    if (props.hasOwnProperty(key)) {
      const row = `<tr style='${
        listRow.length % 2 === 0 ? "background-color: #dddddd" : ""
      }'>
          <td>${key}</td>
          <td>${props[key]}</td>
        </tr>`;
      listRow.push(row);
    }
  }

  return `<table style='border: 1px solid #dddddd'>${listRow.join("")}</table>`;
}

export function getOneLevelDown(featureType: string) {
  switch (featureType) {
    case FEATURE_TYPE.PROV:
      return FEATURE_TYPE.KAB_KOTA;
    case FEATURE_TYPE.KAB_KOTA:
      return FEATURE_TYPE.KECAMATAN;
    case FEATURE_TYPE.KECAMATAN:
      return FEATURE_TYPE.KEL_DESA;
    case FEATURE_TYPE.KEL_DESA:
      return FEATURE_TYPE.KEL_DESA;
    default:
      return "";
  }
}

export const TYPE_DOWNLOAD = {
  GEOJSON: "GeoJSON",
  SHP: "ShapeFile (SHP)",
  KML: "Keyhole Markup Language (KML)",
};

export function saveSpatialFile(
  typeDownload: string,
  geojson: ObjectLiteral,
  level: string,
  name: string
) {
  const eName = name + "-" + level;
  if (typeDownload === TYPE_DOWNLOAD.GEOJSON) {
    downloadFile(JSON.stringify(geojson), "application/json", eName, "geojson");
  } else if (typeDownload === TYPE_DOWNLOAD.SHP) {
    const options = {
      folder: eName,
      types: {
        point: eName + "_PT",
        polygon: eName + "_PL",
        line: eName + "_LN",
      },
    };
    const shpZip = shpwrite.zip(geojson, options);
    downloadFile(shpZip, "data:text/plain;base64,", eName, "zip", false);
  } else if (typeDownload === TYPE_DOWNLOAD.KML) {
    const kml = tokml(geojson, {
      name: "nama",
      description: "label",
    });
    downloadFile(kml, "text/plain", eName, "kml");
  } else {
    console.error("File Type not exist!");
  }
}

export function wktToGeoJson(tableWKT: ObjectLiteral[], geojsonName: string) {
  const listFeature = tableWKT.map((item) => {
    const geom = WKTParse(getValObject(item, "WKT_GEOMETRY", ""));
    const { WKT_GEOMETRY, ogc_fid, ...props } = item;
    return {
      type: "Feature",
      properties: props,
      geometry: geom,
    };
  });
  const geojson: ObjectLiteral = {
    type: "FeatureCollection",
    name: geojsonName,
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
    },
    features: listFeature,
  };
  return { listFeature, geojson };
}
