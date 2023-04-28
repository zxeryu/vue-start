import { defineComponent, PropType } from "vue";
import { provideMap, useMap } from "../Map";
import { useEffect, useWatch } from "@vue-start/hooks";
import { isArray, isNumber } from "lodash";
import { useFeatureOptMethods, useShowConnect } from "../Feature";
import { TEvents } from "../event";

/**
 * overlay 类型 组件 map 添加/删除 操作方法
 */
const useMapOverlayOpe = () => {
  const { mapRef, overlayGroup } = useMap();

  const addToMap = (overlay: any) => {
    if (overlayGroup) {
      if (isArray(overlay)) {
        overlayGroup.addOverlays(overlay);
      } else {
        overlayGroup.addOverlay(overlay);
      }
      return;
    }
    mapRef.value.add(overlay);
  };

  const removeFromMap = (overlay: any) => {
    if (overlayGroup) {
      if (isArray(overlay)) {
        overlayGroup.removeOverlays(overlay);
      } else {
        overlayGroup.removeOverlay(overlay);
      }
      return;
    }
    mapRef.value.remove(overlay);
  };

  return { addToMap, removeFromMap };
};

/**
 * overlay 绑定快捷方式
 * @param overlay
 */
export const useMapOverlayConnect = (overlay: any) => {
  const { addToMap, removeFromMap } = useMapOverlayOpe();

  useEffect(() => {
    addToMap(overlay);
    return () => {
      removeFromMap(overlay);
    };
  }, []);
};

/**
 * 目前OverlayGroup支持Marker, Polygon, Polyline, Circle, Rectangle, Ellipse 和 BezierCurve。
 */
export const OverlayGroup = defineComponent({
  props: {
    /**
     * 首次添加到地图中的标识；
     * 值为true时，将OverlayGroup对象添加到地图中；
     */
    bind: { type: Boolean, default: false },
    //初始化后绑定到地图上的延时时间
    bindTime: { type: Number, default: undefined },
    //拓展响应属性
    opts$: { type: Object as PropType<{ options: AMap.OverlayOptions }> },
    //对应 show/hide方法
    show: { type: Boolean, default: true },
    //事件
    events: { type: Array as PropType<TEvents> },
  },
  setup: (props, { slots, expose }) => {
    const { mapRef } = useMap();

    const overlayGroup = new window.AMap.OverlayGroup();

    let isAdd = false;

    //添加到地图
    const addToMap = () => {
      if (isAdd) return;
      mapRef.value.add(overlayGroup as any);
      isAdd = true;
    };

    //从地图中删除
    const removeFormMap = () => {
      mapRef.value.remove(overlayGroup as any);
      isAdd = false;
    };

    const getFeature = () => overlayGroup;

    //组件卸载
    useEffect(() => {
      return () => {
        removeFormMap();
      };
    }, []);

    //props.bind
    useEffect(() => {
      if (!isNumber(props.bindTime)) return;
      const timer = setTimeout(() => {
        addToMap();
      }, props.bindTime);
      return () => {
        timer && clearTimeout(timer);
      };
    }, []);

    useWatch(
      () => {
        if (props.bind) addToMap();
      },
      () => props.bind,
    );

    //props.show
    useShowConnect(overlayGroup, props.show);

    //动态opts
    useFeatureOptMethods(overlayGroup, props.opts$!);

    expose({ getFeature, addToMap, removeFormMap });

    provideMap({ mapRef, overlayGroup });

    return () => {
      return slots.default?.();
    };
  },
});
