import { defineComponent } from "vue";
import { get, omit } from "lodash";
import { createCurdList, TPageState, useProCurd } from "@vue-start/pro";
import { ProSearchForm, ProSearchFormProps } from "../form";
import { ProTable, ProTableProps } from "../table";
import { Slots } from "@vue/runtime-core";
import { ElPagination } from "element-plus";

const CurdList = createCurdList(ProSearchForm, ProTable);

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

export type ProCurdListProps = {
  extraInSearch?: boolean;
  searchProps?: ProSearchFormProps & { slots?: Slots };
  tableProps?: ProTableProps & { slots?: Slots };
  paginationProps?: PaginationProps;
  pageState?: TPageState;
};

/**
 * 组合列表
 * SearchForm + Table + Pagination
 */
export const ProCurdList = defineComponent<ProCurdListProps>({
  props: {
    ...CurdList.props,
    paginationProps: { type: Object },
  },
  setup: (props, { slots }) => {
    return () => {
      return (
        <CurdList
          {...omit(props, "paginationProps")}
          v-slots={{
            pagination: (pageState: TPageState, total: number, handleSearch: Function) => (
              <ElPagination
                {...props.paginationProps}
                total={total}
                currentPage={pageState.page}
                pageSize={pageState.pageSize}
                // @ts-ignore
                onSizeChange={(pageSize: number) => {
                  pageState.pageSize = pageSize;
                  handleSearch();
                }}
                onCurrentChange={(current: number) => {
                  pageState.page = current;
                  handleSearch();
                }}
              />
            ),
            ...slots,
          }}
        />
      );
    };
  },
});

export const ProCurdListConnect = defineComponent({
  setup: () => {
    const { listProps } = useProCurd();
    return () => {
      return <ProCurdList {...omit(listProps?.value, "slots")} v-slots={get(listProps?.value, "slots")} />;
    };
  },
});
