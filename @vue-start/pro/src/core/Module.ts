import { computed, defineComponent, ExtractPropTypes, h, inject, PropType, provide, reactive, VNode } from "vue";
import { TActionEvent, TActionState, TColumn, TColumns, TValueType } from "../types";
import { get, isArray, isEmpty, isFunction, isObject, keys, map, mergeWith, omit, reduce } from "lodash";
import { Ref, UnwrapNestedRefs } from "@vue/reactivity";
import { Subject } from "rxjs";
import { setReactiveValue } from "../../../hooks";
import { IRequestActor, useRequestProvide } from "../../../request";
import { useComposeRequestActor } from "./request";

/**
 * 获取Column的valueType，默认"text"
 * @param column
 */
export const getColumnValueType = (column: TColumn): TValueType => {
  return column.formValueType || column.valueType || "text";
};

/**
 *获取Column的FormItem name
 * @param column
 */
export const getColumnFormItemName = (column: TColumn): string | number | undefined => {
  return (column.formItemProps?.name || column.dataIndex) as any;
};

/**
 * 根据Column生成FormItem VNode
 * formFieldProps中的slots参数会以v-slots的形式传递到FormItem的录入组件（子组件）中
 * @param formElementMap
 * @param column
 * @param needRules
 */
export const getFormItemEl = (
  formElementMap: any,
  column: TColumn,
  needRules: boolean | undefined = true,
): VNode | null => {
  const valueType = getColumnValueType(column);
  const Comp: any = get(formElementMap, valueType);
  if (!Comp) {
    return null;
  }

  const name = getColumnFormItemName(column);
  const itemProps = needRules ? column.formItemProps : omit(column.formItemProps, "rules");

  return h(
    Comp,
    {
      key: name,
      name,
      label: column.title,
      ...itemProps,
      fieldProps: omit(column.formFieldProps, "slots"),
      showProps: column.showProps,
    },
    column.formFieldProps?.slots,
  );
};

/**
 *  根据Column生成Item VNode
 * @param elementMap
 * @param column
 * @param value
 */
export const getItemEl = (elementMap: any, column: TColumn, value: any): VNode | null => {
  const valueType = column.valueType || "text";
  const Comp: any = get(elementMap, valueType);
  if (!Comp) {
    return null;
  }
  return h(
    Comp,
    {
      ...omit(column.formFieldProps, "slots"),
      showProps: column.showProps,
      value,
    },
    column.formFieldProps?.slots,
  );
};

const ProModuleKey = Symbol("pro-module");

export interface IProModuleProvide {
  columns: Ref<TColumns>;
  getFormItemVNode: (column: TColumn, needRules: boolean | undefined) => VNode | null;
  getItemVNode: (column: TColumn, value: any) => VNode | null;
  elementMap: { [key: string]: any };
  formElementMap: { [key: string]: any };
  //
  subject$: Subject<TActionEvent>;
  sendEvent: (action: TActionEvent) => void;
  //
  state: UnwrapNestedRefs<Record<string, any>>;
  dispatch: (action: TActionState) => void;
  //
  requests: IRequestOpts[];
  sendRequest: (requestNameOrAction: string, ...params: any[]) => void;
}

export const useProModule = (): IProModuleProvide => inject(ProModuleKey) as IProModuleProvide;

export const provideProModule = (ctx: IProModuleProvide) => {
  provide(ProModuleKey, ctx);
};

export interface IRequestOpts {
  actor: IRequestActor;
  /**
   * 如果设置action，可以使用该值发起请求 住：要保证唯一性
   * 设置该字段原因：因为actor中的name不友好，可以理解为一个备选方案
   */
  action?: string;
  stateName?: string; //如果设置，将在state中维护[stateName]数据 请求返回数据
  loadingName?: string; //如果设置，将在state中维护[loadingName]数据 请求状态 boolean类型
  convertParams?: (...params: any[]) => Record<string, any>; //请求参数转换
  convertData?: (actor: IRequestActor) => Record<string, any>; //请求结果转换
  onSuccess?: (actor?: IRequestActor) => void; //请求成功回调
  onFailed?: (actor?: IRequestActor) => void; //请求失败回调
}

export const RequestAction = {
  Success: "request-success$",
  Fail: "request-fail$",
};

const proModuleProps = () => ({
  /**
   * module状态
   */
  state: { type: Object as PropType<UnwrapNestedRefs<Record<string, any>>> },
  /**
   * 配置（静态）
   */
  columns: { type: Array as PropType<TColumns> },
  /**
   * 配置（动态）
   * columns动态属性兼容
   */
  columnState: { type: Object as PropType<Record<string, any>> },
  /**
   * 展示组件集
   */
  elementMap: { type: Object as PropType<{ [key: string]: any }> },
  /**
   * 录入组件集
   */
  formElementMap: { type: Object as PropType<{ [key: string]: any }> },
  /**
   * requests
   */
  requests: { type: Array as PropType<IRequestOpts[]> },
});

