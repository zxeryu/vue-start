import { computed, defineComponent, ExtractPropTypes, PropType } from "vue";
import {
  ElementKeys,
  PaginationSlotProps,
  ProList as ProListOrigin,
  ProListProps,
  SearchSlotProps,
  TPageState,
  useGetCompByKey,
} from "../../comp";
import { CurdAction, CurdSubAction, useProCurd } from "../ctx";
import { filter, get, keys, map, omit, pick } from "lodash";
import { ICurdOperateOpts } from "../Curd";
import { AddButton } from "./button";

const curdListProps = () => ({
  addConfig: {
    type: Object as PropType<{ inSearch: boolean; inTable: boolean; buttonProps: Record<string, any> }>,
    default: { inSearch: true },
  },
});

export type ProCurdListProps = Partial<ExtractPropTypes<ReturnType<typeof curdListProps>>> & ProListProps;

/**
 *
 */
export const ProCurdList = defineComponent<ProCurdListProps>({
  props: {
    ...ProListOrigin.props,
    ...curdListProps(),
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

    const searchProps = computed(() => {
      return { formElementMap, columns: searchColumns.value, ...props.searchProps };
    });

    const tableProps = computed(() => {
      return {
        elementMap,
        columns: tableColumns.value,
        loading: curdState.listLoading,
        dataSource: curdState.listData?.dataSource,
        ...omit(props.tableProps, "operate"),
        operate: { items: tableOperateItems, ...props.tableProps?.operate },
      };
    });

    const paginationProps = computed(() => {
      if (props.paginationProps === false) return false;
      return { total: curdState.listData?.total, ...(props.paginationProps as any) };
    });

    const invalidKeys = keys(curdListProps());

    const getComp = useGetCompByKey();
    const ProList = getComp(ElementKeys.ProListKey);

    return () => {
      if (!ProList) return null;

      return (
        <ProList
          class={"pro-curd-list"}
          {...omit(props, ...invalidKeys, "searchProps", "tableProps", "paginationProps")}
          searchProps={searchProps.value}
          tableProps={tableProps.value}
          paginationProps={paginationProps.value}
          // @ts-ignore
          onSearch={handleSearch}
          v-slots={{
            "search-end": props.addConfig?.inSearch ? () => <AddButton {...props.addConfig?.buttonProps} /> : undefined,
            "table-toolbarExtra": props.addConfig?.inTable
              ? (nodes: any[]) => (
                  <>
                    <AddButton {...props.addConfig?.buttonProps} />
                    {nodes}
                  </>
                )
              : undefined,
            ...slots,
            search: slots.search ? (opts: SearchSlotProps) => slots.search!(opts, searchProps.value) : undefined,
            table: slots.table ? (opts: { pageState: TPageState }) => slots.table!(opts, tableProps.value) : undefined,
            pagination: slots.pagination
              ? (opts: PaginationSlotProps) => slots.pagination!(opts, paginationProps.value)
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
