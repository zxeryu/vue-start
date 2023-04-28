import { provideMap, useMap } from "../Map";
import { isArray, isNumber } from "lodash";
import { useEffect, useWatch } from "@vue-start/hooks";
import { defineComponent, PropType } from "vue";
import { TEvents } from "../event";
import { useFeatureOptMethods, useShowConnect } from "../Feature";

const useMapLayerOpe = () => {
  const { mapRef, layerGroup } = useMap();

  const addToMap = (layer: any) => {
    if (layerGroup) {
      if (isArray(layer)) {
        layerGroup.addLayers(layer);
      } else {
        layerGroup.addLayer(layer);
      }
      return;
    }
    mapRef.value.add(layer);
  };

  const removeFromMap = (layer: any) => {
    if (layerGroup) {
      if (isArray(layer)) {
        layerGroup.removeLayers(layer);
      } else {
        layerGroup.removeLayer(layer);
      }
      return;
    }
    mapRef.value.remove(layer);
  };

  return { addToMap, removeFromMap };
};

export const useMapLayerConnect = (layer: any) => {
  const { addToMap, removeFromMap } = useMapLayerOpe();

  useEffect(() => {
    addToMap(layer);
    return () => {
      removeFromMap(layer);
    };
  }, []);
};

export const LayerGroup = defineComponent({
  props: {
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

    const layerGroup = new window.AMap.LayerGroup();

    let isAdd = false;

    //添加到地图
    const addToMap = () => {
      if (isAdd) return;
      mapRef.value.add(layerGroup as any);
      isAdd = true;
    };

    //从地图中删除
    const removeFormMap = () => {
      mapRef.value.remove(layerGroup as any);
      isAdd = false;
    };

    const getFeature = () => layerGroup;

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
    useShowConnect(layerGroup, props.show);

    //动态opts
    useFeatureOptMethods(layerGroup, props.opts$!);

    expose({ getFeature, addToMap, removeFormMap });

    provideMap({ mapRef, layerGroup });

    return () => {
      return slots.default?.();
    };
  },
});
