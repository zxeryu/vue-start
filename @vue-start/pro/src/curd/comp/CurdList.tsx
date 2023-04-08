import { defineComponent } from "vue";
import { PaginationSlotProps, ProList, ProListProps, SearchSlotProps, TPageState } from "../../comp";
import { CurdAction, CurdSubAction, useProCurd } from "../ctx";
import { filter, get, isBoolean, map, omit, pick } from "lodash";
import { ICurdOperateOpts } from "../Curd";

/**
 *
 */
export const ProCurdList = defineComponent<ProListProps>({
  props: {
    ...ProList.props,
    /**
     * class名称
     */
    clsName: { type: String, default: "pro-curd-list" },
  },
  setup: (props, { slots }) => {
    const { elementMap, formElementMap, curdState, searchColumns, tableColumns, sendCurdEvent, operates } =
      useProCurd();

    //从operates中提取table items
    const tableOperateItems = map(
      //详情、编辑、删除 或者 标记tableOperate为true 的operate item
      filter(operates, (item) => {
        const action = item.action;
        return (
          action === CurdAction.DETAIL ||
          action === CurdAction.EDIT ||
          action === CurdAction.DELETE ||
          item.tableOperate
        );
      }),
      (operate: ICurdOperateOpts) => {
        const item = {
          ...pick(operate, "label", "show", "disabled", "loading", "extraProps", "onClick", "element"),
          value: operate.action,
        };
        if (!item.onClick) {
          item.onClick = (record) => {
            sendCurdEvent({ action: operate.action, type: CurdSubAction.EMIT, record });
          };
        }
        return item;
      },
    );

    const handleSearch = (values: Record<string, any>) => {
      sendCurdEvent({ action: CurdAction.LIST, type: CurdSubAction.EMIT, values });
    };

    return () => {
      //search-form
      const searchProps = props.searchProps;
      const reSearchProps = {
        formElementMap,
        columns: searchColumns.value,
        ...searchProps,
      };
      //table
      const tableProps = props.tableProps;
      const reTableProps = {
        elementMap,
        columns: tableColumns.value,
        loading: curdState.listLoading,
        dataSource: curdState.listData?.dataSource,
        ...omit(tableProps, "operate"),
        operate: {
          items: tableOperateItems,
          ...tableProps?.operate,
        },
      };
      //pagination
      const paginationProps = props.paginationProps;
      const rePaginationProps = {
        total: curdState.listData?.total,
        ...(isBoolean(paginationProps) ? {} : paginationProps),
      };

      return (
        <ProList
          {...omit(props, "searchProps", "tableProps", "paginationProps")}
          searchProps={reSearchProps}
          tableProps={reTableProps}
          paginationProps={paginationProps === false ? false : rePaginationProps}
          // @ts-ignore
          onSearch={handleSearch}
          v-slots={{
            ...slots,
            search: slots.search
              ? (opts: SearchSlotProps) => {
                  return slots.search!(opts, reSearchProps);
                }
              : undefined,
            table: slots.table
              ? (opts: { pageState: TPageState }) => {
                  return slots.table!(opts, reTableProps);
                }
              : undefined,
            pagination: slots.pagination
              ? (opts: PaginationSlotProps) => {
                  return slots.pagination!(opts, rePaginationProps);
                }
              : undefined,
          }}
        />
      );
    };
  },
});

export const ProCurdListConnect = defineComponent(() => {
  const { listProps } = useProCurd();
  return () => {
    return <ProCurdList {...omit(listProps?.value, "slots")} v-slots={get(listProps?.value, "slots")} />;
  };
});
