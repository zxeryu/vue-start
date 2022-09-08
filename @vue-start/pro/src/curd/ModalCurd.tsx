import { defineComponent, ExtractPropTypes, PropType, reactive, ref } from "vue";
import { CurdMethods, defaultPage, ProCurd, ProCurdProps } from "./Curd";
import { get, keys, omit, pick } from "lodash";
import { RequestAction, useModuleEvent, useProModule } from "../core";
import {
  CurdAction,
  CurdAddAction,
  CurdCurrentMode,
  CurdSubAction,
  ICurdAction,
  ICurdSubAction,
  useProCurd,
} from "./ctx";
import { createExpose } from "../util";

const modalCurdProps = () => ({
  defaultAddRecord: { type: Object as PropType<Record<string, any>> },
});

type ModalCurdProps = Partial<ExtractPropTypes<ReturnType<typeof modalCurdProps>>>;

/**
 * 事件处理
 */
const ModalCurd = defineComponent<ModalCurdProps>({
  props: {
    ...modalCurdProps(),
  } as any,
  setup: (props) => {
    const { dispatch, sendRequest } = useProModule();
    const { rowKey, curdState, listProps, getOperate, refreshList } = useProCurd();

    const pageState = listProps?.value?.pageState || reactive({ ...defaultPage });

    //发送详情接口
    const sendDetailRequest = (record: Record<string, any>) => {
      const operateOpts = getOperate(CurdAction.DETAIL);
      if (operateOpts?.actor) {
        //如果注册了详情接口 发起请求
        sendRequest(CurdAction.DETAIL, record, rowKey);
      } else {
        //直接使用当前record作为详情数据
        dispatch({ type: "detailData", payload: record });
      }
    };

    const dealDetail = (subAction: ICurdSubAction, { record }: { record: Record<string, any> }) => {
      if (subAction === CurdSubAction.EMIT) {
        dispatch({ type: "mode", payload: CurdCurrentMode.DETAIL });
        sendDetailRequest(record);
      }
    };

    const dealAdd = (subAction: ICurdSubAction) => {
      if (subAction === CurdSubAction.EMIT) {
        dispatch({ type: "mode", payload: CurdCurrentMode.ADD });

        dispatch({
          type: "detailData",
          payload: props.defaultAddRecord || {},
        });
      } else if (subAction === CurdSubAction.SUCCESS) {
        //添加成功
        pageState.page = 1; //重置当前页数
        //刷新List
        refreshList({ page: 1 });

        if (curdState.addAction === CurdAddAction.CONTINUE) {
          dispatch({
            type: "detailData",
            payload: props.defaultAddRecord || {},
          });
        } else {
          dispatch({ type: "mode", payload: undefined });
        }
      }
    };

    const dealEdit = (subAction: ICurdSubAction, { record }: { record: Record<string, any> }) => {
      if (subAction === CurdSubAction.EMIT) {
        dispatch({ type: "mode", payload: CurdCurrentMode.EDIT });

        sendDetailRequest(record);
      } else if (subAction === CurdSubAction.SUCCESS) {
        // 编辑成功
        dispatch({ type: "mode", payload: undefined });
        //刷新列表
        refreshList();
      }
    };

    const dealDelete = (subAction: ICurdSubAction) => {
      if (subAction === CurdSubAction.SUCCESS) {
        //刷新列表
        refreshList();
      }
    };

    useModuleEvent(({ type, payload, source }) => {
      if (source) {
        return;
      }

      let action: ICurdAction | string = type;
      let subAction: CurdSubAction = payload?.type;
      const record = payload?.record;

      if (action === RequestAction.Success) {
        //覆盖
        action = get(payload, ["requestOpts", "action"]);
        subAction = CurdSubAction.SUCCESS;
      }

      switch (action as ICurdAction) {
        case CurdAction.DETAIL:
          dealDetail(subAction, { record });
          break;
        case CurdAction.ADD:
          dealAdd(subAction);
          break;
        case CurdAction.EDIT:
          dealEdit(subAction, { record });
          break;
        case CurdAction.DELETE:
          dealDelete(subAction);
          break;
      }
    });

    return () => {
      return null;
    };
  },
});

export type ProModalCurdProps = ModalCurdProps & ProCurdProps;

export const ProModalCurd = defineComponent<ProModalCurdProps>({
  props: {
    ...ProCurd.props,
    ...ModalCurd.props,
  },
  setup: (props, { slots, expose }) => {
    const curdRef = ref();

    expose(createExpose(CurdMethods, curdRef));

    const invalidKeys = keys(ModalCurd.props);
    return () => {
      return (
        <ProCurd ref={curdRef} {...(omit(props, invalidKeys) as any)}>
          <ModalCurd {...pick(props, invalidKeys)} />
          {slots.default?.()}
        </ProCurd>
      );
    };
  },
});
