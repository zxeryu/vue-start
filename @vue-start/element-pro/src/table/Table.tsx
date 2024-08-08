import { computed, defineComponent, ExtractPropTypes, PropType, ref, nextTick, reactive } from "vue";
import { ElTable, ElTableColumn, ElButton, TableProps } from "element-plus";
import { TableColumnCtx } from "../../types";
import { find, forEach, get, isFunction, map, omit, pick, reduce, size } from "lodash";
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
  selectedRowKeys: { type: Array as PropType<string[]> },
  rowSelection: {
    type: Object as PropType<{
      type?: "single" | "multi"; //默认multi
      column?: ProTableColumnProps & { slots?: Record<string, any> };
      onChange?: (selectedRowKeys: string[], selectedRows: Record<string, any>[]) => void;
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

    //是否是多选
    const isMulti = computed(() => {
      const rs = props.rowSelection;
      if (!rs) return false;
      return !rs.type || rs.type === "multi";
    });

    //单个选择监听
    const handleCurrentChange = (currentRow: any) => {
      const ids = currentRow ? [getRowId(currentRow)] : [];

      //如果值相等，无需更新
      if (isSame(props.selectedRowKeys, ids, { sort: true })) {
        return;
      }

      props.rowSelection!.onChange?.(ids, currentRow ? [currentRow] : []);
      emit("update:selectedRowKeys", ids);
    };
    //多选监听
    const handleSelectionChange = (rows: any[]) => {
      const ids = map(rows, (item) => getRowId(item));

      //如果值相等，无需更新
      if (isSame(props.selectedRowKeys, ids, { sort: true })) {
        return;
      }

      props.rowSelection!.onChange?.(ids, rows);
      emit("update:selectedRowKeys", ids);
    };

    const rowSelection = computed(() => {
      const rs = props.rowSelection;
      if (!rs) return undefined;

      if (isMulti.value) {
        return { onSelectionChange: handleSelectionChange };
      }
      //单选
      return { highlightCurrentRow: true, onCurrentChange: handleCurrentChange };
    });

    //根据 props.selectedRowKeys 选择
    useEffect(() => {
      const data = props.dataSource || props.data;

      //选择操作
      if (isMulti.value) {
        //多选模式，有变化时候执行

        const selectedRowKeys = props.selectedRowKeys;
        const propKeyMap: Record<string, boolean | undefined> = reduce(
          selectedRowKeys,
          (pair, item) => ({ ...pair, [item]: true }),
          {},
        );
        //
        const selectedRows = tableRef.value?.getSelectionRows();
        const curKeyMap: Record<string, boolean | undefined> = reduce(
          selectedRows,
          (pair, item) => ({ ...pair, [getRowId(item)]: true }),
          {},
        );

        //是否操作
        let isOpe = false;
        //len不等
        if (size(selectedRowKeys) !== size(selectedRows)) {
          isOpe = true;
        } else if (size(selectedRowKeys) !== 0) {
          //相等 非0
          for (let i = 0; i < selectedRowKeys!.length; i++) {
            const key = selectedRowKeys![i];
            //有值不匹配
            if (!curKeyMap[key]) {
              isOpe = true;
              break;
            }
          }
        }
        if (isOpe) {
          nextTick(() => {
            forEach(data, (item) => {
              const id = getRowId(item);
              if (propKeyMap[id] !== curKeyMap[id]) {
                tableRef.value?.toggleRowSelection(item, !!propKeyMap[id]);
              }
            });
          });
        }
      } else {
        //单选模式，直接执行
        const key = props.selectedRowKeys?.[0];
        let target: any = null;
        if (key) {
          target = find(data, (item) => getRowId(item) === key);
        }
        nextTick(() => {
          tableRef.value?.setCurrentRow(target);
        });
      }
    }, [() => props.selectedRowKeys, () => props.dataSource, () => props.data]);

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
          data={props.dataSource || props.data}
          spanMethod={spanMethod.value}
          {...rowSelection.value}
          v-slots={pick(slots, "append", "empty")}>
          {slots.start?.()}

          {isMulti.value && (
            <ElTableColumn
              type={"selection"}
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
