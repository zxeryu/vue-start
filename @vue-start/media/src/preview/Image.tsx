import { defineComponent, ref } from "vue";
import { isString } from "lodash";
import { useEffect } from "@vue-start/hooks";

export const Image = defineComponent({
  props: {
    data: [String, Object],
  },
  setup: (props, { expose }) => {
    const domRef = ref();

    const srcRef = ref<string>("");

    useEffect(
      () => {
        if (!props.data) return;
        if (isString(props.data)) {
          srcRef.value = props.data;
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            srcRef.value = e.target!.result as string;
          };
          reader.readAsDataURL(props.data as any);
        }
      },
      () => props.data,
    );

    expose({ domRef });

    return () => {
      if (!srcRef.value) {
        return null;
      }
      return (
        <div ref={domRef}>
          <img src={srcRef.value} />
        </div>
      );
    };
  },
});
