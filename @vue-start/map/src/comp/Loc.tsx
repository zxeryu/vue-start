import { defineComponent, computed, PropType, nextTick } from "vue";
import { useMapApi } from "../api/api";
import { ApiNames } from "../api/index";
import { MapEvents, useMap } from "../Map";
import { Marker } from "../overlay";
import { useEffect } from "@vue-start/hooks";
import { MapAutoComplete } from "./AutoComplete";

// 组件props定义
const locProps = {
  // 是否启用位置搜索功能
  enableAuto: { type: Boolean, default: true },
  autoProps: { type: Object, default: () => ({}) },
  // 逆地理编码配置
  geoOpts: { type: Object, default: () => ({}) },
  // 模型值，可以是位置坐标 [lng, lat] 或位置字符串
  modelValue: {
    type: [Array, String, Object] as PropType<[number, number] | null | undefined>,
    default: null,
  },
};

export const MapLoc = defineComponent({
  props: locProps,
  emits: ["update:modelValue", "address", "click", "select"],
  setup(props, { emit, expose }) {
    const { mapRef } = useMap();

    const mv = computed(() => {
      return props.modelValue;
    });

    useEffect(() => {
      if (!mv.value) return;

      mapRef.value.setCenter(mv.value);
    }, mv);

    // 逆地理编码API调用
    const { request } = useMapApi(ApiNames.Geocoder_getAddress, {
      onSuccess: (result) => {
        // const regeocode = result.regeocode;
        // const formattedAddress = regeocode.formattedAddress;
        // const location = regeocode.location;

        // const locationOption: LocationOption = {
        //   value: `${location.lng},${location.lat}`,
        //   label: formattedAddress,
        //   location: [location.lng, location.lat],
        //   address: formattedAddress,
        //   ...regeocode.addressComponent,
        // };
        // 回调
        emit("address", result);
      },
    });

    const geoReqCurrent = () => {
      nextTick(() => {
        if (!mv.value) return;
        request({ ...props.geoOpts }, [mv.value]);
      });
    };

    expose({ geoReqCurrent, geoReq: request });

    // 处理选择事件
    const handleSelect = (item: any) => {
      if (!item || !item.location) return;

      const { lng, lat } = item.location;
      emit("update:modelValue", [lng, lat]);
      emit("select", item);
    };

    const events = [
      //点击事件
      {
        type: "click",
        handler: (e: any) => {
          if (!e || !e.lnglat) return;

          const { lng, lat } = e.lnglat;
          emit("update:modelValue", [lng, lat]);
          emit("click", e);
        },
      },
    ];

    return () => {
      return (
        <>
          <MapEvents events={events as any} />

          {mv.value && <Marker opts$={{ position: mv.value }} />}

          {props.enableAuto && <MapAutoComplete {...props.autoProps} onSelect={handleSelect} />}
        </>
      );
    };
  },
});
