import { defineComponent, ref } from "vue";
import { renderAsync } from "docx-preview";
import { useEffect } from "@vue-start/hooks";

export const Word = defineComponent({
  props: {
    data: Object,
  },
  setup: (props) => {
    const domRef = ref();

    useEffect(
      () => {
        if (!props.data || !domRef.value) return;
        renderAsync(props.data, domRef.value);
      },
      () => props.data,
    );

    return () => {
      return <div ref={domRef} />;
    };
  },
});
