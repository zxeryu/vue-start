/*---
title: 逐级下钻
desc: 点击区域下钻（国→省→市→区），点击空白回退；面包屑可外部控制（props 驱动）；事件输出到 console
---*/
import { defineComponent, reactive, ref } from "vue";
import { Map, DistrictLayer } from "@vue-start/map";
import { css } from "@emotion/css";

const hash = (n: number) => {
  let x = n | 0;
  x = ((x >> 16) ^ x) * 0x45d9f3b;
  x = ((x >> 16) ^ x) * 0x45d9f3b;
  x = (x >> 16) ^ x;
  return (Math.abs(x) % 1000) / 1000;
};
const ramp = (t: number) => `hsl(215, 72%, ${85 - t * 40}%)`;
const HOVER_COLOR = "#ff7a45";

const barCls = css({
  position: "absolute", top: 12, left: 12, zIndex: 10, display: "flex", alignItems: "center", gap: 2,
  padding: "7px 14px", background: "#fff", borderRadius: 999, boxShadow: "0 4px 18px rgba(13,38,76,.16)",
  fontSize: 13, userSelect: "none",
});
const linkCls = css({ cursor: "pointer", color: "#1f6fe0", fontWeight: 600 });
const curCls = css({ fontWeight: 700, color: "#10243e" });
const sepCls = css({ margin: "0 7px", color: "#c0cbd9" });
const formWrapCls = css({
  position: "absolute", bottom: 12, right: 12, zIndex: 10,
  background: "rgba(255,255,255,.95)", borderRadius: 10,
  boxShadow: "0 4px 18px rgba(13,38,76,.16)", padding: "8px 12px",
});

export default defineComponent(() => {
  const provinceCode = ref<string | undefined>(undefined);
  const cityCode = ref<string | undefined>(undefined);
  const area = ref<any>({});
  const formState = reactive({ maxLevel: "district", fitView: true });

  const onArea = (v: any) => {
    console.log("[district] area:", v);
    area.value = v || {};
    provinceCode.value = v?.province?.adcode;
    cityCode.value = v?.city?.adcode;
  };
  const onClick = (v: any) => console.log("[district] click:", v);
  const onHover = (v: any) => console.log("[district] hover:", v);

  const nav = (level: "country" | "province" | "city") => {
    if (level === "country") {
      provinceCode.value = undefined;
      cityCode.value = undefined;
    } else if (level === "province") {
      cityCode.value = undefined;
    }
  };

  const fill = (f: any) => ramp(hash(Number(f.properties?.adcode) || 0));

  const formColumns = [
    {
      title: "maxLevel", dataIndex: "maxLevel", valueType: "select",
      formFieldProps: {
        class: css({ width: 110 }),
        options: [
          { value: "province", label: "province" },
          { value: "city", label: "city" },
          { value: "district", label: "district" },
        ],
      },
    },
    { title: "fitView", dataIndex: "fitView", valueType: "switch" },
  ];

  return () => {
    const a = area.value;

    return (
      <Map class={css({ height: 560 })} geoJsonPath="/amap_areas-v3" opts={{ center: [104.5, 34], zoom: 4 }}>
        <div class={barCls}>
          {a.province || a.city ? (
            <>
              <span class={linkCls} onClick={() => nav("country")}>全国</span>
              {a.province && (
                <>
                  <span class={sepCls}>/</span>
                  {a.city ? (
                    <span class={linkCls} onClick={() => nav("province")}>{a.province.name}</span>
                  ) : (
                    <span class={curCls}>{a.province.name}</span>
                  )}
                </>
              )}
              {a.city && (
                <>
                  <span class={sepCls}>/</span>
                  <span class={curCls}>{a.city.name}</span>
                </>
              )}
            </>
          ) : (
            <span class={curCls}>全国</span>
          )}
        </div>

        <div class={formWrapCls}>
          <pro-search-form model={formState} columns={formColumns} />
        </div>

        <DistrictLayer
          provinceCode={provinceCode.value}
          cityCode={cityCode.value}
          maxLevel={formState.maxLevel as "province" | "city" | "district"}
          fitView={formState.fitView}
          fitViewOpts={{ immediately: false, avoid: [60, 60, 60, 60] }}
          fill={fill}
          hoverColor={HOVER_COLOR}
          styles={{ strokeColor: "#fff", strokeWeight: 1, strokeOpacity: 0.9, fillOpacity: 0.85 }}
          onArea={onArea}
          onClick={onClick}
          onHover={onHover}
        />
      </Map>
    );
  };
});