import { defineComponent, ref } from "vue";
import { isObject } from "lodash";
import { ElementKeys, useGetCompByKey } from "@vue-start/pro";

const JsonSet = defineComponent({
  props: {
    title: String,
    target: [Object, String],
  } as any,
  setup: (props, { emit }) => {
    const initValue = isObject(props.target) ? JSON.stringify(props.target, null, " ") : props.target;
    const valueRef = ref(initValue || "");

    const handleSuccess = () => {
      const target = isObject(props.target) ? JSON.parse(valueRef.value) : valueRef.value;
      emit("success", target);
    };

    const getComp = useGetCompByKey();
    const Modal = getComp(ElementKeys.ModalKey);
    const Input = getComp("Input$");

    return () => {
      return (
        <Modal title={props.title || "json"} maskClosable={false} draggable onOk={handleSuccess}>
          <Input v-model={valueRef.value} type={"textarea"} rows={20} />
        </Modal>
      );
    };
  },
});

export const JsonSetDom = defineComponent({
  inheritAttrs: true,
  props: {
    ...JsonSet.props,
  },
  setup: (props, { slots, emit }) => {
    const visibleRef = ref(false);

    const handleOpen = () => {
      visibleRef.value = true;
    };

    const handleSuccess = (target: any) => {
      emit("success", target);
      visibleRef.value = false;
    };

    const handleClose = () => {
      visibleRef.value = false;
    };

    const getComp = useGetCompByKey();
    const Button = getComp(ElementKeys.ButtonKey);

    return () => {
      return (
        <>
          <div onClick={handleOpen}>{slots.default?.() || <Button type={"primary"}>json</Button>}</div>
          {visibleRef.value && (
            <JsonSet
              visible
              title={props.title}
              target={props.target}
              onSuccess={handleSuccess}
              onClose={handleClose}
            />
          )}
        </>
      );
    };
  },
});
