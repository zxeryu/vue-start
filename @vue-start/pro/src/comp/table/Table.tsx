import { computed, defineComponent, ExtractPropTypes, inject, PropType, provide, ref, toRef, VNode, Ref } from "vue";
import { TColumn } from "../../types";
import { filter, get, isBoolean, isFunction, keys, map, omit, pick, reduce, size, some } from "lodash";
import { getItemEl, mergeState, proBaseProps, ProBaseProps, useProConfig } from "../../core";
import { createExpose, filterSlotsByPrefix } from "../../util";
import { IOpeItem, ProOperate, ProOperateProps } from "../Operate";
import { ElementKeys } from "../comp";
import { ColumnSetting, ProColumnSettingProps } from "./ColumnSetting";
import { useResizeObserver } from "@vue-start/hooks";

const ProTableKey = Symbol("pro-table");

export interface IProTableProvideExtra extends Record<string, any> {}

export interface IProTableProvide extends IProTableProvideExtra {
  columns: Ref<TTableColumns>;
  originColumns: Ref<TTableColumns>;
  selectIdsRef: Ref<Array<string | number>>;
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
  element?: (record: Record<string, any>, item: IOperateItem) => VNode;
  //
  sort?: number;
  per?: string; //权限字符串
  perSuffix?: string; //权限字符串后缀
}

/**
 * 整个操作栏描述
 */
export interface ITableOperate {
  column?: TColumn; //table 的column属性
  items?: IOperateItem[];
  //对item的补充 key为item的value
  itemState?: Record<string, IOperateItem>;
  //
  elementKey?: ProOperateProps["elementKey"];
}

const proTableProps = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-table" },
  /**
   * 操作栏
   */
  operate: { type: Object as PropType<ITableOperate> },
  operateItemState: { type: Object as PropType<ITableOperate["itemState"]> }, //默认operate.itemState对象拓展
  operateItemClickMap: {
    type: Object as PropType<Record<string, (record: Record<string, any>, item: IOperateItem) => void>>,
  },
  /**
   * 默认空字符串
   */
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

    /*********************************** 序号 **************************************/

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

    /*********************************** operate **************************************/
    //操作项点击事件
    const handleOperateClick = (record: Record<string, any>, item: IOperateItem) => {
      //拦截某个操作点击事件
      if (props.operateItemClickMap && props.operateItemClickMap[item.value]) {
        props.operateItemClickMap[item.value](record, item);
        return;
      }
      item.onClick?.(record);
    };

    // operate 插槽
    const operateSlots = filterSlotsByPrefix(slots, "operate");
    const createOperateColumn = (): TTableColumn => {
      const operate = props.operate!;
      //将 默认拓展属性 和 itemState拓展属性 补充的信息拼到item中
      const items = map(operate.items, (i) => {
        return { ...get(props.operateItemState, i.value), ...i, ...get(operate.itemState, i.value) };
      });
      return {
        ...props.column,
        title: "操作",
        dataIndex: "operate",
        fixed: "right",
        ...operate.column,
        customRender: ({ record }) => {
          const opeItems = map(items, (item) => {
            return {
              ...item,
              show: isFunction(item.show) ? item.show(record) : item.show,
              disabled: isFunction(item.disabled) ? item.disabled(record) : item.disabled,
              loading: isFunction(item.loading) ? item.loading(record) : item.loading,
              extraProps: isFunction(item.extraProps) ? item.extraProps(record) : item.extraProps,
              element: isFunction(item.element) ? () => item.element!(record, item) : item.element,
              onClick: () => handleOperateClick(record, item),
            } as IOpeItem;
          });

          const opeSlots = reduce(
            keys(operateSlots),
            (pair, key) => ({ ...pair, [key]: (item: string) => operateSlots[key]?.(record, item) }),
            {},
          );

          return (
            <ProOperate
              class={`${props.clsName}-operate`}
              items={opeItems}
              elementKey={operate.elementKey || ElementKeys.TableOperateKey}
              v-slots={opeSlots}
            />
          );
        },
      };
    };

    // ColumnSetting 开启后
    const selectIdsRef = ref<Array<string | number>>([]);

    const isColumnSetting = computed(() => !!props.toolbar?.columnSetting);

    const originColumns = toRef(props, "columns");

    const showColumns = computed(() => {
      if (!isColumnSetting.value) {
        return props.columns;
      }
      const selectIdMap = reduce(selectIdsRef.value, (pair, item) => ({ ...pair, [item]: true }), {});
      return filter(props.columns, (item) => get(selectIdMap, item.dataIndex!));
    });

    //转换column
    const convertColumns = (list: TTableColumns) => {
      return map(list, (item) => {
        //merge公共column
        const mergeColumn = { ...props.column, ...item };
        //convertColumn 转换（如果需要）
        const nextItem: TTableColumn = props.convertColumn ? props.convertColumn(mergeColumn) : mergeColumn;
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
              { ...item, showProps: { ...item.showProps, content: item.showProps?.content || props.columnEmptyText } },
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
      const mergeColumns = mergeState(props.columns!, props.columnState, props.columnState2);
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
      columns,
      originColumns,
      selectIdsRef,
      tableRef,
      toolbar: props.toolbar,
      ...props.provideExtra,
    } as any);

    expose(createExpose(props.tableMethods || [], tableRef));

    /******************************** toolbar class *******************************/

    const toolbarStartDomRef = ref(); //dom
    const toolbarStartValidRef = ref(false); //dom是否为空
    const toolbarExtraDomRef = ref();
    const toolbarExtraValidRef = ref(false);

    useResizeObserver(toolbarStartDomRef, () => {
      toolbarStartValidRef.value = !!toolbarStartDomRef.value.innerText;
    });

    useResizeObserver(toolbarExtraDomRef, () => {
      toolbarExtraValidRef.value = !!toolbarExtraDomRef.value.innerText;
    });

    const toolbarValidClass = computed(() => {
      if (toolbarExtraValidRef.value || toolbarStartValidRef.value) return `${props.clsName}-toolbar-valid`;
      return "";
    });

    const invalidKeys = keys(proTableProps());

    const columnSettingSlots = filterSlotsByPrefix(slots, "columnSetting");
    return () => {
      if (!Table) return null;

      const columnSettingNode = isColumnSetting.value ? (
        <ColumnSetting {...props.toolbar?.columnSetting} v-slots={columnSettingSlots} />
      ) : null;

      return (
        <div class={props.clsName} {...(pick(attrs, "class") as any)}>
          <div class={`${props.clsName}-toolbar ${toolbarValidClass.value}`}>
            <div ref={toolbarStartDomRef} class={`${props.clsName}-toolbar-start`}>
              {slots.toolbar?.()}
            </div>
            <div ref={toolbarExtraDomRef} class={`${props.clsName}-toolbar-extra`}>
              {slots.toolbarExtra ? slots.toolbarExtra([columnSettingNode]) : <>{columnSettingNode}</>}
            </div>
          </div>
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
