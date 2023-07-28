import { AutoComplete, Form, Input, Typography } from "antd";
import classes from "./SearchBox.module.css";
import useAPI from "@/hooks/useAPI";
import API from "@/configs/api";
import { useContext, useEffect, useState } from "react";
import { getValObject, safeObject } from "@/pages/api/utils";
import { ResponseData } from "@/pages/api/search";
import { Feature } from "@/pages/api/utils/geojson.interface";
import useTermDebounce from "@/hooks/useTermDebounce";
import { MainContext } from ".";

const emptyData = [{ value: "", label: "-- No Data --" }];
const renderItem = (feature: Feature) => {
  const props = feature.properties;
  return {
    key: props.FID,
    feature,
    value: props.NAMA + "_" + props.FID,
    label: (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {props.NAMA}
          <span>{getValObject(props, "KODE_KD") || props.FID}</span>
        </div>
        {/* Only show admin level >= 2 */}
        {getValObject(props, "KODE_KK") && (
          <Typography.Text
            type="secondary"
            style={{ whiteSpace: "break-spaces" }}
          >
            {props.LABEL}
          </Typography.Text>
        )}
      </div>
    ),
  };
};

export default function SearchBox() {
  const apiData = useAPI(API.getSearch);
  const [listOptions, setListOptions] = useState<any[]>([]);
  const [text, setText] = useState<string>();
  const [term, setTerm] = useTermDebounce<string>();
  const { setSelected } = useContext(MainContext);

  useEffect(() => {
    apiData.call({ name: term || "" });
  }, [term]);

  useEffect(() => {
    if (apiData.data) {
      const resData = safeObject(apiData.data) as ResponseData;
      const mData = resData.data;

      if (!mData) return;

      const options = [];
      if (mData.prov.length > 0) {
        options.push({
          label: "Provinsi",
          options: mData.prov
            .filter((item) => !getValObject(item, "id"))
            .map((item) => renderItem(item)),
        });
      }
      if (mData.kab_kota.length > 0) {
        options.push({
          label: "Kabupaten / Kota",
          options: mData.kab_kota
            .filter((item) => !getValObject(item, "id"))
            .map((item) => renderItem(item)),
        });
      }
      if (mData.kecamatan.length > 0) {
        options.push({
          label: "Kecamatan",
          options: mData.kecamatan
            .filter((item) => !getValObject(item, "id"))
            .map((item) => renderItem(item)),
        });
      }
      if (mData.kel_desa.length > 0) {
        options.push({
          label: "Kelurahan / Desa",
          options: mData.kel_desa
            .filter((item) => !getValObject(item, "id"))
            .map((item) => renderItem(item)),
        });
      }
      if (resData.meta?.fuzzy) {
        options.push({
          label: "Suggestions",
          options:
            [
              ...mData.prov,
              ...mData.kab_kota,
              ...mData.kecamatan,
              ...mData.kel_desa,
            ]
              .filter((item) => getValObject(item, "id"))
              .map((item) => renderItem(item)) || emptyData,
        });
      }
      setListOptions(options);
    }
  }, [apiData.data]);

  function onSearch(val: string) {
    apiData.call({ name: val });
  }
  function onSelect(_val: string, item: any) {
    setSelected(getValObject(item, "feature", {}));
    setText(getValObject(item, "feature.properties.NAMA", {}));
  }

  return (
    <Form.Item className={classes.custom_search_box}>
      <AutoComplete
        options={listOptions}
        onSelect={onSelect}
        listHeight={450}
        value={text}
      >
        <Input.Search
          size="large"
          placeholder="Cari..."
          onSearch={onSearch}
          onChange={(ev) => {
            setTerm(ev.target.value);
            setText(ev.target.value);
          }}
          allowClear
          loading={apiData.loading}
        />
      </AutoComplete>
    </Form.Item>
  );
}
