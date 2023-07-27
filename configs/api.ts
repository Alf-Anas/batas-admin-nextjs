import axios from "axios";

export const HOST = axios.create({
  baseURL: "/",
});

const API = {
  getSearch: ({ name = "" }) =>
    HOST.get(`api/search`, {
      params: {
        name,
      },
    }),
  getSearchId: ({ fid = "", type = "", level = "" }) =>
    HOST.get(`api/search/${fid}`, {
      params: {
        type,
        level,
      },
    }),
};

export default API;
