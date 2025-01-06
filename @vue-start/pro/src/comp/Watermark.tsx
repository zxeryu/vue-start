import { defineComponent, ExtractPropTypes, reactive, ref, Teleport } from "vue";
import { useEffect } from "@vue-start/hooks";

const watermarkProps = () => ({
  str: { type: String, default: "watermark" },
});

export type ProWatermarkProps = Partial<ExtractPropTypes<ReturnType<typeof watermarkProps>>>;

export const ProWatermark = defineComponent<ProWatermarkProps>({
  props: {
    ...watermarkProps(),
  } as any,
  setup: (props) => {
    const domRef = ref<HTMLDivElement>();

    const state = reactive<{ imgStr: string }>({
      imgStr: "",
    });

    useEffect(() => {
      if (!domRef.value) return;

      let canvas: HTMLCanvasElement | null = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 130;
      let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d")!;
      ctx.rotate((-20 * Math.PI) / 180);
      ctx.font = "12px Vedana";
      ctx.fillStyle = "rgba(200, 200, 200, 0.30)";
      ctx.textBaseline = "middle";
      ctx.fillText(props.str!, canvas.width / 10, canvas.height / 2);

      state.imgStr = canvas.toDataURL("image/png");

      //释放
      ctx = null;
      canvas = null;
    }, [() => props.str, domRef]);

    return () => {
      return (
        <Teleport to={"body"}>
          <div ref={domRef} class={"pro-watermark"} style={`background:url(${state.imgStr}) left top repeat`} />
        </Teleport>
      );
    };
  },
});
