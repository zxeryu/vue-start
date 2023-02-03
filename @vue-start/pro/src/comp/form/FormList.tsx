import { defineComponent, ExtractPropTypes, inject, PropType, provide } from "vue";
import { get, isArray, map, omit, set, size } from "lodash";
import { useProForm } from "./Form";
import { convertPathToList } from "../../util";
import { FormItemKey, useGetCompByKey } from "../comp";

/**
 * ProFormList ctx
 */

const ProFormListKey = Symbol("pro-form-list");

interface IProFormListProvide {
  pathList: (string | number)[];
}

export const useProFormList = (): IProFormListProvide => inject(ProFormListKey) as IProFormListProvide;

export const provideProFormList = (ctx: IProFormListProvide) => {
  provide(ProFormListKey, ctx);
};

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
  //每行默认id
  rowKey: { type: String, default: "id" },
  //name
  name: { type: [String, Number, Array] as PropType<string | number | (string | number)[]>, required: true },
});

export type ProFormListProps = Partial<ExtractPropTypes<ReturnType<typeof proFormListProps>>>;

export const ProFormList = defineComponent<ProFormListProps>({
  props: {
    ...proFormListProps(),
  } as any,
  setup: (props, { slots }) => {
    const getComp = useGetCompByKey();
    const FormItem = getComp(FormItemKey);

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

    return () => {
      if (!FormItem) {
        return null;
      }
      return (
        <FormItem {...omit(props, "rowKey")}>
          {map(get(formState, path), (item, index: number) => (
            <FormListProvider key={item[props.rowKey!] || index} pathList={[...path, index]}>
              <div class={"pro-form-list-item"}>
                {slots.default?.()}
                {!readonly.value && (
                  <>
                    <div class={"pro-form-list-item-add"} onClick={handleAdd}>
                      {slots.itemAdd?.()}
                    </div>
                    <div class={"pro-form-list-item-minus"} onClick={() => handleRemove(index)}>
                      {slots.itemMinus?.()}
                    </div>
                  </>
                )}
              </div>
            </FormListProvider>
          ))}
          {!readonly.value && (
            <div class={"pro-form-list-add"} onClick={handleAdd}>
              {slots.add?.()}
            </div>
          )}
        </FormItem>
      );
    };
  },
});
