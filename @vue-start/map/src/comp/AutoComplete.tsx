import { defineComponent, PropType, ref } from "vue";
import { debounce, filter, isNumber, map } from "lodash";

import { ApiNames, useMapApi } from "../api";

const autocompleteProps = {
  opts: { type: Object as PropType<Record<string, any>>, default: () => ({ city: "全国" }) },
  debounceTime: { type: Number, default: 500 },
  //结果转换
  convertResult: { type: Function as PropType<(tip: any) => any>, default: null },
  //渲染组件
  renderComp: { type: Function },
};

export const MapAutoComplete = defineComponent({
  props: autocompleteProps,
  emits: ["select"],
  setup: (props, { emit, slots }) => {
    const valueRef = ref<string>("");

    let callback: (results: any[]) => void;

    const { request } = useMapApi(ApiNames.AutoComplete_search, {
      onSuccess: (result) => {
        const tips: any[] = filter(
          result?.tips || [],
          (item) => item.location && isNumber(item.location.lng) && isNumber(item.location.lat),
        );
        const list = props.convertResult
          ? props.convertResult(tips)
          : map(tips, (item) => ({ ...item, value: item.name }));
        callback?.(list);
      },
    });

    const query = debounce((queryString: string, cb: (results: any[]) => void) => {
      callback = cb;
      const q = (queryString || "").trim();
      if (!q) {
        cb([]);
        return;
      }
      // 使用封装好的 useMapApi 调用 AMap.AutoComplete_search
      request({ ...props.opts }, [q]);
    }, props.debounceTime);

    const onSelect = (item: any) => {
      emit("select", item);
    };

    return () => {
      if (props.renderComp) {
        return props.renderComp({ query, onSelect, valueRef });
      }
      return slots.default?.({ query, onSelect, valueRef });
    };
  },
});
