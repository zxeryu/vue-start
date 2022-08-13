import { defineComponent, ExtractPropTypes, PropType, reactive } from "vue";
import { ProSearchForm, ProSearchFormProps } from "../form";
import { ProTable, ProTableProps } from "../table";
import { useEffect, useWatch } from "@vue-start/hooks";
import { isNumber, omit, size } from "lodash";
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

    const searchState = props.searchProps?.model || reactive({});

    const pageState = props.pageState || reactive({ ...defaultPage });

    const handleSearch = () => {
      emit("list", { ...searchState, ...pageState });
    };

    //页数重置1 且搜索
    const executeSearchWithResetPage = () => {
      pageState.page = 1;
      handleSearch();
    };

    //无SearchForm组件 初始化 触发
    useEffect(() => {
      if (size(props.searchProps?.columns) <= 0 && props.searchProps?.initEmit !== false) {
        handleSearch();
      }
    }, []);

    //无SearchForm组件 订阅searchState
    useWatch(() => {
      if (size(props.searchProps?.columns) <= 0) {
        executeSearchWithResetPage();
      }
    }, searchState);

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
          {size(searchProps?.columns) > 0 && (
            <ProSearchForm {...searchProps} model={searchState} onFinish={executeSearchWithResetPage}>
              {props.extraInSearch && extra}
            </ProSearchForm>
          )}

          {slots.divide?.()}

          {(size(searchProps?.columns) <= 0 || !props.extraInSearch) && extra}

          {slots.default ? slots.default() : <ProTable {...omit(tableProps, "slots")} v-slots={tableProps?.slots} />}

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
