import { defineComponent, PropType, ref, VNode } from "vue";
import { ISetPropGroup, ISetPropItem } from "../types";
import { useCheng } from "../ctx";
import { get, isArray, map, set, size } from "lodash";
import { useEffect, useUpdateKey } from "@vue-start/hooks";
import { ElementKeys, useGetCompByKey } from "@vue-start/pro";
import { ChengModal } from "../base";
import { JsonSetDom } from "./json";

/**
 * 单属性设置
 */
export const ItemSet = defineComponent({
  props: {
    item: { type: Object as PropType<ISetPropGroup | ISetPropItem> },
    path: { type: Array as PropType<(string | number)[]>, default: [] },
  },
  setup: (props) => {
    const { elementRef } = useCheng();

    const visibleRef = ref(false);

    const path = [...props.path, props.item!.name];

    const setValue = (v: any) => {
      set(elementRef.value!.elementProps!, path, v);
    };

    //初始化，如果 array、object类型未赋值 []、{}
    useEffect(() => {
      const groupItem = props.item! as ISetPropGroup;

      if (!groupItem.groupType) return;

      const target = get(elementRef.value!.elementProps, path);
      if (groupItem.groupType === "array") {
        if (!isArray(target)) {
          setValue([]);
        }
      } else if (groupItem.groupType === "object") {
        if (!target) {
          setValue({});
        }
      }
    }, []);

    const handleOpen = () => {
      visibleRef.value = true;
    };

    const handleClose = () => {
      visibleRef.value = false;
    };

    const handleAddItem = () => {
      const target = get(elementRef.value!.elementProps, path);
      if (isArray(target)) {
        target.push({});
      }
    };

    const [arrKey, updateArrKey] = useUpdateKey();

    const handleRemoveItem = (index: number) => {
      const target = get(elementRef.value!.elementProps, path);
      if (!isArray(target) || size(target) <= 0) {
        return;
      }
      target.splice(index, 1);
      updateArrKey();
    };

    const handleJsonSuccess = (target: any) => {
      setValue(target);
    };

    const handleClear = () => {
      setValue(undefined);
    };

    /**************************** dom *****************************/

    const renderItem = (name: string, node: VNode) => {
      return (
        <div class={"set-item"}>
          <div class={"title"}>{name}</div>
          <div class={"element"}>{node}</div>
        </div>
      );
    };

    const getComp = useGetCompByKey();
    const Button = getComp(ElementKeys.ButtonKey);

    const Input = getComp("Input$");
    const Switch = getComp("Switch$");
    const Select = getComp("Select$");
    const InputNumber = getComp("InputNumber$");

    return () => {
      const modelValue = get(elementRef.value!.elementProps, path);

      const groupItem = props.item! as ISetPropGroup;
      if (groupItem.groupType === "array") {
        return renderItem(
          `${groupItem.name}（数组）`,
          <>
            <Button type={"primary"} link onClick={handleOpen}>
              设置
            </Button>
            <ChengModal
              visible={visibleRef.value}
              title={groupItem.name}
              onCancel={handleClose}
              v-slots={{
                actions: () => (
                  <>
                    <Button type={"primary"} onClick={handleAddItem}>
                      添加一项
                    </Button>
                    <JsonSetDom target={modelValue} onSuccess={handleJsonSuccess} />
                  </>
                ),
              }}>
              <div class={"set-arr"} key={arrKey.value}>
                {map(modelValue, (_, index) => {
                  return (
                    <div class={"set-arr-item"}>
                      {map(groupItem.setProps, (item) => (
                        <ItemSet item={item} path={[...path, index]} />
                      ))}
                      <Button type={"danger"} link onClick={() => handleRemoveItem(index as any)}>
                        删除
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ChengModal>
          </>,
        );
      } else if (groupItem.groupType === "object") {
        return renderItem(
          `${groupItem.name}（对象）`,
          <>
            <Button type={"primary"} link onClick={handleOpen}>
              设置
            </Button>
            <ChengModal
              visible={visibleRef.value}
              title={groupItem.name}
              onCancel={handleClose}
              v-slots={{
                actions: () => <JsonSetDom target={modelValue} onSuccess={handleJsonSuccess} />,
              }}>
              <div class={"set-obj"}>
                {map(groupItem.setProps, (item) => (
                  <ItemSet item={item} path={path} />
                ))}
              </div>
            </ChengModal>
          </>,
        );
      }

      const item = props.item! as ISetPropItem;

      const opts = { modelValue, "onUpdate:modelValue": setValue, ...item.inputProps };

      if (item.elementType === "select") {
        const options = map(item.options, (i) => ({ value: i, label: i }));
        return renderItem(item.name, <Select filterable {...opts} options={options} clearable />);
      } else if (item.elementType === "switch") {
        return renderItem(
          item.name,
          <>
            <Switch {...opts} />
            {typeof modelValue === "boolean" && (
              <Button type={"primary"} link onClick={handleClear}>
                清除
              </Button>
            )}
          </>,
        );
      } else if (item.elementType === "digit") {
        return renderItem(item.name, <InputNumber {...opts} />);
      }

      return renderItem(item.name, <Input {...opts} />);
    };
  },
});
