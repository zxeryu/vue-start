import { defineComponent, ExtractPropTypes, inject, PropType, provide, ref, shallowRef, ShallowRef } from "vue";
import { useEffect, useResizeObserver } from "@vue-start/hooks";
import { init, ECharts } from "echarts";
import { debounce, isObject, map } from "lodash";
import { ChartEvent } from "./ChartEvent";

const ChartProviderKey = Symbol("chart-key");

export const useChart = () => inject(ChartProviderKey) as { chartRef: ShallowRef<ECharts> };

declare type EChartsInitOpts = {
  locale?: string;
  renderer?: "canvas" | "svg";
  devicePixelRatio?: number;
  useDirtyRect?: boolean;
  useCoarsePointer?: boolean;
  pointerSize?: number;
  ssr?: boolean;
  width?: number | string;
  height?: number | string;
};

const chartProps = () => ({
  //init 参数
  theme: { type: [String, Object], default: undefined },
  //init 参数
  opts: { type: Object as PropType<EChartsInitOpts> },
  //chart.setOption 参数
  option: Object,
  //chart.setOption 参数
  optionOpts: Object,
  //chart.resize参数
  resize: { type: [Boolean, Object], default: true },
  //chart.loading参数
  loading: Boolean,
  //events 事件
  events: {
    type: Array as PropType<{ eventName: string; handler: (...params: any[]) => void; query?: string | object }[]>,
  },
});

export type ProChartProps = Partial<ExtractPropTypes<ReturnType<typeof chartProps>>>;

export const Chart = defineComponent<ProChartProps>({
  props: {
    ...chartProps(),
  } as any,
  setup: (props, { slots, emit }) => {
    const chartRef = shallowRef<ECharts>();
    const domRef = ref();

    useEffect(() => {
      if (!domRef.value) return;
      chartRef.value = init(domRef.value, props.theme, props.opts);
      return () => {
        chartRef.value && chartRef.value.dispose();
      };
    }, [domRef, () => props.theme, () => props.opts]);

    useEffect(
      () => {
        if (!chartRef.value) return;
        chartRef.value.clear();
        chartRef.value.setOption(props.option as any, props.optionOpts);
      },
      () => props.option,
    );

    const resizeChart = debounce(() => {
      if (!chartRef.value) return;

      const resize = props.resize;
      if (!resize) return;

      if (isObject(resize)) {
        chartRef.value.resize(resize);
      } else {
        chartRef.value.resize();
      }
    });

    useResizeObserver(domRef, () => {
      resizeChart();
    });

    provide(ChartProviderKey, { chartRef });

    return () => {
      return (
        <div ref={domRef}>
          {map(props.events, (item) => {
            return <ChartEvent {...item} />;
          })}
          {slots.default}
        </div>
      );
    };
  },
});
