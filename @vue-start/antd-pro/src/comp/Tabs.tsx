import { defineComponent, PropType, ref } from "vue";
import { Tabs as TabsOrigin, TabPane, TabPaneProps } from "ant-design-vue";
import { TOption } from "@vue-start/pro";
import { map, omit } from "lodash";
import { useWatch } from "@vue-start/hooks";

export const Tabs = defineComponent({
  props: {
    ...TabsOrigin.props,
    options: { type: Array as PropType<Array<TOption & TabPaneProps>> },
    value: String,
  },
  setup: (props, { slots, emit }) => {
    const activeKeyRef = ref(props.value);

    useWatch(
      () => {
        if (activeKeyRef.value !== props.value) {
          activeKeyRef.value = props.value;
        }
      },
      () => props.value,
    );

    return () => {
      return (
        <TabsOrigin
          {...omit(props, "options", "activeKey")}
          v-model:activeKey={activeKeyRef.value}
          onUpdate:activeKey={(v) => {
            emit("update:value", v);
          }}
          v-slots={omit(slots, "start", "default", "label")}>
          {slots.start?.()}
          {map(props.options, (item) => {
            return (
              <TabPane
                key={item.value}
                {...omit(item, "value", "label")}
                v-slots={{
                  tab: () => {
                    return slots.label?.(item) || item.label;
                  },
                }}
              />
            );
          })}
          {slots.default?.()}
        </TabsOrigin>
      );
    };
  },
});
