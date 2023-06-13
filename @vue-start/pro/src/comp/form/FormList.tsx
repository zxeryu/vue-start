import { computed, defineComponent, ExtractPropTypes, inject, PropType, provide, VNode } from "vue";
import { get, isArray, keys, map, omit, set, size } from "lodash";
import { useProForm } from "./Form";
import { convertPathToList } from "../../util";
import { ElementKeys, useGetCompByKey } from "../comp";
import { TColumn, TColumns } from "../../types";
import { ProGrid, ProGridProps } from "../Grid";
import { getColumnFormItemName, getFormItemEl } from "../../core";

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
  //
  columns: { type: Array as PropType<TColumns> },
  //布局
  inline: { type: Boolean as PropType<boolean>, default: true },
  //拓展
  renderAdd: { type: Function as PropType<() => VNode> },
  renderItemAdd: { type: Function as PropType<() => VNode> },
  renderItemMinus: { type: Function as PropType<() => VNode> },
});

export type ProFormListProps = Partial<ExtractPropTypes<ReturnType<typeof proFormListProps>>> &
  Omit<ProGridProps, "items">;

export const ProFormList = defineComponent<ProFormListProps>({
  props: {
    ...proFormListProps(),
    ...omit(ProGrid.props, "items"),
  } as any,
  setup: (props, { slots }) => {
    const getComp = useGetCompByKey();
    const FormItem = getComp(ElementKeys.FormItemKey);

    const { formState, readonly, formElementMap } = useProForm();

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

    /************************************** render ******************************************/

    const renderItem = (item: TColumn) => {
      const rowKey = getColumnFormItemName(item);
      //插槽优先
      if (rowKey && slots[rowKey]) {
        return slots[rowKey]!(item, formState);
      }
      return getFormItemEl(formElementMap, item)!;
    };

    const items = computed(() => {
      if (!props.row) {
        return map(props.columns, (item) => renderItem(item));
      }
      return map(props.columns, (item) => ({
        rowKey: getColumnFormItemName(item),
        vNode: renderItem(item) as any,
        col: get(item, ["extra", "col"]),
      }));
    });

    const invalidKeys = keys(proFormListProps());

    return () => {
      if (!FormItem) {
        return null;
      }
      return (
        <FormItem
          class={`pro-form-list ${props.inline ? "pro-form-list-inline" : ""}`}
          name={props.name}
          {...omit(props, invalidKeys)}>
          {map(get(formState, path), (item, index: number) => (
            <FormListProvider key={item[props.rowKey!] || index} pathList={[...path, index]}>
              <div class={"pro-form-list-item"}>
                {slots.start?.({ state: formState, path, index })}

                {formElementMap && size(props.columns) > 0 && (
                  <>
                    {props.row ? <ProGrid row={props.row} col={props.col} items={items.value as any} /> : items.value}
                  </>
                )}

                {slots.default?.()}
                {!readonly.value && (
                  <>
                    <div class={"pro-form-list-item-add"} onClick={handleAdd}>
                      {slots.itemAdd?.() || props.renderItemAdd?.()}
                    </div>
                    <div class={"pro-form-list-item-minus"} onClick={() => handleRemove(index)}>
                      {slots.itemMinus?.() || props.renderItemMinus?.()}
                    </div>
                  </>
                )}
              </div>
            </FormListProvider>
          ))}
          {!readonly.value && (
            <div class={"pro-form-list-add"} onClick={handleAdd}>
              {slots.add?.() || props.renderAdd?.()}
            </div>
          )}
        </FormItem>
      );
    };
  },
});
