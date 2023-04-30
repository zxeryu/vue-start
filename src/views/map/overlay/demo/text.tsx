/*---
title: Text
---*/
import { computed, defineComponent, ref } from "vue";
import { Map, Text } from "@vue-start/map";
import { css } from "@emotion/css";

export default defineComponent(() => {
  return () => {
    return (
      <Map class={css({ height: 300 })} opts={{ center: [116.397428, 39.90923], zoom: 13}}>
        <Text
          opts={{
            text: "纯文本标记",
            anchor: "center", // 设置文本标记锚点
            // draggable: true,
            cursor: "pointer",
            angle: 10,
            style: {
              padding: ".75rem 1.25rem",
              "margin-bottom": "1rem",
              "border-radius": ".25rem",
              "background-color": "white",
              width: "15rem",
              "border-width": 0,
              "box-shadow": "0 2px 6px 0 rgba(114, 124, 245, .5)",
              "text-align": "center",
              "font-size": "20px",
              color: "blue",
            },
            position: [116.396923, 39.918203],
          }}
        />
      </Map>
    );
  };
});
