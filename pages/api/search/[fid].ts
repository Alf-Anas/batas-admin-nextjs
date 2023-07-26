import type { NextApiRequest, NextApiResponse } from "next";
import { getBBOXDB } from "../utils/searchGeoJSON";
import { safeString } from "../utils";

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
    const { fid, type } = query;
    const thisFid = safeString(fid).toLowerCase();
    const thisType = safeString(type).toLowerCase();

    if (!thisFid || !thisType) {
      res.status(422).json({
        code: 422,
        message: "FID and Feature Type is Required!",
      });
      return;
    }

    const mDB: any = await getBBOXDB();
    let queryDB: string = "";
    if (thisType.toLowerCase() === "prov") {
      queryDB = `SELECT * FROM kab_kota WHERE "provinsi" = "${fid}"`;
    } else {
      queryDB = `SELECT * FROM kel_desa WHERE "kode_kd" LIKE "${fid}%"`;
    }

    try {
      mDB.serialize(function () {
        mDB.all(queryDB, (err: any, rows: any[]) => {
          if (!err && Array.isArray(rows)) {
            const size = new TextEncoder().encode(JSON.stringify(rows)).length;
            res.status(200).json({
              code: 200,
              message: thisFid,
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
