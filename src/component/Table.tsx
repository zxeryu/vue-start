import { computed, defineComponent } from "vue";
import { ElButton } from "element-plus";
import { ProTable as ProTableOrigin } from "@vue-start/pro";
import { omit } from "lodash";

export const TableOperateItemKey = "TableOperateItem$";

export const TableOperateItem = defineComponent({
  props: {
    ...ElButton.props,
    type: { type: String, default: "primary" },
    link: { type: Boolean, default: true },
  },
  setup: (props, { slots }) => {
    return () => {
      return <ElButton {...props} v-slots={slots} />;
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
