import { defineComponent, isVNode, ref } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import { TableColumnCtx } from "../../types";
import { get, map, omit, pick, size } from "lodash";
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
