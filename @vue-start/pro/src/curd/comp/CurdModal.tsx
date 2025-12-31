import { computed, defineComponent, ExtractPropTypes, PropType, ref, VNode } from "vue";
import { ElementKeys, ProOperate, ProOperateProps, ProPage, useGetCompByKey } from "../../comp";
import { CurdAction, useProCurd } from "../ctx";
import { get, keys, omit, size, some } from "lodash";
import { ProCurdForm } from "./CurdForm";
import { filterSlotsByPrefix } from "../../util";
import { useCurdCommon } from "../Curd";
import { useProConfig } from "../../core";

const proCurdModalProps = () => ({
  //只有指定mode才显示
  validMode: { type: Array, default: [CurdAction.ADD, CurdAction.DETAIL, CurdAction.EDIT] },
  //loading属性
  loadingOpts: { type: Object },
  //modal 属性
  overrideProps: { type: Object },
});

export type ProCurdModalProps = Partial<ExtractPropTypes<ReturnType<typeof proCurdModalProps>>> & Record<string, any>;

export const ProCurdModal = defineComponent<ProCurdModalProps>({
  props: {
    ...proCurdModalProps(),
  } as any,
  setup: (props, { slots }) => {
    const { curdState } = useProCurd();
    const { clearMode, opeTitle } = useCurdCommon();

    const title = computed<string>(() => {
      return props.title || opeTitle.value;
    });

    const show = computed(() => {
      if (some(props.validMode, (item) => item === curdState.mode)) {
        return true;
      }
      return false;
    });

    const handleVisibleChange = (v: boolean) => {
      if (!v) {
        clearMode();
      }
    };

    const invalidKeys = keys(proCurdModalProps());

    const getComp = useGetCompByKey();
    const Modal = getComp(ElementKeys.ModalKey);
    const Loading = getComp(ElementKeys.LoadingKey);

    return () => {
      if (!show.value) return null;

      const mode = curdState.mode;
      return (
        <Modal
          class={"pro-curd-modal"}
          {...omit(props, invalidKeys)}
          visible
          title={title.value}
          confirmLoading={curdState.operateLoading}
          maskClosable={mode === CurdAction.DETAIL}
          footer={curdState.detailLoading || mode === CurdAction.DETAIL ? false : undefined}
          {...props.overrideProps}
          onUpdate:modelValue={handleVisibleChange}
          onUpdate:visible={handleVisibleChange}
          v-slots={omit(slots, "default")}>
          {curdState.detailLoading && Loading ? (
            <Loading loading {...props.loadingOpts}>
              <div class={"pro-curd-modal-loading-dom"} />
            </Loading>
          ) : (
            slots.default?.()
          )}
        </Modal>
      );
    };
  },
});

export const ProCurdModalForm = defineComponent({
  props: {
    modalProps: Object,
    formProps: Object,
  },
  setup: (props, { slots }) => {
    const formRef = ref();

    const modalSlots = filterSlotsByPrefix(slots, "modal");
    const formSlots = filterSlotsByPrefix(slots, "form");

    return () => {
      return (
        <ProCurdModal
          {...props.modalProps}
          onOk={() => {
            formRef.value?.submit();
          }}
          v-slots={modalSlots}>
          <ProCurdForm ref={formRef} {...props.formProps} v-slots={formSlots} />
        </ProCurdModal>
      );
    };
  },
});

export const ProCurdModalFormConnect = defineComponent(() => {
  const { modalProps, formProps } = useProCurd();

  const formRef = ref();

  return () => {
    return (
      <ProCurdModal
        {...omit(modalProps?.value, "slots")}
        onOk={() => {
          formRef.value?.submit();
        }}
        v-slots={get(modalProps?.value, "slots")}>
        <ProCurdForm ref={formRef} {...omit(formProps?.value, "slots")} v-slots={get(formProps?.value, "slots")} />
      </ProCurdModal>
    );
  };
});

/********************************* Page 模式 **********************************/

const curdPageProps = () => ({
  //只有指定mode才显示
  validMode: { type: Array, default: [CurdAction.ADD, CurdAction.DETAIL, CurdAction.EDIT] },
  //
  operate: { type: Object as PropType<ProOperateProps> },
  cancelText: { type: String },
  okText: { type: String },
});

export const ProCurdPage = defineComponent({
  props: {
    ...ProPage.props,
    //重写
    sub: { type: Boolean, default: true },
    showBack: { type: Boolean, default: true },
    //
    ...curdPageProps(),
  },
  setup: (props, { emit, slots }) => {
    const { t } = useProConfig();
    const { curdState } = useProCurd();
    const { clearMode, opeTitle } = useCurdCommon();

    const title = computed<string>(() => {
      return props.title || opeTitle.value;
    });

    const show = computed(() => {
      if (some(props.validMode, (item) => item === curdState.mode)) {
        return true;
      }
      return false;
    });

    /*********************** 操作按钮 *************************/

    const handleSubmit = () => {
      emit("ok");
    };

    const opeItems = computed(() => {
      if (curdState.mode === CurdAction.DETAIL) return [];

      const items = props.operate?.items;
      if (size(items) > 0) return items;

      return [
        { value: "cancel", label: t.value("cancel"), onClick: clearMode },
        {
          value: "ok",
          label: t.value("confirm"),
          extraProps: { type: "primary" },
          loading: curdState.operateLoading,
          onClick: handleSubmit,
        },
      ];
    });

    /************************************************/

    const getComp = useGetCompByKey();
    const ProPage = getComp(ElementKeys.ProPageKey);

    const invalidKeys = keys(curdPageProps());

    return () => {
      if (!show.value) return null;

      return (
        <ProPage
          class={"curd"}
          {...omit(props, invalidKeys)}
          title={title.value}
          onBackClick={props.onBackClick || clearMode}
          v-slots={{
            footer: () => {
              if (curdState.mode === CurdAction.DETAIL) return null;
              return <ProOperate {...props.operate} items={opeItems.value} />;
            },
            ...slots,
          }}
        />
      );
    };
  },
});

export const ProCurdFormPage = defineComponent({
  props: {
    ...ProCurdPage.props,
  },
  setup: (props, { slots }) => {
    const { formProps } = useProCurd();

    const formRef = ref();

    const handleOk = () => {
      formRef.value?.submit();
    };

    return () => {
      return (
        <ProCurdPage {...props} onOk={handleOk} v-slots={omit(slots, "start")}>
          {slots.start?.()}
          <ProCurdForm ref={formRef} {...omit(formProps?.value, "slots")} v-slots={get(formProps?.value, "slots")} />
          {slots.end?.()}
        </ProCurdPage>
      );
    };
  },
});

export const ProCurdPageConnect = defineComponent(() => {
  const { subPageProps } = useProCurd();
  return () => {
    return <ProCurdFormPage {...omit(subPageProps?.value, "slots")} v-slots={get(subPageProps?.value, "slots")} />;
  };
});
