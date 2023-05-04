/*---
title: control
---*/
import { defineComponent } from "vue";
import { Map, ToolBar, Scale, HawkEye, MapType, ControlBar } from "@vue-start/map";
import { css } from "@emotion/css";

export default defineComponent(() => {
  return () => {
    return (
      <Map class={css({ height: 500 })}>
        <ToolBar
          opts={{
            position: { top: "110px", right: "40px" },
          }}
        />
        <Scale opts={{}} />
        <HawkEye opts={{}} />
        <MapType
          opts={{
            position: { top: "10px", left: "100px" },
          }}
        />
        <ControlBar
          opts={{
            position: { top: "10px", right: "10px" },
          }}
        />
      </Map>
    );
  };
});
