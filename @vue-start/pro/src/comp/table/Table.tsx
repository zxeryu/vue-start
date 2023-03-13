import {
  computed,
  defineComponent,
  ExtractPropTypes,
  inject,
  PropType,
  provide,
  reactive,
  ref,
  toRef,
  VNode,
} from "vue";
import { TColumn } from "../../types";
import { filter, get, isBoolean, isFunction, keys, map, omit, pick, reduce, size, some, sortBy } from "lodash";
import { getItemEl, proBaseProps, ProBaseProps, useProConfig } from "../../core";
import { Ref, UnwrapNestedRefs } from "@vue/reactivity";
import { createExpose, filterSlotsByPrefix, getSignValue, mergeStateToList } from "../../util";
import { IOpeItem, ProOperate, ProOperateProps } from "../Operate";
import { ElementKeys } from "../comp";
import { ColumnSetting, ProColumnSettingProps } from "./ColumnSetting";

const ProTableKey = Symbol("pro-table");

export interface IProTableProvideExtra extends Record<string, any> {}

export interface IProTableProvide extends IProTableProvideExtra {
  columns: Ref<TTableColumns>;
  originColumns: Ref<TTableColumns>;
  state: UnwrapNestedRefs<{
    selectIds: (string | number)[];
  }>;
}

export const useProTable = () => inject(ProTableKey) as IProTableProvide;

const provideProTable = (ctx: IProTableProvide) => {
  provide(ProTableKey, ctx);
};

export type TTableColumn = {
  children?: TTableColumn[];
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
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-table" },
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
  serialNumber: { type: [Boolean, Object] },
  /**
   * 分页
   */
  paginationState: { type: Object as PropType<{ page?: number; pageSize?: number }> },
  /**
   * 操作栏
   */
  toolbar: {
    type: Object as PropType<{
      columnSetting?: ProColumnSettingProps;
    }>,
  },
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
  inheritAttrs: false,
  props: {
    ...proBaseProps,
    ...proTableProps(),
  } as any,
  setup: (props, { slots, expose, attrs }) => {
    const { elementMap: elementMapP } = useProConfig();

    const elementMap = props.elementMap || elementMapP;

    const Table = get(elementMapP, ElementKeys.TableKey);

    const createNumberColumn = (): TTableColumn => ({
      title: "序号",
      dataIndex: "serialNumber",
      width: 80,
      ...props.column,
      ...(!isBoolean(props.serialNumber) ? props.serialNumber : undefined),
      customRender: ({ index }) => {
        if (props.paginationState?.page && props.paginationState?.pageSize) {
          return props.paginationState.pageSize * (props.paginationState.page - 1) + index + 1;
        }
        return index + 1;
      },
    });

    const operateSlots = filterSlotsByPrefix(slots, "operate");
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
              clsName={operate.clsName || `${props.clsName}-operate`}
              items={opeItems}
              elementKey={operate.elementKey}
              v-slots={reduce(
                keys(operateSlots),
                (pair, key) => {
                  return {
                    ...pair,
                    [key]: (item: string) => {
                      return operateSlots[key]?.(record, item);
                    },
                  };
                },
                {},
              )}
            />
          );
        },
      };
    };

    //初始化选中的columns
    const initSelectIds = (): (string | number)[] => {
      const signName = props.toolbar?.columnSetting?.signName || "columnSetting";
      const showColumns = filter(props.columns, (item) => {
        //标记初始化不展示
        if (getSignValue(item, signName)?.initShow === false) {
          return false;
        }
        return true;
      });
      if (props.serialNumber) {
        showColumns.unshift(createNumberColumn());
      }
      return map(showColumns, (c) => c.dataIndex!);
    };

    const state = reactive({
      selectIds: initSelectIds(),
    });

    const originColumns = toRef(props, "columns");

    const showColumns = computed(() => {
      const selectIdMap = reduce(state.selectIds, (pair, item) => ({ ...pair, [item]: true }), {});
      return filter(props.columns, (item) => get(selectIdMap, item.dataIndex!));
    });

    //转换column
    const convertColumns = (list: TTableColumns) => {
      return map(list, (item) => {
        //merge公共column
        const nextItem = { ...props.column, ...item };
        //如果有子column，转换子节点 再返回
        if (item.children && size(item.children) > 0) {
          nextItem.children = convertColumns(item.children);
          return nextItem;
        }
        //如果是子节点，且不存在 customRender ，重写
        if (!item.customRender) {
          nextItem.customRender = ({ text }) => {
            const vn = getItemEl(
              elementMap,
              { ...item, showProps: { ...item.showProps, content: props.columnEmptyText } },
              text,
            );
            //如果找不到注册的组件，使用当前值 及 columnEmptyText
            return vn || text || props.columnEmptyText;
          };
        }
        return nextItem;
      });
    };

    const columns = computed(() => {
      const mergeColumns = mergeStateToList(showColumns.value as any, props.columnState!, (item) => item.dataIndex);
      //根据valueType选择对应的展示组件
      const columns = convertColumns(mergeColumns);
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

    provideProTable({
      columns: columns as any,
      originColumns: originColumns as any,
      state: state as any,
      tableRef,
      toolbar: props.toolbar,
      ...props.provideExtra,
    });

    expose(createExpose(props.tableMethods || [], tableRef));

    const invalidKeys = keys(proTableProps());

    const columnSettingSlots = filterSlotsByPrefix(slots, "columnSetting");
    return () => {
      if (!Table) {
        return null;
      }

      const toolbarDom = slots.toolbar ? slots.toolbar() : undefined;
      return (
        <div class={props.clsName} {...(pick(attrs, "class") as any)}>
          {(toolbarDom || props.toolbar?.columnSetting) && (
            <div class={`${props.clsName}-toolbar`}>
              {toolbarDom}
              {props.toolbar?.columnSetting && (
                <ColumnSetting {...props.toolbar?.columnSetting} v-slots={columnSettingSlots} />
              )}
            </div>
          )}
          <Table
            ref={tableRef}
            {...omit(attrs, "class")}
            {...omit(props, invalidKeys)}
            columns={columns.value}
            v-slots={slots}
          />
        </div>
      );
    };
  },
});
