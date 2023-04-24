import { defineComponent, ref } from "vue";
import { isString } from "lodash";
import { useEffect } from "@vue-start/hooks";

export const Image = defineComponent({
  props: {
    data: [String, Object],
  },
  setup: (props) => {
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

    return () => {
      if (!srcRef.value) {
        return null;
      }
      return (
        <div>
          <img src={srcRef.value} />
        </div>
      );
    };
  },
});
