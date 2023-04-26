import { defineComponent, ExtractPropTypes, inject, PropType, provide, ref, shallowRef, ShallowRef } from "vue";
import { useEffect, useResizeObserver } from "@vue-start/hooks";
import { init, ECharts } from "echarts";
import { debounce, isBoolean, isObject, map } from "lodash";
import { ChartEvent } from "./ChartEvent";
import { mergeOptionData } from "./util";

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
  /**************** init 参数 ***************/
  theme: { type: [String, Object], default: undefined },
  //init 参数
  opts: { type: Object as PropType<EChartsInitOpts> },
  /****************** chart.setOption 参数 **********************/
  //默认的 option， 在执行 setOption 的时候会与option合并
  basicOption: Object,
  mergeOptionData: { type: Function, default: mergeOptionData },
  option: Object,
  optionOpts: Object,
  /**************** chart.resize ***************/
  resize: { type: [Boolean, Object], default: true },
  /**************** chart.loading 参数 ***************/
  loading: { type: Boolean, default: false },
  loadingOpts: { type: Object },
  /**************** events 事件 ***************/
  events: {
    type: Array as PropType<{ eventName: string; handler: (...params: any[]) => void; query?: string | object }[]>,
  },
});

export type ProChartProps = Partial<ExtractPropTypes<ReturnType<typeof chartProps>>>;

export const ProChart = defineComponent<ProChartProps>({
  props: {
    ...chartProps(),
  } as any,
  setup: (props, { slots, expose }) => {
    const chartRef = shallowRef<ECharts>();
    const domRef = ref();

    expose({ chartRef, domRef });

    useEffect(() => {
      if (!domRef.value) return;
      chartRef.value = init(domRef.value, props.theme, props.opts);
      return () => {
        chartRef.value && chartRef.value.dispose();
      };
    }, []);

    const mergeOption = (): any => {
      const basicOption = props.basicOption;
      const option = props.option;
      if (!basicOption || !option) return props.option;
      //拼接思路：basicOption为主 option为辅
      return props.mergeOptionData!(basicOption, option);
    };

    useEffect(
      () => {
        if (!chartRef.value) return;
        chartRef.value.clear();
        chartRef.value.setOption(mergeOption(), props.optionOpts);
      },
      () => props.option,
    );

    //************************* loading **************************

    useEffect(
      () => {
        if (!chartRef.value) return;
        if (props.loading) {
          chartRef.value.showLoading({ ...props.loadingOpts });
        } else {
          chartRef.value.hideLoading();
        }
      },
      () => props.loading,
    );

    //************************* resize **************************

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

    //是否是初始化执行
    let isInit = true;

    useResizeObserver(domRef, () => {
      if (isInit) {
        isInit = false;
        return;
      }
      resizeChart();
    });

    provide(ChartProviderKey, { chartRef });

    return () => {
      return (
        <div ref={domRef}>
          {chartRef.value && (
            <>
              {map(props.events, (item) => {
                return <ChartEvent {...item} />;
              })}
              {slots.default?.()}
            </>
          )}
        </div>
      );
    };
  },
});
