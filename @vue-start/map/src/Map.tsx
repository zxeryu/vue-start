import { defineComponent, ExtractPropTypes, inject, PropType, provide, ref, shallowRef, ShallowRef } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { useEffect } from "@vue-start/hooks";
import { TEvents, useEvents } from "./event";

const MapProvideKey = Symbol("amap-key");
const GroupProvideKey = Symbol("amap-group-key");

export type GeoJsonFeature = {
  type: "Feature";
  properties: Record<string, any>;
  geometry: { type: string; coordinates: any };
};

export type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

export type GeoJsonQuery = {
  adcode: string;
  type: "boundary" | "children";
};

export type GetGeoJson = (opts: GeoJsonQuery) => Promise<GeoJsonFeatureCollection>;

export interface IMapProvide {
  mapRef: ShallowRef<AMap.Map>;
  getGeoJson: GetGeoJson;
}

export interface IGroupProvide {
  overlayGroup?: AMap.OverlayGroup;
  layerGroup?: AMap.LayerGroup;
}

export const provideMap = (opts: IMapProvide) => provide(MapProvideKey, opts);

export const useMap = <T extends IMapProvide>() => inject(MapProvideKey) as T;

export const provideGroup = (opts: IGroupProvide) => provide(GroupProvideKey, opts);

export const useGroup = () => inject(GroupProvideKey, {} as IGroupProvide);

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
  //事件
  events: { type: Array as PropType<TEvents> },
  getGeoJson: { type: Function as PropType<GetGeoJson> },
  geoJsonPath: { type: String },
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

export const MapEvents = defineComponent({
  props: {
    events: { type: Array as PropType<TEvents> },
  },
  setup: (props) => {
    const { mapRef } = useMap();

    useEvents(mapRef.value, props.events!);

    return () => {
      return null;
    };
  },
});

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

    const emptyFC = (): GeoJsonFeatureCollection => ({ type: "FeatureCollection", features: [] });

    const normalizeAdcode = (fc: GeoJsonFeatureCollection): GeoJsonFeatureCollection => ({
      ...fc,
      features: fc.features.map((f) => ({
        ...f,
        properties: {
          ...f.properties,
          adcode: f.properties?.adcode != null ? String(f.properties.adcode) : f.properties?.adcode,
          parent: f.properties?.parent
            ? { ...f.properties.parent, adcode: String(f.properties.parent.adcode) }
            : f.properties?.parent,
        },
      })),
    });

    const cache: Record<string, Promise<GeoJsonFeatureCollection>> = {};
    const load = (url: string): Promise<GeoJsonFeatureCollection> => {
      if (!cache[url]) {
        cache[url] = fetch(url)
          .then((r) => (r.ok ? r.json() : emptyFC()))
          .then(normalizeAdcode)
          .catch(() => emptyFC());
      }
      return cache[url];
    };

    const MUNICIPALITIES = ["110000", "120000", "310000", "500000", "810000", "820000"];

    const defaultGetGeoJson: GetGeoJson | undefined = props.geoJsonPath
      ? (opts) => {
          const base = props.geoJsonPath!.replace(/\/$/, "");
          const code = opts.adcode;
          const isCountry = opts.adcode === "100000";
          const isProvince = !isCountry && opts.adcode.endsWith("0000");
          const isCity = !isProvince && opts.adcode.endsWith("00");
          const provinceCode = opts.adcode.slice(0, 2) + "0000";

          if (opts.type === "boundary") {
            if (isCountry) return load(`${base}/100000.json`);
            const url = isProvince
              ? `${base}/100000_full.json`
              : isCity
              ? `${base}/${provinceCode}_full.json`
              : MUNICIPALITIES.includes(provinceCode)
              ? `${base}/${provinceCode}_full.json`
              : `${base}/${provinceCode}_full_district.json`;
            return load(url).then((fc) => ({
              type: "FeatureCollection",
              features: fc.features.filter((f) => f.properties?.adcode === code),
            }));
          }

          if (isCountry) return load(`${base}/100000_full.json`);
          if (isProvince) {
            return load(`${base}/${provinceCode}_full.json`).then((fc) => ({
              type: "FeatureCollection",
              features: fc.features.filter((f) => f.properties?.parent?.adcode === code),
            }));
          }
          if (isCity) {
            return load(`${base}/${provinceCode}_full_district.json`).then((fc) => ({
              type: "FeatureCollection",
              features: fc.features.filter((f) => f.properties?.parent?.adcode === code),
            }));
          }
          return Promise.resolve(emptyFC());
        }
      : undefined;

    const getGeoJson: GetGeoJson = (opts) => {
      if (props.getGeoJson) return props.getGeoJson(opts);
      if (defaultGetGeoJson) return defaultGetGeoJson(opts);
      return Promise.resolve(emptyFC());
    };

    provideMap({ mapRef, getGeoJson } as any);

    return () => {
      return (
        <div ref={domRef}>
          {mapRef.value && <MapEvents events={props.events} />}
          {mapRef.value && slots.default?.()}
        </div>
      );
    };
  },
});
