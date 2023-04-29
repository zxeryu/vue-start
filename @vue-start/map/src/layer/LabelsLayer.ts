import { defineComponent, PropType, toRef } from "vue";
import { debounce, forEach, map } from "lodash";
import { TEvents } from "../event";
import { useEffect, useWatch } from "@vue-start/hooks";
import { useMap } from "../Map";
import { useShowConnect } from "../Feature";

export const LabelsLayer = defineComponent({
  props: {
    //LabelsLayer opts
    opts: { type: Object as PropType<AMap.LabelsLayerOptions> },
    //LabelMarker opts
    itemOpts: { type: Object as PropType<AMap.LabelMarkerOptions> },
    //labelMarker数据集合
    data: { type: Array as PropType<AMap.LabelMarkerOptions[]> },
    show: { type: Boolean, default: true },
    events: { type: Array as PropType<TEvents> },
  },
  setup: (props, { expose }) => {
    const { mapRef } = useMap();

    const feature = new window.AMap.LabelsLayer(props.opts);

    const convertMarkers = () => {
      return map(props.data, (item) => {
        const labelMarker = new AMap.LabelMarker({
          ...props.itemOpts,
          ...item,
        });
        if (props.events) {
          //事件注册
          forEach(props.events, (e) => {
            labelMarker.on(e.type, e.handler, undefined, e.once);
          });
        }
        return;
      });
    };

    const setData = debounce(() => {
      //@ts-ignore
      feature.clear();
      const markers = convertMarkers();
      //@ts-ignore
      feature.add(markers);
    }, 100);

    useEffect(() => {
      setData();
      mapRef.value.add(feature);
      return () => {
        //@ts-ignore
        feature.clear();
        mapRef.value.remove(feature);
      };
    }, []);

    useWatch(
      () => setData(),
      () => props.data,
    );

    //show
    const showRef = toRef(props, "show");
    useShowConnect(feature, showRef);

    expose({ getFeature: () => feature });

    return () => {
      return null;
    };
  },
});
