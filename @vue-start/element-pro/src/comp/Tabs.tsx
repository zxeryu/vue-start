import { defineComponent, PropType } from "vue";
import { ElTabs, ElTabPane, TabPaneProps } from "element-plus";
import { map, omit } from "lodash";
import { TOption } from "@vue-start/pro";

export const ProTabs = defineComponent({
  props: {
    ...ElTabs.props,
    options: { type: Array as PropType<Array<TOption & TabPaneProps>> },
  },
  setup: (props, { slots, emit }) => {
    return () => {
      return (
        <ElTabs
          {...omit(props, "options")}
          onUpdate:modelValue={(v) => {
            emit("update:modelValue", v);
          }}>
          {slots.start?.()}

          {map(props.options, (item) => {
            return (
              <ElTabPane
                key={item.value}
                {...omit(item, "value")}
                name={item.value}
                v-slots={{
                  label: () => {
                    //插槽重写label
                    return slots.label?.(item) || item.label;
                  },
                }}
              />
            );
          })}

          {slots.default?.()}
        </ElTabs>
      );
    };
  },
});
