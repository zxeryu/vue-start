/*---
title: HeatMap
---*/
import { computed, defineComponent, ref } from "vue";
import { css } from "@emotion/css";
import { Map, HeatMap } from "@vue-start/map";
import { useFetch } from "@vue-start/request";
import { getHeatmap } from "@/clients/map-data";
import { size } from "lodash";
import { useUpdateKey } from "@vue-start/hooks";

export default defineComponent(() => {
  const { data } = useFetch(getHeatmap, { initEmit: true });

  const modeRef = ref("2d");

  const [mapKey, updateMapKey] = useUpdateKey();

  const data2D = {
    mapOpts: { center: [116.33719, 39.942384], zoom: 11 },
    heatOpts: { radius: 25, opacity: [0, 0.8] },
  };
  const data3D = {
    mapOpts: { center: [116.33719, 39.942384], zoom: 11, viewMode: "3D", pitch: 70 },
    heatOpts: {
      radius: 25,
      opacity: [0, 0.8],
      "3d": {
        //热度转高度的曲线控制参数，可以利用左侧的控制面板获取
        heightBezier: [0.4, 0.2, 0.4, 0.8],
        //取样精度，值越小，曲面效果越精细，但同时性能消耗越大
        gridSize: 2,
        heightScale: 1,
      },
    },
  };

  const modeData = computed(() => {
    if (modeRef.value === "3d") {
      return data3D;
    }
    return data2D;
  });

  return () => {
    return (
      <Map key={mapKey.value} class={css({ height: 400 })} opts={modeData.value.mapOpts as any}>
        <div class={css({ position: "absolute" })}>
          <button
            onClick={() => {
              modeRef.value = modeRef.value === "2d" ? "3d" : "2d";
              updateMapKey();
            }}>
            切换{modeRef.value === "2d" ? "3d" : "2d"}
          </button>
        </div>

        {size(data.list) > 0 && (
          <HeatMap opts={modeData.value.heatOpts} opts$={{ dataSet: { data: data.list, max: 100 } }} />
        )}
      </Map>
    );
  };
});
