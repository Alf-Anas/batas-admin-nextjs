import { Button, Form, Modal, Radio, Space, Typography } from "antd";
import classes from "./DownloadButton.module.css";
import { useContext, useState } from "react";
import { MainContext } from ".";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadFile } from "@/utils";
const shpwrite = require("shp-write");
const tokml = require("tokml");

const TYPE_DOWNLOAD = {
  GEOJSON: "GeoJSON",
  SHP: "ShapeFile (SHP)",
  KML: "Keyhole Markup Language (KML)",
};
const LIST_TYPE_DOWNLOAD = [
  TYPE_DOWNLOAD.GEOJSON,
  TYPE_DOWNLOAD.SHP,
  TYPE_DOWNLOAD.KML,
];

export default function DownloadButton() {
  const { geojson, selected } = useContext(MainContext);
  const [openModal, setOpenModal] = useState(false);
  const [typeDownload, setTypeDownload] = useState(TYPE_DOWNLOAD.GEOJSON);

  function onDownloadFile() {
    if (typeDownload === TYPE_DOWNLOAD.GEOJSON) {
      downloadFile(
        JSON.stringify(geojson),
        "application/json",
        selected.properties.NAMA,
        "geojson"
      );
    } else if (typeDownload === TYPE_DOWNLOAD.SHP) {
      const options = {
        folder: selected.properties.NAMA,
        types: {
          point: selected.properties.NAMA + "_PT",
          polygon: selected.properties.NAMA + "_PL",
          line: selected.properties.NAMA + "_LN",
        },
      };

      shpwrite.download(geojson, options);
    } else if (typeDownload === TYPE_DOWNLOAD.KML) {
      const kml = tokml(geojson, {
        name: "nama",
        description: "label",
      });
      downloadFile(kml, "text/plain", selected.properties.NAMA, "kml");
    }
  }

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
      >
        <Typography.Title level={5}>File Type : </Typography.Title>
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