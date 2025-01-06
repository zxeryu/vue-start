import { computed, defineComponent, ExtractPropTypes, PropType, ref, nextTick, reactive } from "vue";
import { ElTable, ElTableColumn, ElButton, TableProps } from "element-plus";
import { TableColumnCtx } from "../../types";
import { filter, find, forEach, get, isArray, isFunction, last, map, omit, pick, reduce, size, slice } from "lodash";
import { createExpose, TColumns } from "@vue-start/pro";
import { createLoadingId, ProLoading } from "../comp";
import { getNameMapByMergeOpts, TTableMergeOpts, useEffect, isSame } from "@vue-start/hooks";

export type ProTableColumnProps = TableColumnCtx<any>;

export const ProTableColumn = defineComponent<ProTableColumnProps>({
  props: {
    ...omit(ElTableColumn.props, "label", "prop"),
    title: { type: String },
    dataIndex: { type: String },
    children: { type: Array },
    customRender: { type: Function },
  } as any,
  setup: (props, { slots }) => {
    const defaultSlot = ({
      row,
      column: columnOrigin,
      $index,
    }: {
      row: Record<string, any>;
      column: Record<string, any>;
      $index: number;
    }) => {
      const record = row;
      const index = $index;
      const column = { ...columnOrigin, title: columnOrigin.label, dataIndex: columnOrigin.property };

      const value = get(row, column.dataIndex);
      const nextParams = { value, text: value, record, column, index };

      const sv = slots.bodyCell?.(nextParams);
      if (sv) {
        return sv;
      }

      if (props.customRender) {
        return props.customRender(nextParams);
      }
      return value;
    };

    const headerSlot = ({ column: columnOrigin, $index }: { column: Record<string, any>; $index: number }) => {
      const index = $index;
      const title = columnOrigin.label;
      const column = { ...columnOrigin, title, dataIndex: columnOrigin.property };

      const sv = slots.headerCell?.({ title, column, index });

      return sv || title;
    };

    const reSlots: Record<string, any> = { header: headerSlot };
    //不包含children，重写default
    if (!props.children || size(props.children) <= 0) {
      reSlots.default = defaultSlot;
    }

    return () => {
      return (
        <ElTableColumn
          {...(omit(props, "title", "dataIndex", "prop", "customRender", "children") as any)}
          prop={props.dataIndex as any}
          label={props.title as any}
          v-slots={reSlots}>
          {size(props.children) > 0 &&
            map(props.children, (item) => <ProTableColumn key={item.dataIndex} {...item} v-slots={slots} />)}
        </ElTableColumn>
      );
    };
  },
});

export const TableMethods = [
  "clearSelection",
  "getSelectionRows",
  "toggleRowSelection",
  "toggleAllSelection",
  "toggleRowExpansion",
  "setCurrentRow",
  "clearSort",
  "clearFilter",
  "doLayout",
  "sort",
  "scrollTo",
  "setScrollTop",
  "setScrollLeft",
];

const proTableProps = () => ({
  columns: { type: Array as PropType<TColumns> },
  dataSource: { type: Array },
  loading: { type: Boolean },
  /**
   * 行、列合并配置
   */
  mergeOpts: { type: Object as PropType<TTableMergeOpts> },
  /**
   * 选择
   */
  selectedRowKeys: { type: [Array as PropType<string[]>, String as PropType<string>] },
  rowSelection: {
    type: Object as PropType<{
      type?: "single" | "multi"; //默认multi
      column?: ProTableColumnProps & { slots?: Record<string, any> };
      onChange?: (selectedRowKeys: string[], selectedRows: Record<string, any>[]) => void;
      /**
       * 分页选择模式，type="multi" 模式下生效。
       * 与当前页无关；可累计选择；
       * 缺点：
       *  1、如果初始化绑定的数据中存在数据源中不存在的数据，table中操作清空不了，需要外部处理（如："清空"按钮）；
       *  2、onChange中没有rows
       */
      pagination?: boolean;
    }>,
    default: undefined,
  },
});

export type ProTableProps = Partial<ExtractPropTypes<ReturnType<typeof proTableProps>>> & TableProps<any>;

