import MainMap from "@/component/map/MainMap";
import SearchBox from "./SearchBox";
import { createContext, useEffect, useState } from "react";
import {
  Feature,
  GeojsonType,
  ObjectLiteral,
} from "@/pages/api/utils/geojson.interface";
import useAPI from "@/hooks/useAPI";
import API from "@/configs/api";
import { FEATURE_TYPE, getTypeFeature, getValObject } from "@/pages/api/utils";
import DownloadButton from "./DownloadButton";
import { getOneLevelDown } from "@/utils/map";

export type MainContextType = {
  selected: Feature;
  setSelected: (_args: any) => void;
  polygons: ObjectLiteral[];
  setPolygons: (_args: any) => void;
  geojson: GeojsonType;
  setGeojson: (_args: any) => void;
};

export const MainContext = createContext<MainContextType>({
  selected: {} as Feature,
  setSelected: (_args: any) => {},
  polygons: [],
  setPolygons: (_args: any) => {},
  geojson: {} as GeojsonType,
  setGeojson: (_args: any) => {},
});

export default function HomePage() {
  const [selected, setSelected] = useState<Feature>({} as Feature);
  const [polygons, setPolygons] = useState<ObjectLiteral[]>([]);
  const [geojson, setGeojson] = useState<GeojsonType>({} as GeojsonType);
  const apiData = useAPI(API.getSearchId);

  useEffect(() => {
    if (!selected.properties) return;
    const typeFeature = getTypeFeature(selected.properties);
    apiData.call({
      fid:
        typeFeature === FEATURE_TYPE.PROV
          ? getValObject(selected.properties, "PROVINSI")
          : getValObject(selected.properties, "KODE_KD") ||
            selected.properties.FID ||
            "",
      level: getOneLevelDown(typeFeature),
      type: typeFeature,
    });
  }, [selected]);

  useEffect(() => {
    if (!apiData.data) return;
    setPolygons(getValObject(apiData.data, "data", []));
  }, [apiData.data]);

  return (
    <MainContext.Provider
      value={{
        selected,
        setSelected,
        polygons,
        setPolygons,
        geojson,
        setGeojson,
      }}
    >
      <MainMap isLoading={apiData.loading}>
        <SearchBox />
        {geojson.name && <DownloadButton />}
      </MainMap>
    </MainContext.Provider>
  );
}
