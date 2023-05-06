import { computed, defineComponent, reactive } from "vue";
import { Map, DistrictLayerProvince } from "@vue-start/map";
import { css } from "@emotion/css";
import { listToOptions, useUpdateKey } from "@vue-start/hooks";
import { useFetch } from "@vue-start/request";
import { getProvince } from "@/clients/map-data";

export default defineComponent(() => {
  const state = reactive({
    adCode: 130000,
    depth: "1",
  });

  const [layerKey, updateLayerKey] = useUpdateKey();

  const { data } = useFetch(getProvince, { initEmit: true });

  const columns = computed(() => {
    return [
      {
        title: "省份",
        dataIndex: "adCode",
        valueType: "select",
        formFieldProps: {
          clearable: false,
          options: listToOptions(data.list, { value: "adcode", label: "name" }),
        },
      },
      {
        title: "层级",
        dataIndex: "depth",
        valueType: "select",
        formFieldProps: {
          clearable: false,
          options: [
            { value: "0", label: "省级" },
            { value: "1", label: "市级" },
            { value: "2", label: "区/县级" },
          ],
        },
      },
    ];
  });

  const handleSubmit = () => {
    updateLayerKey();
  };

  // 颜色辅助方法
  const colors: Record<string, string> = {};
  const getColorByAdcode = (adcode: string) => {
    if (!colors[adcode]) {
      const gb = Math.random() * 155 + 50;
      colors[adcode] = "rgb(" + gb + "," + gb + ",255)";
    }
    return colors[adcode];
  };

  const styles = {
    fill: (properties: any) => {
      // properties为可用于做样式映射的字段，包含
      // NAME_CHN:中文名称
      // adcode_pro
      // adcode_cit
      // adcode
      var adcode = properties.adcode;
      return getColorByAdcode(adcode);
    },
    "province-stroke": "cornflowerblue",
    "city-stroke": "white", // 中国地级市边界
    "county-stroke": "rgba(255,255,255,0.5)", // 中国区县边界
  };

  return () => {
    return (
      <Map
        class={css({ height: 500 })}
        opts={{
          zoom: 6,
          pitch: 0,
          viewMode: "3D",
        }}>
        <div class={css({ position: "absolute" })}>
          <pro-search-form model={state} columns={columns.value} onFinish={handleSubmit} />
        </div>

        <DistrictLayerProvince
          key={layerKey.value}
          opts={{
            zIndex: 12,
            adcode: [state.adCode],
            depth: state.depth,
            styles,
          }}
        />
      </Map>
    );
  };
});
