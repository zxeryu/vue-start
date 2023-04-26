/*---
title: 基础使用
---*/

import { defineComponent, ref } from "vue";
import { css } from "@emotion/css";

export default defineComponent(() => {
  const loadingRef = ref(false);

  const option = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  };

  const handleClick = () => {
    loadingRef.value = !loadingRef.value;
  };

  return () => {
    return (
      <>
        <pro-operate items={[{ value: "loading", label: "loading状态切换", onClick: handleClick }]} />
        <pro-chart
          class={css({ height: 300 })}
          loading={loadingRef.value}
          option={option}
          events={[
            {
              eventName: "click",
              handler: (e: any) => {
                console.log("click", e);
              },
            },
            {
              eventName: "highlight",
              handler: (e: any) => {
                console.log("highlight", e);
              },
            },
          ]}
        />
      </>
    );
  };
});
