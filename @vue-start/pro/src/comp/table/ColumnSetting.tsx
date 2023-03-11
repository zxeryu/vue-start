import { computed, defineComponent, ExtractPropTypes } from "vue";
import { ElementKeys, useGetCompByKey } from "../comp";
import { filter, get, isObject, map, omit, reduce, some, every } from "lodash";
import { TTableColumn, useProTable } from "./Table";
import { useUpdateKey, useWatch } from "@vue-start/hooks";
import { getSignValue as getSignValueOrigin } from "../../util";

const proColumnSetting = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-table-toolbar-column" },
  signName: { type: String, default: "columnSetting" },
  popoverProps: Object,
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

    const { originColumns, state: tableState } = useProTable();

    const [listKey, updateListKey] = useUpdateKey();

    useWatch(
      () => {
        updateListKey();
      },
      () => tableState.selectIds,
    );

    const selectIdMap = computed(() => {
      return reduce(tableState.selectIds, (pair, item) => ({ ...pair, [item]: true }), {});
    });

    const getSignValue = (item: TTableColumn) => {
      return getSignValueOrigin(item, props.signName!);
    };

    const allValue = computed(() => {
      const allSelect = every(originColumns.value, (item) => {
        const sign = getSignValue(item);
        if (sign?.disabled) {
          return true;
        }
        return get(selectIdMap.value, item.dataIndex!);
      });
      const hasSelect = some(originColumns.value, (item) => {
        const sign = getSignValue(item);
        if (sign?.disabled) {
          return true;
        }
        return get(selectIdMap.value, item.dataIndex!);
      });
      return {
        checked: allSelect,
        indeterminate: allSelect ? false : hasSelect,
      };
    });

    const handleAllChecked = (e: boolean | { target: { checked: boolean } }) => {
      const v = isObject(e) ? e.target?.checked : e;
      if (v) {
        tableState.selectIds = map(originColumns.value, (c) => c.dataIndex!);
      } else {
        tableState.selectIds = map(
          filter(originColumns.value, (item) => {
            if (getSignValue(item)?.disabled) {
              return true;
            }
            return false;
          }),
          (c) => c.dataIndex!,
        );
      }
    };

    const handleReset = () => {
      tableState.selectIds = map(
        filter(originColumns.value, (item) => {
          if (getSignValue(item)?.initShow === false) {
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
        tableState.selectIds = [...tableState.selectIds, item.dataIndex!];
      } else {
        tableState.selectIds = filter(tableState.selectIds, (i) => {
          if (item.dataIndex === i) {
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
                    checked={allValue.value.checked}
                    indeterminate={allValue.value.indeterminate}
                    onChange={handleAllChecked}>
                    列展示
                  </Checkbox>
                  <a onClick={handleReset}>重置</a>
                </div>
                <div key={listKey.value} class={`${props.clsName}-list`}>
                  {map(originColumns.value, (item) => {
                    const sign = getSignValue(item);
                    return (
                      <Checkbox
                        checked={get(selectIdMap.value, item.dataIndex!, false)}
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
          {slots.default?.() || "列设置"}
        </Popover>
      );
    };
  },
});
