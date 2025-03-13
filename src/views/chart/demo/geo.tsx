/*---
title: geo
---*/

import { computed, defineComponent, reactive, ref } from "vue";
import { useEffect, useWatch } from "@vue-start/hooks";
import axios from "axios";
import { registerMap } from "echarts";
import { css } from "@emotion/css";
import { map } from "lodash";

export default defineComponent(() => {
  const chart = ref();

  const state = reactive<{
    visible: boolean;
    options: { value: string; label: string }[];
    area: undefined | string;
  }>({
    visible: false,
    options: [],
    area: undefined,
  });

  useEffect(() => {
    axios.get("/geo/USA.json").then((res) => {
      const options = map(res.data.features, (item) => ({ value: item.properties.name, label: item.properties.name }));

      registerMap("USA", res.data, {
        Alaska: { left: -131, top: 25, width: 15 },
        Hawaii: { left: -110, top: 28, width: 5 },
        "Puerto Rico": { left: -76, top: 26, width: 2 },
      });
      state.visible = true;
      state.options = options;
    });
  }, []);

  /* 联动 select切换，选中echart区域*/
  useWatch(
    () => {
      const c = chart.value?.chartRef;
      if (!c) {
        return;
      }
      c.dispatchAction({
        type: "select",
        seriesId: "USA",
        // seriesName: "USA",
        name: state.area,
      });
    },
    () => state.area,
  );

  /* echart 数据 */
  const option = computed(() => {
    return {
      series: [
        {
          id: "USA",
          name: "USA",
          type: "map",
          roam: true,
          map: "USA",
          layoutSize: "100%",
          emphasis: {
            label: { show: true },
          },
        },
      ],
    };
  });

  /* echart 事件 */
  const events = [
    {
      eventName: "click",
      handler: (e: any) => {
        console.log("click area =", e);
        //点击echart区域，修改select值
        state.area = e.name;
      },
    },
  ];

  return () => {
    if (!state.visible) {
      return null;
    }
    return (
      <>
        <pro-select v-model={state.area} options={state.options} />
        <pro-chart class={css({ height: 300 })} ref={chart} option={option.value} events={events} />
      </>
    );
  };
});
