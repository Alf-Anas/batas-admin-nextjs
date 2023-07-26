import { errorResponse } from "@/utils";
import { useState } from "react";

const useAPI = (API: Function) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const call = (params?: {}) => {
    setLoading(true);
    API(params || {})
      .then((res: any) => {
        const datas = res.data;
        if (!datas) throw new Error(res.status.toString());
        setData(datas);
        setError("");
      })
      .catch((err: any) => {
        setData(null);
        setError(errorResponse(err));
      })
      .finally(() => setLoading(false));
  };

  return { data, loading, error, call };
};
export default useAPI;
