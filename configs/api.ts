import { API_BASE_URL } from "@/constant/env";
import { FEATURE_TYPE, getLevelTable } from "@/pages/api/utils";
import axios from "axios";

export const HOST = axios.create({
  baseURL: "",
});

const API = {
  getSearch: ({ name = "" }) =>
    HOST.get(`/api/search`, {
      params: {
        name,
      },
    }),
  // getSearchId: ({ fid = "", type = "", level = "" }) =>
  //   HOST.get(`api/search/${fid}`, {
  //     params: {
  //       type,
  //       level,
  //     },
  //   }),
  getSearchId: ({ fid = "", type = "", level = "" }) => {
    let columnName: string = "";
    const tableName = getLevelTable(level.toLowerCase());
    if (!tableName) {
      return;
    }
    switch (type.toLowerCase()) {
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
        if (typeof fid === "number") {
          columnName = "fid";
        }
        break;
      default:
        return;
    }
    return HOST.get(`${API_BASE_URL}/download.php`, {
      params: {
        fid,
        column: columnName,
        table: tableName,
      },
    });
  },
};

export default API;
