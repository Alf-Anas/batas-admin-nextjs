import fsPromises from "fs/promises";
import path from "path";
import { safeArray, safeString } from ".";
import { Feature, GeojsonType } from "./geojson.interface";

export const LIST_KEY_STARTS_WITH = {
  PROVINSI: ["FID", "KODE_PROV", "PROVINSI", "NAMA"],
  KAB_KOTA: ["KODE_KK", "KAB_KOTA", "NAMA", "LABEL"],
  KECAMATAN: ["KODE_KEC", "KECAMATAN", "NAMA", "LABEL"],
  KEL_DESA: ["KODE_KD", "KEL_DESA", "NAMA", "LABEL"],
};

export const LIST_KEY_INCLUDES = {
  PROVINSI: ["LABEL"],
  KAB_KOTA: ["LABEL"],
  KECAMATAN: ["LABEL"],
  KEL_DESA: ["LABEL"],
};

const FILE_PATH = {
  PROVINSI: "/pages/api/data/provinsi.geojson",
  KAB_KOTA: "/pages/api/data/kab_kota.geojson",
  KECAMATAN: "/pages/api/data/kecamatan.geojson",
  KEL_DESA: "/pages/api/data/kel_desa.geojson",
  BBOX_DB: "/pages/api/data/bbox.sqlite",
};

export async function getListProvinsi() {
  const dataFilePath = path.join(process.cwd(), FILE_PATH.PROVINSI);
  try {
    const geojsonBuffer = await fsPromises.readFile(dataFilePath);
    const geojson: GeojsonType = JSON.parse(geojsonBuffer as unknown as string);
    const features = safeArray<Feature>(geojson?.features);
    return features.sort((a, b) =>
      safeString(a.properties.FID).localeCompare(safeString(b.properties.FID))
    );
  } catch (err) {
    return err;
  }
}

export async function getListKabKota() {
  const dataFilePath = path.join(process.cwd(), FILE_PATH.KAB_KOTA);
  try {
    const geojsonBuffer = await fsPromises.readFile(dataFilePath);
    const geojson: GeojsonType = JSON.parse(geojsonBuffer as unknown as string);
    const features = safeArray<Feature>(geojson?.features);
    return features.sort((a, b) =>
      safeString(a.properties.FID).localeCompare(safeString(b.properties.FID))
    );
  } catch (err) {
    return err;
  }
}

export async function getListKecamatan() {
  const dataFilePath = path.join(process.cwd(), FILE_PATH.KECAMATAN);
  try {
    const geojsonBuffer = await fsPromises.readFile(dataFilePath);
    const geojson: GeojsonType = JSON.parse(geojsonBuffer as unknown as string);
    const features = safeArray<Feature>(geojson?.features);
    return features.sort((a, b) =>
      safeString(a.properties.FID).localeCompare(safeString(b.properties.FID))
    );
  } catch (err) {
    return err;
  }
}
export async function getListKelDesa() {
  const dataFilePath = path.join(process.cwd(), FILE_PATH.KEL_DESA);
  try {
    const geojsonBuffer = await fsPromises.readFile(dataFilePath);
    const geojson: GeojsonType = JSON.parse(geojsonBuffer as unknown as string);
    const features = safeArray<Feature>(geojson?.features);
    return features;
  } catch (err) {
    return err;
  }
}

export async function getBBOXDB() {
  const dataFilePath = path.join(process.cwd(), FILE_PATH.BBOX_DB);
  try {
    const sqlite3 = require("sqlite3").verbose();
    let db = new sqlite3.Database(dataFilePath, (err: any) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to the bbox database.");
    });

    return db;
  } catch (err) {
    return err;
  }
}
