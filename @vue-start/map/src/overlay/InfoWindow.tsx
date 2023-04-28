import { defineComponent, PropType, ref, Teleport } from "vue";
import { useEffect } from "@vue-start/hooks";
import { isFunction } from "lodash";
import { useFeatureOptMethods } from "../Feature";
import { useMap } from "../Map";

export const InfoWindow = defineComponent({
  props: {
    opts: { type: Object as PropType<AMap.InfoOptions> },
    opts$: { type: Object as PropType<AMap.InfoOptions> },
    height: { type: Number, default: undefined },
  },
  setup: (props, { slots, emit }) => {
    const { mapRef } = useMap();

    const feature = new window.AMap.InfoWindow({
      closeWhenClickMap: true,
      isCustom: !!slots.default,
      ...props.opts,
    });

    //动态opts
    useFeatureOptMethods(feature, props.opts$!);

    const handleClose = () => {
      emit("close");
    };

    useEffect(() => {
      //初始化
      feature.on("close" as any, handleClose);

      //组件卸载
      return () => {
        feature.off("close" as any, handleClose);
        feature.close();
      };
    }, []);

    //open
    useEffect(
      () => {
        const position = props.opts$?.position || props.opts?.position;
        if (!position) return;
        feature.open(mapRef.value, position as any, props.height);
      },
      () => props.opts$?.position,
    );

    /********************* dom html **********************/

    const domRef = ref();

    useEffect(() => {
      if (domRef.value && isFunction(feature.setContent)) {
        feature.setContent(domRef.value);
      }
    }, domRef);

    return () => {
      if (slots.default) {
        return (
          <Teleport to={"body"}>
            <div ref={domRef}>{slots.default()}</div>
          </Teleport>
        );
      }
      return null;
    };
  },
});
