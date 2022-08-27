import { defineComponent, ExtractPropTypes, PropType, reactive } from "vue";
import { PaginationProps } from "ant-design-vue";
import { concat, get, isArray, isUndefined, map, mergeWith, omit, pick, size } from "lodash";
import { ProSearchForm, ProSearchFormProps } from "../form";
import { ProTable, ProTableProps } from "../table";
import { Slots } from "@vue/runtime-core";

import {
  CurdAction,
  CurdSubAction,
  defaultPage,
  ICurdAction,
  IOperateItem,
  TPageState,
  useProCurd,
  useProModule,
} from "@vue-start/pro";

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
    ...curdListProps(),
  } as any,
  setup: (props, { slots }) => {
    const { elementMap, formElementMap } = useProModule();
    const { curdState, searchColumns, tableColumns, getOperate, sendCurdEvent } = useProCurd();

    /******************* table ********************/

    const prepareTableItem = (action: ICurdAction): IOperateItem => {
      const item = getOperate(action);
      return {
        ...pick(item, "label", "element", "disabled", "sort"),
        show: !isUndefined(item?.show) ? item?.show : false,
        value: action,
        onClick: (record) => {
          if (item?.onClick) {
            item.onClick(record);
            return;
          }
          sendCurdEvent({ action, type: CurdSubAction.EMIT, record });
        },
      };
    };

    //table操作栏 items
    const tableOperateItems: IOperateItem[] = [
      prepareTableItem(CurdAction.DETAIL),
      prepareTableItem(CurdAction.EDIT),
      prepareTableItem(CurdAction.DELETE),
    ];

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

    return () => {
      //
      const extra = slots.extra ? <div class={"pro-curd-list-search"}>{slots.extra()}</div> : null;

      return (
        <>
          {size(searchColumns.value) > 0 && (
            <ProSearchForm
              formElementMap={formElementMap}
              {...props.searchProps}
              columns={searchColumns.value}
              onFinish={executeSearchWithResetPage}>
              {props.extraInSearch && extra}
            </ProSearchForm>
          )}

          {slots.divide?.()}

          {!props.extraInSearch && extra}

          {slots.default ? (
            slots.default()
          ) : (
            <ProTable
              paginationState={{ page: pageState.page, pageSize: pageState.pageSize }}
              elementMap={elementMap}
              {...omit(props.tableProps, "slots", "operate")}
              //tableProps中的operate无用
              operate={mergeWith({ items: tableOperateItems }, props.tableProps?.operate, (objValue, srcValue) => {
                if (isArray(objValue) && isArray(srcValue)) {
                  return concat(objValue, convertOperateItems(srcValue));
                }
              })}
              columns={tableColumns.value}
              loading={curdState.listLoading}
              dataSource={curdState.listData?.dataSource}
              v-slots={props.tableProps?.slots}
              pagination={false}
            />
          )}

          {slots.divide2?.()}

          <div class={"pro-list-footer"}>
            {slots.footerStart?.()}
            {slots.pagination?.(pageState, curdState.listData?.total, handleSearch)}
            {slots.footerEnd?.()}
          </div>
        </>
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
