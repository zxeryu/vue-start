import { defineComponent, ref } from "vue";
import { useEffect, useResizeObserver, useUpdateKey } from "@vue-start/hooks";
import { get, isNumber, isString } from "lodash";

export const Pdf = defineComponent({
  props: {
    data: [String, Object],
    convertFrameUrl: Function,
    showNameCover: { type: Boolean, default: true },
    showDownloadCover: { type: Boolean, default: true },
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

    return () => {
      if (!urlRef.value) return null;
      return (
        <div ref={domRef}>
          <iframe key={keyRef.value} src={urlRef.value} frameborder={0} allowtransparency={true} />
          {props.showNameCover && <div class={"pro-preview-pdf-hide-name"} />}
          {props.showDownloadCover && <div class={"pro-preview-pdf-hide-download"} />}
        </div>
      );
    };
  },
});