export const ProTable = defineComponent<ProTableProps>({
  props: {
    ...ElTable.props,
    ...proTableProps(),
  },
  setup: (props, { slots, expose, emit }) => {
    const tableRef = ref();

    const id = createLoadingId("table");

    expose(createExpose(TableMethods, tableRef));

    const dataSource = computed(() => props.dataSource || props.data || []);

    const dataKeyMap = computed<Record<string, boolean>>(() => {
      return reduce(dataSource.value, (pair, item) => ({ ...pair, [getRowId(item)]: true }), {});
    });

    //获取record id
    const getRowId = (record: any) => {
      const rowKey = props.rowKey;
      if (isFunction(rowKey)) {
        return rowKey(record);
      }
      if (rowKey) {
        return record[rowKey];
      }
      return record.id;
    };

    /***************************** rowSelection ********************************/

    //是否展示选择
    const isSelection = computed(() => !!props.rowSelection);

    //是否是多选
    const isMulti = computed(() => {
      const rs = props.rowSelection;
      if (!rs) return false;
      return !rs.type || rs.type === "multi";
    });

    const propRowKeys = computed(() => {
      const keys = props.selectedRowKeys;
      if (isArray(keys)) return keys;
      if (keys) return [keys];
      return [];
    });

    const propKeyMap = computed<Record<string, boolean>>(() => {
      return reduce(propRowKeys.value, (pair, item) => ({ ...pair, [item]: true }), {});
    });

    let prevSelectedKeys: string[] = [];

    //主动赋值是否完成
    let methodOpeFinish = false;

    //多选监听
    const handleSelectionChange = (rows: any[]) => {
      if (!methodOpeFinish) return;

      const ids = map(rows, (item) => getRowId(item));

      //单选
      if (isSelection.value && !isMulti.value) {
        if (size(ids) <= 0 && size(prevSelectedKeys) > 0) {
          //取消场景
          const data = dataSource.value;
          const target = find(data, (item) => getRowId(item) === prevSelectedKeys[0]);
          if (target) {
            tableRef.value?.toggleRowSelection(target, true);
          }
          return;
        } else if (size(ids) > 1) {
          //选择其他场景
          const targetId = last(ids);
          forEach(rows, (item) => {
            tableRef.value?.toggleRowSelection(item, getRowId(item) === targetId);
          });
          return;
        }
      }

      //如果值相等，无需更新
      if (isSame(propRowKeys.value, ids, { sort: true })) {
        return;
      }

      //单选
      if(!isMulti.value){
        const id = get(ids, 0);
        props.rowSelection!.onChange?.(id, get(rows, 0));
        emit("update:selectedRowKeys", id);
        return;
      }

      //分页模式
      if (props.rowSelection?.pagination) {
        //清除 已选择集合中 包含 dataSource.value 中的项
        const reIds = filter(propRowKeys.value, (key) => {
          return !dataKeyMap.value[key];
        });
        reIds.push(...ids);

        props.rowSelection!.onChange?.(reIds, []);
        emit("update:selectedRowKeys", reIds);
        return;
      }

      props.rowSelection!.onChange?.(ids, rows);
      emit("update:selectedRowKeys", ids);
    };

    const rowSelection = computed(() => {
      const rs = props.rowSelection;
      if (!rs) return undefined;

      return { onSelectionChange: handleSelectionChange };
    });

    //主动赋值
    //根据 props.selectedRowKeys 选择
    useEffect(() => {
      methodOpeFinish = false;

      prevSelectedKeys = propRowKeys.value;

      const data = dataSource.value;
      //选择操作
      if (isSelection.value) {
        const selectedRows = tableRef.value?.getSelectionRows();
        const curKeyMap: Record<string, boolean | undefined> = reduce(
          selectedRows,
          (pair, item) => ({ ...pair, [getRowId(item)]: true }),
          {},
        );

        nextTick(() => {
          forEach(data, (item) => {
            const id = getRowId(item);
            if (propKeyMap.value[id] !== curKeyMap[id]) {
              tableRef.value?.toggleRowSelection(item, !!propKeyMap.value[id]);
            }
          });
          methodOpeFinish = true;
        });
      } else {
        methodOpeFinish = true;
      }
    }, [propRowKeys, dataSource]);

    /***************************** 行/列合并 ********************************/

    const createSpanMethod = () => {
      if (props.spanMethod) return props.spanMethod;
      if (props.mergeOpts?.rowNames || props.mergeOpts?.colNames) {
        const nameMap = getNameMapByMergeOpts(props.mergeOpts);
        return ({ row, column }: any) => {
          const name = column.property;
          if (nameMap[name]) {
            const rs = row[nameMap[name] as string];
            const cs = row[name + "-colspan"];
            return {
              rowspan: rs !== undefined ? rs : 1,
              colspan: cs !== undefined ? cs : 1,
            };
          }
        };
      }
      return props.spanMethod;
    };
    const spanMethod = computed(() => {
      return createSpanMethod();
    });

    return () => {
      return (
        <ElTable
          ref={tableRef}
          // @ts-ignore
          id={id}
          {...omit(props, "columns", "dataSource", "data", "loading", "spanMethod")}
          data={dataSource.value}
          spanMethod={spanMethod.value}
          {...rowSelection.value}
          v-slots={pick(slots, "append", "empty")}>
          {slots.start?.()}

          {isSelection.value && (
            <ElTableColumn
              type={"selection"}
              className={isMulti.value ? "pro-multi" : "pro-single"}
              {...(omit(props.rowSelection?.column, "slots") as any)}
              v-slots={props.rowSelection?.column?.slots}
            />
          )}

          {map(props.columns, (item) => (
            <ProTableColumn key={item.dataIndex} {...item} v-slots={slots} />
          ))}
          {slots.default?.()}

          {props.loading && <ProLoading target={id} loading />}
        </ElTable>
      );
    };
  },
});

export const ProTableOperateItem = defineComponent({
  props: {
    ...ElButton.props,
    type: { type: String, default: "primary" },
    link: { type: Boolean, default: true },
  },
  setup: (props, { slots }) => {
    return () => {
      return <ElButton {...props} v-slots={slots} />;
    };
  },
});
