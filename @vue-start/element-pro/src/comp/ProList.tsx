import { defineComponent, ExtractPropTypes, PropType, reactive } from "vue";
import { ProSearchForm, ProSearchFormProps } from "../form";
import { ProTable, ProTableProps } from "../table";
import { isNumber, omit } from "lodash";
import { Slots } from "@vue/runtime-core";
import { ElPagination } from "element-plus";

export interface PaginationProps {
  total?: number;
  pageSize?: number;
  defaultPageSize?: number;
  currentPage?: number;
  defaultCurrentPage?: number;
  pageCount?: number;
  pagerCount?: number;
  layout?: string;
  pageSizes?: number[];
  popperClass?: string;
  prevText?: string;
  nextText?: string;
  small?: boolean;
  background?: boolean;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  //emit
  onSizeChange?: (val: number) => void;
  onCurrentChange?: (val: number) => void;
}

export type TPageState = {
  page: number;
  pageSize: number;
};

export const defaultPage: TPageState = {
  page: 1,
  pageSize: 10,
};

const proListProps = () => ({
  /**
   * extra 是否放到SearchForm中
   */
  extraInSearch: { type: Boolean, default: undefined },
  //search
  searchProps: { type: Object as PropType<ProSearchFormProps> },
  //table
  tableProps: { type: Object as PropType<ProTableProps & { slots?: Slots }> },
  //pagination
  paginationProps: { type: Object as PropType<PaginationProps> },
  //pageState
  pageState: { type: Object as PropType<TPageState> },
});

export type ProListProps = Partial<ExtractPropTypes<ReturnType<typeof proListProps>>>;

export const ProList = defineComponent<ProListProps>({
  props: {
    ...(proListProps() as any),
  },
  setup: (props, { slots, emit }) => {
    /******************* search pagination ********************/

    const pageState = props.pageState || reactive({ ...defaultPage });

    let prevValues: Record<string, any> | undefined;
    const handleSearch = () => {
      emit("list", { ...prevValues, ...pageState });
    };

    //页数重置1 且搜索
    const executeSearchWithResetPage = (values: Record<string, any>) => {
      prevValues = values;
      pageState.page = 1;
      handleSearch();
    };

    return () => {
      const searchProps = props.searchProps;
      const tableProps = props.tableProps;
      const paginationProps = props.paginationProps;

      //操作按钮
      const extra = slots.extra ? <div class={"pro-list-search"}>{slots.extra()}</div> : null;

      //分页参数
      const pagination = {
        ...paginationProps,
        currentPage: pageState.page,
        pageSize: pageState.pageSize,
        onSizeChange: (pageSize: number) => {
          pageState.pageSize = pageSize;
          handleSearch();
        },
        onCurrentChange: (current: number) => {
          pageState.page = current;
          handleSearch();
        },
      };

      return (
        <>
          <ProSearchForm {...searchProps} onFinish={executeSearchWithResetPage}>
            {props.extraInSearch && extra}
          </ProSearchForm>

          {slots.divide?.()}

          {!props.extraInSearch && extra}

          {slots.default ? (
            slots.default()
          ) : (
            <ProTable
              paginationState={{ page: pageState.page, pageSize: pageState.pageSize }}
              {...omit(tableProps, "slots")}
              v-slots={tableProps?.slots}
            />
          )}

          {slots.divide2?.()}

          <div class={"pro-list-footer"}>
            {slots.footerLeft?.()}

            {isNumber(paginationProps?.total) && paginationProps!.total > 0 && (
              <>{slots.pagination ? slots.pagination(pagination) : <ElPagination {...pagination} />}</>
            )}

            {slots.footerRight?.()}
          </div>
        </>
      );
    };
  },
});
