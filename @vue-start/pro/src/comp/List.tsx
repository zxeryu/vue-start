import { defineComponent, ExtractPropTypes, PropType, reactive } from "vue";
import { ElementKeys, useGetCompByKey } from "./comp";
import { isBoolean, omit } from "lodash";
import { filterSlotsByPrefix } from "../util";

export type TPageState = {
  page: number;
  pageSize: number;
};

export const defaultPage: TPageState = Object.freeze({
  page: 1,
  pageSize: 10,
});

const proListProps = () => ({
  /**
   * class名称
   */
  clsName: { type: String, default: "pro-list" },
  //search
  searchProps: { type: Object as PropType<Record<string, any>> },
  //table
  tableProps: { type: Object as PropType<Record<string, any>> },
  //为false 不展示
  paginationProps: { type: [Object as PropType<Record<string, any>>, Boolean as PropType<boolean>] },
  //pageState
  pageState: { type: Object as PropType<TPageState> },
});

export type ProListProps = Partial<ExtractPropTypes<ReturnType<typeof proListProps>>>;

export type SearchSlotProps = {
  executeSearchWithResetPage: (values: Record<string, any>, page?: number) => void;
  pageState: TPageState;
};

export type PaginationSlotProps = {
  executePageChange: (page: number, pageSize: number) => void;
  pageState: TPageState;
};

/**
 * 搜索框+表格+分页 三个组件组成
 * onSearch 方法：search改变、page改变触发
 */
export const ProList = defineComponent<ProListProps>({
  props: {
    ...proListProps(),
  } as any,
  setup: (props, { slots, emit }) => {
    const getComp = useGetCompByKey();
    const SearchForm = getComp(ElementKeys.ProSearchFormKey);
    const Table = getComp(ElementKeys.ProTableKey);
    const Pagination = getComp(ElementKeys.PaginationKey);

    const pageState = props.pageState || reactive({ ...defaultPage });

    let prevValues: Record<string, any> | undefined;

    //触发搜索方法
    const handleSearch = () => {
      emit("search", { ...prevValues, ...pageState });
    };

    // 搜索同时将page设置为1
    const executeSearchWithResetPage = (values: Record<string, any>, page?: number) => {
      prevValues = values;
      pageState.page = page || 1;
      handleSearch();
    };

    //pagination改变
    const handlePageChange = (page: number, pageSize: number) => {
      pageState.page = page;
      pageState.pageSize = pageSize;

      handleSearch();
    };

    const searchSlots = filterSlotsByPrefix(slots, "search");
    const tableSlots = filterSlotsByPrefix(slots, "table");
    const paginationSlots = filterSlotsByPrefix(slots, "pagination");

    return () => {
      return (
        <>
          {slots.start?.()}

          {slots.search ? (
            slots.search({ executeSearchWithResetPage, pageState })
          ) : (
            <>
              {SearchForm ? (
                <SearchForm
                  clsName={`${props.clsName}-search`}
                  {...omit(props.searchProps, "onFinish")}
                  onFinish={(values: Record<string, any>) => executeSearchWithResetPage(values)}
                  v-slots={searchSlots}
                />
              ) : null}
            </>
          )}

          {slots.divide?.()}

          {slots.table ? (
            slots.table({ pageState })
          ) : (
            <>
              {Table ? (
                <Table
                  clsName={`${props.clsName}-table`}
                  paginationState={{ page: pageState.page, pageSize: pageState.pageSize }}
                  pagination={false}
                  {...props.tableProps}
                  v-slots={tableSlots}
                />
              ) : null}
            </>
          )}

          {slots.divide2?.()}

          {slots.pagination ? (
            slots.pagination({ executePageChange: handlePageChange, pageState })
          ) : (
            <>
              {props.paginationProps !== false && Pagination ? (
                <Pagination
                  clsName={`${props.clsName}-pagination`}
                  {...omit(!isBoolean(props.paginationProps) ? props.paginationProps : {}, "onChange")}
                  page={pageState.page}
                  pageSize={pageState.pageSize}
                  onComposeChange={handlePageChange}
                  v-slots={paginationSlots}
                />
              ) : null}
            </>
          )}

          {slots.end?.()}
        </>
      );
    };
  },
});
