import { LngLatLike } from "maplibre-gl";

export interface GeojsonType {
  type: string;
  name: string;
  crs: Crs;
  features: Feature[];
}

export interface Crs {
  type: string;
  properties: HeadProperties;
}

export interface HeadProperties {
  name: string;
}

export interface Feature {
  type: string;
  properties:
    | PropertiesProvinsi
    | PropertiesKabKota
    | PropertiesKecamatan
    | PropertiesKelDesa;
  geometry: Geometry;
}

export interface PropertiesProvinsi {
  KODE_PROV: string;
  PROVINSI: string;
  FID: string;
  LABEL: string;
  NAMA: string;
}

export interface PropertiesKabKota {
  KODE_KK: string;
  KODE_PROV: string;
  KAB_KOTA: string;
  PROVINSI: string;
  FID: string;
  NAMA: string;
  LABEL: string;
}

export interface PropertiesKecamatan {
  KODE_KEC: string;
  KODE_KK: string;
  KODE_PROV: string;
  KECAMATAN?: string;
  KAB_KOTA?: string;
  PROVINSI: string;
  FID: string;
  NAMA: string;
  LABEL: string;
}

export interface PropertiesKelDesa {
  FID: number;
  ORI_NAME: string;
  KODE_KEC: string;
  KODE_KD: string;
  KODE_KK: string;
  KODE_PROV: string;
  TIPE_KD: number;
  KECAMATAN: string;
  KEL_DESA: string;
  KAB_KOTA: string;
  PROVINSI: string;
  JENIS_KD: string;
  NAMA: string;
  LABEL: string;
}

export interface Geometry {
  type: string;
  coordinates: GeometryPolygon;
}

export type GeometryPolygon = [LngLatLike, LngLatLike][][];

export interface ObjectLiteral {
  [key: string]: any;
}
