/*---
title: CanvasLayer
---*/
import { defineComponent, ref } from "vue";
import { css } from "@emotion/css";
import { Map, CanvasLayer } from "@vue-start/map";
import { useEffect } from "@vue-start/hooks";

export default defineComponent(() => {
  const featureRef = ref();

  const createCanvas = () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 200;

    const context = canvas.getContext("2d")!;
    context.fillStyle = "rgb(0,100,255)";
    context.strokeStyle = "white";
    context.globalAlpha = 1;
    context.lineWidth = 2;

    return { canvas, context };
  };

  const { canvas, context } = createCanvas();

  let radious = 0;
  const draw = () => {
    context.clearRect(0, 0, 200, 200);
    context.globalAlpha = (context.globalAlpha - 0.01 + 1) % 1;
    radious = (radious + 1) % 100;

    context.beginPath();
    context.arc(100, 100, radious, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    // 刷新渲染图层
    const canvasLayer = featureRef.value.getFeature();
    canvasLayer.reFresh();

    AMap.Util.requestAnimFrame(draw);
  };

  useEffect(() => {
    if (!featureRef.value) return;
    draw();
  }, featureRef);

  return () => {
    return (
      <Map class={css({ height: 400 })} opts={{ viewMode: "3D", zoom: 15, center: [116.335183, 39.941735] }}>
        <CanvasLayer
          ref={featureRef}
          opts={{
            canvas: canvas,
            bounds: new AMap.Bounds([116.328911, 39.937229], [116.342659, 39.946275]),
            zooms: [3, 18],
          }}
        />
      </Map>
    );
  };
});
