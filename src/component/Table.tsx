import { computed, defineComponent } from "vue";
import { ProTable as ProTableOrigin } from "@vue-start/pro";
import { omit } from "lodash";
import { isElementPlus } from "@/common/platform";

export const TableOperateItemKey = "TableOperateItem$";

export const TableOperateItem = defineComponent({
  props: {
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    type: { type: String, default: isElementPlus() ? "primary" : "link" },
    link: { type: Boolean, default: true },
  },
  setup: (props, { slots }) => {
    return () => {
      return <pro-button {...props} v-slots={slots} />;
    };
  },
});

export const ProTable = defineComponent({
  props: {
    ...ProTableOrigin.props,
  },
  setup: (props, { slots }) => {
    const operate = computed(() => {
      if (props.operate && !props.operate.elementKey) {
        return {
          ...props.operate,
          elementKey: TableOperateItemKey,
        };
      }
      return props.operate;
    });

    return () => {
      return <ProTableOrigin {...omit(props, "operate")} operate={operate.value} v-slots={slots} />;
    };
  },
});
