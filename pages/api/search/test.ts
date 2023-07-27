import type { NextApiRequest, NextApiResponse } from "next";
import { FEATURE_TYPE, getLevelTable, safeString } from "../utils";
import { API_BASE_URL } from "@/constant/env";

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

    let columnName: string = "";
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
        columnName = "provinsi";
        break;
      case FEATURE_TYPE.KAB_KOTA.toLowerCase():
        columnName = "kode_kk";
        break;
      case FEATURE_TYPE.KECAMATAN.toLowerCase():
        columnName = "kode_kec";
        break;
      case FEATURE_TYPE.KEL_DESA.toLowerCase():
        columnName = "kode_kd";
        break;
      default:
        res.status(422).json({
          code: 422,
          message: "Feature Type is Wrong!",
        });
        return;
    }

    try {
      // Fetch from another server with large database
      const response = await fetch(
        `${API_BASE_URL}/download.php?fid=${fid}&table=${tableName}&column=${columnName}`
      );
      const resData: ResponseData = await response.json();
      if (resData.code === 200 && Array.isArray(resData.data)) {
        const size = new TextEncoder().encode(
          JSON.stringify(resData.data)
        ).length;
        res.status(200).json({
          code: 200,
          message: "sucess",
          data: resData.data,
          meta: {
            size: `${(size / 1024 / 1024).toFixed(4)} MB`,
            count: resData.data.length,
          },
        });
      } else {
        res.status(500).json({
          code: 500,
          message: JSON.stringify(resData),
        });
      }
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
