import { defineComponent, ExtractPropTypes, inject, PropType, provide, ref, shallowRef, ShallowRef } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { useEffect } from "@vue-start/hooks";

const MapProvideKey = Symbol("amap-key");

export interface IMapProvide {
  mapRef: ShallowRef<AMap.Map>;
  overlayGroup?: AMap.OverlayGroup;
  layerGroup?: AMap.LayerGroup;
}

export const provideMap = (opts: IMapProvide) => provide(MapProvideKey, opts);

export const useMap = <T extends IMapProvide>() => inject(MapProvideKey) as T;

export type TLoadOpts = {
  key: string; // 申请好的Web端开发者Key，首次调用 load 时必填
  version: string; // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  plugins?: string[]; //插件列表
  // 是否加载 AMapUI，缺省不加载
  AMapUI?: {
    version?: string; // AMapUI 缺省 1.1
    plugins?: string[]; // 需要加载的 AMapUI ui插件
  };
  // 是否加载 Loca， 缺省不加载
  Loca?: {
    version?: string; // Loca 版本，缺省 1.3.2
  };
};

const mapProps = () => ({
  //密钥
  securityJsCode: { type: String },
  //加载地图opts
  loadOpts: { type: Object as PropType<TLoadOpts> },
  //地图opts
  opts: { type: Object as PropType<AMap.MapOptions> },
});

export type MapProps = Partial<ExtractPropTypes<ReturnType<typeof mapProps>>>;

declare global {
  interface Window {
    _AMapSecurityConfig?: { securityJsCode: string };
  }
}

//设置 安全密钥
const setSecurityCode = (code?: string) => {
  if (!code) return;
  if (!window._AMapSecurityConfig || !window._AMapSecurityConfig?.securityJsCode) {
    window._AMapSecurityConfig = { securityJsCode: code };
    return;
  }
  if (window._AMapSecurityConfig.securityJsCode !== code) {
    window._AMapSecurityConfig = { securityJsCode: code };
    console.warn("当前window对象已经注入过securityJsCode值，可能造成问题");
  }
};

export const Map = defineComponent<MapProps>({
  props: {
    ...mapProps(),
  } as any,
  setup: (props, { slots, expose }) => {
    setSecurityCode(props.securityJsCode);

    const mapRef = shallowRef<AMap.Map>();
    const domRef = ref();

    expose({ mapRef, domRef });

    useEffect(() => {
      // @ts-ignore
      AMapLoader.load({ version: "2.0", ...props.loadOpts! })
        .then((m) => {
          const map = new m.Map(domRef.value, { ...props.opts });
          //地图加载成功事件
          map.on("complete", () => {
            mapRef.value = map;
          });
        })
        .catch((err) => {
          console.error("加载地图错误");
          console.error(err);
        });

      return () => {
        mapRef.value && mapRef.value.destroy();
      };
    }, []);

    provideMap({ mapRef } as any);

    return () => {
      return <div ref={domRef}>{mapRef.value && slots.default?.()}</div>;
    };
  },
});
