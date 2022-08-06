import { defineComponent, ExtractPropTypes, PropType, reactive } from "vue";
import { Button, Pagination, PaginationProps } from "ant-design-vue";
import { useProModule } from "../core";
import { useProCurdModule } from "./ctx";
import { camelCase, concat, get, isArray, isNumber, mergeWith, omit, size } from "lodash";
import { ProSearchForm, ProSearchFormProps } from "../form";
import { IOperateItem, ProTable, ProTableProps } from "../table";
import { Slots } from "@vue/runtime-core";
import { useEffect, useWatch } from "@vue-start/hooks";

export type TPageState = {
  page: number;
  pageSize: number;
};

export const defaultPage: TPageState = {
  page: 1,
  pageSize: 10,
};

const curdListProps = () => ({
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

export type ProCurdListProps = Partial<ExtractPropTypes<ReturnType<typeof curdListProps>>>;

/**
 * 组合列表
 * SearchForm + Table + Pagination
 */
export const ProCurdList = defineComponent<ProCurdListProps>({
  props: {
    ...(curdListProps() as any),
  },
  setup: (props, { slots }) => {
    const { elementMap, formElementMap } = useProModule();
    const { curdState, searchColumns, tableColumns, operate } = useProCurdModule();

    /******************* table ********************/

    const prepareTableItem = (propName: string): IOperateItem => {
      return {
        value: propName,
        label: get(operate, `${propName}Label`),
        show: get(operate, propName, false),
        onClick: (record) => {
          const fun = get(operate, camelCase(`on-${propName}`));
          fun?.(record);
        },
      };
    };

    //table操作栏 items
    const tableOperateItems: IOperateItem[] = [
      prepareTableItem("detail"),
      prepareTableItem("edit"),
      prepareTableItem("delete"),
    ];

    /******************* search pagination ********************/

    const searchState = props.searchProps?.model || reactive({});

    const pageState = props.pageState || reactive({ ...defaultPage });

    const handleSearch = () => {
      operate.onList && operate.onList({ ...searchState, ...pageState });
    };

    const executeSearchWithResetPage = () => {
      pageState.page = 1;
      handleSearch();
    };

    //无SearchForm组件 初始化
    useEffect(() => {
      // 处理触发onList 操作
      if (size(searchColumns.value) <= 0 && props.searchProps?.initEmit !== false) {
        handleSearch();
      }
    }, []);
    //无SearchForm组件 订阅searchState
    useWatch(() => {
      if (size(searchColumns.value) > 0) {
        return;
      }
      executeSearchWithResetPage();
    }, searchState);

    return () => {
      const pagination = props.paginationProps || props.tableProps?.pagination;

      //
      const extra = (
        <div class={"pro-curd-list-search"}>
          {operate.add && (
            <Button
              type={"primary"}
              onClick={() => {
                operate.onAdd?.();
              }}>
              {operate.addLabel}
            </Button>
          )}
          {slots.extra?.()}
        </div>
      );

      return (
        <>
          {size(searchColumns.value) > 0 && (
            <ProSearchForm
              formElementMap={formElementMap}
              columns={searchColumns.value}
              {...props.searchProps}
              model={searchState}
              onFinish={executeSearchWithResetPage}
              v-slots={{
                //extraInSearch 模式下放入SearchForm
                extra: () => (props.extraInSearch ? extra : null),
              }}
            />
          )}
          {slots.divide?.()}
          {(size(searchColumns.value) <= 0 || !props.extraInSearch) && (operate.add || slots.extra) && extra}

          {slots.default ? (
            slots.default()
          ) : (
            <ProTable
              elementMap={elementMap}
              columns={tableColumns.value}
              //tableProps中的operate无用
              operate={mergeWith({ items: tableOperateItems }, operate.tableOperate, (objValue, srcValue) => {
                if (isArray(objValue) && isArray(srcValue)) {
                  return concat(objValue, srcValue);
                }
              })}
              {...omit(props.tableProps, "slots", "operate")}
              loading={curdState.listLoading}
              dataSource={curdState.listData?.dataSource}
              v-slots={props.tableProps?.slots}
              pagination={false}
            />
          )}

          {slots.divide2?.()}

          {curdState.listData && isNumber(curdState.listData?.total) && curdState.listData.total > 0 && (
            <div class={"pro-curd-list-bottom"}>
              <Pagination
                {...pagination}
                total={curdState.listData.total}
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
            </div>
          )}
        </>
      );
    };
  },
});

export const ProCurdListConnect = defineComponent({
  setup: () => {
    const { listProps } = useProCurdModule();
    return () => {
      return <ProCurdList {...omit(listProps, "slots")} v-slots={get(listProps, "slots")} />;
    };
  },
});