export type ProModuleProps = Partial<ExtractPropTypes<ReturnType<typeof proModuleProps>>>;

export const ProModule = defineComponent<ProModuleProps>({
  props: {
    ...(proModuleProps() as any),
  },
  setup: (props, { slots }) => {
    /**
     * columns columnState 合并
     */
    const columns = computed(() => {
      return map(props.columns, (item) => {
        //如果columnState中有值，merge处理
        const mapData = get(props.columnState, getColumnFormItemName(item)!);
        if (isObject(mapData) && !isEmpty(mapData) && !isArray(mapData) && !isFunction(mapData)) {
          //合并
          return mergeWith(item, mapData, (objValue, srcValue) => {
            //如果是数组，替换
            if (isArray(objValue) || isArray(srcValue)) {
              return srcValue;
            }
          });
        }
        return item;
      });
    });

    /*********************************** 渲染组件 ***************************************/

    // 获取FormItem VNode
    const getFormItemVNode = (column: TColumn, needRules: boolean | undefined = true): VNode | null => {
      return getFormItemEl(props.formElementMap, column, needRules);
    };

    // 获取Item VNode
    const getItemVNode = (column: TColumn, value: any): VNode | null => {
      return getItemEl(props.elementMap, column, value);
    };

    /*********************************** 事件处理 ***************************************/
    const subject$ = new Subject<TActionEvent>();
    //发送Module事件
    const sendEvent = (action: TActionEvent) => {
      subject$.next(action);
    };

    /*********************************** 页面状态 ***************************************/

    const state = props.state || reactive({});

    const dispatch = (action: TActionState) => {
      //如果要更新的属性值是 object ，执行覆盖操作
      if (isObject(state[action.type])) {
        setReactiveValue(state[action.type], action.payload);
        return;
      }
      state[action.type] = action.payload;
    };

    /*********************************** request ***************************************/
    const { dispatchRequest } = useRequestProvide();

    const requestMap = reduce(props.requests, (pair, item) => ({ ...pair, [item.actor.name]: item }), {});
    const actionMap = reduce(props.requests, (pair, item) => ({ ...pair, [item.action!]: item }), {});

    //发送请求
    const sendRequest = (requestNameOrAction: string, ...params: any[]) => {
      const requestOpts = get(requestMap, requestNameOrAction) || get(actionMap, requestNameOrAction);
      if (!requestOpts) {
        return;
      }
      let nextParams;
      if (requestOpts.convertParams) {
        nextParams = requestOpts.convertParams(...params);
      } else {
        nextParams = get(params, 0);
      }
      dispatchRequest(requestOpts.actor, nextParams);
    };

    useComposeRequestActor(
      keys(requestMap),
      {
        onStart: (actor) => {
          //如果设置了loading，将请求状态维护到state中
          const loadingName = get(requestMap, [actor.name, "loadingName"]);
          if (loadingName) {
            dispatch({ type: loadingName, payload: true });
          }
        },
        onSuccess: (actor) => {
          const requestOpts = get(requestMap, actor.name);
          //如果设置了stateName，将结果维护到state中
          if (requestOpts?.stateName) {
            const data = requestOpts.convertData ? requestOpts.convertData(actor) : actor.res?.data;
            dispatch({ type: requestOpts.stateName, payload: data });
          }
          //发送成功事件
          sendEvent({ type: RequestAction.Success, payload: { actor } });
          //回调事件
          requestOpts.onSuccess?.(actor);
        },
        onFailed: (actor) => {
          const requestOpts = get(requestMap, actor.name);
          //发送失败事件
          sendEvent({ type: RequestAction.Fail, payload: { actor } });
          //回调事件
          requestOpts.onFailed?.(actor);
        },
        onFinish: (actor) => {
          const loadingName = get(requestMap, [actor.name, "loadingName"]);
          if (loadingName) {
            dispatch({ type: loadingName, payload: false });
          }
        },
      },
      true,
    );

    provideProModule({
      columns,
      getFormItemVNode,
      getItemVNode,
      elementMap: props.elementMap!,
      formElementMap: props.formElementMap!,
      //
      subject$,
      sendEvent,
      //
      state,
      dispatch,
      //
      requests: props.requests!,
      sendRequest,
    });

    return () => {
      return slots.default?.();
    };
  },
});
