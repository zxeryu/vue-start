import { Button } from "ant-design-vue";
import { defineComponent } from "vue";

export const ProTableOperateItem = defineComponent({
  props: {
    ...Button.props,
    type: { type: String, default: "link" },
  },
  setup: (props, { slots }) => {
    return () => {
      return <Button {...props} v-slots={slots} />;
    };
  },
});
