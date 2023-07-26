import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import maplibregl, { Map, StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import classes from "./MainMap.module.css";
import { getPolygonBoundingBox, propertiesTableDiv } from "@/utils/map";
import { Spin } from "antd";
import { INITIAL_MAP, LAYER_ID, LAYER_SRC, OSM_STYLE } from "./constant";
import { MainContext } from "@/container/HomePage";
import { parse as WKTParse } from "wellknown";
import { getValObject } from "@/pages/api/utils";
import * as turf from "@turf/turf";

export default function MainMap({
  children,
  isLoading,
}: {
  children?: ReactNode;
  isLoading?: boolean;
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [lng] = useState(INITIAL_MAP.lon);
  const [lat] = useState(INITIAL_MAP.lat);
  const [zoom] = useState(INITIAL_MAP.zoom);
  const [mapHeight, setMapHeight] = useState("100vh");
  const { selected, polygons, setGeojson } = useContext(MainContext);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: OSM_STYLE as StyleSpecification,
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      if (!map.current) return;
      map.current.addSource(LAYER_SRC.ADMIN, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      map.current.addSource(LAYER_SRC.ADMIN_CENTROID, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      map.current.addLayer({
        id: LAYER_ID.ADMIN_PL,
        type: "fill",
        source: LAYER_SRC.ADMIN,
        paint: {
          "fill-color": "#f7be6d",
          "fill-opacity": 0.2,
          "fill-outline-color": "#ff6600",
        },
      });
      map.current.addLayer({
        id: LAYER_ID.ADMIN_LN,
        type: "line",
        source: LAYER_SRC.ADMIN,
        paint: {
          "line-color": "#ff6600",
          "line-width": 2,
        },
      });
      map.current.addLayer({
        id: LAYER_ID.ADMIN_SYMBOL,
        type: "symbol",
        source: LAYER_SRC.ADMIN_CENTROID,
        layout: {
          "text-field": ["get", "nama"],
          "text-variable-anchor": ["top", "bottom", "left", "right"],
          "text-radial-offset": 0.5,
          "text-justify": "auto",
          "text-size": 12,
        },
        paint: {
          "text-halo-color": "white",
          "text-halo-width": 2,
        },
      });
      map.current.addLayer({
        id: LAYER_ID.ADMIN_PT,
        type: "circle",
        source: LAYER_SRC.ADMIN_CENTROID,
        paint: {
          "circle-color": "black",
          "circle-radius": 2,
          "circle-stroke-color": "white",
          "circle-stroke-width": 2,
        },
      });

      map.current.on("click", LAYER_ID.ADMIN_PL, (e) => {
        if (!map.current) return;
        if (!e.features) return;

        new maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(propertiesTableDiv(e.features[0].properties))
          .addTo(map.current);
      });

      // Change the cursor to a pointer when the mouse is over the states layer.
      map.current.on("mouseenter", LAYER_ID.ADMIN_PL, () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.current.on("mouseleave", LAYER_ID.ADMIN_PL, () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = "";
      });
    });
  }, [lng, lat, zoom]);

  useEffect(() => {
    const headerElement = document.getElementById("public-layout-header");
    const footerElement = document.getElementById("public-layout-footer");

    if (headerElement?.clientHeight && footerElement?.clientHeight) {
      setMapHeight(
        `calc(100vh - ${headerElement.clientHeight}px - ${footerElement.clientHeight}px)`
      );
    }
  }, []);

  useEffect(() => {
    if (!map.current) return;
    if (selected.geometry) {
      const bbox = getPolygonBoundingBox(selected.geometry.coordinates);
      map.current.fitBounds(bbox);
    }
  }, [selected]);

  useEffect(() => {
    if (!map.current) return;
    if (polygons.length > 0) {
      const adminSource = map.current.getSource(LAYER_SRC.ADMIN);
      const adminCentroidSource = map.current.getSource(
        LAYER_SRC.ADMIN_CENTROID
      );
      if (adminSource) {
        const listPolygon = polygons.map((item) => {
          const polygon = WKTParse(getValObject(item, "WKT_GEOMETRY", ""));
          const { WKT_GEOMETRY, ogc_fid, ...props } = item;
          return {
            type: "Feature",
            properties: props,
            geometry: polygon,
          };
        });

        const mData = {
          type: "FeatureCollection",
          features: listPolygon,
        };
        adminSource
          // @ts-ignore
          .setData(mData);

        if (adminCentroidSource) {
          const listCentroid = listPolygon.map((item) => {
            const center = turf.centerOfMass(item.geometry);
            return {
              ...center,
              properties: item.properties,
            };
          });
          const mDataPoint = {
            type: "FeatureCollection",
            features: listCentroid,
          };
          adminCentroidSource
            // @ts-ignore
            .setData(mDataPoint);
        }
        setGeojson({
          type: "FeatureCollection",
          name: selected.properties.NAMA,
          crs: {
            type: "name",
            properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
          },
          features: listPolygon,
        });
      }
    }
  }, [polygons]);

  return (
    <div className={classes.map_wrap} style={{ height: mapHeight }}>
      {children}
      {isLoading && <Spin size="large" className={classes.map_loading} />}
      <div ref={mapContainer} className={classes.map} />
    </div>
  );
}
