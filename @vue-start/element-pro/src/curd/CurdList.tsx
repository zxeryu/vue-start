import { defineComponent } from "vue";
import { get, isUndefined, omit, pick, mergeWith, isArray, concat } from "lodash";
import { ProList, ProListProps } from "../comp/ProList";
import { CurdAction, CurdSubAction, ICurdAction, IOperateItem, useProCurd, useProModule } from "@vue-start/pro";
import { IProCurdProvide } from "../../types";

/**
 * 组合列表
 * SearchForm + Table + Pagination
 */
export const ProCurdList = defineComponent<ProListProps>({
  props: {
    ...ProList.props,
  },
  setup: (props, { slots }) => {
    const { elementMap, formElementMap } = useProModule();
    const { curdState, searchColumns, tableColumns, getOperate, sendCurdEvent } = useProCurd<IProCurdProvide>();

    /******************* table ********************/

    const prepareTableItem = (action: ICurdAction): IOperateItem => {
      const item = getOperate(action);
      return {
        ...pick(item, "label", "element", "disabled", "sort"),
        show: !isUndefined(item?.show) ? item?.show : false,
        onClick: (record) => {
          if (item?.onClick) {
            item.onClick(record);
            return;
          }
          sendCurdEvent({ action, type: CurdSubAction.EMIT, record });
        },
        value: action,
      };
    };

    //table操作栏 items
    const tableOperateItems: IOperateItem[] = [
      prepareTableItem(CurdAction.DETAIL),
      prepareTableItem(CurdAction.EDIT),
      prepareTableItem(CurdAction.DELETE),
    ];

    return () => {
      const tableProps = props.tableProps;

      return (
        <ProList
          //@ts-ignore
          onList={(values: Record<string, any>) => {
            sendCurdEvent({ action: CurdAction.LIST, type: CurdSubAction.EMIT, values });
          }}
          {...props}
          searchProps={{
            formElementMap,
            ...props.searchProps,
            columns: searchColumns.value,
          }}
          tableProps={{
            elementMap,
            ...tableProps,
            operate: mergeWith({ items: tableOperateItems }, tableProps?.operate, (objValue, srcValue) => {
              if (isArray(objValue)) {
                if (isArray(srcValue)) {
                  //合并
                  return concat(objValue, srcValue);
                } else {
                  //使用curd默认
                  return objValue;
                }
              }
            }),
            columns: tableColumns.value,
            loading: curdState.listLoading,
            data: curdState.listData?.dataSource,
          }}
          paginationProps={{
            ...props.paginationProps,
            total: curdState.listData?.total,
          }}
          v-slots={slots}
        />
      );
    };
  },
});

export const ProCurdListConnect = defineComponent({
  setup: () => {
    const { listProps } = useProCurd();
    return () => {
      return <ProCurdList {...omit(listProps, "slots")} v-slots={get(listProps, "slots")} />;
    };
  },
});
