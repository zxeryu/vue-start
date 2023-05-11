import { defineComponent } from "vue";
import { ElementKeys, useGetCompByKey } from "../../comp";
import { CurdAction, CurdSubAction, useProCurd } from "../ctx";

export const AddButton = defineComponent({
  props: {
    buttonProps: Object,
  },
  setup: (props, { slots }) => {
    const { getOperate, sendCurdEvent } = useProCurd();
    const addOperate = getOperate(CurdAction.ADD);

    const handleClick = () => {
      if (addOperate?.onClick) {
        // @ts-ignore
        addOperate!.onClick();
        return;
      }
      sendCurdEvent({ action: CurdAction.ADD, type: CurdSubAction.EMIT });
    };

    const getComp = useGetCompByKey();
    const Button = getComp(ElementKeys.ButtonKey);

    return () => {
      if (!addOperate?.show) return null;

      if (slots.default) {
        return slots.default(addOperate, handleClick);
      }

      if (!Button) return null;

      return (
        <Button class={"pro-curd-add-button"} {...props.buttonProps} onClick={handleClick}>
          {addOperate.label}
        </Button>
      );
    };
  },
});
