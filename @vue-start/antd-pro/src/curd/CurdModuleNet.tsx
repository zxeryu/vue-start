import { defineComponent, ExtractPropTypes, PropType, reactive } from "vue";
import { IRequestActor, isDoneRequestActor, isFailedRequestActor, useRequestProvide } from "@vue-start/request";
import { setReactiveValue, useEffect } from "@vue-start/hooks";
import { ICurdState, IListData, IOperate, ProCurd, ProCurdModuleProps } from "./CurdModule";
import { camelCase, forEach, get, omit, pick } from "lodash";
import { filter as rxFilter, tap as rxTap } from "rxjs";
import { UnwrapNestedRefs } from "@vue/reactivity";

export interface ICurdNetConvert {
  //添加参数转换
  convertAddParams?: (values: Record<string, any>, record: Record<string, any>) => Record<string, any>;
  //编辑参数转换
  convertEditParams?: (values: Record<string, any>, record: Record<string, any>) => Record<string, any>;
  //列表参数转换
  convertListParams?: (values: Record<string, any>) => Record<string, any>;
  //列表数据转换
  convertListData?: (actor: IRequestActor) => IListData;
  //详情参数转换
  convertDetailParams?: (record: Record<string, any>, rowKey: string) => Record<string, any>;
  //详情数据转换
  convertDetailData?: (actor: IRequestActor) => Record<string, any>;
  //删除参数转换
  convertDeleteParams?: (record: Record<string, any>, rowKey: string) => Record<string, any>;
}

/**
 * `on{Action}Bubble`
 *  各个回调中都会调用该方法
 *  场景：不改变原有方法逻辑，但是需要在对应的节点添加其他处理
 *  如果直接重写`on{Action}...`，将不会再调用对应的bubble方法
 */
export interface INetOperate extends IOperate {
  //list
  onListDone?: (actor: IRequestActor) => void; //请求成功回调
  onListFail?: (actor: IRequestActor) => void; //请求失败回调
  onListBubble?: (type: "emit" | "done" | "fail", ...rest: any[]) => void;
  //detail
  onDetailDone?: (actor: IRequestActor) => void;
  onDetailFail?: (actor: IRequestActor) => void;
  onDetailBubble?: (type: "emit" | "done" | "fail", ...rest: any[]) => void;
  //edit
  onEditDone?: (actor: IRequestActor) => void;
  onEditFail?: (actor: IRequestActor) => void;
  onEditBubble?: (type: "emit" | "execute" | "done" | "fail", ...rest: any[]) => void;
  //add
  onAddDone?: (actor: IRequestActor) => void;
  onAddFail?: (actor: IRequestActor) => void;
  onAddBubble?: (type: "emit" | "execute" | "done" | "fail", ...rest: any[]) => void;
  //delete
  onDeleteDone?: (actor: IRequestActor) => void;
  onDeleteFail?: (actor: IRequestActor) => void;
  onDeleteBubble?: (type: "emit" | "done" | "fail", ...rest: any[]) => void;
}

const proCurdNetProps = () => ({
  //发起接口参数/接口回来数据 转换
  converts: { type: Object as PropType<ICurdNetConvert> },
  //
  operate: { type: Object as PropType<INetOperate> },
});

export type ProCurdNetProps = Partial<ExtractPropTypes<ReturnType<typeof proCurdNetProps>>> &
  Omit<ProCurdModuleProps, "operate">;

