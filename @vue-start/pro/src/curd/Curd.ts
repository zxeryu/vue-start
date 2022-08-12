import { computed, defineComponent, ExtractPropTypes, h, inject, PropType, provide, reactive } from "vue";
import {
  IProModuleProvide,
  IRequestOpts,
  ProModule,
  ProModuleProps,
  RequestAction,
  useModuleEvent,
  useProModule,
} from "../core";
import { filter, get, keys, map, omit, pick, sortBy } from "lodash";
import { TColumns } from "../types";
import { Ref, UnwrapNestedRefs } from "@vue/reactivity";

const ProCurdKey = Symbol("pro-curd");

export interface IProCurdProvide {
  rowKey: string;
  curdState: UnwrapNestedRefs<ICurdState>;
  formColumns: Ref<TColumns>;
  descColumns: Ref<TColumns>;
  tableColumns: Ref<TColumns>;
  searchColumns: Ref<TColumns>;
  //
  sendCurdEvent: (event: TCurdActionEvent) => void;
  /******************子组件参数*******************/
  listProps?: Record<string, any>;
  formProps?: Record<string, any>;
  descProps?: Record<string, any>;
  modalProps?: Record<string, any>;
}

export const useProCurd = (): IProCurdProvide => inject(ProCurdKey) as IProCurdProvide;

export const provideProCurd = (ctx: IProCurdProvide) => provide(ProCurdKey, ctx);

/**
 * curd 5种action
 */
export enum CurdAction {
  LIST = "LIST",
  DETAIL = "DETAIL",
  ADD = "ADD",
  EDIT = "EDIT",
  DELETE = "DELETE",
}

export type ICurdAction = keyof typeof CurdAction;

/**
 * curd 操作模式
 */
export enum CurdCurrentMode {
  ADD = "ADD",
  EDIT = "EDIT",
  DETAIL = "DETAIL",
}

export type ICurdCurrentMode = keyof typeof CurdCurrentMode;

/**
 * curd add 模式下 标记 "确定" "确定并继续" 触发
 */
export enum CurdAddAction {
  NORMAL = "NORMAL",
  CONTINUE = "CONTINUE",
}

export type ICurdAddAction = keyof typeof CurdAddAction;

export interface IListData extends Record<string, any> {
  total: number;
  dataSource: Record<string, any>[];
}

export interface ICurdState extends Record<string, any> {
  //list
  listLoading?: boolean; //列表加载状态
  listData?: IListData;
  //mode
  mode?: ICurdCurrentMode;
  //detail add edit
  detailLoading?: boolean; //详情加载状态
  detailData?: Record<string, any>; //详情数据
  //add edit
  operateLoading?: boolean; //修改、保存 等等
  addAction?: ICurdAddAction;
}

/**
 * action：list,detail,add,edit,delete
 */
export interface ICurdRequestOpts extends Omit<IRequestOpts, "action"> {
  action?: ICurdAction; //类型，由当前程序赋值
}

export type TCurdActionEvent = {
  //action类型
  action: ICurdAction;
  //add、edit 存在execute类型事件
  type: "emit" | "execute";
  record?: Record<string, any>;
  values?: Record<string, any>;
};

const proCurdProps = () => ({
  /**
   * 列表 或 详情 的唯一标识
   */
  rowKey: { type: String, default: "id" },

  /************************* 子组件props *******************************/
  listProps: { type: Object as PropType<Record<string, any>> },
  formProps: { type: Object as PropType<Record<string, any>> },
  descProps: { type: Object as PropType<Record<string, any>> },
  modalProps: { type: Object as PropType<Record<string, any>> },
});

type CurdProps = Partial<ExtractPropTypes<ReturnType<typeof proCurdProps>>>;

