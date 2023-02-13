import { computed, defineComponent, ExtractPropTypes, inject, PropType, provide, ref, VNode } from "vue";
import { TColumn } from "../../types";
import { get, isFunction, keys, map, omit, some, sortBy } from "lodash";
import { getItemEl, proBaseProps, ProBaseProps, useProConfig } from "../../core";
import { Ref } from "@vue/reactivity";
import { createExpose, mergeStateToList } from "../../util";
import { IOpeItem, ProOperate, ProOperateProps } from "../Operate";

const ProTableKey = Symbol("pro-table");

export interface IProTableProvideExtra extends Record<string, any> {}

export interface IProTableProvide extends IProTableProvideExtra {
  columns: Ref<TTableColumns>;
}

export const useProTable = () => inject(ProTableKey) as IProTableProvide;

const provideProTable = (ctx: IProTableProvide) => {
  provide(ProTableKey, ctx);
};

export type TTableColumn = {
  //antd 自定义列
  customRender?: (opt: {
    value: any;
    text: any;
    record: Record<string, any>;
    index: number;
    column: TTableColumn;
  }) => VNode | string | number;

  fixed?: boolean | string;
  width?: number | string;
} & TColumn;

export type TTableColumns = TTableColumn[];

/**
 * 单个操作描述
 */
export interface IOperateItem {
  value: string | number;
  label?: string | VNode;
  show?: boolean | ((record: Record<string, any>) => boolean);
  disabled?: boolean | ((record: Record<string, any>) => boolean);
  loading?: boolean | ((record: Record<string, any>) => boolean);
  //
  extraProps?: object | ((record: Record<string, any>) => Record<string, any>);
  onClick?: (record: Record<string, any>) => void;
  sort?: number;
  element?: (record: Record<string, any>, item: IOperateItem) => VNode;
}

/**
 * 整个操作栏描述
 */
export interface ITableOperate {
  column?: TColumn; //table 的column属性
  items?: IOperateItem[];
  //对item的补充 key为item的value
  itemState?: { [key: string]: Omit<IOperateItem, "value"> };
  //
  clsName?: ProOperateProps["clsName"];
  elementKey?: ProOperateProps["elementKey"];
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
  column: { type: Object as PropType<TTableColumn> },
  /**
   * 序号
   */
  serialNumber: { type: Boolean },
  /**
   * 分页
   */
  paginationState: { type: Object as PropType<{ page?: number; pageSize?: number }> },
  /**
   * provide传递
   */
  provideExtra: { type: Object as PropType<IProTableProvideExtra> },

  /**
   * ref 默认中转方法
   */
  tableMethods: { type: Array as PropType<string[]> },
});

export type ProTableProps = Partial<ExtractPropTypes<ReturnType<typeof proTableProps>>> &
  ProBaseProps & {
    loading?: boolean;
    dataSource?: Record<string, any>[];
  };

export const ProTable = defineComponent<ProTableProps>({
  props: {
    ...proBaseProps,
    ...proTableProps(),
  } as any,
  setup: (props, { slots, expose }) => {
    const { elementMap: elementMapP } = useProConfig();

    const elementMap = props.elementMap || elementMapP;

    const createNumberColumn = (): TTableColumn => ({
      title: "序号",
      dataIndex: "serialNumber",
      width: 80,
      ...props.column,
      customRender: ({ index }) => {
        if (props.paginationState?.page && props.paginationState?.pageSize) {
          return props.paginationState.pageSize * (props.paginationState.page - 1) + index + 1;
        }
        return index + 1;
      },
    });

    const createOperateColumn = (): TTableColumn => {
      const operate = props.operate!;
      //将itemState补充的信息拼到item中
      const items = map(operate.items, (i) => ({ ...i, ...get(operate.itemState, i.value) }));
      //排序
      const sortedItems = sortBy(items, (item) => item.sort);
      return {
        ...props.column,
        title: "操作",
        dataIndex: "operate",
        fixed: "right",
        ...operate.column,
        customRender: ({ record }) => {
          const opeItems = map(sortedItems, (item) => {
            return {
              value: item.value,
              label: item.label,
              show: isFunction(item.show) ? item.show(record) : item.show,
              disabled: isFunction(item.disabled) ? item.disabled(record) : item.disabled,
              loading: isFunction(item.loading) ? item.loading(record) : item.loading,
              extraProps: isFunction(item.extraProps) ? item.extraProps(record) : item.extraProps,
              onClick: () => {
                item.onClick?.(record);
              },
              element: isFunction(item.element)
                ? () => {
                    return item.element!(record, item);
                  }
                : item.element,
            } as IOpeItem;
          });

          return (
            <ProOperate
              clsName={operate.clsName || "pro-table-operate"}
              items={opeItems}
              elementKey={operate.elementKey}
            />
          );
        },
      };
    };

    const columns = computed(() => {
      const mergeColumns = mergeStateToList(props.columns!, props.columnState!, (item) => item.dataIndex);
      //根据valueType选择对应的展示组件
      const columns = map(mergeColumns, (item) => {
        //merge公共item
        const nextItem = { ...props.column, ...item };
        if (!item.customRender) {
          nextItem.customRender = ({ text }) => {
            const vn = getItemEl(
              elementMap,
              {
                ...item,
                showProps: { ...item.showProps, content: props.columnEmptyText },
              },
              text,
            );
            //如果找不到注册的组件，使用当前值 及 columnEmptyText
            return vn || text || props.columnEmptyText;
          };
        }
        return nextItem;
      });
      //处理序号
      if (props.serialNumber) {
        columns.unshift(createNumberColumn());
      }

      //处理operate
      if (props.operate && props.operate.items && some(props.operate.items, (item) => item.show)) {
        columns.push(createOperateColumn());
      }

      return columns;
    });

    const tableRef = ref();

    provideProTable({ columns: columns as any, tableRef, ...props.provideExtra });

    const tableMethods = props.tableMethods || [];
    expose(createExpose(tableMethods, tableRef));

    const invalidKeys = keys(proTableProps());

    const Table = get(elementMapP, ProTableKey);

    return () => {
      if (!Table) {
        return null;
      }
      return <Table ref={tableRef} {...omit(props, invalidKeys)} columns={columns.value} v-slots={slots} />;
    };
  },
});