export const ProCurdNet = defineComponent<ProCurdNetProps>({
  props: {
    ...ProCurd.props,
    ...proCurdNetProps(),
  },
  setup: (props, { slots }) => {
    const { dispatchRequest, requestSubject$ } = useRequestProvide();

    const curdState: UnwrapNestedRefs<ICurdState> = props.curdState || reactive({ detailData: {} });

    /********************************** 网络请求相关 ***************************************/

    //默认converts
    const converts: ICurdNetConvert = {
      convertListParams: (values) => values,
      convertListData: (actor) => actor.res?.data,
      convertDetailParams: (record, rowKey) => pick(record, rowKey),
      convertDetailData: (actor) => actor.res?.data,
      convertAddParams: (values, record) => ({ body: { ...record, ...values } }),
      convertEditParams: (values, record) => ({ body: { ...record, ...values } }),
      ...props.converts,
    };

    const Action = {
      List: "list",
      Detail: "detail",
      Add: "add",
      Edit: "edit",
      Delete: "delete",
    };
    //接口map {`${actorName}`:action}
    const actorNameMap: { [key: string]: string } = {};

    const lastRequestActors: { [key: string]: IRequestActor | undefined } = {};

    const actionConvertParamsMap = {
      [Action.List]: converts.convertListParams,
      [Action.Detail]: converts.convertDetailParams,
      [Action.Add]: converts.convertAddParams,
      [Action.Edit]: converts.convertEditParams,
      [Action.Delete]: converts.convertDeleteParams,
    };

    const createRequestFun = (action: string) => {
      return (...params: any[]) => {
        const actor = get(props.operate, `${action}Actor`);
        if (!actor) {
          return;
        }
        // action he actorName 绑定
        actorNameMap[actor.name] = action;

        const convertParams = get(actionConvertParamsMap, action);
        // @ts-ignore
        const nextParams = convertParams ? convertParams(...params) : undefined;
        lastRequestActors[action] = dispatchRequest(actor, nextParams);
      };
    };

    const actions = {
      executeList: createRequestFun(Action.List),
      executeDetail: createRequestFun(Action.Detail),
      executeAdd: createRequestFun(Action.Add),
      executeEdit: createRequestFun(Action.Edit),
      executeDelete: createRequestFun(Action.Delete),
    };

    /********************************** operate ***************************************/
    let prevListParams: Record<string, any> | undefined;
    const handleSearch = () => {
      actions.executeList(prevListParams);
    };

    const operate: INetOperate = {
      //list
      onList: (values) => {
        prevListParams = values;
        handleSearch();

        props.operate?.onListBubble?.("emit", values);
      },
      onListDone: (actor) => {
        curdState.listLoading = false;
        curdState.listData = converts.convertListData?.(actor);

        props.operate?.onListBubble?.("done", actor);
      },
      onListFail: (actor) => {
        curdState.listLoading = false;

        props.operate?.onListBubble?.("fail", actor);
      },
      //detail
      onDetailDone: (actor) => {
        curdState.detailLoading = false;
        setReactiveValue(curdState.detailData, converts.convertDetailData?.(actor));

        props.operate?.onDetailBubble?.("done", actor);
      },
      onDetailFail: (actor) => {
        curdState.detailLoading = false;

        props.operate?.onDetailBubble?.("fail", actor);
      },
      //add
      onAddExecute: (values) => {
        curdState.operateLoading = true;
        actions.executeAdd(values, curdState.detailData);

        props.operate?.onAddBubble?.("execute", values);
      },
      onAddFail: (actor) => {
        curdState.operateLoading = false;

        props.operate?.onAddBubble?.("fail", actor);
      },
      //edit
      onEditExecute: (values) => {
        curdState.operateLoading = true;
        actions.executeEdit(values, curdState.detailData);

        props.operate?.onEditBubble?.("execute", values);
      },
      onEditFail: (actor) => {
        curdState.operateLoading = false;

        props.operate?.onEditBubble?.("fail", actor);
      },
      //delete
      onDelete: (record) => {
        actions.executeDelete(record, props.rowKey);

        props.operate?.onDeleteBubble?.("emit", record);
      },
      ...props.operate,
    };

    //网络请求订阅
    useEffect(() => {
      //请求成功
      const doneSub = requestSubject$
        .pipe(
          rxFilter(isDoneRequestActor),
          rxTap((actor) => {
            const action = actorNameMap[actor.name];
            const actionDone = get(operate, camelCase(`on-${action}-done`));
            actionDone?.(actor);
            lastRequestActors[action] = undefined;
          }),
        )
        .subscribe();
      //请求失败
      const failSub = requestSubject$
        .pipe(
          rxFilter(isFailedRequestActor),
          rxTap((actor) => {
            const action = actorNameMap[actor.name];
            const actionFail = get(operate, camelCase(`on-${action}-fail`));
            actionFail?.(actor);
            lastRequestActors[action] = undefined;
          }),
        )
        .subscribe();

      return () => {
        doneSub.unsubscribe();
        failSub.unsubscribe();
        //组件销毁的时候cancel请求
        forEach(lastRequestActors, (actor) => {
          actor && dispatchRequest({ ...actor, stage: "CANCEL" });
        });
      };
    }, []);

    return () => {
      return <ProCurd {...omit(props, "converts")}>{slots.default?.()}</ProCurd>;
    };
  },
});
