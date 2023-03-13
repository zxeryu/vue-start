import { defineComponent } from "vue";

export const Typography = defineComponent({
  props: {
    content: String,
  },
  setup: (props, { slots }) => {
    return () => {
      return <span>{slots.default?.() || props.content}</span>;
    };
  },
});
