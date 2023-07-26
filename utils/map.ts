import {
  GeometryPolygon,
  ObjectLiteral,
} from "@/pages/api/utils/geojson.interface";
import maplibregl, { LngLatLike } from "maplibre-gl";

export const getPolygonBoundingBox = (polygon: GeometryPolygon) => {
  const coordinates: [LngLatLike, LngLatLike][] = polygon[0];
  const bounds = coordinates.reduce(function (bounds, coord) {
    return bounds.extend(coord);
    // @ts-ignore
  }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
  return bounds;
};

export const FEATURE_TYPE = {
  PROV: "PROV",
  KAB_KOTA: "KAB_KOTA",
  KECAMATAN: "KECAMATAN",
  KEL_DESA: "KEL_DESA",
};

export function getTypeFeature(props: ObjectLiteral) {
  if (props?.KEL_DESA) {
    return FEATURE_TYPE.KEL_DESA;
  } else if (props?.KECAMATAN) {
    return FEATURE_TYPE.KECAMATAN;
  } else if (props?.KAB_KOTA) {
    return FEATURE_TYPE.KAB_KOTA;
  } else if (props?.PROVINSI) {
    return FEATURE_TYPE.PROV;
  } else {
    return "";
  }
}

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
