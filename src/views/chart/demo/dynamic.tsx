/*---
title: 动静分离
---*/

import { computed, defineComponent } from "vue";
import { css } from "@emotion/css";

export default defineComponent(() => {
  //静态配置
  const basicOption = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "line",
        smooth: true,
      },
    ],
  };

  //动态获取的数据
  const option = computed(() => {
    return {
      xAxis: {
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
        },
      ],
    };
  });

  return () => {
    return <pro-chart class={css({ height: 300 })} basicOption={basicOption} option={option.value} />;
  };
});
