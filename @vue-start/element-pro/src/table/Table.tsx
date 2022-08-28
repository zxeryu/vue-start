import { DefineComponent, defineComponent, isVNode } from "vue";
import { ElTable, ElTableColumn } from "element-plus";
import { TableProps } from "element-plus/es/components/table/src/table/defaults";
import { TableColumnCtx, TColumns } from "../../types";
import { get, map, omit } from "lodash";
import { createTable, ProTableProps as ProTablePropsOrigin } from "@vue-start/pro";
import { createLoadingId, ProLoading } from "../comp/Loading";

export type ProTableProps = Omit<ProTablePropsOrigin, "columns"> & {
  columns?: TColumns;
} & Omit<TableProps<any>, "tableLayout" | "flexible" | "data"> & {
    tableLayout?: "fixed" | "auto";
    flexible?: boolean;
    data?: any;
    loading?: boolean;
  };

const Table = defineComponent({
  props: {
    ...ElTable.props,
    columns: { type: Array },
    dataSource: { type: Array },
    loading: { type: Boolean },
  },
  setup: (props, { slots }) => {
    const id = createLoadingId("table");

    return () => {
      return (
        <ElTable
          {...omit(props, "columns", "dataSource", "loading")}
          data={props.dataSource || props.data}
          v-slots={omit(slots, "default", "start")}>
          {slots.start?.()}
          {map(props.columns, (item) => (
            <ElTableColumn
              key={item.dataIndex}
              {...omit(item, "title", "label", "renderHeader", "prop", "dataIndex", "formatter", "customRender")}
              label={isVNode(item.title) ? undefined : item.title || get(item, "label")}
              renderHeader={isVNode(item.title) ? () => item.title as any : undefined}
              prop={item.dataIndex as any}
              formatter={
                ((record: Record<string, any>, column: TableColumnCtx<any>, value: any, index: number) => {
                  if (item.customRender) {
                    return item.customRender({ value, text: value, record, column, index } as any);
                  }
                  return value;
                }) as any
              }
            />
          ))}
          {slots.default?.()}

          {props.loading && <ProLoading target={id} loading />}
        </ElTable>
      );
    };
  },
});

export const ProTable: DefineComponent<ProTableProps> = createTable(Table);
