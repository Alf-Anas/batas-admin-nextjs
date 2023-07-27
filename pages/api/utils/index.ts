import MiniSearch from "minisearch";
import { Feature, ObjectLiteral } from "./geojson.interface";

export function safeArray<T = ObjectLiteral>(arr: any, defaultValue = []) {
  if (Array.isArray(arr) && arr.length > 0) {
    return arr as T[];
  }
  return defaultValue as T[];
}

export function safeObject<T = ObjectLiteral>(obj: any, defaultValue = {}) {
  if (!!obj && typeof obj === "object") {
    return obj as T;
  }
  return defaultValue as T;
}

export function safeString(str: any, defaultValue = "") {
  if (!!str && typeof str === "string") {
    return str;
  } else if (typeof str === "number") {
    return String(str);
  }
  return defaultValue;
}

export function safeNumber(num: any, defaultValue = 0) {
  if (typeof num === "number") {
    return num;
  }
  return defaultValue;
}

export function getValObject(obj: any, key = "", defaultValue: any = "") {
  if (!!obj && typeof obj === "object") {
    const splitKey = key.split(".");
    let value: any = obj;
    for (let i = 0; i < splitKey.length; i++) {
      value = safeObject(value)[splitKey[i]];
    }
    return value || defaultValue;
  }
  return defaultValue;
}

export function searchStartsWith(
  features: Feature[],
  txt: string = "",
  listKey: string[] = ["FID", "NAMA", "LABEL"],
  limit: number = 20
): Feature[] {
  let count = 0;
  const listSearch: Feature[] = features.filter((feature) => {
    if (count >= limit) {
      return false;
    }
    let isMatch = false;
    const props = safeObject<ObjectLiteral>(feature?.properties);
    for (const key of listKey) {
      if (props.hasOwnProperty(key)) {
        isMatch = safeString(props[key]).toLowerCase().startsWith(txt);
        if (isMatch) {
          count++;
          break;
        }
      }
    }
    return isMatch;
  });

  return listSearch;
}

export function searchIncludes(
  features: Feature[],
  txt: string = "",
  listKey: string[] = ["FID", "NAMA", "LABEL"],
  limit: number = 20,
  existingFeatures: Feature[]
): Feature[] {
  let count = 0;
  const listSearch: Feature[] = features.filter((feature) => {
    if (count >= limit) {
      return false;
    }
    const findExisting = existingFeatures.find(
      (feat) => feat.properties.FID == feature.properties.FID
    );
    if (findExisting) {
      return false;
    }
    let isIncludes = false;
    const props = safeObject<ObjectLiteral>(feature?.properties);
    for (const key of listKey) {
      if (props.hasOwnProperty(key)) {
        isIncludes = safeString(props[key]).toLowerCase().includes(txt);
        if (isIncludes) {
          count++;
          break;
        }
      }
    }
    return isIncludes;
  });

  return listSearch;
}

export function searchFuzzy(
  features: Feature[],
  txt: string = "",
  limit: number = 20,
  existingFeatures: Feature[]
): Feature[] {
  if (limit <= 0) return [];

  const filteringFeatures: Feature[] = features.filter((feature) => {
    const findExisting = existingFeatures.find(
      (feat) => feat.properties.FID == feature.properties.FID
    );
    if (findExisting) {
      return false;
    }
    return true;
  });

  const mFeatures = filteringFeatures.map((feature, idx) => {
    const props = safeObject<ObjectLiteral>(feature?.properties);
    const combine = safeString(
      props?.KEL_DESA || props?.KECAMATAN || props?.KAB_KOTA || props?.PROVINSI
    )
      .replaceAll(" ", "")
      .toLowerCase();

    return { ...feature, id: idx + features.length, search: combine };
  });

  const miniSearch = new MiniSearch({
    fields: ["search"],
    storeFields: ["type", "properties", "geometry"],
    searchOptions: {
      fuzzy: 0.3,
    },
  });
  miniSearch.addAll(mFeatures);

  const clearTxt = safeString(txt).replaceAll(" ", "");
  const results = miniSearch.search(clearTxt);
  const sortingResults = results
    .sort((a, b) => b.score - a.score)
    .splice(0, limit);

  return sortingResults as unknown as Feature[];
}

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

export function getLevelTable(level: string) {
  switch (level.toLowerCase()) {
    case FEATURE_TYPE.PROV.toLowerCase():
      return "provinsi";
    case FEATURE_TYPE.KAB_KOTA.toLowerCase():
      return "kab_kota";
    case FEATURE_TYPE.KECAMATAN.toLowerCase():
      return "kecamatan";
    case FEATURE_TYPE.KEL_DESA.toLowerCase():
      return "kel_desa";
    default:
      return "";
  }
}
