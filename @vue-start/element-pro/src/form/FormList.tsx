import { defineComponent, ExtractPropTypes, PropType } from "vue";
import { provideProFormList, useProForm, useProFormList } from "./ctx";
import { ButtonProps, ElButton } from "element-plus";
import { get, isArray, keys, map, omit, set, size } from "lodash";
import { convertPathToList } from "../util";
import { ProFormItem, ProFormItemProps } from "./Form";

const FormListProvider = defineComponent<{
  pathList: (string | number)[];
}>({
  props: { pathList: { type: Array } } as any,
  setup: (props, { slots }) => {
    provideProFormList({ pathList: props.pathList });
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

export type ProFormListProps = Partial<ExtractPropTypes<ReturnType<typeof proFormListProps>>> & ProFormItemProps;

export const ProFormList = defineComponent<ProFormListProps>({
  name: "PFormList",
  props: {
    ...ProFormItem.props,
    ...proFormListProps(),
  },
  setup: (props, { slots }) => {
    const { formState, readonly } = useProForm();

    const formListCtx = useProFormList();

    const nameList = convertPathToList(props.prop);
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
        <ProFormItem {...(omit(props, invalidKeys) as any)}>
          {map(get(formState, path), (item, index: number) => (
            <FormListProvider key={index} pathList={[...path, index]}>
              <div class={"pro-form-list-item"}>
                {slots.default?.()}
                {!readonly.value && (
                  <div class={"pro-form-list-item-minus"} onClick={() => handleRemove(index)}>
                    {slots.minus ? slots.minus() : <ElButton link>删除</ElButton>}
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
                <ElButton type={"primary"} {...props.addButtonProps}>
                  {props.addButtonText}
                </ElButton>
              )}
            </div>
          )}
        </ProFormItem>
      );
    };
  },
});
