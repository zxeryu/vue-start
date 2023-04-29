import { useEffect, useWatch } from "@vue-start/hooks";
import { forEach, isFunction, upperFirst } from "lodash";
import { DefineComponent, defineComponent, PropType, ref, Teleport, ToRef, toRef } from "vue";
import { TEvents, useEvents } from "./event";
import { useMap } from "./Map";

/**
 * 与地图绑定关系
 * @param features
 */
export const useMapConnect = (features: any) => {
  const { mapRef } = useMap();

  useEffect(() => {
    mapRef.value.add(features);
    return () => {
      try {
        mapRef.value.remove(features);
      } catch (e) {
        console.error(e);
      }
    };
  }, []);
};

/**
 * show 处理
 * @param feature
 * @param showRef
 */
export const useShowConnect = (feature: any, showRef: ToRef<boolean>) => {
  const show = () => {
    if (feature && isFunction(feature.show)) {
      feature.show();
    }
  };
  const hide = () => {
    if (feature && isFunction(feature.hide)) {
      feature.hide();
    }
  };

  useEffect(() => {
    if (!showRef.value) {
      hide();
    }
  }, []);

  useWatch(
    () => {
      if (showRef.value) {
        show();
      } else {
        hide();
      }
    },
    () => showRef,
  );
};

/**
 * 根据 key 调用 `set${Key}`方法
 * @param feature
 * @param optsRef
 */
export const useFeatureOptMethods = (feature: any, optsRef: ToRef<any>) => {
  useEffect(() => {
    forEach(optsRef.value, (v, k) => {
      const methodName = "set" + upperFirst(k);
      if (feature[methodName] && isFunction(feature[methodName])) {
        feature[methodName](v);
      }
    });
  }, optsRef);
};

type TFeature = {
  /********************************* overlay ***********************************/
  //OverlayGroup支持
  Marker: { type: AMap.Marker; opts: AMap.MarkerOptions };
  Polygon: { type: AMap.Polygon; opts: AMap.PolygonOptions };
  Polyline: { type: AMap.Polyline; opts: AMap.PolylineOptions };
  Circle: { type: AMap.Circle; opts: AMap.CircleOptions };
  Rectangle: { type: AMap.Rectangle; opts: AMap.RectangleOptions };
  Ellipse: { type: AMap.Ellipse; opts: AMap.EllipseOptions };
  BezierCurve: { type: AMap.BezierCurve; opts: AMap.BezierCurveOptions };
  //
  ElasticMarker: { type: any; opts: any };
  CircleMarker: { type: AMap.CircleMarker; opts: AMap.CircleMarkerOptions };
  LabelMarker: { type: AMap.LabelMarker; opts: AMap.LabelMarkerOptions };
  Text: { type: AMap.Text; opts: AMap.TextOptions };
  /********************************* layer ***********************************/
  TileLayer: { type: AMap.TileLayer; opts: AMap.TileLayerOptions };
  "TileLayer.Satellite": { type: any; opts: AMap.SatelliteLayerOptions };
  "TileLayer.RoadNet": { type: any; opts: AMap.RoadnetLayerOptions };
  "TileLayer.Traffic": { type: any; opts: AMap.TrafficLayerOptions };
  Buildings: { type: AMap.BuildingLayer; opts: AMap.BuildingLayerOpts };
  MassMarks: { type: AMap.MassMarks; opts: AMap.MassMarkersOptions & { data?: AMap.MassData[] } };
  //
  "TileLayer.WMS": { type: any; opts: AMap.WMSLayerOptions };
  "TileLayer.WMTS": { type: any; opts: AMap.WMTSLayerOptions };
  //自定义
  "TileLayer.Flexible": { type: any; opts: AMap.FlexibleLayerOptions };
  ImageLayer: { type: AMap.ImageLayer; opts: AMap.ImageLayerOptions };
  // VideoLayer: { type: AMap.VideoLayer; opts: AMap.VideoLayerOptions };
  CanvasLayer: { type: AMap.CanvasLayer; opts: AMap.CanvasLayerOptions };
  CustomLayer: { type: AMap.CustomLayer; opts: AMap.CustomLayerOption };
};

export const createFeature = <T extends keyof TFeature>(
  name: T,
  {
    useMapConnect,
    createFeatureObj,
    needDom,
  }: {
    //添加/卸载到地图中操作
    useMapConnect: (feature: TFeature[T]["type"]) => void;
    //自定义创建Feature方法，例：MassMarks
    createFeatureObj?: (opts: TFeature[T]["opts"]) => TFeature[T]["type"];
    //需要使用Html自定义元素
    needDom?: boolean;
  },
): DefineComponent<any, any, any> => {
  return defineComponent<{
    opts: TFeature[T]["opts"];
    opts$?: TFeature[T]["opts"];
    show: boolean;
    events?: TEvents;
  }>({
    props: {
      opts: { type: Object as PropType<TFeature[T]["opts"]> },
      opts$: { type: Object as PropType<TFeature[T]["opts"]> },
      //对应 show/hide方法
      show: { type: Boolean, default: true },
      //事件
      events: { type: Array as PropType<TEvents> },
    } as any,
    setup: (props, { slots, expose }) => {
      // @ts-ignore
      const feature = createFeatureObj ? createFeatureObj(props.opts) : new window.AMap[name](props.opts);

      //map connect
      useMapConnect(feature);

      //show
      const showRef = toRef(props, "show");
      useShowConnect(feature, showRef);

      //动态opts
      const optsRef = toRef(props, "opts$");
      useFeatureOptMethods(feature, optsRef);

      //event
      useEvents(feature, props.events!);

      expose({ getFeature: () => feature });

      /********************* dom html **********************/

      const domRef = ref();

      useEffect(() => {
        if (domRef.value && isFunction(feature.setContent)) {
          feature.setContent(domRef.value);
        }
      }, domRef);

      return () => {
        if (needDom && slots.default) {
          return (
            <Teleport to={"body"}>
              <div ref={domRef}>{slots.default()}</div>
            </Teleport>
          );
        }
        return null;
      };
    },
  });
};
