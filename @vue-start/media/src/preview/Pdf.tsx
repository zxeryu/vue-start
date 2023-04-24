import { computed, defineComponent, ref } from "vue";
import { useEffect, useResizeObserver, useUpdateKey } from "@vue-start/hooks";
import { get, isNumber, isString } from "lodash";

export const Pdf = defineComponent({
  props: {
    data: [String, Object],
    convertFrameUrl: Function,
  },
  setup: (props) => {
    const urlRef = ref("");

    const domRef = ref();
    const domWidth = ref(0);

    const [keyRef, updateKey] = useUpdateKey();

    useEffect(
      () => {
        if (!props.data) return;
        if (isString(props.data)) {
          urlRef.value = props.data;
        } else {
          const blob = new Blob([props.data as any], { type: "application/pdf;charset=utf-8" });
          const url = window.URL.createObjectURL(blob);
          urlRef.value = props.convertFrameUrl ? props.convertFrameUrl(url) : url;
        }
        updateKey();
      },
      () => props.data,
    );

    useResizeObserver(domRef, (entry) => {
      const rect = get(entry, [0, "contentRect"]);
      if (isNumber(rect.width)) {
        domWidth.value = rect.width;
      }
    });

    const hideWid = computed(() => {
      if (!urlRef.value) return 0;
      if (urlRef.value.indexOf("toolbar=0") > -1) return 0;
      if (domWidth.value <= 600) return 0;
      if (domWidth.value > 990) return 270;
      //((270 - 72) * (domWidth.value - 600)) / (990 - 390) + 72
      return (198 * (domWidth.value - 600)) / 390 + 72;
    });

    return () => {
      if (!urlRef.value) return null;
      return (
        <div ref={domRef}>
          <iframe key={keyRef.value} src={urlRef.value} frameborder={0} allowtransparency={true} />
          {hideWid.value && <div class={"pro-preview-pdf-hide-name"} style={`width:${hideWid.value}px`} />}
        </div>
      );
    };
  },
});
