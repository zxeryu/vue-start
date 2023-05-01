/*---
title: DistrictLayerWorld
---*/
import { defineComponent } from "vue";
import { Map, DistrictLayerWorld } from "@vue-start/map";
import { css } from "@emotion/css";
import { useFetch } from "@vue-start/request";
import { getWorld } from "@/clients/map-data";
import { find, size } from "lodash";

export default defineComponent(() => {
  const { data } = useFetch(getWorld, { initEmit: true });

  const counts = [10000, 5000, 1000, 500, 100];
  const color = ["#41ae76", "#99d8c9", "#ccece6", "#e5f5f9", "#f7fcfd"];

  const opts = {
    zIndex: 10,
    styles: {
      "stroke-width": 0.8,
      fill: (d: any) => {
        let country = find(data.list, (c) => c.name == d.NAME_CHN);
        if (!country) {
          return "#fff";
        }
        country = country.qz;
        if (country > counts[0]) {
          return color[0];
        } else if (country > counts[1]) {
          return color[1];
        } else if (country > counts[2]) {
          return color[2];
        } else if (country > counts[3]) {
          return color[3];
        } else {
          return color[4];
        }
      },
      "coastline-stroke": (d: any) => {
        if (d.type === "Coastline_China") {
          return "#41ae76";
        }
        return "rgba(0,0,0,0)";
      },
      "nation-stroke": (d: any) => {
        if (d.type === "Nation_Border_China") {
          return "red";
        }
        return "#09f";
      },
    },
  };

  return () => {
    return (
      <Map
        class={css({ height: 500 })}
        opts={{
          center: [170.451348, 43.792165],
          zoom: 2,
          zooms: [2, 4],
          viewMode: "3D",
          showLabel: false,
          layers: [],
        }}>
        {size(data.list) > 0 && <DistrictLayerWorld opts={opts} />}
      </Map>
    );
  };
});
