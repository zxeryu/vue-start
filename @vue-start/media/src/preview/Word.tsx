import { defineComponent, ref } from "vue";
import { renderAsync } from "docx-preview";
import { useEffect } from "@vue-start/hooks";

export const Word = defineComponent({
  props: {
    data: Object,
  },
  setup: (props, { expose }) => {
    const domRef = ref();

    useEffect(
      () => {
        if (!props.data || !domRef.value) return;
        renderAsync(props.data, domRef.value);
      },
      () => props.data,
    );

    expose({ domRef });

    return () => {
      return <div ref={domRef} />;
    };
  },
});
