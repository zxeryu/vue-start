import { DefineComponent } from "vue";
import { Table, TableProps } from "ant-design-vue";
import { createTable, ProTableProps as ProTablePropsOrigin } from "@vue-start/pro";

export type ProTableProps = ProTablePropsOrigin & Omit<TableProps, "columns">;

export const ProTable: DefineComponent<ProTableProps> = createTable(Table, {
  pagination: { type: [Boolean, Object], default: false },
});
