import { computed, defineComponent } from "vue";
import { ProForm } from "@vue-start/element-pro";
import { omit, size } from "lodash";

/**
 * 添加默认按钮（重置、提交）
 */
export const Form = defineComponent({
  props: {
    ...ProForm.props,
  },
  setup: (props, { slots }) => {
    const operate = computed(() => {
      if (props.operate && size(props.operate.items) <= 0) {
        return {
          ...props.operate,
          items: [
            { value: "reset", label: "重置" },
            { value: "submit", label: "提交", extraProps: { type: "primary" } },
          ],
        };
      }
      return props.operate;
    });

    return () => {
      return <ProForm {...omit(props, "operate")} operate={operate.value} v-slots={slots} />;
    };
  },
});
