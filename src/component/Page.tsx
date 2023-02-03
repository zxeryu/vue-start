import { defineComponent } from "vue";
import { ProPage } from "@vue-start/pro";
import { omit } from "lodash";

export const Page = defineComponent({
  props: {
    ...ProPage.props,
  },
  setup: (props, { slots }) => {
    return () => {
      return (
        <ProPage {...props} v-slots={omit(slots, "default")}>
          <div class={"page-content"}>{slots.default?.()}</div>
        </ProPage>
      );
    };
  },
});
