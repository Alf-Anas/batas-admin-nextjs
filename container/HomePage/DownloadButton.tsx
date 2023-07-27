import { Button, Form, Modal, Radio, Space, Typography } from "antd";
import classes from "./DownloadButton.module.css";
import { useContext, useEffect, useState } from "react";
import { MainContext } from ".";
import { DownloadOutlined } from "@ant-design/icons";
import { FEATURE_TYPE, getTypeFeature, getValObject } from "@/pages/api/utils";
import {
  TYPE_DOWNLOAD,
  getOneLevelDown,
  saveSpatialFile,
  wktToGeoJson,
} from "@/utils/map";
import useAPI from "@/hooks/useAPI";
import API from "@/configs/api";
import { ObjectLiteral } from "@/pages/api/utils/geojson.interface";

const LIST_TYPE_DOWNLOAD = [
  TYPE_DOWNLOAD.GEOJSON,
  TYPE_DOWNLOAD.SHP,
  TYPE_DOWNLOAD.KML,
];

const BATAS_ADMIN_LEVEL = {
  PROVINSI: { ID: FEATURE_TYPE.PROV, LABEL: "Provinsi" },
  KAB_KOTA: { ID: FEATURE_TYPE.KAB_KOTA, LABEL: "Kabupaten / Kota" },
  KECAMATAN: { ID: FEATURE_TYPE.KECAMATAN, LABEL: "Kecamatan" },
  KEL_DESA: { ID: FEATURE_TYPE.KEL_DESA, LABEL: "Kelurahan / Desa" },
};

function getListBatasAdminLevel(featureType: string) {
  switch (featureType) {
    case FEATURE_TYPE.PROV:
      return [
        BATAS_ADMIN_LEVEL.PROVINSI,
        BATAS_ADMIN_LEVEL.KAB_KOTA,
        BATAS_ADMIN_LEVEL.KECAMATAN,
        BATAS_ADMIN_LEVEL.KEL_DESA,
      ];
    case FEATURE_TYPE.KAB_KOTA:
      return [
        BATAS_ADMIN_LEVEL.KAB_KOTA,
        BATAS_ADMIN_LEVEL.KECAMATAN,
        BATAS_ADMIN_LEVEL.KEL_DESA,
      ];
    case FEATURE_TYPE.KECAMATAN:
      return [BATAS_ADMIN_LEVEL.KECAMATAN, BATAS_ADMIN_LEVEL.KEL_DESA];
    case FEATURE_TYPE.KEL_DESA:
      return [BATAS_ADMIN_LEVEL.KEL_DESA];
    default:
      return [];
  }
}

export default function DownloadButton() {
  const { geojson, selected } = useContext(MainContext);
  const [openModal, setOpenModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [typeDownload, setTypeDownload] = useState(TYPE_DOWNLOAD.GEOJSON);
  const [typeLevel, setTypeLevel] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [downloadGeojson, setDownloadGeojson] = useState<ObjectLiteral>({});
  const apiData = useAPI(API.getSearchId);

  function onDownloadFile() {
    setIsDownloading(true);

    const eGeoJson = downloadGeojson[typeLevel];
    if (getValObject(eGeoJson, "type", null)) {
      saveSpatialFile(
        typeDownload,
        eGeoJson,
        typeLevel,
        selected.properties.NAMA
      );
    } else {
      apiData.call({
        fid:
          selectedLevel === FEATURE_TYPE.PROV
            ? getValObject(selected.properties, "PROVINSI")
            : getValObject(selected.properties, "KODE_KD") ||
              selected.properties.FID ||
              "",
        level: typeLevel,
        type: selectedLevel,
      });
    }

    setTimeout(() => {
      setIsDownloading(false);
    }, 1500);
  }

  useEffect(() => {
    if (selected.properties) {
      const mSelected = getTypeFeature(selected.properties);
      setSelectedLevel(mSelected);
      setTypeLevel(getOneLevelDown(mSelected));
    }
  }, [selected]);

  useEffect(() => {
    if (!geojson.type || !selectedLevel) return;
    setDownloadGeojson({
      [getOneLevelDown(selectedLevel)]: geojson,
    });
  }, [geojson, selectedLevel]);

  useEffect(() => {
    if (!apiData.data) return;
    const eData = getValObject(apiData.data, "data", []);
    const geoPolygon = wktToGeoJson(eData, selected.properties.NAMA);
    setDownloadGeojson((oldState) => {
      return { ...oldState, [typeLevel]: geoPolygon.geojson };
    });
    saveSpatialFile(
      typeDownload,
      geoPolygon.geojson,
      typeLevel,
      selected.properties.NAMA
    );
  }, [apiData.data]);

  return (
    <>
      <Form.Item className={classes.custom_download_box}>
        <Button
          size="large"
          type="primary"
          icon={<DownloadOutlined />}
          className={classes.full_width}
          onClick={() => setOpenModal(true)}
        >
          Download
        </Button>
      </Form.Item>
      <Modal
        title={`Download Batas Admin - ${selected.properties.NAMA}`}
        open={openModal}
        onOk={onDownloadFile}
        onCancel={() => setOpenModal(false)}
        okText="Download"
        confirmLoading={isDownloading || apiData.loading}
      >
        <Typography.Title level={5}>Level Batas Adminitrasi :</Typography.Title>
        <Radio.Group
          onChange={(e) => setTypeLevel(e.target.value)}
          value={typeLevel}
        >
          <Space direction="vertical">
            {getListBatasAdminLevel(selectedLevel).map((item, idx) => {
              return (
                <Radio key={idx} value={item.ID}>
                  {item.LABEL}
                </Radio>
              );
            })}
          </Space>
        </Radio.Group>
        <Typography.Title level={5}>File Type :</Typography.Title>
        <Radio.Group
          onChange={(e) => setTypeDownload(e.target.value)}
          value={typeDownload}
        >
          <Space direction="vertical">
            {LIST_TYPE_DOWNLOAD.map((item, idx) => {
              return (
                <Radio key={idx} value={item}>
                  {item}
                </Radio>
              );
            })}
          </Space>
        </Radio.Group>
      </Modal>
    </>
  );
}
