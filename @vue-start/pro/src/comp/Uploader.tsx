import { computed, defineComponent } from "vue";
import { ElementKeys, useGetCompByKey } from "./comp";
import { jsonToStr, strToJson } from "@vue-start/hooks";
import { filter, get, isArray, isObject, isString, map, omit, size } from "lodash";

export type TFile = { id: string; name: string; size?: number };

export const ProUploaderText = defineComponent<Record<string, any>>({
  props: {
    fieldNames: { type: Object, default: { id: "id", name: "name", size: "size" } },
    convertItem: { type: Function },
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
            const nextItem = {
              [fieldNames.id]: item.id,
              [fieldNames.name]: item.name,
              [fieldNames.size || "size"]: item.size,
            };
            return props.convertItem?.(item) || nextItem;
          }),
        );
      }
      emit(updateText, str);
    };

    return () => {
      if (!Uploader) return null;
      return (
        <Uploader
          class={"pro-uploader-text"}
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

/**
 * 文件列表
 */
export const ProUploadList = defineComponent({
  props: {
    value: [String, Array],
    fieldNames: { type: Object, default: { id: "id", name: "name", size: "size" } },
  },
  setup: (props, { slots, emit }) => {
    const isValidItem = (item: Record<string, any>): boolean => {
      return !!get(item, props.fieldNames?.id || "id");
    };

    const fileList = computed(() => {
      let value = props.value;
      //字符串转换
      if (value && isString(value)) {
        value = strToJson(value);
      }
      //单个对象转换
      if (value && !isArray(value) && isObject(value) && isValidItem(value)) {
        value = [value];
      }
      if (isArray(value)) {
        return map(
          filter(value, (item) => isValidItem(item)),
          (item) => {
            const id = get(item, props.fieldNames?.id || "id");
            const name = get(item, props.fieldNames?.name || "name");
            const size = get(item, props.fieldNames?.name || "size");
            return { ...item, id, size, name: name || id };
          },
        );
      }
      return [];
    });

    const handleTitleClick = (item: TFile) => {
      emit("titleClick", item);
    };

    return () => {
      return (
        <div class={"pro-upload-list"}>
          {slots.start?.()}
          {map(fileList.value, (item) => {
            return (
              <div class={"pro-upload-list-item"}>
                <span class={"pro-upload-list-item-title"} onClick={() => handleTitleClick(item)}>
                  {item.name}
                </span>
                {slots.extra?.(item)}
              </div>
            );
          })}
          {slots.default?.()}
        </div>
      );
    };
  },
});
