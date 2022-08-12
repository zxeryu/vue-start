import { computed, defineComponent, ExtractPropTypes, isVNode, PropType, VNode } from "vue";
import { ElTable, ElTableColumn, ElButton } from "element-plus";
import { TableProps } from "element-plus/es/components/table/src/table/defaults";
import { TableColumnCtx, TColumn, TColumns } from "../../types";
import { filter, get, isFunction, keys, map, merge, omit, size, sortBy } from "lodash";
import { getItemEl } from "@vue-start/pro";

export interface IOperateItem {
  value: string | number;
  label?: string | VNode;
  element?: (record: Record<string, any>, item: IOperateItem) => VNode;
  show?: boolean | ((record: Record<string, any>) => boolean);
  disabled?: boolean | ((record: Record<string, any>) => boolean);
  onClick?: (record: Record<string, any>) => void;
  sort?: number;
}

export interface ITableOperate {
  column?: TableColumnCtx<any>;
  items?: IOperateItem[];
  itemState?: { [key: string]: Omit<IOperateItem, "value"> };
}

const proTableProps = () => ({
  //操作栏
  operate: {
    type: Object as PropType<ITableOperate>,
  },
  //默认空字符串
  columnEmptyText: { type: String },
  /**
   * 公共column，会merge到columns item中
   */
  column: { type: Object as PropType<TableColumnCtx<any>> },
  //
  columns: { type: Array as PropType<TColumns> },
  /**
   * 展示控件集合，readonly模式下使用这些组件渲染
   */
  elementMap: { type: Object as PropType<{ [key: string]: any }> },
  /**
   * loading
   */
  loading: { type: Boolean, default: false },
});

export type ProTableProps = Partial<ExtractPropTypes<ReturnType<typeof proTableProps>>> &
  Omit<TableProps<any>, "tableLayout" | "flexible" | "data"> & {
    tableLayout?: "fixed" | "auto";
    flexible?: boolean;
    data?: any;
  };

export const ProTable = defineComponent<ProTableProps>({
  props: {
    ...ElTable.props,
    ...proTableProps(),
  },
  setup: (props, { slots, expose }) => {
    const columns = computed(() => {
      //根据valueType选择对应的展示组件
      const columns = map(props.columns, (item) => {
        //merge从共item
        const nextItem = merge(props.column, item);
        if (!item.customRender || !item.formatter) {
          nextItem.customRender = ({ text }: any) => {
            return (
              getItemEl<TColumn>(
                props.elementMap,
                {
                  ...item,
                  showProps: { ...item.showProps, content: props.columnEmptyText },
                },
                text,
              ) ||
              text ||
              props.columnEmptyText
            );
          };
        }
        return nextItem;
      });

      const operate = props.operate;
      //处理operate
      if (operate && size(operate.items) > 0) {
        //将itemState补充的信息拼到item中
        const completeItems = map(operate.items, (i) => ({ ...i, ...get(operate.itemState, i.value) }));
        //排序
        const operateList = sortBy(completeItems, (item) => item.sort);

        columns.push({
          title: "操作",
          valueType: "option",
          fixed: "right",
          ...props.column,
          customRender: ({ record }: any) => {
            const validList = filter(operateList, (item) => {
              if (isFunction(item.show)) {
                return item.show(record);
              }
              if (item.show === false) {
                return false;
              }
              return true;
            });

            return (
              <div class={"pro-table-operate"}>
                {map(validList, (item) => {
                  // 自定义
                  if (isFunction(item.element)) {
                    return item.element(record, item);
                  }

                  return (
                    <ElButton
                      key={item.value}
                      type={"primary"}
                      link
                      disabled={isFunction(item.disabled) ? item.disabled(record) : item.disabled}
                      onClick={() => {
                        item.onClick?.(record);
                      }}>
                      {item.label}
                    </ElButton>
                  );
                })}
              </div>
            );
          },
          ...operate.column,
        });
      }

      return columns;
    });

    const invalidKeys = keys(proTableProps());

    return () => {
      return (
        <ElTable
          ref={(el: any) => {
            expose(el);
          }}
          {...omit(props, invalidKeys)}
          v-loading={props.loading}
          v-slots={omit(slots, "default")}>
          {map(columns.value, (item) => {
            const formatter = (record: Record<string, any>, column: TableColumnCtx<any>, value: any, index: number) => {
              if (item.formatter) {
                return item.formatter(record, column, value, index);
              }
              if (item.customRender) {
                return item.customRender({ value, text: value, record, column } as any);
              }
              return null;
            };

            return (
              <ElTableColumn
                key={item.dataIndex || item.prop}
                {...omit(item, "title", "label", "renderHeader", "prop", "dataIndex", "formatter", "customRender")}
                label={isVNode(item.title) ? undefined : item.title || item.label}
                renderHeader={isVNode(item.title) ? () => item.title as any : undefined}
                prop={(item.dataIndex as any) || item.prop}
                formatter={item.formatter || item.customRender ? (formatter as any) : undefined}
              />
            );
          })}

          {slots.default?.()}
        </ElTable>
      );
    };
  },
});
