import { defineComponent, ExtractPropTypes, PropType, ref } from "vue";
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
import { useRoute, useRouter } from "vue-router";
import { get, keys, omit, pick } from "lodash";
import { CurdMethods, ProCurd, ProCurdProps } from "./Curd";
import { createExpose } from "../util";

const pageCurdProps = () => ({
  defaultAddRecord: { type: Object as PropType<Record<string, any>> },
  routeBack: { type: Function as PropType<(action: ICurdAction) => void> },
});

type PageCurdProps = Partial<ExtractPropTypes<ReturnType<typeof pageCurdProps>>>;

const PageCurd = defineComponent<PageCurdProps>({
  props: {
    ...pageCurdProps(),
  } as any,
  setup: (props) => {
    const router = useRouter();
    const route = useRoute();

    const { dispatch, sendRequest } = useProModule();
    const { rowKey, curdState } = useProCurd();

    const dealList = (subAction: ICurdSubAction) => {
      if (subAction === CurdSubAction.PAGE) {
        //其实就是个重置过程
        dispatch({ type: "mode", payload: undefined });
        dispatch({ type: "detailData", payload: {} });
        dispatch({ type: "detailLoading", payload: false });
        dispatch({ type: "addAction", payload: undefined });
      }
    };

    const dealDetail = (subAction: ICurdSubAction, { record }: { record: Record<string, any> }) => {
      if (subAction === CurdSubAction.EMIT) {
        router.push({ path: `${route.path}/detail`, query: pick(record, rowKey) });
      } else if (subAction === CurdSubAction.PAGE) {
        dispatch({ type: "mode", payload: CurdCurrentMode.DETAIL });
        sendRequest(CurdAction.DETAIL, route.query, rowKey);
      }
    };

    const dealAdd = (subAction: ICurdSubAction) => {
      if (subAction === CurdSubAction.EMIT) {
        router.push({ path: `${route.path}/add` });
      } else if (subAction === CurdSubAction.PAGE) {
        dispatch({ type: "mode", payload: CurdCurrentMode.ADD });
        dispatch({ type: "detailData", payload: props.defaultAddRecord || {} });
      } else if (subAction === CurdSubAction.SUCCESS) {
        if (curdState.addAction === CurdAddAction.CONTINUE) {
          dispatch({
            type: "detailData",
            payload: props.defaultAddRecord || {},
          });
        } else {
          props.routeBack ? props.routeBack(CurdAction.ADD) : router.go(-1);
        }
      }
    };

    const dealEdit = (subAction: ICurdSubAction, { record }: { record: Record<string, any> }) => {
      if (subAction === CurdSubAction.EMIT) {
        router.push({ path: `${route.path}/edit`, query: pick(record, rowKey) });
      } else if (subAction === CurdSubAction.PAGE) {
        dispatch({ type: "mode", payload: CurdCurrentMode.EDIT });
        sendRequest(CurdAction.DETAIL, route.query, rowKey);
      } else if (subAction === CurdSubAction.SUCCESS) {
        props.routeBack ? props.routeBack(CurdAction.EDIT) : router.go(-1);
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

      switch (action) {
        case CurdAction.LIST:
          dealList(subAction);
          break;
        case CurdAction.DETAIL:
          dealDetail(subAction, { record });
          break;
        case CurdAction.ADD:
          dealAdd(subAction);
          break;
        case CurdAction.EDIT:
          dealEdit(subAction, { record });
          break;
      }
    });

    return () => {
      return null;
    };
  },
});

export type ProPageCurdProps = PageCurdProps & ProCurdProps;

export const ProPageCurd = defineComponent<ProPageCurdProps>({
  props: {
    ...ProCurd.props,
    ...PageCurd.props,
  },
  setup: (props, { slots, expose }) => {
    const curdRef = ref();

    expose(createExpose(CurdMethods, curdRef));

    const invalidKeys = keys(PageCurd.props);
    return () => {
      return (
        <ProCurd ref={curdRef} {...(omit(props, invalidKeys) as any)}>
          <PageCurd {...pick(props, invalidKeys)} />
          {slots.default?.()}
        </ProCurd>
      );
    };
  },
});
