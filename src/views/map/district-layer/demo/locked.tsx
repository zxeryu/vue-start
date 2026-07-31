/*---
title: 范围锁定
desc: provinceCode / cityCode 锁定根层级，maxLevel 限定终止层
---*/
import { computed, defineComponent, ref } from "vue";
import { Map, DistrictLayer } from "@vue-start/map";
import { css } from "@emotion/css";

const presets = [
  { value: "country", label: "全国", provinceCode: undefined, cityCode: undefined, maxLevel: "district" as const },
  { value: "shanxi", label: "山西省-市终止", provinceCode: 140000, cityCode: undefined, maxLevel: "city" as const },
  { value: "taiyuan", label: "太原市-区终止", provinceCode: undefined, cityCode: 140100, maxLevel: "district" as const },
];

const hash = (n: number) => {
  let x = n | 0;
  x = ((x >> 16) ^ x) * 0x45d9f3b;
  x = ((x >> 16) ^ x) * 0x45d9f3b;
  x = (x >> 16) ^ x;
  return (Math.abs(x) % 1000) / 1000;
};
const tealRamp = (t: number) => `hsl(174, 62%, ${80 - t * 36}%)`;

export default defineComponent(() => {
  const preset = ref("shanxi");

  const current = computed(() => presets.find((p) => p.value === preset.value)!);

  const fill = (f: any) => tealRamp(hash(Number(f.properties?.adcode) || 0));

  return () => {
    const p = current.value;
    return (
      <Map class={css({ height: 400 })} geoJsonPath="/amap_areas-v3">
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
          <pro-radio v-model={preset.value} options={presets} optionType={"button"} />
        </div>
        <DistrictLayer {...({ disabled: true } as any)}
          provinceCode={p.provinceCode}
          cityCode={p.cityCode}
          maxLevel={p.maxLevel}
          fill={fill}
          hoverColor="#ff7a45"
          styles={{ strokeColor: "#fff", strokeWeight: 1, strokeOpacity: 0.9, fillOpacity: 0.85 }}
          onArea={(v: any) => console.log("[district:locked] area:", v)}
          onClick={(v: any) => console.log("[district:locked] click:", v)}
          onHover={(v: any) => console.log("[district:locked] hover:", v)}
        />
      </Map>
    );
  };
});