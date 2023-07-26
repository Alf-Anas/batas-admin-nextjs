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
  getSearchId: ({ fid = "", type = "" }) =>
    HOST.get(`api/search/${fid}`, {
      params: {
        type,
      },
    }),
};

export default API;
