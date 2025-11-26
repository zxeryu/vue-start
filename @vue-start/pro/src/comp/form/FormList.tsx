import { defineComponent, ExtractPropTypes, inject, PropType, provide, VNode } from "vue";
import { filter, get, isArray, keys, map, omit, set, size } from "lodash";
import { useProForm } from "./Form";
import { convertPathToList } from "../../util";
import { ElementKeys, useGetCompByKey } from "../comp";
import { TColumn, TColumns } from "../../types";
import { ProGrid, ProGridProps } from "../Grid";
import { getColumnFormItemName, renderInputColumn } from "../../core";
import { useUpdateKey } from "@vue-start/hooks";

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

type TOriginFn = () => void;

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
  //方法
  onPreAdd: { type: Function as PropType<() => boolean | undefined> }, //新增方法执行前判断
  onAdd: { type: Function as PropType<(fn: TOriginFn) => void> }, //新增回调
  onPreRemove: { type: Function as PropType<(opts: any) => boolean | undefined> }, //删除方法执行前判断
  onRemove: { type: Function as PropType<(fn: TOriginFn, opts: any) => void> }, //删除回调
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

    const { formState, readonly, elementMap, formElementMap } = useProForm();

    const formListCtx = useProFormList();

    const nameList = convertPathToList(props.name);
    const path = formListCtx?.pathList ? [...formListCtx.pathList, ...nameList!] : nameList!;

    const [key, updateKey] = useUpdateKey();

    const handleAdd = () => {
      const preFlag = props.onPreAdd?.();
      if (preFlag === true) return;

      const fn = () => {
        let targetList = get(formState, path);
        if (!isArray(targetList)) {
          targetList = [];
        }
        targetList.push({
          [props.rowKey!]: new Date().valueOf(),
        });
        set(formState, path, targetList);
      };
      if (props.onAdd) {
        props.onAdd(fn);
        return;
      }
      fn();
    };

    const handleRemove = (index: number, item: any) => {
      const preFlag = props.onPreRemove?.({ index, item });
      if (preFlag === true) return;

      const fn = () => {
        const targetList = get(formState, path);
        if (size(targetList) <= 0) {
          return;
        }
        targetList.splice(index, 1);
        updateKey();
      };
      if (props.onRemove) {
        props.onRemove(fn, { index, item });
        return;
      }
      fn();
    };

    /************************************** render ******************************************/

    const renderItem = (item: TColumn, pathList: (string | number)[]) => {
      const rowKey = getColumnFormItemName(item);
      //插槽优先
      if (rowKey && slots[rowKey]) {
        return slots[rowKey]!({ item, formState, pathList });
      }
      return renderInputColumn(elementMap, formElementMap, item)!;
    };

    const renderItems = (pathList: (string | number)[], record: any) => {
      if (!formElementMap || size(props.columns) <= 0) {
        return null;
      }
      if (!props.row) {
        return map(props.columns, (item) => renderItem(item, pathList));
      }

      const items = map(props.columns, (item) => ({
        rowKey: getColumnFormItemName(item),
        vNode: renderItem(item, pathList) as any,
        col: get(item, ["extra", "col"]),
      }));

      return <ProGrid row={props.row} col={props.col} items={items} />;
    };

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
          {map(get(formState, path), (item, index: number) => {
            const pathList = [...path, index];
            return (
              <FormListProvider key={item[props.rowKey!] + key.value} pathList={pathList}>
                <div class={"pro-form-list-item"}>
                  {slots.start?.({ state: formState, path, index })}

                  {renderItems(pathList, item)}

                  {slots.default?.({ state: formState, path, index })}
                  {!readonly.value && (
                    <>
                      <div class={"pro-form-list-item-add"} onClick={handleAdd}>
                        {slots.itemAdd?.() || props.renderItemAdd?.()}
                      </div>
                      <div class={"pro-form-list-item-minus"} onClick={() => handleRemove(index, item)}>
                        {slots.itemMinus?.() || props.renderItemMinus?.()}
                      </div>
                    </>
                  )}
                </div>
              </FormListProvider>
            );
          })}
          {!readonly.value && (
            <div class={"pro-form-list-add"} onClick={handleAdd}>
              {slots.add?.() || props.renderAdd?.()}
            </div>
          )}
          {slots.end?.()}
        </FormItem>
      );
    };
  },
});
