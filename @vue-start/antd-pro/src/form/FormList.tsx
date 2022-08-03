import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { provideProFormList, useProForm, useProFormList } from "./ctx";
import { ButtonProps, FormItem, FormItemProps, Button } from "ant-design-vue";
import { get, isArray, keys, map, omit, set, size } from "lodash";
import { convertPathToList } from "../util";

const FormListProvider = defineComponent({
  props: { pathList: { type: Array } },
  setup: (props, { slots }) => {
    provideProFormList({ pathList: props.pathList as any });
    return () => {
      return slots.default?.();
    };
  },
});

const proFormListProps = () => ({
  addButtonText: { type: String, default: "添加一项" },
  addButtonProps: { type: Object as PropType<ButtonProps> },
  //每行默认id
  rowKey: { type: String, default: "id" },
});

export type ProFormListProps = Partial<ExtractPropTypes<ReturnType<typeof proFormListProps>>> & FormItemProps;

export const FormList = defineComponent<ProFormListProps>({
  name: "PFormList",
  props: {
    ...FormItem.props,
    ...proFormListProps(),
  },
  setup: (props, { slots }) => {
    const { formState, readonly } = useProForm();

    const formListCtx = useProFormList();

    const nameList = convertPathToList(props.name);
    const path = formListCtx?.pathList ? [...formListCtx.pathList, ...nameList!] : nameList!;

    const handleAdd = () => {
      let targetList = get(formState, path);
      if (!isArray(targetList)) {
        targetList = [];
      }
      targetList.push({
        [props.rowKey!]: new Date().valueOf(),
      });
      set(formState, path, targetList);
    };

    const handleRemove = (index: number) => {
      const targetList = get(formState, path);
      if (size(targetList) <= 0) {
        return;
      }
      targetList.splice(index, 1);
    };

    const invalidKeys = keys(proFormListProps());

    return () => {
      return (
        <FormItem {...omit(props, invalidKeys)}>
          {map(get(formState, path), (item, index: number) => (
            <FormListProvider pathList={[...path, index]}>
              <div class={"pro-form-list-item"}>
                {slots.default?.()}
                {!readonly.value && (
                  <div class={"pro-form-list-item-minus"} onClick={() => handleRemove(index)}>
                    {slots.minus ? slots.minus() : <Button type={"link"}>删除</Button>}
                  </div>
                )}
              </div>
            </FormListProvider>
          ))}
          {!readonly.value && (
            <div class={"pro-form-list-item-add"} onClick={handleAdd}>
              {slots.add ? (
                slots.add()
              ) : (
                <Button type={"primary"} {...props.addButtonProps}>
                  {props.addButtonText}
                </Button>
              )}
            </div>
          )}
        </FormItem>
      );
    };
  },
});
