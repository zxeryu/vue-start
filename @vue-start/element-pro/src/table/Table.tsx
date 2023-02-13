import { defineComponent, isVNode, ref } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import { TableColumnCtx } from "../../types";
import { map, omit, pick, size } from "lodash";
import { createExpose } from "@vue-start/pro";
import { createLoadingId, ProLoading } from "../comp";

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
    return () => {
      return (
        <ElTableColumn
          {...omit(
            props,
            "title",
            "label",
            "renderHeader",
            "prop",
            "dataIndex",
            "formatter",
            "customRender",
            "children",
          )}
          label={isVNode(props.title) ? undefined : props.title}
          renderHeader={isVNode(props.title) ? () => props.title as any : undefined}
          prop={props.dataIndex as any}
          formatter={
            ((record: Record<string, any>, column: TableColumnCtx<any>, value: any, index: number) => {
              if (props.customRender) {
                return props.customRender({ value, text: value, record, column, index } as any);
              }
              return value;
            }) as any
          }
          v-slots={{ default: slots[props.dataIndex!], header: slots[`${props.dataIndex!}_header`] }}>
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

export const ProTable = defineComponent({
  props: {
    ...ElTable.props,
    columns: { type: Array },
    dataSource: { type: Array },
    loading: { type: Boolean },
  },
  setup: (props, { slots, expose }) => {
    const tableRef = ref();

    const id = createLoadingId("table");

    expose(createExpose(TableMethods, tableRef));

    return () => {
      return (
        <ElTable
          ref={tableRef}
          // @ts-ignore
          id={id}
          {...omit(props, "columns", "dataSource", "loading")}
          data={props.dataSource || props.data}
          v-slots={pick(slots, "append", "empty")}>
          {slots.start?.()}
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
