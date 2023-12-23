import { defineComponent } from "vue";
import { ElementKeys, useGetCompByKey } from "../../comp";
import { CurdAction, CurdSubAction, useProCurd } from "../ctx";
import { isFunction } from "lodash";
import { useHasPer2 } from "../../access";

export const AddButton = defineComponent({
  props: {
    buttonProps: Object,
  },
  setup: (props, { slots }) => {
    const hasPer2 = useHasPer2();
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
      if (!addOperate) {
        return null;
      }
      if (!hasPer2(addOperate.per, addOperate.perSuffix)) {
        return null;
      }

      const show = isFunction(addOperate.show) ? addOperate.show({}) : addOperate.show;
      if (!show) return null;

      if (addOperate.element) {
        return addOperate.element({}, addOperate as any);
      }

      if (slots.default) {
        return slots.default(addOperate, handleClick);
      }

      if (!Button) return null;

      return (
        <Button
          class={"pro-curd-add-button"}
          //@ts-ignore
          disabled={isFunction(addOperate.disabled) ? addOperate.disabled() : addOperate.disabled}
          {...props.buttonProps}
          onClick={handleClick}>
          {addOperate.label}
        </Button>
      );
    };
  },
});
