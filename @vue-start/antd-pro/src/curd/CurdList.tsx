import { defineComponent } from "vue";
import { Pagination, PaginationProps } from "ant-design-vue";
import { get, omit } from "lodash";
import { ProSearchForm, ProSearchFormProps } from "../form";
import { ProTable, ProTableProps } from "../table";
import { Slots } from "@vue/runtime-core";

import { createCurdList, TPageState, useProCurd } from "@vue-start/pro";

const CurdList = createCurdList(ProSearchForm, ProTable);

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
              <Pagination
                {...props.paginationProps}
                total={total}
                current={pageState.page}
                pageSize={pageState.pageSize}
                onChange={(page: number, pageSize: number) => {
                  pageState.page = page;
                  pageState.pageSize = pageSize;
                  handleSearch();
                }}
                onShowSizeChange={(current: number, size: number) => {
                  pageState.page = current;
                  pageState.pageSize = size;
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
