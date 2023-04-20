import { computed, defineComponent } from "vue";
import { ElementKeys, useGetCompByKey } from "./comp";
import { jsonToStr, strToJson } from "@vue-start/hooks";
import { get, isArray, map, omit, size } from "lodash";

export type TFile = { id: string; name: string; size?: number };

export const ProUploaderText = defineComponent<Record<string, any>>({
  props: {
    fieldNames: { type: Object, default: { id: "id", name: "name", size: "size" } },
  } as any,
  setup: (props, { slots, emit }) => {
    const getComp = useGetCompByKey();
    const Uploader = getComp(ElementKeys.UploaderKey);

    const convertValue = (value: string) => {
      const list = strToJson(value);
      if (isArray(list)) {
        const fieldNames = props.fieldNames;
        return map(list, (item) => {
          return {
            ...omit(item, fieldNames.id, fieldNames.name, fieldNames.size!),
            id: get(item, fieldNames.id),
            name: get(item, fieldNames.name),
            size: get(item, fieldNames.size!),
          };
        });
      }
      return [];
    };

    const v = computed(() => convertValue(props.value));
    const mv = computed(() => convertValue(props.modelValue));

    const handleChange = (v: TFile[], updateText: string) => {
      let str = "";
      if (v && size(v) > 0) {
        str = jsonToStr(
          map(v, (item) => {
            const fieldNames = props.fieldNames;
            return { [fieldNames.id]: item.id, [fieldNames.name]: item.name, [fieldNames.size || "size"]: item.size };
          }),
        );
      }
      emit(updateText, str);
    };

    return () => {
      if (!Uploader) return null;
      return (
        <Uploader
          value={v.value}
          onUpdate:value={(v: TFile[]) => handleChange(v, "update:value")}
          modelValue={mv.value}
          onUpdate:modelValue={(v: TFile[]) => handleChange(v, "update:modelValue")}
          {...omit(props, "value", "modelValue", "fieldNames")}
          v-slots={slots}
        />
      );
    };
  },
});

export const UploadList = defineComponent({
  props: {},
  setup: () => {
    return () => {
      return <div></div>;
    };
  },
});
