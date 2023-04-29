/*---
title: ElasticMarker
---*/
import { defineComponent } from "vue";
import { Map, MapPlugin, ElasticMarker, MapPluginType } from "@vue-start/map";
import { css } from "@emotion/css";
import { useFetch } from "@vue-start/request";
import { getTianTan } from "@/clients/map-data";
import { get, map } from "lodash";

export default defineComponent(() => {
  const { data } = useFetch(getTianTan, { initEmit: true });

  const zoomStyleMapping1 = {
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
  };

  var zoomStyleMapping2 = {
    14: 0,
    15: 0,
    16: 1,
    17: 1,
    18: 1,
    19: 1,
    20: 1,
  };

  return () => {
    return (
      <Map
        class={css({ height: 400 })}
        opts={{
          viewMode: "3D",
          // turboMode: false,
          showIndoorMap: false,
          defaultCursor: "pointer",
          showBuildingBlock: false,
          zooms: [14, 20],
          showLabel: false,
          zoom: 16,
          pitch: 55,
          rotation: -45,
          center: [116.408967, 39.880101],
          // forceVector: true,
        }}>
        <MapPlugin plugins={[MapPluginType.ElasticMarker]}>
          {map(get(data, "sheshi"), (item) => {
            return (
              <ElasticMarker
                opts={{
                  position: item.position,
                  zooms: [14, 20],
                  styles: [
                    {
                      icon: {
                        img: item.icon,
                        size: [16, 16], //可见区域的大小
                        anchor: "bottom-center", //锚点
                        fitZoom: 14, //最合适的级别
                        scaleFactor: 2, //地图放大一级的缩放比例系数
                        maxScale: 1.4, //最大放大比例
                        minScale: 0.8, //最小放大比例
                      },
                    },
                  ],
                  zoomStyleMapping: zoomStyleMapping1,
                }}
              />
            );
          })}
          {map(get(data, "touristSpots"), (item) => {
            return (
              <ElasticMarker
                opts={{
                  position: item.position,
                  zooms: [14, 20],
                  styles: [
                    {
                      icon: {
                        img: item.smallIcon,
                        size: [16, 16], //可见区域的大小
                        anchor: "bottom-center", //锚点
                        fitZoom: 14, //最合适的级别
                        scaleFactor: 2, //地图放大一级的缩放比例系数
                        maxScale: 2, //最大放大比例
                        minScale: 1, //最小放大比例
                      },
                      label: { content: item.name, position: "BM", minZoom: 15 },
                    },
                    {
                      icon: {
                        img: item.bigIcon,
                        size: item.size,
                        anchor: item.anchor,
                        fitZoom: 17.5,
                        scaleFactor: 2,
                        maxScale: 2,
                        minScale: 0.125,
                      },
                      label: { content: item.name, position: "BM" },
                    },
                  ],
                  zoomStyleMapping: zoomStyleMapping2,
                }}
              />
            );
          })}
        </MapPlugin>
      </Map>
    );
  };
});
