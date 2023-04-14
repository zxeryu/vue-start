import { defineComponent } from "vue";
import { ProPage as ProPageOrign } from "@vue-start/pro";
import { omit } from "lodash";
import { useRouter } from "vue-router";

export const ProPage = defineComponent({
  props: {
    ...ProPageOrign.props,
  },
  setup: (props, { slots }) => {
    const router = useRouter();

    return () => {
      return (
        <ProPageOrign
          {...props}
          // @ts-ignore
          onBack={() => {
            router.back();
          }}
          v-slots={{
            backIcon: () => <span>&#8610;返回</span>,
            ...omit(slots, "default"),
          }}>
          <div class={"page-content"}>{slots.default?.()}</div>
        </ProPageOrign>
      );
    };
  },
});
