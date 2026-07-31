import { map } from "lodash";
import { computed, defineComponent, PropType, ref } from "vue";
import { useEffect, useWatch } from "@vue-start/hooks";
import { MapEvents, useMap } from "../Map";
import { Polygon } from "../overlay";
import { MapFitView } from "./FitView";

type TLevel = "province" | "city" | "district";

type TArea = {
  adcode: string;
  level: TLevel;
  name?: string;
};

type TAreaState = {
  province?: TArea;
  city?: TArea;
};

type TFillFn = (feature: any, state: TAreaState) => string;

export const DistrictLayer = defineComponent({
  props: {
    provinceCode: [String, Number] as PropType<string | number>,
    cityCode: [String, Number] as PropType<string | number>,
    maxLevel: { type: String as PropType<TLevel>, default: "district" },
    fill: { type: Function as PropType<TFillFn> },
    hoverColor: { type: String, default: "#ff7a45" },
    defaultColor: { type: String, default: "#e6e6e6" },
    styles: { type: Object as PropType<Record<string, any>> },
    disabled: Boolean,
    fitView: { type: Boolean, default: true },
    fitViewOpts: { type: Object as PropType<{ immediately?: boolean; avoid?: number[]; maxZoom?: number }> },
  },
  emits: ["area", "click", "hover"],
  setup: (props, { emit, expose }) => {
    const { getGeoJson } = useMap();

    const path = ref<TArea[]>([]);
    const features = ref<any[]>([]);
    const hover = ref<TArea>();

    const buildRoot = (): TArea[] => {
      const root: TArea[] = [];
      if (props.provinceCode != null) {
        const adcode = String(props.provinceCode);
        const existing = path.value.find((a) => a.adcode === adcode);
        root.push({ adcode, level: "province", name: existing?.name });
      }
      if (props.cityCode != null) {
        const adcode = String(props.cityCode);
        const existing = path.value.find((a) => a.adcode === adcode);
        root.push({ adcode, level: "city", name: existing?.name });
      }
      return root;
    };

    useEffect(() => {
      path.value = buildRoot();
    }, [() => props.provinceCode, () => props.cityCode]);

    const areaState = computed<TAreaState>(() => {
      const state: TAreaState = {};
      for (const a of path.value) {
        if (a.level === "province") state.province = a;
        else if (a.level === "city") state.city = a;
      }
      return state;
    });

    useWatch(() => {
      emit("area", { ...areaState.value });
    }, [areaState]);

    const currentAdcode = computed(() => path.value[path.value.length - 1]?.adcode ?? "100000");

    useEffect((adcode) => {
      let cancelled = false;
      getGeoJson({ adcode, type: "children" }).then((fc) => {
        if (!cancelled) {
          features.value = fc.features;
        }
      });
      return () => {
        cancelled = true;
      };
    }, currentAdcode);

    const polygons = computed(() => {
      const list: { key: string; feature: any; path: any }[] = [];
      for (const f of features.value) {
        const g = f.geometry;
        const adcode = f.properties?.adcode;
        if (g?.type === "Polygon") {
          list.push({ key: `${adcode}-0`, feature: f, path: g.coordinates });
        } else if (g?.type === "MultiPolygon") {
          g.coordinates.forEach((p: any, i: number) => {
            list.push({ key: `${adcode}-${i}`, feature: f, path: p });
          });
        }
      }
      return list;
    });

    const colorFor = (feature: any): string => {
      const h = hover.value;
      if (h && h.adcode === feature.properties?.adcode) return props.hoverColor;
      if (props.fill) return props.fill(feature, areaState.value);
      return props.defaultColor;
    };

    const toArea = (feature: any): TArea => {
      const p = feature.properties || {};
      return { adcode: p.adcode, level: p.level, name: p.name };
    };

    const handleDrill = (feature: any) => {
      const area = toArea(feature);
      emit("click", area);
      if (props.maxLevel && area.level === props.maxLevel) return;
      path.value = [...path.value, area];
    };

    const handleHover = (feature: any) => {
      const area = toArea(feature);
      if (hover.value?.adcode !== area.adcode) {
        hover.value = area;
        emit("hover", area);
      }
    };

    const handleHoverOut = () => {
      if (hover.value) {
        hover.value = undefined;
        emit("hover", undefined);
      }
    };

    const toTop = () => {
      if (path.value.length > 0) {
        path.value = path.value.slice(0, -1);
      }
    };

    expose({
      getState: () => ({ ...areaState.value, hover: hover.value }),
    });

    const fitAdcode = computed(() => path.value[path.value.length - 1]?.adcode);

    return () => {
      return (
        <>
          {map(polygons.value, (p) => {
            return (
              <Polygon
                key={p.key}
                opts={{ path: p.path, ...props.styles }}
                opts$={{ options: { fillColor: colorFor(p.feature) } }}
                events={
                  [
                    { type: "click", handler: () => handleDrill(p.feature) },
                    { type: "mouseover", handler: () => handleHover(p.feature) },
                    { type: "mouseout", handler: () => handleHoverOut() },
                  ] as any
                }
              />
            );
          })}
          {!props.disabled && <MapEvents events={[{ type: "click", handler: toTop }] as any} />}
          {props.fitView && <MapFitView adcode={fitAdcode.value || "100000"} {...(props.fitViewOpts || {})} />}
        </>
      );
    };
  },
});
