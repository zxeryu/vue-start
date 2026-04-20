import { defineComponent } from "vue";
import { ElPopover } from "element-plus";

export const ProPopover = defineComponent({
  props: {
    ...ElPopover.props,
  } as any,
  setup: (props, { emit, slots }) => {
    const handleChange = (v: any) => {
      emit("update:modelValue", v);
    };

    return () => {
      return (
        <ElPopover
          {...props}
          onUpdate:visible={(v: any) => handleChange(v)}
          v-slots={{
            reference: slots.default,
            default: slots.content,
          }}
        />
      );
    };
  },
});