const Curd = defineComponent<CurdProps>({
  props: {
    ...(proCurdProps() as any),
  },
  setup: (props, { slots }) => {
    const { columns, state, sendEvent, sendRequest } = useProModule() as Omit<IProModuleProvide, "state"> & {
      state: ICurdState;
    };

    /**
     * 排序
     * @param list
     * @param propName
     */
    const dealSort = (list: TColumns, propName: string): TColumns => {
      return sortBy(list, (item) => get(item, propName));
    };

    /**
     * 非 hideInForm columns
     */
    const formColumns = computed(() => {
      return dealSort(
        filter(columns.value, (item) => !item.hideInForm),
        "formSort",
      );
    });

    /**
     * 非 hideInDetail columns
     */
    const descColumns = computed(() => {
      return dealSort(
        filter(columns.value, (item) => !item.hideInDetail),
        "descSort",
      );
    });

    /**
     *  非 hideInTable columns
     */
    const tableColumns = computed(() => {
      return dealSort(
        filter(columns.value, (item) => !item.hideInTable),
        "tableSort",
      );
    });

    /**
     * search columns
     */
    const searchColumns = computed(() => {
      return dealSort(
        filter(columns.value, (item) => !!item.search),
        "searchSort",
      );
    });

    /******************************** 逻辑 *************************************/

    //上一次发起列表请求的参数
    let prevListParams: Record<string, any> | undefined;
    //刷新列表
    const handleSearch = (extra?: Record<string, any>) => {
      sendRequest(CurdAction.LIST, { ...prevListParams, ...extra });
    };

    //发送事件
    const sendCurdEvent = (event: TCurdActionEvent) => {
      sendEvent({ type: event.action, payload: omit(event, "action") });
    };

    //事件订阅
    useModuleEvent((event) => {
      if (event.type === RequestAction.Success) {
        return;
      } else if (event.type === RequestAction.Fail) {
        return;
      }

      const action = event.type as ICurdAction;

      const { type, values, record } = event.payload as Omit<TCurdActionEvent, "action">;

      switch (action) {
        case CurdAction.LIST:
          if (type === "emit") {
            prevListParams = values;
            handleSearch();
          }
          return;
        case CurdAction.ADD:
          if (type === "execute") {
            sendRequest(CurdAction.ADD, values, state.detailData);
          }
          return;
        case CurdAction.EDIT:
          if (type === "execute") {
            sendRequest(CurdAction.EDIT, values, state.detailData);
          }
          return;
        case CurdAction.DELETE:
          if (type === "emit") {
            sendRequest(CurdAction.DELETE, record, props.rowKey);
          }
          return;
      }
    });

    provideProCurd({
      rowKey: props.rowKey!,
      curdState: state,
      formColumns,
      descColumns,
      tableColumns,
      searchColumns,
      //
      sendCurdEvent,
      //
      listProps: props.listProps,
      formProps: props.formProps,
      descProps: props.descProps,
      modalProps: props.modalProps,
    });

    return () => {
      return slots.default?.();
    };
  },
});

export type ProCurdProps = CurdProps &
  Omit<ProModuleProps, "state" | "requests"> & {
    curdState: UnwrapNestedRefs<ICurdState>;
    requests: ICurdRequestOpts[];
  };

export const ProCurd = defineComponent<ProCurdProps>({
  props: {
    ...ProModule.props,
    ...Curd.props,
  },
  setup: (props, { slots }) => {
    const curdState: UnwrapNestedRefs<ICurdState> = props.curdState || reactive({ detailData: {} });

    /****************** 请求处理 **********************/
    //curd默认网络属性
    const curdRequestOpts: Record<
      ICurdAction,
      Pick<ICurdRequestOpts, "convertParams" | "convertData" | "loadingName" | "stateName">
    > = {
      [CurdAction.LIST]: {
        convertParams: (values) => values,
        convertData: (actor) => actor.res?.data,
        loadingName: "listLoading",
        stateName: "listData",
      },
      [CurdAction.DETAIL]: {
        convertParams: (record, rowKey) => pick(record, rowKey),
        convertData: (actor) => actor.res?.data,
        loadingName: "detailLoading",
        stateName: "detailData",
      },
      [CurdAction.ADD]: {
        convertParams: (values, record) => ({ body: { ...record, ...values } }),
        loadingName: "operateLoading",
      },
      [CurdAction.EDIT]: {
        convertParams: (values, record) => ({ body: { ...record, ...values } }),
        loadingName: "operateLoading",
      },
      [CurdAction.DELETE]: {
        convertParams: (values, record) => ({ body: { ...record, ...values } }),
      },
    };

    const requests = map(props.requests, (item) => {
      const curdOpts = get(curdRequestOpts, item.action!);
      return { ...curdOpts, ...item };
    });

    const moduleKeys = keys(ProModule.props);
    return () => {
      return h(
        ProModule,
        { ...pick(props, moduleKeys), state: curdState, requests: requests },
        h(Curd, { ...omit(props, ...moduleKeys, "curdState") }, slots),
      );
    };
  },
});
