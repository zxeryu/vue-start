import { defineComponent, ExtractPropTypes, PropType, reactive } from "vue";
import { defaultPage, ICurdOperateOpts, TPageState } from "./Curd";
import { CurdAction, CurdSubAction, useProCurd } from "./ctx";
import { concat, filter, isArray, isUndefined, map, mergeWith, omit, pick } from "lodash";
import { IOperateItem } from "../table";

const proCurdListProps = () => ({
  /**
   * extra 是否放到SearchForm中
   */
  extraInSearch: { type: Boolean, default: undefined },
  //search
  searchProps: { type: Object as PropType<Record<string, any>> },
  //table
  tableProps: { type: Object as PropType<Record<string, any>> },
  //pagination是否展示
  paginationProps: { type: Object as PropType<Record<string, any>> },
  showPagination: { type: Boolean, default: true },
  //pageState
  pageState: { type: Object as PropType<TPageState> },
});

export type ProCurdListProps = Partial<ExtractPropTypes<ReturnType<typeof proCurdListProps>>>;

export const createCurdList = (SearchForm: any, Table: any) => {
  return defineComponent<ProCurdListProps>({
    props: {
      ...proCurdListProps(),
    } as any,
    setup: (props, { slots }) => {
      const { elementMap, formElementMap, curdState, searchColumns, tableColumns, sendCurdEvent, operates } =
        useProCurd();

      /******************* search pagination ********************/

      const pageState = props.pageState || reactive({ ...defaultPage });

      let prevValues: Record<string, any> | undefined;
      const handleSearch = () => {
        sendCurdEvent({ action: CurdAction.LIST, type: CurdSubAction.EMIT, values: { ...prevValues, ...pageState } });
      };

      const executeSearchWithResetPage = (values: Record<string, any>) => {
        prevValues = values;
        pageState.page = 1;
        handleSearch();
      };

      /******************* table ********************/

      const tableOperateItems = map(
        filter(operates as ICurdOperateOpts[], (item) => {
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
            ...pick(operate, "label", "element", "disabled", "sort", "onClick"),
            show: !isUndefined(operate?.show) ? operate?.show : false,
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

      //新配置的operate item，添加默认发送事件方法
      const convertOperateItems = (list: IOperateItem[]) => {
        return map(list, (item) => {
          if (!item.onClick) {
            return {
              ...item,
              onClick: (record: Record<string, any>) => {
                sendCurdEvent({ action: "operate", type: item.value, record } as any);
              },
            };
          }
          return item;
        });
      };

      return () => {
        const tableProps = props.tableProps;
        const rewriteTableProps = {
          elementMap,
          columns: tableColumns.value,
          ...omit(tableProps, "slots", "operate"),
          operate: mergeWith({ items: tableOperateItems }, tableProps?.operate, (objValue, srcValue) => {
            if (isArray(objValue) && isArray(srcValue)) {
              return concat(objValue, convertOperateItems(srcValue));
            }
          }),
          paginationState: { page: pageState.page, pageSize: pageState.pageSize },
          loading: curdState.listLoading,
          dataSource: curdState.listData?.dataSource,
        };

        const extra = slots.extra ? <div class={"pro-curd-list-extra"}>{slots.extra()}</div> : null;

        return (
          <>
            {slots.start?.()}

            {slots.search ? (
              slots.search({ executeSearchWithResetPage })
            ) : (
              <SearchForm
                formElementMap={formElementMap}
                columns={searchColumns.value}
                {...omit(props.searchProps, "slots")}
                onFinish={executeSearchWithResetPage}
                v-slots={props.searchProps?.slots}>
                {props.extraInSearch && extra}
              </SearchForm>
            )}

            {slots.divide?.()}

            {!props.extraInSearch && extra}

            {slots.table ? (
              slots.table(rewriteTableProps)
            ) : (
              <Table {...rewriteTableProps} v-slots={tableProps?.slots} />
            )}

            {slots.divide2?.()}

            {props.showPagination && (
              <div class={"pro-curd-list-footer"}>
                {slots.footerStart?.()}
                {slots.pagination?.(pageState, curdState.listData?.total, handleSearch)}
                {slots.footerEnd?.()}
              </div>
            )}

            {slots.end?.()}
          </>
        );
      };
    },
  });
};
