/*---
title: CircleMarker
---*/
import { defineComponent } from "vue";
import { Map, CircleMarker } from "@vue-start/map";
import { css } from "@emotion/css";
import { useFetch } from "@vue-start/request";
import { getCapitals } from "@/clients/map-data";
import { map } from "lodash";

export default defineComponent(() => {
  const { data } = useFetch(getCapitals, { initEmit: true });

  return () => {
    return (
      <Map class={css({ height: 400 })} opts={{ zoom: 4, center: [108, 34] }}>
        {map(data.list, (item) => {
          return (
            <CircleMarker
              opts={{
                center: item.center,
                radius: 10 + Math.random() * 10, //3D视图下，CircleMarker半径不要超过64px
                strokeColor: "white",
                strokeWeight: 2,
                strokeOpacity: 0.5,
                fillColor: "rgba(0,0,255,1)",
                fillOpacity: 0.5,
                zIndex: 10,
                bubble: true,
                cursor: "pointer",
                clickable: true,
              }}
            />
          );
        })}
      </Map>
    );
  };
});
