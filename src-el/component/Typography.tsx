import { defineComponent } from "vue";

export const Typography = defineComponent({
  props: {
    content: String,
  },
  setup: (props, { slots }) => {
    return () => {
      return <div>{slots.default?.() || props.content}</div>;
    };
  },
});
