import { defineComponent } from "vue";
import { ProPage as ProPageOrign } from "@vue-start/pro";
import { omit } from "lodash";

export const ProPage = defineComponent({
  props: {
    ...ProPageOrign.props,
  },
  setup: (props, { slots }) => {
    return () => {
      return (
        <ProPageOrign {...props} v-slots={omit(slots, "default")}>
          <div class={"page-content"}>{slots.default?.()}</div>
        </ProPageOrign>
      );
    };
  },
});
