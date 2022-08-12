import { defineComponent } from "vue";
import { get, omit, pick } from "lodash";
import { IOperateItem } from "../table";
import { ProList, ProListProps } from "../comp/ProList";
import { CurdAction, ICurdAction, useProCurd, useProModule } from "@vue-start/pro";
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
      return {
        ...pick(getOperate(action), "label", "element", "show", "disabled", "onClick", "sort"),
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
            sendCurdEvent({ action: CurdAction.LIST, type: "emit", values });
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
            operate: {
              ...tableProps?.operate,
              items: tableProps?.operate?.items
                ? [...tableOperateItems, ...tableProps?.operate?.items]
                : tableOperateItems,
            },
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
