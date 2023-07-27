/**
 * EXAMPLE IF USING NODE JS SERVER
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { getBBOXDB } from "../utils/searchGeoJSON";
import { FEATURE_TYPE, getLevelTable, safeString } from "../utils";

type Meta = {
  count: number;
  size: string;
};
export type ResponseData = {
  code: number;
  message: string;
  data?: any[];
  meta?: Meta;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    const query = req.query;
    const { fid, type, level } = query;
    const thisFid = safeString(fid).toLowerCase();
    const thisType = safeString(type).toLowerCase();
    const thisLevel = safeString(level).toLowerCase();

    if (!thisFid || !thisType || !thisLevel) {
      res.status(422).json({
        code: 422,
        message: "FID, Level and Feature Type is Required!",
      });
      return;
    }

    const mDB: any = await getBBOXDB();
    let queryDB: string = "";
    const tableName = getLevelTable(thisLevel);
    if (!tableName) {
      res.status(422).json({
        code: 422,
        message: "Level is Wrong!",
      });
      return;
    }
    switch (thisType.toLowerCase()) {
      case FEATURE_TYPE.PROV.toLowerCase():
        queryDB = `SELECT * FROM ${tableName} WHERE "provinsi" = "${fid}"`;
        break;
      case FEATURE_TYPE.KAB_KOTA.toLowerCase():
        queryDB = `SELECT * FROM ${tableName} WHERE "kode_kk" LIKE "${fid}%"`;
        break;
      case FEATURE_TYPE.KECAMATAN.toLowerCase():
        queryDB = `SELECT * FROM ${tableName} WHERE "kode_kec" LIKE "${fid}%"`;
        break;
      case FEATURE_TYPE.KEL_DESA.toLowerCase():
        queryDB = `SELECT * FROM ${tableName} WHERE "kode_kd" LIKE "${fid}%"`;
        break;
      default:
        res.status(422).json({
          code: 422,
          message: "Feature Type is Wrong!",
        });
        return;
    }

    try {
      mDB.serialize(function () {
        mDB.all(queryDB, (err: any, rows: any[]) => {
          if (!err && Array.isArray(rows)) {
            const size = new TextEncoder().encode(JSON.stringify(rows)).length;
            res.status(200).json({
              code: 200,
              message: "sucess",
              data: rows,
              meta: {
                size: `${(size / 1024 / 1024).toFixed(4)} MB`,
                count: rows.length,
              },
            });
          } else {
            res.status(500).json({
              code: 500,
              message: JSON.stringify(err),
            });
          }
        });
      });
    } catch (err) {
      res.status(500).json({
        code: 500,
        message: JSON.stringify(err),
      });
    }
  } else {
    res.status(404).json({ code: 404, message: "Not Found!" });
  }
}
