import { defineComponent, PropType } from "vue";
import { useEffect } from "@vue-start/hooks";
import { useChart } from "./Chart";
import { map } from "lodash";

export const ChartEvent = defineComponent({
  props: {
    eventName: String,
    query: [String, Object],
    handler: Function,
  },
  setup: (props) => {
    const { chartRef } = useChart();

    useEffect(() => {
      if (!chartRef.value) {
        console.warn("please use ChartEvent in Chart");
        return;
      }
      if (!props.eventName || !props.handler) return;
      if (props.query) {
        chartRef.value.on(props.eventName, props.handler as any);
      } else {
        chartRef.value.on(props.eventName, props.query as any, props.handler);
      }
      return () => {
        chartRef.value && props.eventName && chartRef.value.off(props.eventName, props.handler);
      };
    }, []);

    return () => {
      return null;
    };
  },
});

