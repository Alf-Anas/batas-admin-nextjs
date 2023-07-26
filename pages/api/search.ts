import type { NextApiRequest, NextApiResponse } from "next";
import {
  LIST_KEY_INCLUDES,
  LIST_KEY_STARTS_WITH,
  getListKabKota,
  getListKecamatan,
  getListKelDesa,
  getListProvinsi,
} from "./utils/searchGeoJSON";
import { Feature } from "./utils/geojson.interface";
import {
  safeString,
  searchFuzzy,
  searchIncludes,
  searchStartsWith,
} from "./utils";

type Data = {
  prov: Feature[];
  kab_kota: Feature[];
  kecamatan: Feature[];
  kel_desa: Feature[];
};
type Meta = {
  count: number;
  starts_with: number;
  includes: number;
  fuzzy: number;
};
export type ResponseData = {
  code: number;
  message: string;
  data?: Data;
  meta?: Meta;
};

const MAX_FEATURE = 30;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    const query = req.query;
    const { name } = query;
    const thisName = safeString(name).toLowerCase();

    let limitLeft = MAX_FEATURE;

    // ======================================= START SEARCH STARTS-WITH =======================================
    const listProvinsi: Feature[] | any = await getListProvinsi();
    if (!Array.isArray(listProvinsi)) {
      res
        .status(500)
        .json({ code: 500, message: JSON.stringify(listProvinsi) });
      return;
    }

    if (!thisName) {
      res.status(200).json({
        code: 200,
        message: "success",
        data: {
          prov: listProvinsi,
          kab_kota: [],
          kecamatan: [],
          kel_desa: [],
        },
        meta: {
          count: listProvinsi.length,
          starts_with: 0,
          includes: 0,
          fuzzy: 0,
        },
      });
      return;
    }

    const listSearchProvinsi: Feature[] = searchStartsWith(
      listProvinsi,
      thisName,
      LIST_KEY_STARTS_WITH.PROVINSI,
      limitLeft
    );
    limitLeft = limitLeft - listSearchProvinsi.length;

    let listKabKota: Feature[] | any = [];
    if (limitLeft > 0) {
      listKabKota = await getListKabKota();
    }
    if (!Array.isArray(listKabKota)) {
      res.status(500).json({ code: 500, message: JSON.stringify(listKabKota) });
      return;
    }
    const listSearchKabKota: Feature[] = searchStartsWith(
      listKabKota,
      thisName,
      LIST_KEY_STARTS_WITH.KAB_KOTA,
      limitLeft
    );
    limitLeft = limitLeft - listSearchKabKota.length;

    let listKecamatan: Feature[] | any = [];
    if (limitLeft > 0) {
      listKecamatan = await getListKecamatan();
    }
    if (!Array.isArray(listKecamatan)) {
      res
        .status(500)
        .json({ code: 500, message: JSON.stringify(listKecamatan) });
      return;
    }
    const listSearchKecamatan: Feature[] = searchStartsWith(
      listKecamatan,
      thisName,
      LIST_KEY_STARTS_WITH.KECAMATAN,
      limitLeft
    );
    limitLeft = limitLeft - listSearchKecamatan.length;

    let listKelDesa: Feature[] | any = [];
    if (limitLeft > 0) {
      listKelDesa = await getListKelDesa();
    }
    if (!Array.isArray(listKelDesa)) {
      res.status(500).json({ code: 500, message: JSON.stringify(listKelDesa) });
      return;
    }
    const listSearchKelDesa: Feature[] = searchStartsWith(
      listKelDesa,
      thisName,
      LIST_KEY_STARTS_WITH.KEL_DESA,
      limitLeft
    );

    limitLeft = limitLeft - listSearchKelDesa.length;
    const mStartsWith = MAX_FEATURE - limitLeft;
    // ======================================= END SEARCH STARTS-WITH =======================================

    const listIncludesProvinsi: Feature[] = searchIncludes(
      listProvinsi,
      thisName,
      LIST_KEY_INCLUDES.PROVINSI,
      limitLeft,
      listSearchProvinsi
    );
    listSearchProvinsi.push(...listIncludesProvinsi);
    limitLeft = limitLeft - listIncludesProvinsi.length;

    const listIncludesKabKota: Feature[] = searchIncludes(
      listKabKota,
      thisName,
      LIST_KEY_INCLUDES.KAB_KOTA,
      limitLeft,
      listSearchKabKota
    );
    listSearchKabKota.push(...listIncludesKabKota);
    limitLeft = limitLeft - listIncludesKabKota.length;

    const listIncludesKecamatan: Feature[] = searchIncludes(
      listKecamatan,
      thisName,
      LIST_KEY_INCLUDES.KECAMATAN,
      limitLeft,
      listSearchKecamatan
    );
    listSearchKecamatan.push(...listIncludesKecamatan);
    limitLeft = limitLeft - listIncludesKecamatan.length;

    const listIncludesKelDesa: Feature[] = searchIncludes(
      listKelDesa,
      thisName,
      LIST_KEY_INCLUDES.KEL_DESA,
      limitLeft,
      listSearchKelDesa
    );
    listSearchKelDesa.push(...listIncludesKelDesa);
    limitLeft = limitLeft - listIncludesKelDesa.length;
    const mIncludes = MAX_FEATURE - mStartsWith - limitLeft;

    // ======================================= END SEARCH INCLUDES =======================================

    // const listFuzzyProvinsi: Feature[] = searchFuzzy(
    //   listProvinsi,
    //   thisName,
    //   limitLeft,
    //   listSearchProvinsi
    // );
    // listSearchProvinsi.push(...listFuzzyProvinsi);
    // limitLeft = limitLeft - listFuzzyProvinsi.length;

    const listFuzzyKabKota: Feature[] = searchFuzzy(
      listKabKota,
      thisName,
      limitLeft,
      listSearchKabKota
    );
    listSearchKabKota.push(...listFuzzyKabKota);
    limitLeft = limitLeft - listFuzzyKabKota.length;

    const listFuzzyKecamatan: Feature[] = searchFuzzy(
      listKecamatan,
      thisName,
      limitLeft,
      listSearchKecamatan
    );
    listSearchKecamatan.push(...listFuzzyKecamatan);
    limitLeft = limitLeft - listFuzzyKecamatan.length;

    const listFuzzyKelDesa: Feature[] = searchFuzzy(
      listKelDesa,
      thisName,
      limitLeft,
      listSearchKelDesa
    );
    listSearchKelDesa.push(...listFuzzyKelDesa);
    limitLeft = limitLeft - listFuzzyKelDesa.length;

    res.status(200).json({
      code: 200,
      message: "success",
      data: {
        prov: listSearchProvinsi,
        kab_kota: listSearchKabKota,
        kecamatan: listSearchKecamatan,
        kel_desa: listSearchKelDesa,
      },
      meta: {
        count: MAX_FEATURE - limitLeft,
        starts_with: mStartsWith,
        includes: mIncludes,
        fuzzy: MAX_FEATURE - mStartsWith - mIncludes - limitLeft,
      },
    });
  } else {
    res.status(404).json({ code: 404, message: "Not Found!" });
  }
}
