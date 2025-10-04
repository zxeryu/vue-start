import { computed, defineComponent, ExtractPropTypes, PropType, VNode } from "vue";
import { ElementKeys, useGetCompByKey } from "../comp";
import { filter, get, isObject, map, omit, reduce, some, every, forEach, has } from "lodash";
import { TTableColumn, useProTable } from "./Table";
import { useEffect, useUpdateKey, useWatch } from "@vue-start/hooks";
import { getSignValue as getSignValueOrigin } from "../../util";

const proColumnSetting = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-table-toolbar-column" },
  signName: { type: String, default: "columnSetting" },
  popoverProps: Object,
  //使用保留状态。columns在操作过程中改变的话可能会出现该情况
  useSelectedStatus: { type: Boolean, default: true },
  //select改变监听
  onColumnSelectChange: { type: Function as PropType<(selectIds: Array<string | number>) => void> },
  //render dom
  renderDom: { type: Function as PropType<() => VNode>, default: () => "列设置" },
  // all title
  allTitle: { type: String, default: "列展示" },
  // reset title
  resetTitle: { type: String, default: "重置" },
});

export type ProColumnSettingProps = Partial<ExtractPropTypes<ReturnType<typeof proColumnSetting>>>;

export const ColumnSetting = defineComponent<ProColumnSettingProps>({
  props: {
    ...proColumnSetting(),
  } as any,
  setup: (props, { slots }) => {
    const getComp = useGetCompByKey();
    const Popover = getComp(ElementKeys.PopoverKey);
    const Checkbox = getComp(ElementKeys.CheckboxKey);

    const { originColumns, selectIdsRef } = useProTable();

    const [listKey, updateListKey] = useUpdateKey();

    // 当前操作过的的状态
    // 当originColumns改变的时，重新赋值的时候使用保留状态
    let selectedMap: Record<string, boolean> = {};
    const setSelectedItemFalse = (item: string | number) => {
      selectedMap[item] = false;
    };
    const setSelectedMapValue = () => {
      forEach(selectIdsRef.value, (item) => {
        selectedMap[item] = true;
      });
    };

    const selectIdMap = computed(() => {
      return reduce(selectIdsRef.value, (pair, item) => ({ ...pair, [item]: true }), {});
    });

    const getSignValue = (item: TTableColumn) => {
      return getSignValueOrigin(item, props.signName!);
    };

    //originColumns 发生改变
    useEffect(() => {
      selectIdsRef.value = map(
        filter(originColumns.value, (item) => {
          if (props.useSelectedStatus && has(selectedMap, item.dataIndex!)) {
            return selectedMap[item.dataIndex!];
          }
          return getSignValue(item)?.initShow !== false;
        }),
        (item) => item.dataIndex!,
      );
    }, originColumns);

    useWatch(() => {
      updateListKey();
      setSelectedMapValue();
      // @ts-ignore
      props.onColumnSelectChange?.(selectIdsRef.value);
    }, selectIdsRef);

    const allValue = computed(() => {
      const allSelect = every(originColumns.value, (item) => {
        if (getSignValue(item)?.disabled) return true;
        return get(selectIdMap.value, item.dataIndex!);
      });
      const hasSelect = some(originColumns.value, (item) => {
        if (getSignValue(item)?.disabled) return true;
        return get(selectIdMap.value, item.dataIndex!);
      });
      return { checked: allSelect, indeterminate: allSelect ? false : hasSelect };
    });

    const handleAllChecked = (e: boolean | { target: { checked: boolean } }) => {
      const v = isObject(e) ? e.target?.checked : e;
      if (v) {
        selectIdsRef.value = map(originColumns.value, (c) => c.dataIndex!);
      } else {
        selectIdsRef.value = map(
          filter(originColumns.value, (item) => {
            if (getSignValue(item)?.disabled) {
              return true;
            }
            setSelectedItemFalse(item.dataIndex!);
            return false;
          }),
          (c) => c.dataIndex!,
        );
      }
    };

    const handleReset = () => {
      selectIdsRef.value = map(
        filter(originColumns.value, (item) => {
          if (getSignValue(item)?.initShow === false) {
            setSelectedItemFalse(item.dataIndex!);
            return false;
          }
          return true;
        }),
        (item) => item.dataIndex!,
      );
    };

    const handleChecked = (item: TTableColumn, e: boolean | { target: { checked: boolean } }) => {
      const v = isObject(e) ? e.target?.checked : e;
      if (v) {
        selectIdsRef.value = [...selectIdsRef.value, item.dataIndex!];
      } else {
        selectIdsRef.value = filter(selectIdsRef.value, (i) => {
          if (item.dataIndex === i) {
            setSelectedItemFalse(item.dataIndex!);
            return false;
          }
          return true;
        });
      }
    };

    return () => {
      if (!Popover) {
        return null;
      }
      return (
        <Popover
          trigger={"click"}
          {...props.popoverProps}
          v-slots={{
            content: () => (
              <div class={`${props.clsName}`}>
                <div class={`${props.clsName}-header`}>
                  <Checkbox
                    key={listKey.value}
                    checked={allValue.value.checked}
                    indeterminate={allValue.value.indeterminate}
                    onChange={handleAllChecked}>
                    {props.allTitle}
                  </Checkbox>
                  <a onClick={handleReset}>{props.resetTitle}</a>
                </div>
                <div key={listKey.value} class={`${props.clsName}-list`}>
                  {map(originColumns.value, (item) => {
                    const sign = getSignValue(item);
                    const checked = get(selectIdMap.value, item.dataIndex!, false);
                    return (
                      <Checkbox
                        checked={checked}
                        disabled={sign?.disabled}
                        onChange={(e: boolean | { target: { checked: boolean } }) => {
                          handleChecked(item, e);
                        }}>
                        {item.title}
                      </Checkbox>
                    );
                  })}
                </div>
              </div>
            ),
            ...omit(slots, "default"),
          }}>
          {slots.default?.() || props.renderDom?.()}
        </Popover>
      );
    };
  },
});
