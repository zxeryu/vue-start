import { computed, defineComponent, ExtractPropTypes, inject, PropType, provide, ref, toRef, VNode, Ref } from "vue";
import { TColumn } from "../../types";
import { filter, get, isBoolean, isFunction, keys, map, omit, pick, reduce, size, some } from "lodash";
import {
  isValidNode,
  mergeState,
  proBaseProps,
  ProBaseProps,
  renderColumn,
  useProConfig,
  useProRouter,
} from "../../core";
import { createExpose, filterSlotsByPrefix } from "../../util";
import { IOpeItem, ProOperate, ProOperateProps } from "../Operate";
import { ElementKeys } from "../comp";
import { ColumnSetting, ProColumnSettingProps } from "./ColumnSetting";
import { signTableMerge, TTableMergeOpts, useResizeObserver } from "@vue-start/hooks";

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
  //
  tip?: string | VNode | ((record: Record<string, any>) => string | VNode); //tooltip提示
  tipProps?: Record<string, any> | ((record: Record<string, any>) => Record<string, any>); //tooltip配置
  //
  title?: string; //modal title 或者 page(sub) title
  //
  routeOpts?: { name: string; query: string[] } | ((record: Record<string, any>) => Record<string, any>);
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
  /**
   * 行、列合并配置
   */
  mergeOpts: { type: Object as PropType<TTableMergeOpts> },
  //
  dataSource: { type: Array as PropType<Record<string, any>[]> },
});

export type ProTableProps = Partial<ExtractPropTypes<ReturnType<typeof proTableProps>>> &
  ProBaseProps & { loading?: boolean };

export const ProTable = defineComponent<ProTableProps>({
  inheritAttrs: false,
  props: {
    ...proBaseProps,
    ...proTableProps(),
  } as any,
  setup: (props, { slots, expose, attrs }) => {
    const { elementMap: elementMapP } = useProConfig();

    const elementMap = props.elementMap || elementMapP;

    const { router } = useProRouter();

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
      //路由操作
      const routeOpts = item.routeOpts;
      if (routeOpts) {
        if (isFunction(routeOpts)) {
          router.push(routeOpts(record));
        } else {
          router.push({ name: routeOpts.name, query: pick(record, routeOpts.query) });
        }
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
              element: isFunction(item.element) ? (i) => item.element!(record, i) : item.element,
              onClick: () => handleOperateClick(record, item),
              tip: isFunction(item.tip) ? item.tip(record) : item.tip,
              tipProps: isFunction(item.tipProps) ? item.tipProps(record) : item.tipProps,
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
          nextItem.customRender = ({ value }) => {
            if (typeof value === "undefined" || value === null || value === "") {
              return props.columnEmptyText;
            }

            return renderColumn(elementMap, item, { value }, { render: "tableRender" }) || value;
          };
        }
        return nextItem;
      });
    };

    const columns = computed(() => {
      const mergeColumns = mergeState(showColumns.value as any, props.columnState, props.columnState2);
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

    //行、列合并标记
    const dataSource = computed(() => {
      const list = props.dataSource;
      if (list && (props.mergeOpts?.rowNames || props.mergeOpts?.colNames)) {
        signTableMerge(list, props.mergeOpts);
      }
      return list;
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

    const toolbarRef = ref();
    const toolbarHeiRef = ref(0);

    //计算toolbar高度
    useResizeObserver(toolbarRef, (entries) => {
      const rect = get(entries, [0, "contentRect"]);
      const styles = window.getComputedStyle(toolbarRef.value);
      if (rect.height && styles) {
        const mbs = styles.getPropertyValue("margin-bottom");
        const mb = parseInt(mbs.replace("px", ""));
        toolbarHeiRef.value = rect.height + mb;
      }
    });

    const invalidKeys = keys(proTableProps());

    const columnSettingSlots = filterSlotsByPrefix(slots, "columnSetting");
    return () => {
      if (!Table) return null;

      const columnSettingNode = isColumnSetting.value ? (
        <ColumnSetting {...props.toolbar?.columnSetting} v-slots={columnSettingSlots} />
      ) : null;

      const tb = slots.toolbar?.();
      const tbExtra = slots.toolbarExtra?.([columnSettingNode]);

      const cls = [props.clsName];
      let oldCls = "";
      if (isValidNode(tb) || isValidNode(tbExtra) || isColumnSetting.value) {
        cls.push("has-header");
        oldCls = `${props.clsName}-toolbar-valid`;
      }

      return (
        <div class={cls} style={`--pro-table-toolbar-hei: ${toolbarHeiRef.value}px`} {...(pick(attrs, "class") as any)}>
          <div ref={toolbarRef} class={`${props.clsName}-toolbar ${oldCls}`}>
            <div class={`${props.clsName}-toolbar-start`}>{tb}</div>
            <div class={`${props.clsName}-toolbar-extra`}>{tbExtra || columnSettingNode}</div>
          </div>
          <Table
            ref={tableRef}
            {...omit(attrs, "class")}
            {...omit(props, invalidKeys)}
            mergeOpts={props.mergeOpts}
            dataSource={dataSource.value}
            columns={columns.value}
            v-slots={slots}
          />
        </div>
      );
    };
  },
});
