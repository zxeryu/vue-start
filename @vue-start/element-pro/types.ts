import { DescriptionsProps, ProCurdFormProps, ProFormItemProps } from "./src";
import { VNode } from "vue";
import { FilterMethods, Filters } from "element-plus/es/components/table/src/table-column/defaults";
import { IProCurdProvide as IProCurdProvideOrigin, TTableColumn } from "@vue-start/pro";
import { ComputedRef, Ref } from "@vue/reactivity";
import { ProListProps } from "./src";
import { ModalProps } from "./src/curd/CurdModal";
import { ColSizeObject } from "element-plus/es/components/col/src/col";

export type TOption = {
  label?: string;
  value: string | number;
  disabled?: boolean;
};

export type TOptions = TOption[];

export type TColumn = TableColumnCtx<any> &
  Omit<TTableColumn, "formItemProps" | "title" | "dataIndex"> & {
    formItemProps?: ProFormItemProps;
  };

export type TColumns = TColumn[];

// Table column
export interface TableColumnCtx<T> {
  id?: string;
  realWidth?: number;
  type?: string;
  /********* title兼容 ********/
  label?: string;
  renderHeader?: (data: { column: TableColumnCtx<T>; $index: number }) => VNode;
  title?: string | VNode;
  /********* dataIndex兼容 ********/
  prop?: string;
  dataIndex?: string | number;

  className?: string;
  labelClassName?: string;
  property?: string;
  width?: string | number;
  minWidth?: string | number;
  sortable?: boolean | string;
  sortMethod?: (a: T, b: T) => number;
  sortBy?: string | ((row: T, index: number) => string) | string[];
  resizable?: boolean;
  columnKey?: string;
  rawColumnKey?: string;
  align?: string;
  headerAlign?: string;
  showTooltipWhenOverflow?: boolean;
  showOverflowTooltip?: boolean;
  fixed?: boolean | string;
  formatter?: (row: T, column: TableColumnCtx<T>, cellValue: any, index: number) => VNode | string;
  //数据兼容，其实就是formatter
  customRender?: (opt: {
    value: any;
    text: any;
    record: T;
    index: number;
    column: TableColumnCtx<T>;
  }) => VNode | string | null;
  selectable?: (row: T, index: number) => boolean;
  reserveSelection?: boolean;
  filterMethod?: FilterMethods<T>;
  filteredValue?: string[];
  filters?: Filters;
  filterPlacement?: string;
  filterMultiple?: boolean;
  index?: number | ((index: number) => number);
  sortOrders?: ("ascending" | "descending" | null)[];
  renderCell?: (data: any) => void;
  colSpan?: number;
  rowSpan?: number;
  children?: TableColumnCtx<T>[];
  level?: number;
  filterable?: boolean | FilterMethods<T> | Filters;
  order?: string;
  isColumnGroup?: boolean;
  isSubColumn?: boolean;
  columns?: TableColumnCtx<T>[];
  getColumnIndex?: () => number;
  no?: number;
  filterOpened?: boolean;
}

export interface IProCurdProvide
  extends Pick<IProCurdProvideOrigin, "rowKey" | "curdState" | "sendCurdEvent" | "getOperate" | "refreshList"> {
  formColumns: Ref<TColumns>;
  descColumns: Ref<TColumns>;
  tableColumns: Ref<TColumns>;
  searchColumns: Ref<TColumns>;
  /******************子组件参数*******************/
  listProps?: ComputedRef<ProListProps | undefined>;
  formProps?: ComputedRef<ProCurdFormProps | undefined>;
  descProps?: ComputedRef<DescriptionsProps | undefined>;
  modalProps?: ComputedRef<ModalProps | undefined>;
}

export interface IRow {
  gutter?: number;
  justify?: "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly";
  align?: "top" | "bottom" | "middle";
  tag?: string;
}

export interface ICol {
  span?: number;
  offset?: number;
  push?: number;
  pull?: number;
  xs?: ColSizeObject | number;
  sm?: ColSizeObject | number;
  md?: ColSizeObject | number;
  lg?: ColSizeObject | number;
  xl?: ColSizeObject | number;
  tag?: string;
}
