import { defineComponent, ref } from "vue";
import { useEffect } from "@vue-start/hooks";

export const TopRuler = defineComponent({
  props: {
    width: Number,
    height: Number,
  },
  setup: (props) => {
    const domRef = ref();

    const init = () => {
      const width = props.width!;

      const canvas = domRef.value;
      canvas.style.width = width + "px";
      canvas.width = width;
      canvas.height = props.height;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 刻度样式
      ctx.strokeStyle = "#999";
      ctx.fillStyle = "#333";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";

      // 计算可见区域
      const startPixel = 0;
      const endPixel = Math.ceil(width);

      const renderLine = (x: number, y: number) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, y);
        ctx.stroke();
      };

      // 绘制像素刻度
      for (let pixel = startPixel; pixel <= endPixel; pixel++) {
        const x = pixel;
        // 每100像素的主刻度
        if (pixel % 100 === 0) {
          renderLine(x, 18);
          ctx.fillText(pixel.toString(), x, 20);
        }
        // 每50像素的中等刻度
        else if (pixel % 50 === 0) {
          renderLine(x, 14);
        }
        // 每10像素的小刻度
        else if (pixel % 10 === 0) {
          renderLine(x, 10);
        }
      }
    };

    useEffect(() => {
      init();
    }, [() => props.width, () => props.height]);

    return () => {
      return <canvas ref={domRef} />;
    };
  },
});

export const LeftRuler = defineComponent({
  props: {
    width: Number,
    height: Number,
  },
  setup: (props) => {
    const domRef = ref();

    const init = () => {
      const height = props.height!;

      const canvas = domRef.value;
      canvas.style.height = height + "px";
      canvas.width = 20;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 刻度样式
      ctx.strokeStyle = "#999";
      ctx.fillStyle = "#333";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";

      // 计算可见区域
      const startPixel = 0;
      const endPixel = Math.ceil(height);

      const renderLine = (x: number, y: number) => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(x, y);
        ctx.stroke();
      };
      // 绘制像素刻度
      for (let pixel = startPixel; pixel <= endPixel; pixel++) {
        const y = pixel;
        // 每100像素的主刻度
        if (pixel % 100 === 0) {
          renderLine(18, y);

          ctx.save();
          // ctx.translate(14, y + 5);
          ctx.translate(12, y);
          ctx.rotate(Math.PI / 2);
          ctx.fillText(pixel.toString(), 0, 0);
          ctx.restore();
        }
        // 每50像素的中等刻度
        else if (pixel % 50 === 0) {
          renderLine(14, y);
        }
        // 每10像素的小刻度
        else if (pixel % 10 === 0) {
          renderLine(10, y);
        }
      }
    };

    useEffect(() => {
      init();
    }, [() => props.width, () => props.height]);

    return () => {
      return <canvas ref={domRef} />;
    };
  },
});
