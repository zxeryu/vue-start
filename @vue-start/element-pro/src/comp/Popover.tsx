import { defineComponent } from "vue";
import { ElPopover } from "element-plus";

export const ProPopover = defineComponent({
  props: {
    ...ElPopover.props,
  },
  setup: (props, { slots }) => {
    return () => {
      return (
        <ElPopover
          {...props}
          v-slots={{
            reference: slots.default,
            default: slots.content,
          }}
        />
      );
    };
  },
});
