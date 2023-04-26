/*---
title: 折线图封装
---*/

import { computed, defineComponent } from "vue";
import { css } from "@emotion/css";
import { ProChart } from "@vue-start/chart";

export const BaseLineOption = {
  legend: {},
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

export const LineChart = defineComponent({
  props: {
    ...ProChart.props,
    basicOption: { type: Object, default: BaseLineOption },
  },
  setup: (props, { slots }) => {
    return () => {
      return <ProChart {...props} v-slots={slots} />;
    };
  },
});

export default defineComponent(() => {
  //动态获取的数据
  const option = computed(() => {
    return {
      xAxis: {
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      series: [
        {
          name: "Email",
          type: "line",
          stack: "Total",
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "Union Ads",
          type: "line",
          stack: "Total",
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: "Video Ads",
          type: "line",
          stack: "Total",
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: "Direct",
          type: "line",
          stack: "Total",
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: "Search Engine",
          type: "line",
          stack: "Total",
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    };
  });

  return () => {
    return <LineChart class={css({ height: 360 })} option={option.value} />;
  };
});
